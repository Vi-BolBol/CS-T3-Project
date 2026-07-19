import { PrismaClient } from "@prisma/client";
import {
  createNotification,
  createNotifications,
  findNotificationsByRecipient,
  findNotificationById,
  countUnreadForRecipient,
  markNotificationRead,
  markAllNotificationsRead,
} from "../models/notification.model.js";
import { NOTIFICATION_TYPES, buildNotificationContent } from "../utils/notificationTypes.js";

const prisma = new PrismaClient();

/* ==========================================================================
 * Reader API — used by controllers/notification.controller.js
 * ======================================================================== */

export const getMyNotificationsService = async (userId) => {
  const notifications = await findNotificationsByRecipient(userId);
  return { success: true, notifications };
};

export const getUnreadNotificationsService = async (userId) => {
  const notifications = await findNotificationsByRecipient(userId, { onlyUnread: true });
  return { success: true, notifications };
};

export const getUnreadCountService = async (userId) => {
  const count = await countUnreadForRecipient(userId);
  return { success: true, count };
};

export const markAsReadService = async (userId, notificationId) => {
  const notification = await findNotificationById(Number(notificationId));
  if (!notification) return { success: false, message: "Notification not found" };
  if (notification.recipientId !== userId) {
    return { success: false, message: "You can only mark your own notifications as read" };
  }

  const updated = await markNotificationRead(notification.id);
  return { success: true, message: "Notification marked as read", notification: updated };
};

export const markAllAsReadService = async (userId) => {
  await markAllNotificationsRead(userId);
  return { success: true, message: "All notifications marked as read" };
};

/* ==========================================================================
 * Writer API — domain events. Other services call these; they never touch
 * the notification model directly. Each function fails soft (logs, doesn't
 * throw) so a notification problem never blocks the action that triggered it
 * (e.g. a broken notification must not stop an application from saving).
 * ======================================================================== */

const safeNotify = async (fn) => {
  try {
    await fn();
  } catch (err) {
    console.error("[notification.service] failed to create notification:", err);
  }
};

/** A student applied → tell the company that owns the internship. */
export const notifyNewApplication = (application) =>
  safeNotify(async () => {
    const internship = await prisma.internship.findUnique({
      where: { id: application.internshipId },
      include: { company: { select: { userId: true } } },
    });
    if (!internship?.company?.userId) return;

    const student = await prisma.user.findUnique({
      where: { id: application.studentId },
      include: { studentProfile: { select: { fullName: true } } },
    });

    const { title, message } = buildNotificationContent(NOTIFICATION_TYPES.NEW_APPLICATION, {
      studentName: student?.studentProfile?.fullName || student?.email,
      internshipTitle: internship.title,
    });

    await createNotification({
      recipientId: internship.company.userId,
      type: NOTIFICATION_TYPES.NEW_APPLICATION,
      title,
      message,
      entityType: "Application",
      entityId: application.id,
    });
  });

/** A company changed an application's status → tell the student. */
export const notifyApplicationStatusChanged = (application) =>
  safeNotify(async () => {
    const { title, message } = buildNotificationContent(
      NOTIFICATION_TYPES.APPLICATION_STATUS_CHANGED,
      {
        internshipTitle: application.internship?.title,
        status: application.status,
      }
    );

    await createNotification({
      recipientId: application.studentId,
      type: NOTIFICATION_TYPES.APPLICATION_STATUS_CHANGED,
      title,
      message,
      entityType: "Application",
      entityId: application.id,
    });
  });

/** A company published a new internship → tell everyone following that company. */
export const notifyFollowersOfNewInternship = (internship, companyProfile) =>
  safeNotify(async () => {
    const followers = await prisma.followedCompany.findMany({
      where: { companyId: companyProfile.id },
      select: { userId: true },
    });
    if (followers.length === 0) return;

    const { title, message } = buildNotificationContent(
      NOTIFICATION_TYPES.NEW_INTERNSHIP_FROM_FOLLOWED_COMPANY,
      { companyName: companyProfile.companyName, internshipTitle: internship.title }
    );

    await createNotifications(
      followers.map((f) => ({
        recipientId: f.userId,
        type: NOTIFICATION_TYPES.NEW_INTERNSHIP_FROM_FOLLOWED_COMPANY,
        title,
        message,
        entityType: "Internship",
        entityId: internship.id,
      }))
    );
  });

/** An internship's deadline is approaching → tell the owning company. Used by jobs/internshipDeadline.job.js. */
export const notifyDeadlineApproaching = (internship) =>
  safeNotify(async () => {
    const company = await prisma.companyProfile.findUnique({
      where: { id: internship.companyId },
      select: { userId: true },
    });
    if (!company?.userId) return;

    const { title, message } = buildNotificationContent(
      NOTIFICATION_TYPES.INTERNSHIP_DEADLINE_REMINDER,
      {
        internshipTitle: internship.title,
        deadline: internship.deadline?.toISOString().slice(0, 10),
      }
    );

    await createNotification({
      recipientId: company.userId,
      type: NOTIFICATION_TYPES.INTERNSHIP_DEADLINE_REMINDER,
      title,
      message,
      entityType: "Internship",
      entityId: internship.id,
    });
  });
