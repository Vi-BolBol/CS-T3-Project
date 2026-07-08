import apiClient from "./apiClient";

const CV_URL = "/api/cv";

export async function parseUploadedCV(base64File) {
  try {
    const { data } = await apiClient.post(`${CV_URL}/parse-upload`, { file: base64File });
    return data; // { personal, about, experience }
  } catch (error) {
    throw error.message || "Failed to parse CV";
  }
}

export async function generateCVPhoto(base64Image) {
  try {
    const { data } = await apiClient.post(`${CV_URL}/generate-photo`, { image: base64Image });
    return data.image;
  } catch (error) {
    throw error.message || "Generation failed";
  }
}

export async function scoreCV(cvData) {
  try {
    const { data } = await apiClient.post(`${CV_URL}/score`, { cvData });
    return data;
  } catch (error) {
    throw error.message || "Scoring failed";
  }
}

const cvService = { parseUploadedCV, generateCVPhoto, scoreCV };
export default cvService;