import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Saved Internships ──────────────────────────────────────────────

export const saveInternship = async (userId, internshipId) => {
  return prisma.savedInternship.upsert({
    where: { userId_internshipId: { userId, internshipId } },
    update: {},
    create: { userId, internshipId },
  });
};

export const unsaveInternship = async (userId, internshipId) => {
  return prisma.savedInternship.deleteMany({
    where: { userId, internshipId },
  });
};

export const findSavedInternships = async (userId) => {
  const rows = await prisma.savedInternship.findMany({
    where: { userId },
    include: {
      internship: {
        include: {
          company: { select: { id: true, companyName: true, logoUrl: true, industry: true } },
        },
      },
    },
  });
  return rows.map((row) => row.internship);
};

// ── Followed Companies ─────────────────────────────────────────────

export const followCompany = async (userId, companyId) => {
  return prisma.followedCompany.upsert({
    where: { userId_companyId: { userId, companyId } },
    update: {},
    create: { userId, companyId },
  });
};

export const unfollowCompany = async (userId, companyId) => {
  return prisma.followedCompany.deleteMany({
    where: { userId, companyId },
  });
};

export const findFollowedCompanies = async (userId) => {
  const rows = await prisma.followedCompany.findMany({
    where: { userId },
    include: {
      company: {
        include: {
          _count: { select: { internships: true } },
        },
      },
    },
  });
  return rows.map((row) => ({ ...row.company, openInternshipsCount: row.company._count.internships }));
};

// ── Recommendations ────────────────────────────────────────────────

// Simple v1: most recently posted open internships the student hasn't
// already saved or applied to. Good enough to seed the Home page until
// real preference-based matching exists.
export const findRecommendedInternships = async (userId, limit = 6) => {
  const [savedIds, appliedIds] = await Promise.all([
    prisma.savedInternship.findMany({ where: { userId }, select: { internshipId: true } }),
    prisma.application.findMany({ where: { studentId: userId }, select: { internshipId: true } }),
  ]);

  const excludeIds = [
    ...savedIds.map((row) => row.internshipId),
    ...appliedIds.map((row) => row.internshipId),
  ];

  return prisma.internship.findMany({
    where: {
      status: "open",
      ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      company: { select: { id: true, companyName: true, logoUrl: true, industry: true } },
    },
  });
};

export default {
  saveInternship,
  unsaveInternship,
  findSavedInternships,
  followCompany,
  unfollowCompany,
  findFollowedCompanies,
  findRecommendedInternships,
};


/* ---------- Student profile ----------
   The frontend kept the whole profile in localStorage with a TODO. That meant a
   profile never followed the student to another device, and — worse — a company
   opening an applicant's profile was shown its OWN cached profile, because the
   page had no way to fetch anyone else's. These are the missing endpoints.     */

/** Fields a student may write. `userId` and `id` are never client-supplied. */
export const PROFILE_EDITABLE = [
  "fullName", "phone", "bio", "education", "skills", "profileImage",
];

export const findStudentProfile = (userId) =>
  prisma.studentProfile.findUnique({
    where: { userId: Number(userId) },
    include: { user: { select: { id: true, email: true, status: true, createdAt: true } } },
  });

export const upsertStudentProfile = (userId, data) =>
  prisma.studentProfile.upsert({
    where: { userId: Number(userId) },
    update: data,
    create: { userId: Number(userId), ...data },
  });
