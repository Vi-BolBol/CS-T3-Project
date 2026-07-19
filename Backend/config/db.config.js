const { PrismaClient } = require("../generated/prisma");
const { nodeEnv } = require("./env.config");

const prisma = new PrismaClient({
  log: nodeEnv === "development" ? ["warn", "error"] : ["error"],
});

module.exports = prisma;