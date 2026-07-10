import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async ({ email, passwordHash, role, status = "active" }) => {
  return prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      status,
    },
  });
};

// Creates the User row AND its role-specific profile row (StudentProfile or
// CompanyProfile) in a single transaction, so a user can never exist without
// a matching profile — the two writes succeed or fail together.
export const createUserWithProfile = async ({ email, passwordHash, role, status = "active", name }) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, passwordHash, role, status },
    });

    if (role === "company") {
      await tx.companyProfile.create({
        data: {
          userId: user.id,
          companyName: name || null,
        },
      });
    } else if (role === "student") {
      await tx.studentProfile.create({
        data: {
          userId: user.id,
          fullName: name || null,
        },
      });
    }

    return user;
  });
};

export const disconnectAuthModel = async () => {
  await prisma.$disconnect();
};

export default {
  findUserByEmail,
  createUser,
  createUserWithProfile,
  disconnectAuthModel,
};