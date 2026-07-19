/**
 * Promote an existing user to admin.
 *
 * Admin accounts CANNOT be created through the public /api/auth/register endpoint —
 * that's deliberate (otherwise anyone could sign up as an admin). This script is the
 * intended way for a developer to grant admin rights.
 *
 *   node scripts/makeAdmin.js someone@example.com
 *   npm run make-admin -- someone@example.com
 *
 * To revoke:
 *   node scripts/makeAdmin.js someone@example.com --revoke
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = process.argv[2];
const revoke = process.argv.includes("--revoke");

if (!email) {
  console.error("Usage: node scripts/makeAdmin.js <email> [--revoke]");
  process.exit(1);
}

try {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`No user found with email: ${email}`);
    console.error("Register the account through the app first, then run this script.");
    process.exit(1);
  }

  const newRole = revoke ? "student" : "admin";
  await prisma.user.update({ where: { id: user.id }, data: { role: newRole } });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: revoke ? "ADMIN_REVOKED" : "ADMIN_GRANTED",
      entityType: "User",
      entityId: user.id,
    },
  });

  console.log(`✓ ${email} is now: ${newRole}`);
  console.log("  They must log out and log back in — the role lives in the JWT.");
} catch (err) {
  console.error("Failed:", err.message);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
