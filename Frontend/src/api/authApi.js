const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/auth";

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }

    return data;
  } catch (error) {
    console.error("Register error:", error);

    return {
      success: false,
      message: "Cannot connect to server. Please check backend or database.",
    };
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Invalid email or password",
      };
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);

    return {
      success: false,
      message: "Cannot connect to server. Please check backend or database.",
    };
  }
};export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        message: "No authentication token found",
      };
    }

    const response = await fetch(`${API_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch user",
      };
    }

    return data;
  } catch (error) {
    console.error("Get current user error:", error);

    return {
      success: false,
      message: "Cannot connect to server. Please check backend or database.",
    };
  }
};