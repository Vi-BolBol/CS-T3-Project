import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createNotification = ({
  recipientId,
  type,
  title,
  message,
  entityType = null,
  entityId = null,
}) =>
  prisma.notification.create({
    data: { recipientId, type, title, message, entityType, entityId },
  });

/** Bulk insert — used when one event fans out to many recipients (e.g. every
 *  follower of a company that just posted a new internship). */
export const createNotifications = (rows) =>
  prisma.notification.createMany({ data: rows });

export const findNotificationsByRecipient = (recipientId, { onlyUnread = false } = {}) =>
  prisma.notification.findMany({
    where: { recipientId, ...(onlyUnread ? { isRead: false } : {}) },
    orderBy: { createdAt: "desc" },
  });

export const findNotificationById = (id) =>
  prisma.notification.findUnique({ where: { id } });

export const countUnreadForRecipient = (recipientId) =>
  prisma.notification.count({ where: { recipientId, isRead: false } });

export const markNotificationRead = (id) =>
  prisma.notification.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  });

export const markAllNotificationsRead = (recipientId) =>
  prisma.notification.updateMany({
    where: { recipientId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
