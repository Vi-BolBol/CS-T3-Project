const API_BASE_URL = "http://localhost:3000/api";

export const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  const data = await response.json();

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Request failed"
    );
  }

  return data;
};