import {
  createApplication,
  findApplication,
  findApplicationById,
  findApplicationsByStudent,
  findApplicationsByInternship,
  findApplicationsByCompany,
  updateApplicationStatus,
  deleteApplication,
  countUnseenForStudent,
  markAllSeenForStudent,
} from "../models/application.model.js";
import { PrismaClient } from "@prisma/client";
import { logAction } from "../utils/audit.js";
import { notifyNewApplication, notifyApplicationStatusChanged } from "./notification.service.js";

const prisma = new PrismaClient();
const VALID_STATUS = ["pending", "reviewed", "accepted", "rejected"];

/** A company may only touch applications on internships it owns. */
const assertCompanyOwnsInternship = async (userId, internshipId) => {
  const profile = await prisma.companyProfile.findUnique({ where: { userId } });
  if (!profile) return { ok: false, message: "No company profile found for this account" };

  const internship = await prisma.internship.findUnique({ where: { id: internshipId } });
  if (!internship) return { ok: false, message: "Internship not found" };
  if (internship.companyId !== profile.id) {
    return { ok: false, message: "You do not own this internship" };
  }
  return { ok: true, profile };
};

/* ---------- Student ---------- */

export const applyService = async (studentId, { internshipId, cvId = null }) => {
  const id = Number(internshipId);
  if (!id) return { success: false, message: "internshipId is required" };

  const internship = await prisma.internship.findUnique({ where: { id } });
  if (!internship) return { success: false, message: "Internship not found" };
  if (internship.status === "suspended") {
    return { success: false, message: "This listing has been suspended by an administrator" };
  }
  if (internship.status !== "open") {
    return { success: false, message: "This internship is no longer accepting applications" };
  }

  // Backed by the @@unique([studentId, internshipId]) constraint (FR-04).
  const existing = await findApplication(studentId, id);
  if (existing) return { success: false, message: "You have already applied to this internship" };

  // Attach the student's CV automatically if they have one.
  let resolvedCvId = cvId ? Number(cvId) : null;
  if (!resolvedCvId) {
    const cv = await prisma.cv.findFirst({
      where: { studentId },
      orderBy: { updatedAt: "desc" },
    });
    resolvedCvId = cv?.id ?? null;
  }

  const application = await createApplication({ studentId, internshipId: id, cvId: resolvedCvId });
  await logAction({ userId: studentId, action: "APPLICATION_SUBMITTED", entityType: "Application", entityId: application.id });
  await notifyNewApplication(application);
  return { success: true, message: "Application submitted", application };
};

/*
  Works out what the student should actually be told about each application.

  Two different failure modes look similar from the student's side but are stored
  very differently:
    - company DELETED  -> the internship row is gone; everything is read from the
                          tombstone snapshot written at delete time.
    - company SUSPENDED -> the rows all still exist; derived live from the
                          company's account status, so it un-derives itself the
                          moment the admin lifts the suspension.
*/
const decorate = (app) => {
  if (app.removedType === "deleted") {
    return {
      ...app,
      companyState: "deleted",
      companyStateReason: app.removedReason || null,
      companyStateAt: app.removedAt || null,
      displayTitle: app.internshipTitle || "Removed listing",
      displayCompany: app.companyName || "Removed company",
    };
  }

  const companyUser = app.internship?.company?.user;
  if (companyUser?.status === "suspended") {
    return {
      ...app,
      companyState: "suspended",
      companyStateReason: companyUser.suspensionReason || null,
      companyStateUntil: companyUser.suspendedUntil || null,
      displayTitle: app.internship?.title || "Internship",
      displayCompany: app.internship?.company?.companyName || "Company",
    };
  }

  if (app.internship?.status === "suspended") {
    return {
      ...app,
      companyState: "listing_suspended",
      companyStateReason: app.internship.suspensionReason || null,
      displayTitle: app.internship?.title || "Internship",
      displayCompany: app.internship?.company?.companyName || "Company",
    };
  }

  return {
    ...app,
    companyState: "active",
    displayTitle: app.internship?.title || "Internship",
    displayCompany: app.internship?.company?.companyName || "Company",
  };
};

export const getMyApplicationsService = async (studentId) => {
  const rows = await findApplicationsByStudent(studentId);
  const applications = rows.map(decorate);
  const unseen = await countUnseenForStudent(studentId);
  return { success: true, applications, unseen };
};

/** Badge count only — cheap enough for the navbar to poll. */
export const getMyApplicationAlertsService = async (studentId) => {
  const unseen = await countUnseenForStudent(studentId);
  return { success: true, unseen };
};

/** Called when the student opens the Applications page. */
export const markApplicationsSeenService = async (studentId) => {
  const { count } = await markAllSeenForStudent(studentId);
  return { success: true, message: `${count} update(s) marked as seen`, seen: count };
};

export const withdrawApplicationService = async (studentId, applicationId) => {
  const application = await findApplicationById(Number(applicationId));
  if (!application) return { success: false, message: "Application not found" };
  if (application.studentId !== studentId) {
    return { success: false, message: "You can only withdraw your own application" };
  }
  await deleteApplication(application.id);
  return { success: true, message: "Application withdrawn" };
};

/* ---------- Company ---------- */

export const getInternshipApplicantsService = async (userId, internshipId) => {
  const check = await assertCompanyOwnsInternship(userId, Number(internshipId));
  if (!check.ok) return { success: false, message: check.message };

  const applications = await findApplicationsByInternship(Number(internshipId));
  return { success: true, applications };
};

export const getCompanyApplicationsService = async (userId) => {
  const profile = await prisma.companyProfile.findUnique({ where: { userId } });
  if (!profile) return { success: false, message: "No company profile found for this account" };

  const applications = await findApplicationsByCompany(profile.id);
  return { success: true, applications };
};

export const decideApplicationService = async (userId, applicationId, status) => {
  if (!VALID_STATUS.includes(status)) {
    return { success: false, message: `status must be one of: ${VALID_STATUS.join(", ")}` };
  }

  const application = await findApplicationById(Number(applicationId));
  if (!application) return { success: false, message: "Application not found" };
  // A tombstoned application has no internship left to own or decide on.
  if (!application.internship) {
    return { success: false, message: "This listing no longer exists" };
  }

  const check = await assertCompanyOwnsInternship(userId, application.internship.id);
  if (!check.ok) return { success: false, message: check.message };

  const updated = await updateApplicationStatus(application.id, status);
  await logAction({ userId, action: `APPLICATION_${status.toUpperCase()}`, entityType: "Application", entityId: updated.id });
  await notifyApplicationStatusChanged({ ...updated, internship: application.internship });
  return { success: true, message: `Application marked as ${status}`, application: updated };
};
