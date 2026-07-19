import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Shape returned to the student ("internships I applied to")
const studentInclude = {
  internship: {
    include: {
      company: {
        select: {
          id: true, companyName: true, logoUrl: true, industry: true,
          // The company's account status is what tells the student their
          // application is stuck because the company was suspended.
          user: {
            select: { status: true, suspensionReason: true, suspendedUntil: true },
          },
        },
      },
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

// findFirst, not findUnique: internshipId is nullable now (tombstones), and a
// compound unique containing a nullable column is not safely addressable.
export const findApplication = (studentId, internshipId) =>
  prisma.application.findFirst({ where: { studentId, internshipId } });

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
  prisma.application.update({
    where: { id },
    data: {
      status,
      // A decision the student has not seen yet is what lights up the badge.
      ...(status === "accepted" || status === "rejected"
        ? { decidedAt: new Date(), seenAt: null }
        : {}),
    },
  });

/** Unseen accept/reject decisions, plus listings removed out from under them. */
export const countUnseenForStudent = (studentId) =>
  prisma.application.count({
    where: {
      studentId,
      seenAt: null,
      OR: [
        { status: { in: ["accepted", "rejected"] } },
        { removedType: { not: null } },
      ],
    },
  });

export const markAllSeenForStudent = (studentId) =>
  prisma.application.updateMany({
    where: { studentId, seenAt: null },
    data: { seenAt: new Date() },
  });

export const deleteApplication = (id) =>
  prisma.application.delete({ where: { id } });

export const countApplicationsForInternship = (internshipId) =>
  prisma.application.count({ where: { internshipId } });
