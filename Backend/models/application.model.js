import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findStudentProfileByUserId = async (userId) => {
  return prisma.studentProfile.findUnique({ where: { userId } });
};

export const createApplication = async (data) => {
  return prisma.application.create({ data });
};

export const findApplicationById = async (id) => {
  return prisma.application.findUnique({
    where: { id },
    include: {
      internship: { include: { company: true } },
      student: { include: { studentProfile: true } },
      cv: true,
    },
  });
};

// All applications for one internship — used by the company dashboard's
// "View Applicants" tab.
export const findApplicationsByInternshipId = async (internshipId) => {
  return prisma.application.findMany({
    where: { internshipId },
    orderBy: { appliedAt: "desc" },
    include: {
      student: { include: { studentProfile: true } },
      cv: true,
    },
  });
};

// All applications submitted by one student — used by the student's
// "My Applications" page.
export const findApplicationsByStudentId = async (studentId) => {
  return prisma.application.findMany({
    where: { studentId },
    orderBy: { appliedAt: "desc" },
    include: {
      internship: { include: { company: true } },
    },
  });
};

export const findApplicationByStudentAndInternship = async (studentId, internshipId) => {
  return prisma.application.findUnique({
    where: { studentId_internshipId: { studentId, internshipId } },
  });
};

export const updateApplicationStatus = async (id, status) => {
  return prisma.application.update({ where: { id }, data: { status } });
};

export const findInternshipWithCompany = async (internshipId) => {
  return prisma.internship.findUnique({
    where: { id: internshipId },
    include: { company: true },
  });
};

export default {
  findStudentProfileByUserId,
  createApplication,
  findApplicationById,
  findApplicationsByInternshipId,
  findApplicationsByStudentId,
  findApplicationByStudentAndInternship,
  updateApplicationStatus,
  findInternshipWithCompany,
};
