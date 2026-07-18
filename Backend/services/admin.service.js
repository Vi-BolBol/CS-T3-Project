import {
  countAll,
  findUsers,
  findUserById,
  setUserStatus,
  removeUser,
  findAuditLogs,
  findSuspiciousUsers,
} from "../models/admin.model.js";
import { logAction } from "../utils/audit.js";

const VALID_STATUS = ["active", "inactive", "suspended"];

export const getStatsService = async () => {
  const stats = await countAll();
  return { success: true, stats };
};

export const getUsersService = async (filters) => {
  const users = await findUsers(filters);
  return { success: true, users, page: filters?.page ?? 1, pageSize: filters?.pageSize ?? 200 };
};

export const updateUserStatusService = async (adminId, userId, status) => {
  if (!VALID_STATUS.includes(status)) {
    return { success: false, message: `status must be one of: ${VALID_STATUS.join(", ")}` };
  }

  const target = await findUserById(userId);
  if (!target) return { success: false, message: "User not found" };

  // An admin must not lock themselves out.
  if (target.id === adminId) {
    return { success: false, message: "You cannot change your own account status" };
  }
  // Admins are not suspendable through the panel — prevents an admin war.
  if (target.role === "admin") {
    return { success: false, message: "Admin accounts cannot be modified here. Use the CLI." };
  }

  const user = await setUserStatus(userId, status);
  await logAction({
    userId: adminId,
    action: `USER_${status.toUpperCase()}`,
    entityType: "User",
    entityId: user.id,
  });

  return { success: true, message: `User ${status}`, user };
};

export const deleteUserService = async (adminId, userId) => {
  const target = await findUserById(userId);
  if (!target) return { success: false, message: "User not found" };
  if (target.id === adminId) {
    return { success: false, message: "You cannot delete your own account" };
  }
  if (target.role === "admin") {
    return { success: false, message: "Admin accounts cannot be deleted here" };
  }

  // Log BEFORE deleting — the FK is SetNull, so the entry survives the user.
  await logAction({
    userId: adminId,
    action: "USER_DELETED",
    entityType: "User",
    entityId: target.id,
  });
  await removeUser(userId);

  return { success: true, message: "User deleted" };
};

export const getAuditLogsService = async (filters) => {
  const logs = await findAuditLogs(filters);
  return { success: true, logs };
};

export const getSuspiciousService = async () => {
  const flagged = await findSuspiciousUsers();
  return { success: true, flagged };
};
