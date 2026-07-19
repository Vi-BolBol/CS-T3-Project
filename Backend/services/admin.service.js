import {
  countAll,
  findUsers,
  findUserById,
  setUserStatus,
  removeUser,
  findAuditLogs,
  findSuspiciousUsers,
  findAuditActions,
  findUserDetail,
  findInternshipsByUser,
  findCvByUser,
  setInternshipStatus,
  findInternshipById,
  findInternshipDetail,
  removeInternship,
  snapshotApplicationsForInternships,
  findInternshipIdsByUser,
} from "../models/admin.model.js";
import { logAction } from "../utils/audit.js";

const VALID_STATUS = ["active", "inactive", "suspended"];
const VALID_ROLES = ["student", "company", "admin"];

/*
  Query parameters arrive as strings and cannot be trusted.

  A client that builds its query with URLSearchParams turns a missing value into
  the literal string "undefined" rather than omitting the key. Passing that
  straight to Prisma threw on the UserRole enum and surfaced as a 500 — a server
  error for what was really an empty filter. Junk input should be ignored, not
  fatal.
*/
const clean = (v) => {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  if (!s || s === "undefined" || s === "null") return undefined;
  return s;
};

/** Only a real role reaches the query; anything else is treated as no filter. */
const cleanRole = (v) => {
  const s = clean(v);
  return s && VALID_ROLES.includes(s) ? s : undefined;
};

/** An unparseable date is dropped rather than becoming an Invalid Date. */
const cleanDate = (v) => {
  const s = clean(v);
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : s;
};

