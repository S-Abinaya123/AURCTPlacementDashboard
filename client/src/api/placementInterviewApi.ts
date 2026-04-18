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

const BASE_URL = getBackendUrl();

console.log("API Base URL:", BASE_URL);

export interface PlacementInterviewData {
  _id?: string;
  companyName: string;
  role: string;
  interviewDate: string;
  description?: string;
  jobLink?: string;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
  fileSize?: number;
  uploadedBy?: string;
  calendarEventLink?: string;
  icsFileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlacementInterviewResponse {
  status: "SUCCESS" | "FAILED";
  message: string;
  data?: PlacementInterviewData | PlacementInterviewData[];
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export const placementInterviewApi = {
  // Create a new placement interview
  createPlacementInterview: async (
    companyName: string,
    role: string,
    interviewDate: string,
    description: string,
    jobLink: string,
    file?: File
  ): Promise<PlacementInterviewResponse> => {
    let fileUrl = "";
    let fileName = "";
    let fileType = "";
    let fileSize = 0;

    if (file) {
      fileUrl = await fileToBase64(file);
      fileName = file.name;
      fileType = file.type;
      fileSize = file.size;
    }

    const response = await axios.post(
      `${BASE_URL}/placement-interviews`,
      {
        companyName,
        role,
        interviewDate,
        description,
        jobLink,
        fileUrl,
        fileName,
        fileType,
        fileSize,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  },

  // Get all placement interviews
  getAllPlacementInterviews: async (): Promise<PlacementInterviewResponse> => {
    const response = await axios.get(`${BASE_URL}/placement-interviews`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    });

    return response.data;
  },

  // Get placement interview by ID
  getPlacementInterviewById: async (id: string): Promise<PlacementInterviewResponse> => {
    const response = await axios.get(`${BASE_URL}/placement-interviews/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    });

    return response.data;
  },

  // Get placement interviews by date
  getPlacementInterviewsByDate: async (date: string): Promise<PlacementInterviewResponse> => {
    const response = await axios.get(`${BASE_URL}/placement-interviews/date/${date}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    });

    return response.data;
  },

  // Update placement interview
  updatePlacementInterview: async (
    id: string,
    data: Partial<PlacementInterviewData>
  ): Promise<PlacementInterviewResponse> => {
    const response = await axios.put(
      `${BASE_URL}/placement-interviews/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  },

  // Delete placement interview
  deletePlacementInterview: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/placement-interviews/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    });
  },
};
