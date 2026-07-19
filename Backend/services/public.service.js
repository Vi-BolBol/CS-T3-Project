import {
  findPublicCompanies,
  findPublicCompanyById,
  searchPublic,
} from "../models/public.model.js";

export const listCompaniesService = async () => {
  const companies = await findPublicCompanies();
  return { success: true, companies };
};

export const getCompanyService = async (rawId) => {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    return { success: false, message: "Invalid company id." };
  }

  const company = await findPublicCompanyById(id);
  if (!company) return { success: false, message: "Company not found." };

  return { success: true, company };
};

export const searchService = async (q) => {
  const term = (q || "").trim();
  // Below 2 characters every row matches — that's a table scan, not a search.
  if (term.length < 2) {
    return { success: true, results: { internships: [], companies: [] } };
  }
  const results = await searchPublic(term);
  return { success: true, results };
};
