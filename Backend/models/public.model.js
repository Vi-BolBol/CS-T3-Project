import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Public directory of companies. Only fields safe to show a logged-out
 * visitor — never `user`, never `contact`/email.
 */
export const findPublicCompanies = () =>
  prisma.companyProfile.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      industry: true,
      location: true,
      logoUrl: true,
      description: true,
      employeeCount: true,
      website: true,
      _count: { select: { internships: true } },
    },
  });

/** One company + its open listings, for the public company detail page. */
export const findPublicCompanyById = (id) =>
  prisma.companyProfile.findUnique({
    where: { id },
    select: {
      id: true,
      companyName: true,
      industry: true,
      location: true,
      logoUrl: true,
      coverUrl: true,
      description: true,
      employeeCount: true,
      website: true,
      internships: {
        where: { status: "open" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          location: true,
          workEnvironment: true,
          internshipCategory: true,
          salaryMin: true,
          salaryMax: true,
          createdAt: true,
        },
      },
    },
  });

/**
 * Unified public search across open internships + companies.
 * Deliberately NOT students — a logged-out visitor has no business
 * enumerating student profiles. (The company-side /api/company/search does
 * include students, but that route is behind protect + authorize("company").)
 */
export const searchPublic = async (q) => {
  const like = { contains: q, mode: "insensitive" };

  const [internships, companies] = await Promise.all([
    prisma.internship.findMany({
      where: {
        status: "open",
        OR: [{ title: like }, { internshipCategory: like }, { skills: like }, { location: like }],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        company: { select: { id: true, companyName: true, logoUrl: true, industry: true } },
      },
    }),
    prisma.companyProfile.findMany({
      where: { OR: [{ companyName: like }, { industry: like }, { location: like }] },
      take: 20,
      select: {
        id: true,
        companyName: true,
        industry: true,
        location: true,
        logoUrl: true,
        _count: { select: { internships: true } },
      },
    }),
  ]);

  return { internships, companies };
};

export default { findPublicCompanies, findPublicCompanyById, searchPublic };
