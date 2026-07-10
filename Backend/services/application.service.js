import {
  findStudentProfileByUserId,
  createApplication,
  findApplicationById,
  findApplicationsByInternshipId,
  findApplicationsByStudentId,
  findApplicationByStudentAndInternship,
  updateApplicationStatus,
  findInternshipWithCompany,
} from "../models/application.model.js";
import { findCompanyProfileByUserId } from "../models/internship.model.js";

const VALID_STATUSES = ["pending", "reviewed", "accepted", "rejected"];

// Student applies to an internship.
export const applyToInternshipService = async (userId, internshipId, cvId = null) => {
  const studentProfile = await findStudentProfileByUserId(userId);
  if (!studentProfile) {
    return { success: false, message: "Please complete your student profile before applying." };
  }

  const internship = await findInternshipWithCompany(internshipId);
  if (!internship) {
    return { success: false, message: "Internship not found." };
  }
  if (internship.status !== "open") {
    return { success: false, message: "This internship is no longer accepting applications." };
  }

  const existing = await findApplicationByStudentAndInternship(userId, internshipId);
  if (existing) {
    return { success: false, message: "You've already applied to this internship." };
  }

  const application = await createApplication({
    studentId: userId,
    internshipId,
    cvId: cvId || null,
    status: "pending",
  });

  return { success: true, message: "Application submitted successfully", application };
};

// Company views applicants for one of their own internships.
export const listApplicantsForInternshipService = async (userId, internshipId) => {
  const companyProfile = await findCompanyProfileByUserId(userId);
  if (!companyProfile) {
    return { success: false, message: "No company profile found for this account." };
  }

  const internship = await findInternshipWithCompany(internshipId);
  if (!internship) {
    return { success: false, message: "Internship not found." };
  }
  if (internship.companyId !== companyProfile.id) {
    return { success: false, message: "You don't have access to this internship's applicants." };
  }

  const applications = await findApplicationsByInternshipId(internshipId);
  return { success: true, applications };
};

// Student views their own application history.
export const listMyApplicationsService = async (userId) => {
  const applications = await findApplicationsByStudentId(userId);
  return { success: true, applications };
};

// Company accepts/rejects/reviews an applicant. Ownership is checked via
// the internship the application belongs to, not the application's own
// fields, since only the company that owns the listing may update it.
export const updateApplicationStatusService = async (userId, applicationId, status) => {
  if (!VALID_STATUSES.includes(status)) {
    return { success: false, message: `Status must be one of: ${VALID_STATUSES.join(", ")}` };
  }

  const companyProfile = await findCompanyProfileByUserId(userId);
  if (!companyProfile) {
    return { success: false, message: "No company profile found for this account." };
  }

  const application = await findApplicationById(applicationId);
  if (!application) {
    return { success: false, message: "Application not found." };
  }
  if (application.internship.companyId !== companyProfile.id) {
    return { success: false, message: "You don't have access to this application." };
  }

  const updated = await updateApplicationStatus(applicationId, status);
  return { success: true, message: "Application status updated", application: updated };
};

// Company views a single applicant's full detail (used by the CV review page).
export const getApplicationForCompanyService = async (userId, applicationId) => {
  const companyProfile = await findCompanyProfileByUserId(userId);
  if (!companyProfile) {
    return { success: false, message: "No company profile found for this account." };
  }

  const application = await findApplicationById(applicationId);
  if (!application) {
    return { success: false, message: "Application not found." };
  }
  if (application.internship.companyId !== companyProfile.id) {
    return { success: false, message: "You don't have access to this application." };
  }

  return { success: true, application };
};

export default {
  applyToInternshipService,
  listApplicantsForInternshipService,
  listMyApplicationsService,
  updateApplicationStatusService,
  getApplicationForCompanyService,
};
