/**
 * Single source of truth for notification "type" values.
 *
 * These must match the `NotificationType` enum in prisma/schema.prisma
 * exactly (same strings). Keeping them here means services never hardcode
 * a raw string, and the frontend can import the same list if it needs to
 * branch on type (e.g. picking an icon per notification).
 */
export const NOTIFICATION_TYPES = {
  NEW_APPLICATION: "new_application",
  APPLICATION_STATUS_CHANGED: "application_status_changed",
  NEW_INTERNSHIP_FROM_FOLLOWED_COMPANY: "new_internship_from_followed_company",
  INTERNSHIP_DEADLINE_REMINDER: "internship_deadline_reminder",
};

/**
 * Builds the { title, message } shown to the user for each notification
 * type. Centralized so wording stays consistent no matter which service
 * triggers the notification.
 */
export const buildNotificationContent = (type, data = {}) => {
  switch (type) {
    case NOTIFICATION_TYPES.NEW_APPLICATION:
      return {
        title: "New applicant",
        message: `${data.studentName || "A student"} applied to "${data.internshipTitle}"`,
      };

    case NOTIFICATION_TYPES.APPLICATION_STATUS_CHANGED:
      return {
        title: "Application update",
        message: `Your application to "${data.internshipTitle}" was marked as ${data.status}`,
      };

    case NOTIFICATION_TYPES.NEW_INTERNSHIP_FROM_FOLLOWED_COMPANY:
      return {
        title: "New internship posted",
        message: `${data.companyName || "A company you follow"} just posted "${data.internshipTitle}"`,
      };

    case NOTIFICATION_TYPES.INTERNSHIP_DEADLINE_REMINDER:
      return {
        title: "Deadline approaching",
        message: `"${data.internshipTitle}" closes on ${data.deadline}`,
      };

    default:
      return { title: "Notification", message: data.message || "" };
  }
};

export default { NOTIFICATION_TYPES, buildNotificationContent };
