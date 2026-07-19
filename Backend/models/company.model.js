import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findCompanyProfileByUserId = (userId) =>
  prisma.companyProfile.findUnique({ where: { userId } });

export const updateCompanyProfile = (userId, data) =>
  prisma.companyProfile.update({ where: { userId }, data });

/** Dashboard numbers for the logged-in company. */
export const getCompanyStats = async (companyId) => {
  const [internships, openInternships, applications, pending, accepted, rejected] =
    await Promise.all([
      prisma.internship.count({ where: { companyId } }),
      prisma.internship.count({ where: { companyId, status: "open" } }),
      prisma.application.count({ where: { internship: { companyId } } }),
      prisma.application.count({ where: { internship: { companyId }, status: "pending" } }),
      prisma.application.count({ where: { internship: { companyId }, status: "accepted" } }),
      prisma.application.count({ where: { internship: { companyId }, status: "rejected" } }),
    ]);

  // Applications per listing — powers the analytics bars on Company Home.
  const perInternship = await prisma.internship.findMany({
    where: { companyId },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    internships,
    openInternships,
    applications,
    pending,
    accepted,
    rejected,
    perInternship: perInternship.map((i) => ({
      id: i.id,
      title: i.title,
      status: i.status,
      createdAt: i.createdAt,
      applicants: i._count.applications,
    })),
  };
};

/** Other companies — "affiliations / connections". */
export const findOtherCompanies = (excludeId, limit = 8) =>
  prisma.companyProfile.findMany({
    where: { ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: {
      id: true,
      companyName: true,
      industry: true,
      logoUrl: true,
      location: true,
      _count: { select: { internships: true } },
    },
    take: limit,
  });

/** Unified search across students, companies, and internships. */
export const searchAll = async (q) => {
  const like = { contains: q, mode: "insensitive" };

  const [students, companies, internships] = await Promise.all([
    prisma.studentProfile.findMany({
      where: { OR: [{ fullName: like }, { skills: like }, { education: like }] },
      select: {
        id: true,
        userId: true,
        fullName: true,
        skills: true,
        education: true,
        profileImage: true,
      },
      take: 10,
    }),
    prisma.companyProfile.findMany({
      where: { OR: [{ companyName: like }, { industry: like }, { location: like }] },
      select: { id: true, companyName: true, industry: true, location: true, logoUrl: true },
      take: 10,
    }),
    prisma.internship.findMany({
      where: {
        status: "open",
        OR: [{ title: like }, { internshipCategory: like }, { skills: like }, { location: like }],
      },
      include: { company: { select: { id: true, companyName: true, logoUrl: true } } },
      take: 10,
    }),
  ]);

  return { students, companies, internships };
};
