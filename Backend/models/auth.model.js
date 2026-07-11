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

export const disconnectAuthModel = async () => {
  await prisma.$disconnect();
};

export default { findUserByEmail, createUser, disconnectAuthModel };
