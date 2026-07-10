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

export const findPublicInternships = async ({ status = "open", search, location } = {}) => {
  const where = {};
  if (status) where.status = status;
  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }
  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  return prisma.internship.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        select: { id: true, companyName: true, logoUrl: true, industry: true },
      },
      _count: { select: { applications: true } },
    },
  });
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
