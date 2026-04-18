import axios from "axios";

// Dynamic backend URL
const getBackendUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL && !import.meta.env.VITE_BACKEND_URL.includes('localhost')) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  let backendPort = '5000';
  if (import.meta.env.VITE_BACKEND_URL) {
    const portMatch = import.meta.env.VITE_BACKEND_URL.match(/:(\d+)/);
    if (portMatch) backendPort = portMatch[1];
  }
  return `${protocol}//${hostname}:${backendPort}/api`;
};

const API_URL = getBackendUrl() + "/auth";

/* ================================
   AXIOS INSTANCE WITH TOKEN
================================ */
const authAxios = axios.create({
  baseURL: API_URL,
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token"); // ✅ get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================================
   TYPES
================================ */
type LoginPayload = {
  registerNo?: string;
  mobileNo?: string;
  password: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
};

type RequestResetPayload = {
  registerNo?: string;
  mobileNo?: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
};

type VerifyOtpPayload = {
  registerNo?: string;
  mobileNo?: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
  otp: string;
};

/* ================================
   SERVICE
================================ */
export const authService = {
  login: async (data: LoginPayload) => {
    const response = await axios.post(`${API_URL}/login`, data);

    // Store token in localStorage
    if (response.data?.data?.token) {
      localStorage.setItem("Token", response.data.data.token);
    }

// Store user data in localStorage
      if (response.data?.data) {
        const userData = response.data.data;
        
        // Profile picture is now returned as base64 data URL directly
        let fullProfilePicture = "";
        if (userData.profilePictureData && userData.profilePictureContentType) {
          fullProfilePicture = `data:${userData.profilePictureContentType};base64,${userData.profilePictureData}`;
        } else if (userData.profilePicture) {
          fullProfilePicture = `${getBackendUrl()}${userData.profilePicture}`;
        }
        
        localStorage.setItem("userId", userData.userId);
        localStorage.setItem("userName", userData.userName);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("registerNo", userData.registerNo || "");
        localStorage.setItem("mobileNo", userData.mobileNo || "");
        localStorage.setItem("email", userData.email || "");
        localStorage.setItem("profilePicture", fullProfilePicture);
        localStorage.setItem("department", userData.department || "");
        
        // Save user's theme preference
        localStorage.setItem("userThemePreference", userData.theme || "light");
      }

      return response;
  },

  // Request password reset - sends OTP to email
  requestPasswordReset: async (data: RequestResetPayload) => {
    const response = await axios.post(`${API_URL}/request-password-reset`, data);
    return response;
  },

  // Verify OTP
  verifyOtp: async (data: VerifyOtpPayload) => {
    const response = await axios.post(`${API_URL}/verify-otp`, data);
    
    // Store reset token if verification successful
    if (response.data?.data?.resetToken) {
      localStorage.setItem("resetToken", response.data.data.resetToken);
    }
    
    return response;
  },

  // Reset password
  resetPassword: async (newPassword: string) => {
    const resetToken = localStorage.getItem("resetToken");
    if (!resetToken) {
      throw new Error("Reset token not found");
    }
    
    const response = await axios.post(
      `${API_URL}/reset-password`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${resetToken}`,
        },
      }
    );
    
    // Clear reset token after successful password reset
    localStorage.removeItem("resetToken");
    
    return response;
  },

  verifyToken: () => authAxios.get("/verify-token"),

  logout: () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("registerNo");
    localStorage.removeItem("mobileNo");
    localStorage.removeItem("email");
    localStorage.removeItem("profilePicture");
    localStorage.removeItem("department");
    localStorage.removeItem("resetToken");
  },

  getToken: () => localStorage.getItem("Token"),

  getUserDetails: () => {
    return {
      userId: localStorage.getItem("userId"),
      userName: localStorage.getItem("userName"),
      role: localStorage.getItem("role"),
      registerNo: localStorage.getItem("registerNo"),
      mobileNo: localStorage.getItem("mobileNo"),
      email: localStorage.getItem("email"),
      profilePicture: localStorage.getItem("profilePicture"),
      department: localStorage.getItem("department"),
    };
  },
};