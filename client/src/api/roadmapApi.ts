import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const testApi = async () => {
  const response = await axios.get(`${API_URL}/roadmap/test`);
  return response.data;
};

// Get companies by department
export const getCompaniesByDepartment = async (department: string) => {
  try {
    const response = await axios.get(`${API_URL}/roadmap/companies`, {
      params: { department }
    });
    return response.data;
  } catch (error: any) {
    console.error("getCompaniesByDepartment error:", error.response?.data || error.message);
    // Fallback to debug endpoint
    try {
      const fallbackResponse = await axios.get(`${API_URL}/roadmap/companies-debug`, {
        params: { department }
      });
      return fallbackResponse.data;
    } catch (fallbackError) {
      throw error;
    }
  }
};

// Generate roadmap using Groq API
export const generateRoadmap = async (data: {
  department: string;
  company: string;
  role?: string;
  studentId?: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/roadmap/generate`, data);
    return response.data;
  } catch (error: any) {
    console.error("generateRoadmap error:", error.response?.data || error.message);
    throw error;
  }
};

// Get search history for a student
export const getSearchHistory = async (studentId: string) => {
  const response = await axios.get(`${API_URL}/roadmap/history/${studentId}`);
  return response.data;
};

// Delete search history entry
export const deleteSearchHistory = async (id: string) => {
  const response = await axios.delete(`${API_URL}/roadmap/history/${id}`);
  return response.data;
};

// Get student roadmap progress
export const getRoadmapProgress = async (studentId: string, roadmapId: string) => {
  const response = await axios.get(`${API_URL}/roadmap/progress/${studentId}/${roadmapId}`);
  return response.data;
};

// Mark task as completed and unlock next task
export const completeTask = async (data: {
  studentId: string;
  roadmapId: string;
  taskId: string;
  resourceUrl?: string;
  resourceType?: string;
}) => {
  const response = await axios.post(`${API_URL}/roadmap/complete-task`, data);
  return response.data;
};

// Mark resource as viewed
export const markResourceViewed = async (data: {
  studentId: string;
  roadmapId: string;
  taskId: string;
  resourceUrl: string;
  resourceType?: string;
}) => {
  const response = await axios.post(`${API_URL}/roadmap/mark-resource-viewed`, data);
  return response.data;
};

// Create company roadmap (Faculty upload)
export const createCompanyRoadmap = async (data: {
  companyName: string;
  department: string;
  role?: string;
  description?: string;
  steps: any[];
  facultyId: string;
}) => {
  const token = localStorage.getItem('Token');
  const response = await axios.post(`${API_URL}/roadmap/company`, data, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return response.data;
};

// Update company roadmap
export const updateCompanyRoadmap = async (id: string, data: {
  companyName?: string;
  department?: string;
  role?: string;
  description?: string;
  steps?: any[];
}) => {
  const response = await axios.put(`${API_URL}/roadmap/company/${id}`, data);
  return response.data;
};

// Get company roadmaps with filters
export const getCompanyRoadmaps = async (filters?: {
  department?: string;
  company?: string;
  role?: string;
  search?: string;
}) => {
  const response = await axios.get(`${API_URL}/roadmap/company`, { params: filters });
  return response.data;
};

// Get single company roadmap by ID
export const getCompanyRoadmapById = async (id: string) => {
  const response = await axios.get(`${API_URL}/roadmap/company/${id}`);
  return response.data;
};

// Delete company roadmap
export const deleteCompanyRoadmap = async (id: string) => {
  const token = localStorage.getItem('Token');
  const response = await axios.delete(`${API_URL}/roadmap/company/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.data;
};
