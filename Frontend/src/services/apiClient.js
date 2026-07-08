import axios from "axios";


/**
 * Single axios instance shared by every service module.
 * Anything that talks to the backend should go through this file —
 * services should never call axios/fetch directly.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the auth token (if present) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
    return config;
});

// Normalize error responses so every service can throw/read the same shape.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;