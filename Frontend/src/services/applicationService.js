import apiClient from "./apiClient";

export async function getUserApplications() {
  const { data } = await apiClient.get("/api/applications/mine");
  return data;
}

export async function getTopChoices() {
  const { data } = await apiClient.get("/api/applications/top-choices");
  return data;
}

export async function updateApplicationStatus(applicationId, targetStatus) {
  const { data } = await apiClient.patch(`/api/applications/${applicationId}`, { status: targetStatus });
  return data;
}

const applicationService = { getUserApplications, getTopChoices, updateApplicationStatus };
export default applicationService;