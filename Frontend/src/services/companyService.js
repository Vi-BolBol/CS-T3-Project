import apiClient from "./apiClient";
import { mockDelay } from "./mockDelay";
import companies from "./mockData/companies";
import internshipsByCompany from "./mockData/internships";

// NOTE: No company/job backend routes exist yet (only /api/auth and /api/cv
// are implemented — see Backend/routes). Every function below is mock-backed
// so pages already call a stable service interface; once real endpoints
// exist, swap the body for the commented apiClient call and nothing above
// this file needs to change.

export async function getCompanies() {
  // return (await apiClient.get("/api/companies")).data;
  return mockDelay(companies);
}

export async function getCompanyById(id) {
  // return (await apiClient.get(`/api/companies/${id}`)).data;
  return mockDelay(companies.find((c) => c.id === id) || null);
}

export async function getCompanyInternships(companyId) {
  // return (await apiClient.get(`/api/companies/${companyId}/internships`)).data;
  return mockDelay(internshipsByCompany[companyId] || []);
}

export async function getFeaturedPartners() {
  // return (await apiClient.get("/api/companies/featured")).data;
  return mockDelay(["Notion", "Figma", "Vercel", "Linear"]);
}

export async function getTalentPool() {
  // return (await apiClient.get("/api/companies/talent-pool")).data;
  return mockDelay([
    { name: "Elena Rodriguez", role: "Senior Full-Stack Engineer Intern", tags: ["React", "Node.js", "AWS"], initial: "ER" },
    { name: "Marcus Dow", role: "UX/UI Design Fellow", tags: ["Figma", "Prototyping", "Research"], initial: "MD" },
  ]);
}

const companyService = {
  getCompanies,
  getCompanyById,
  getCompanyInternships,
  getFeaturedPartners,
  getTalentPool,
};

export default companyService;