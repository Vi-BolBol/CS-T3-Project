import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Write an audit log entry. Fire-and-forget: an audit failure must never break
 * the request it's recording, so errors are logged and swallowed.
 */
export const logAction = async ({ userId = null, action, entityType = null, entityId = null }) => {
  try {
    await prisma.auditLog.create({
      data: { userId, action, entityType, entityId: entityId ? Number(entityId) : null },
    });
  } catch (err) {
    console.error("[audit] failed to write log:", err.message);
  }
};

/** Alias — services import this name. Same function. */
export const recordAudit = logAction;

export default { logAction, recordAudit };
