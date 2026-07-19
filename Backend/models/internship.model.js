import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findCompanyProfileByUserId = async (userId) => {
  return prisma.companyProfile.findFirst({
    where: { userId },
    orderBy: { id: "asc" },
  });
};

export const createInternship = async (data) => {
  return prisma.internship.create({ data });
};

export const findInternshipsByCompanyId = async (companyId) => {
  return prisma.internship.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
    },
  });
};

export const findInternshipById = async (id) => {
  return prisma.internship.findUnique({
    where: { id },
    include: {
      company: true,
      _count: { select: { applications: true } },
    },
  });
};

export const findPublicInternships = async ({
  status = "open",
  category,
  location,
  q,
  page = 1,
  pageSize = 100,
} = {}) => {
  const take = Math.min(Math.max(Number(pageSize) || 100, 1), 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {
    ...(status ? { status } : {}),
    ...(category ? { internshipCategory: { contains: category, mode: "insensitive" } } : {}),
    ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
    ...(q ? { OR: [
        { title: { contains: q, mode: "insensitive" } },
        { skills: { contains: q, mode: "insensitive" } },
      ] } : {}),
  };

  const [internships, total] = await Promise.all([
    prisma.internship.findMany({
      where, orderBy: { createdAt: "desc" }, skip, take,
      include: { company: { select: { id: true, companyName: true, logoUrl: true, industry: true } } },
    }),
    prisma.internship.count({ where }),
  ]);

  return { internships, total, page: Math.max(Number(page) || 1, 1), pageSize: take };
};

export const updateInternship = async (id, data) => {
  return prisma.internship.update({ where: { id }, data });
};

export const deleteInternship = async (id) => {
  return prisma.internship.delete({ where: { id } });
};


export default {
  findCompanyProfileByUserId,
  createInternship,
  findInternshipsByCompanyId,
  findInternshipById,
  findPublicInternships,
  updateInternship,
  deleteInternship,
};
