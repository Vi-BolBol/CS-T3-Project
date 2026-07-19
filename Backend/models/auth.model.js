import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

/**
 * Creates the User AND its matching role profile in a single transaction.
 *
 * Previously registration only created the `User` row, so every route needing a
 * CompanyProfile/StudentProfile (posting an internship, /internships/mine) 400'd
 * for any manually-registered account. Both rows now succeed or both roll back.
 */
export const createUser = async ({ email, passwordHash, role, status = "active", fullName, companyName }) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, passwordHash, role, status },
    });

    if (role === "student") {
      await tx.studentProfile.create({
        data: { userId: user.id, fullName: fullName || null },
      });
    } else if (role === "company") {
      await tx.companyProfile.create({
        data: { userId: user.id, companyName: companyName || null },
      });
    }
    // admin has no profile table by design

    return user;
  });
};

/** Minimal projection used by the session check — no password hash. */
export const findUserStatusById = (id) =>
  prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true, email: true, role: true, status: true,
      suspendedAt: true, suspendedUntil: true, suspensionReason: true,
    },
  });

/** Clears a suspension once its end date has passed. */
export const liftSuspension = (id) =>
  prisma.user.update({
    where: { id: Number(id) },
    data: { status: "active", suspendedAt: null, suspendedUntil: null, suspensionReason: null },
  });

export const disconnectAuthModel = async () => {
  await prisma.$disconnect();
};

export default { findUserByEmail, createUser, findUserStatusById, liftSuspension, disconnectAuthModel };
