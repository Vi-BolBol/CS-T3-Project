// const API_URL = "/api/auth";

// export const registerUser = async (userData) => {
//   try {
//     const response = await fetch(`${API_URL}/register`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(userData),
//     });

//     const data = await response.json();
    
//     if (!response.ok) {
//       return {
//         success: false,
//         message: data.message || "Registration failed",
//       };
//     }

//     return data;
//   } catch (error) {
//     console.error("Register error:", error);
//     return {
//       success: false,
//       message: "Network error. Please try again.",
//     };
//   }
// };

// export const loginUser = async (loginData) => {
//   try {
//     const response = await fetch(`${API_URL}/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(loginData),
//     });

//     const data = await response.json();
    
//     if (!response.ok) {
//       return {
//         success: false,
//         message: data.message || "Login failed",
//       };
//     }

//     return data;
//   } catch (error) {
//     console.error("Login error:", error);
//     return {
//       success: false,
//       message: "Network error. Please try again.",
//     };
//   }
// };

const API_URL = "/api/auth";

// ── TEMPORARY: mock auth for frontend-only testing (no backend required) ──
// Enable by setting VITE_MOCK_AUTH=true in Frontend/.env
// Remove this block (and the two early-returns below) once the real
// backend is up and you want to test against it.
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
    user: {
      id: 0,
      email,
      role,
    },
  };
}
// ── end mock auth block ──

export const registerUser = async (userData) => {
  if (MOCK_AUTH_ENABLED) {
    return mockAuthResponse(userData.email);
  }

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
      message: "Network error. Please try again.",
    };
  }
};

export const loginUser = async (loginData) => {
  if (MOCK_AUTH_ENABLED) {
    return mockAuthResponse(loginData.email);
  }

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
        message: data.message || "Login failed",
      };
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
};