const cleanId = (v) => {
  const s = clean(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isInteger(n) && n > 0 ? n : undefined;
};

export const getStatsService = async () => {
  const stats = await countAll();
  return { success: true, stats };
};

export const getUsersService = async (filters = {}) => {
  const users = await findUsers({
    role: cleanRole(filters.role),
    status: VALID_STATUS.includes(clean(filters.status)) ? clean(filters.status) : undefined,
    search: clean(filters.search),
    page: filters.page,
    pageSize: filters.pageSize,
  });

  return {
    success: true,
    users,
    page: Number(filters.page) || 1,
    pageSize: Math.min(Math.max(Number(filters.pageSize) || 200, 1), 200),
  };
};

export const updateUserStatusService = async (adminId, userId, status, { reason, days } = {}) => {
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

  let until = null;
  if (status === "suspended") {
    // A suspension with no stated reason is not reviewable later, and the person
    // being suspended has no idea what they did. Require it.
    if (!reason || !String(reason).trim()) {
      return { success: false, message: "A reason is required to suspend an account" };
    }
    if (days !== undefined && days !== null && days !== "" && days !== "permanent") {
      const n = Number(days);
      if (!Number.isFinite(n) || n < 1 || n > 3650) {
        return { success: false, message: "Duration must be between 1 and 3650 days" };
      }
      until = new Date(Date.now() + n * 24 * 60 * 60 * 1000);
    }
    // until === null means an indefinite suspension.
  }

  const user = await setUserStatus(userId, status, {
    reason: status === "suspended" ? String(reason).trim() : null,
    until,
  });

  await logAction({
    userId: adminId,
    action: `USER_${status.toUpperCase()}`,
    entityType: "User",
    entityId: user.id,
  });

  return {
    success: true,
    message:
      status === "suspended"
        ? until
          ? `User suspended until ${until.toDateString()}`
          : "User suspended indefinitely"
        : `User ${status}`,
    user,
  };
};

export const deleteUserService = async (adminId, userId, { reason } = {}) => {
  const target = await findUserById(userId);
  if (!target) return { success: false, message: "User not found" };
  if (target.id === adminId) {
    return { success: false, message: "You cannot delete your own account" };
  }
  if (target.role === "admin") {
    return { success: false, message: "Admin accounts cannot be deleted here" };
  }

  // Snapshot BEFORE deleting. Deleting a company cascades to its listings, and
  // the application FK is SET NULL — so without this the student is left with a
  // row that has no title and no company name. Once the row is gone there is
  // nothing to reconstruct it from.
  let tombstoned = 0;
  if (target.role === "company") {
    const internshipIds = await findInternshipIdsByUser(userId);
    tombstoned = await snapshotApplicationsForInternships(
      internshipIds,
      reason || "The company account was removed by an administrator."
    );
  }

  // Log BEFORE deleting — the FK is SetNull, so the entry survives the user.
  await logAction({
    userId: adminId,
    action: "USER_DELETED",
    entityType: "User",
    entityId: target.id,
  });
  await removeUser(userId);

  return {
    success: true,
    message: "User deleted",
    tombstoned,
  };
};

export const getAuditLogsService = async (filters = {}) => {
  // Cap the limit. This endpoint feeds an export button, so it has to serve a
  // large pull without letting ?limit=999999 turn into a table scan.
  const limit = Math.min(Math.max(Number(filters.limit) || 150, 1), 2000);

  const [logs, actions] = await Promise.all([
    findAuditLogs({
      action: clean(filters.action),
      userId: cleanId(filters.userId),
      role: cleanRole(filters.role),
      search: clean(filters.search),
      from: cleanDate(filters.from),
      to: cleanDate(filters.to),
      limit,
    }),
    findAuditActions(),
  ]);
  return { success: true, logs, actions, limit };
};

/* ---------- Per-user drill-down ---------- */

export const getUserDetailService = async (userId) => {
  const user = await findUserDetail(userId);
  if (!user) return { success: false, message: "User not found" };
  return { success: true, user };
};

/** One account's activity, date-filterable. Powers the admin Activity tab. */
export const getUserActivityService = async (userId, { from, to, action, limit } = {}) => {
  const target = await findUserById(userId);
  if (!target) return { success: false, message: "User not found" };

  const logs = await findAuditLogs({
    userId,
    action: clean(action),
    from: cleanDate(from),
    to: cleanDate(to),
    limit: Math.min(Math.max(Number(limit) || 300, 1), 2000),
  });
  return { success: true, logs };
};

export const getUserInternshipsService = async (userId) => {
  const target = await findUserById(userId);
  if (!target) return { success: false, message: "User not found" };
  if (target.role !== "company") {
    return { success: false, message: "Only company accounts have internships" };
  }
  const internships = await findInternshipsByUser(userId);
  return { success: true, internships };
};

export const getUserCvService = async (userId) => {
  const target = await findUserById(userId);
  if (!target) return { success: false, message: "User not found" };
  if (target.role !== "student") {
    return { success: false, message: "Only student accounts have a CV" };
  }
  const cv = await findCvByUser(userId);
  return { success: true, cv: cv || null };
};

/** Full listing + applicants, for the admin drill-down. */
export const getInternshipDetailService = async (internshipId) => {
  const internship = await findInternshipDetail(internshipId);
  if (!internship) return { success: false, message: "Internship not found" };
  return { success: true, internship };
};

/* ---------- Moderating a single listing ---------- */

const VALID_INTERNSHIP_STATUS = ["open", "closed", "draft", "suspended"];

export const moderateInternshipService = async (adminId, internshipId, status, reason) => {
  if (!VALID_INTERNSHIP_STATUS.includes(status)) {
    return { success: false, message: `status must be one of: ${VALID_INTERNSHIP_STATUS.join(", ")}` };
  }
  const internship = await findInternshipById(internshipId);
  if (!internship) return { success: false, message: "Internship not found" };

  if (status === "suspended" && (!reason || !String(reason).trim())) {
    return { success: false, message: "A reason is required to suspend a listing" };
  }

  const updated = await setInternshipStatus(internshipId, status, reason ? String(reason).trim() : null);
  await logAction({
    userId: adminId,
    action: `INTERNSHIP_${status.toUpperCase()}`,
    entityType: "Internship",
    entityId: updated.id,
  });
  return { success: true, message: `Listing ${status}`, internship: updated };
};

export const deleteInternshipService = async (adminId, internshipId, reason) => {
  const internship = await findInternshipById(internshipId);
  if (!internship) return { success: false, message: "Internship not found" };

  // Same reasoning as deleting a company: snapshot the applications first or the
  // students who applied lose the record entirely.
  const tombstoned = await snapshotApplicationsForInternships(
    [internship.id],
    reason || "This listing was removed by an administrator."
  );

  await logAction({
    userId: adminId,
    action: "INTERNSHIP_DELETED",
    entityType: "Internship",
    entityId: internship.id,
  });
  await removeInternship(internshipId);

  return { success: true, message: "Listing deleted", tombstoned };
};

export const getSuspiciousService = async () => {
  const flagged = await findSuspiciousUsers();
  return { success: true, flagged };
};
