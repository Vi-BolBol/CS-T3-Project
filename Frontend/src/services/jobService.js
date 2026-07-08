import apiClient from "./apiClient";

export async function getPostedJobs() {
  const { data } = await apiClient.get("/api/jobs/mine");
  return data;
}

export async function publishNewJob(jobPayload) {
  const { data } = await apiClient.post("/api/jobs", jobPayload);
  return data; // { success, internship }
}

const jobService = { getPostedJobs, publishNewJob };
export default jobService;