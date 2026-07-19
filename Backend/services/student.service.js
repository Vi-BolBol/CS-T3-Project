import {
  saveInternship,
  unsaveInternship,
  findSavedInternships,
  followCompany,
  unfollowCompany,
  findFollowedCompanies,
  findRecommendedInternships,
  findStudentProfile,
  upsertStudentProfile,
  PROFILE_EDITABLE,
} from "../models/student.model.js";

export const saveInternshipService = async (userId, internshipId) => {
  if (!Number.isFinite(internshipId)) {
    return { success: false, message: "Invalid internship id" };
  }
  await saveInternship(userId, internshipId);
  return { success: true };
};

export const unsaveInternshipService = async (userId, internshipId) => {
  if (!Number.isFinite(internshipId)) {
    return { success: false, message: "Invalid internship id" };
  }
  await unsaveInternship(userId, internshipId);
  return { success: true };
};

export const listSavedInternshipsService = async (userId) => {
  const internships = await findSavedInternships(userId);
  return { success: true, internships };
};

export const followCompanyService = async (userId, companyId) => {
  if (!Number.isFinite(companyId)) {
    return { success: false, message: "Invalid company id" };
  }
  await followCompany(userId, companyId);
  return { success: true };
};

export const unfollowCompanyService = async (userId, companyId) => {
  if (!Number.isFinite(companyId)) {
    return { success: false, message: "Invalid company id" };
  }
  await unfollowCompany(userId, companyId);
  return { success: true };
};

export const listFollowedCompaniesService = async (userId) => {
  const companies = await findFollowedCompanies(userId);
  return { success: true, companies };
};

export const listRecommendedInternshipsService = async (userId) => {
  const internships = await findRecommendedInternships(userId);
  return { success: true, internships };
};


/** The signed-in student's own profile. */
export const getMyProfileService = async (userId) => {
  const profile = await findStudentProfile(userId);
  return { success: true, profile: profile || null };
};

export const updateMyProfileService = async (userId, body = {}) => {
  const data = {};
  for (const key of PROFILE_EDITABLE) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (Object.keys(data).length === 0) {
    return { success: false, message: "No editable fields provided" };
  }
  const profile = await upsertStudentProfile(userId, data);
  return { success: true, message: "Profile updated", profile };
};

/*
  Someone else's student profile — used by a company reviewing an applicant and
  by an admin inspecting an account.

  `phone` is stripped: it is contact detail the student gave for their own
  record, and a company can already reach them through the application. Admins
  see everything, because moderation needs it.
*/
export const getPublicStudentProfileService = async (userId, viewerRole) => {
  const profile = await findStudentProfile(userId);
  if (!profile) return { success: false, message: "Profile not found" };

  if (viewerRole === "admin") return { success: true, profile };

  const { phone, ...safe } = profile;
  return { success: true, profile: safe };
};
