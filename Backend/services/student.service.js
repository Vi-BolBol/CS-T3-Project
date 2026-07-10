import {
  saveInternship,
  unsaveInternship,
  findSavedInternships,
  followCompany,
  unfollowCompany,
  findFollowedCompanies,
  findRecommendedInternships,
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
