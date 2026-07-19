import {
  findCompanyProfileByUserId,
  updateCompanyProfile,
  getCompanyStats,
  findOtherCompanies,
  searchAll,
} from "../models/company.model.js";
import { logAction } from "../utils/audit.js";

// Only these fields may be written from the client.
const EDITABLE = [
  "companyName", "industry", "location", "description",
  "website", "logoUrl", "employeeCount", "coverUrl",
];

export const getMyCompanyService = async (userId) => {
  const profile = await findCompanyProfileByUserId(userId);
  if (!profile) return { success: false, message: "No company profile found for this account" };
  return { success: true, profile };
};

export const updateMyCompanyService = async (userId, body = {}) => {
  const profile = await findCompanyProfileByUserId(userId);
  if (!profile) return { success: false, message: "No company profile found for this account" };

  const data = {};
  for (const key of EDITABLE) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (data.employeeCount !== undefined && data.employeeCount !== null && data.employeeCount !== "") {
    data.employeeCount = Number(data.employeeCount);
  }
  if (Object.keys(data).length === 0) {
    return { success: false, message: "No editable fields provided" };
  }

  const updated = await updateCompanyProfile(userId, data);
  await logAction({ userId, action: "COMPANY_PROFILE_UPDATED", entityType: "CompanyProfile", entityId: updated.id });
  return { success: true, message: "Profile updated", profile: updated };
};

export const getMyStatsService = async (userId) => {
  const profile = await findCompanyProfileByUserId(userId);
  if (!profile) return { success: false, message: "No company profile found for this account" };

  const stats = await getCompanyStats(profile.id);
  return { success: true, stats, profile };
};

export const getConnectionsService = async (userId) => {
  const profile = await findCompanyProfileByUserId(userId);
  const companies = await findOtherCompanies(profile?.id);
  return { success: true, companies };
};

export const searchService = async (q) => {
  const term = (q || "").trim();
  if (term.length < 2) {
    return { success: true, results: { students: [], companies: [], internships: [] } };
  }
  const results = await searchAll(term);
  return { success: true, results };
};
