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

export const disconnectAuthModel = async () => {
  await prisma.$disconnect();
};

export default {
  findUserByEmail,
  createUser,
  disconnectAuthModel,
};