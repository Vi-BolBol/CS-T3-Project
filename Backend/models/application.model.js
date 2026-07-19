import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Shape returned to the student ("internships I applied to")
const studentInclude = {
  internship: {
    include: {
      company: { select: { id: true, companyName: true, logoUrl: true, industry: true } },
    },
  },
};

// Shape returned to the company ("who applied to my listing")
const companyInclude = {
  student: {
    select: {
      id: true,
      email: true,
      studentProfile: {
        select: { fullName: true, bio: true, skills: true, education: true, profileImage: true },
      },
    },
  },
  cv: { select: { id: true, fileUrl: true, score: true, userCvData: true } },
};

export const createApplication = ({ studentId, internshipId, cvId = null }) =>
  prisma.application.create({
    data: { studentId, internshipId, cvId },
    include: studentInclude,
  });

export const findApplication = (studentId, internshipId) =>
  prisma.application.findUnique({
    where: { studentId_internshipId: { studentId, internshipId } },
  });

export const findApplicationById = (id) =>
  prisma.application.findUnique({
    where: { id },
    include: { internship: { select: { id: true, companyId: true, title: true } } },
  });

export const findApplicationsByStudent = (studentId) =>
  prisma.application.findMany({
    where: { studentId },
    include: studentInclude,
    orderBy: { appliedAt: "desc" },
  });

export const findApplicationsByInternship = (internshipId) =>
  prisma.application.findMany({
    where: { internshipId },
    include: companyInclude,
    orderBy: { appliedAt: "desc" },
  });

export const findApplicationsByCompany = (companyId) =>
  prisma.application.findMany({
    where: { internship: { companyId } },
    include: { ...companyInclude, internship: { select: { id: true, title: true } } },
    orderBy: { appliedAt: "desc" },
  });

export const updateApplicationStatus = (id, status) =>
  prisma.application.update({ where: { id }, data: { status } });

export const deleteApplication = (id) =>
  prisma.application.delete({ where: { id } });

export const countApplicationsForInternship = (internshipId) =>
  prisma.application.count({ where: { internshipId } });
