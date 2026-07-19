import { PrismaClient } from "@prisma/client";
import { notifyDeadlineApproaching } from "../services/notification.service.js";
import { NOTIFICATION_TYPES } from "../utils/notificationTypes.js";

const prisma = new PrismaClient();

// How many days before the deadline a company should be reminded.
const REMINDER_DAYS_BEFORE = 3;

// How often the job wakes up and checks. Deadlines are day-granularity, so
// there's no need to poll more often than once a day.
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

function daysFromNow(days) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

/**
 * Finds every open internship whose deadline lands exactly REMINDER_DAYS_BEFORE
 * days from now and sends the owning company one reminder notification.
 *
 * Idempotent: before notifying, it checks whether a deadline-reminder
 * notification already exists for that internship, so re-running the check
 * (e.g. after a server restart) never double-sends.
 */
export async function checkInternshipDeadlines() {
  const targetDate = daysFromNow(REMINDER_DAYS_BEFORE);
  const nextDay = daysFromNow(REMINDER_DAYS_BEFORE + 1);

  const internships = await prisma.internship.findMany({
    where: {
      status: "open",
      deadline: { gte: targetDate, lt: nextDay },
    },
  });

  for (const internship of internships) {
    const alreadyNotified = await prisma.notification.findFirst({
      where: {
        type: NOTIFICATION_TYPES.INTERNSHIP_DEADLINE_REMINDER,
        entityType: "Internship",
        entityId: internship.id,
      },
    });
    if (alreadyNotified) continue;

    await notifyDeadlineApproaching(internship);
  }

  return internships.length;
}

/** Called once from src/server.js on startup. Runs immediately, then daily. */
export function startInternshipDeadlineJob() {
  checkInternshipDeadlines().catch((err) =>
    console.error("[internshipDeadline.job] initial run failed:", err)
  );

  setInterval(() => {
    checkInternshipDeadlines().catch((err) =>
      console.error("[internshipDeadline.job] scheduled run failed:", err)
    );
  }, CHECK_INTERVAL_MS);
}
