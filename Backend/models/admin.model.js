import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const countAll = async () => {
  const [users, students, companies, admins, internships, applications, suspended] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "student" } }),
      prisma.user.count({ where: { role: "company" } }),
      prisma.user.count({ where: { role: "admin" } }),
      prisma.internship.count(),
      prisma.application.count(),
      prisma.user.count({ where: { status: "suspended" } }),
    ]);
  return { users, students, companies, admins, internships, applications, suspended };
};

export const findUsers = ({ role, status, search, page = 1, pageSize = 200 } = {}) => {
  const take = Math.min(Math.max(Number(pageSize) || 200, 1), 200);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  return prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
      ...(search ? { email: { contains: search, mode: "insensitive" } } : {}),
    },
    select: {
      id: true, email: true, role: true, status: true, createdAt: true,
      studentProfile: { select: { fullName: true } },
      companyProfile: { select: { companyName: true, _count: { select: { internships: true } } } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
    skip, take,
  });
};
export const findUserById = (id) =>
  prisma.user.findUnique({ where: { id: Number(id) } });

export const setUserStatus = (id, status, { reason = null, until = null } = {}) =>
  prisma.user.update({
    where: { id: Number(id) },
    data:
      status === "suspended"
        ? { status, suspendedAt: new Date(), suspendedUntil: until, suspensionReason: reason }
        : { status, suspendedAt: null, suspendedUntil: null, suspensionReason: null },
    select: {
      id: true, email: true, role: true, status: true,
      suspendedAt: true, suspendedUntil: true, suspensionReason: true,
    },
  });

export const removeUser = (id) =>
  prisma.user.delete({ where: { id: Number(id) } });

export const findAuditLogs = ({ action, userId, role, search, from, to, limit = 100 } = {}) =>
  prisma.auditLog.findMany({
    where: {
      ...(action ? { action } : {}),
      ...(userId ? { userId: Number(userId) } : {}),
      // Filtering by role or email only matches rows that still have a user.
      // An entry whose account was later deleted has userId = null (the FK is
      // SetNull so the log survives) — those are intentionally excluded here,
      // and the UI says so rather than leaving it a mystery.
      ...(role ? { user: { role } } : {}),
      ...(search ? { user: { email: { contains: search, mode: "insensitive" } } } : {}),
      // `from`/`to` bound the activity view's date picker. `to` is pushed to the
      // end of that day so picking a single date returns that whole day.
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(new Date(to).setHours(23, 59, 59, 999)) } : {}),
            },
          }
        : {}),
    },
    include: { user: { select: { id: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: Number(limit),
  });

/**
 * The action values that actually appear in this database.
 *
 * The filter dropdown is built from real rows rather than a hardcoded list, so
 * it can never drift out of sync with whatever `logAction` is recording.
 */
export const findAuditActions = async () => {
  const rows = await prisma.auditLog.findMany({
    distinct: ["action"],
    select: { action: true },
    orderBy: { action: "asc" },
  });
  return rows.map((r) => r.action).filter(Boolean);
};

/* ---------- Per-user drill-down (admin "inspect this account" view) ---------- */

export const findUserDetail = (id) =>
  prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true, email: true, role: true, status: true, createdAt: true,
      suspendedAt: true, suspendedUntil: true, suspensionReason: true,
      studentProfile: true,
      companyProfile: true,
      _count: { select: { applications: true, cvs: true, auditLogs: true } },
    },
  });

/** Every listing belonging to a company account, with its applicant count. */
export const findInternshipsByUser = async (userId) => {
  const profile = await prisma.companyProfile.findUnique({ where: { userId: Number(userId) } });
  if (!profile) return [];
  return prisma.internship.findMany({
    where: { companyId: profile.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });
};

/*
  One listing in full, with its applicants.

  The admin panel could list a company's internships but not open one, so there
  was no way to see what a reported listing actually says or who had applied to
  it — which is exactly the information needed before suspending or deleting it.
*/
export const findInternshipDetail = (id) =>
  prisma.internship.findUnique({
    where: { id: Number(id) },
    include: {
      company: {
        select: {
          id: true, companyName: true, industry: true, location: true,
          logoUrl: true, contact: true,
          user: { select: { id: true, email: true, status: true } },
        },
      },
      applications: {
        orderBy: { appliedAt: "desc" },
        include: {
          student: {
            select: {
              id: true, email: true,
              studentProfile: { select: { fullName: true, education: true, profileImage: true } },
            },
          },
          cv: { select: { id: true, score: true, updatedAt: true } },
        },
      },
    },
  });

/** The student's CV, so an admin can check it isn't being used maliciously. */
export const findCvByUser = (userId) =>
  prisma.cv.findFirst({
    where: { studentId: Number(userId) },
    orderBy: { updatedAt: "desc" },
  });

export const setInternshipStatus = (id, status, reason = null) =>
  prisma.internship.update({
    where: { id: Number(id) },
    data: { status, suspensionReason: status === "suspended" ? reason : null },
  });

export const findInternshipById = (id) =>
  prisma.internship.findUnique({
    where: { id: Number(id) },
    include: { company: { select: { id: true, companyName: true, userId: true } } },
  });

export const removeInternship = (id) =>
  prisma.internship.delete({ where: { id: Number(id) } });

/*
  Writes the tombstone onto every application attached to these internships.

  This MUST run before the delete. Once the internship row is gone the FK is set
  to NULL and there is nothing left to join to — the student would be looking at
  an application with no title and no company name.
*/
export const snapshotApplicationsForInternships = async (internshipIds, reason) => {
  if (!internshipIds.length) return 0;

  const internships = await prisma.internship.findMany({
    where: { id: { in: internshipIds } },
    select: { id: true, title: true, company: { select: { companyName: true } } },
  });

  let touched = 0;
  for (const it of internships) {
    const { count } = await prisma.application.updateMany({
      where: { internshipId: it.id },
      data: {
        removedType: "deleted",
        removedReason: reason || null,
        removedAt: new Date(),
        internshipTitle: it.title,
        companyName: it.company?.companyName || null,
        // Re-flag as unseen so the student is actually told the listing is gone.
        seenAt: null,
      },
    });
    touched += count;
  }
  return touched;
};

/** All internship ids owned by a user (used before deleting a company account). */
export const findInternshipIdsByUser = async (userId) => {
  const profile = await prisma.companyProfile.findUnique({ where: { userId: Number(userId) } });
  if (!profile) return [];
  const rows = await prisma.internship.findMany({
    where: { companyId: profile.id },
    select: { id: true },
  });
  return rows.map((r) => r.id);
};

// Accounts worth a second look — a crude but honest heuristic.
export const findSuspiciousUsers = async () => {
  const suspended = await prisma.user.findMany({
    where: { status: "suspended" },
    select: { id: true, email: true, role: true, status: true, createdAt: true },
  });

  // Companies with no profile row can't function and may be junk signups.
  const orphanCompanies = await prisma.user.findMany({
    where: { role: "company", companyProfile: null },
    select: { id: true, email: true, role: true, status: true, createdAt: true },
  });

  return [
    ...suspended.map((u) => ({ ...u, reason: "Account is suspended" })),
    ...orphanCompanies.map((u) => ({ ...u, reason: "Company account has no profile" })),
  ];
};
