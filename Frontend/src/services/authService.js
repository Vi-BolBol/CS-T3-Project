import apiClient from "./apiClient";

const AUTH_URL = "/api/auth";

// ── TEMPORARY: mock auth for frontend-only testing (no backend required) ──
// Enable by setting VITE_MOCK_AUTH=true in Frontend/.env
// Remove this block (and the two early-returns below) once the real
// backend is up and you want to test against it for every environment.


const MOCK_AUTH_ENABLED = import.meta.env.VITE_MOCK_AUTH === "true";

function mockRoleFromEmail(email = "") {
  if (email.includes("company")) return "company";
  if (email.includes("admin")) return "admin";
  return "student";
}

function mockAuthResponse(email) {
  const role = mockRoleFromEmail(email);
  return {
    success: true,
    message: "Mock login successful (no backend called)",
    token: "mock-token-for-testing",
    user: { id: 0, email, role },
  };
}
// ── end mock auth block ──

export async function registerUser(userData) {
  if (MOCK_AUTH_ENABLED) return mockAuthResponse(userData.email);

  try {
    const { data } = await apiClient.post(`${AUTH_URL}/register`, userData);
    return data;
  } catch (error) {
    return { success: false, message: error.message || "Registration failed" };
  }
}

export async function loginUser(loginData) {
  if (MOCK_AUTH_ENABLED) return mockAuthResponse(loginData.email);

  try {
    const { data } = await apiClient.post(`${AUTH_URL}/login`, loginData);
    return data;
  } catch (error) {
    return { success: false, message: error.message || "Login failed" };
  }
}

export function logoutUser() {
  localStorage.removeItem("token");
}

const authService = { registerUser, loginUser, logoutUser };
export default authService;