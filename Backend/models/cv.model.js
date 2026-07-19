import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findCvByStudent = (studentId) =>
  prisma.cv.findFirst({ where: { studentId }, orderBy: { updatedAt: "desc" } });

export const upsertCv = async ({ studentId, userCvData, fileUrl = null, score = null }) => {
  const existing = await findCvByStudent(studentId);
  if (existing) {
    return prisma.cv.update({
      where: { id: existing.id },
      data: {
        userCvData,
        ...(fileUrl !== null ? { fileUrl } : {}),
        ...(score !== null ? { score } : {}),
      },
    });
  }
  return prisma.cv.create({ data: { studentId, userCvData, fileUrl, score } });
};

export const deleteCvByStudent = async (studentId) => {
  const existing = await findCvByStudent(studentId);
  if (!existing) return null;
  return prisma.cv.delete({ where: { id: existing.id } });
};
