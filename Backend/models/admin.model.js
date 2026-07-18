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

export const setUserStatus = (id, status) =>
  prisma.user.update({
    where: { id: Number(id) },
    data: { status },
    select: { id: true, email: true, role: true, status: true },
  });

export const removeUser = (id) =>
  prisma.user.delete({ where: { id: Number(id) } });

export const findAuditLogs = ({ action, limit = 100 } = {}) =>
  prisma.auditLog.findMany({
    where: { ...(action ? { action } : {}) },
    include: { user: { select: { id: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: Number(limit),
  });

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
