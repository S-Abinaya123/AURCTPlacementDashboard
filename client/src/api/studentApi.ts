import authAxios from "./authAxios";

export interface StudentData {
  _id: string;
  userName: string;
  registerNo: string;
  email: string;
  mobileNo: string;
  department: string;
  year: number;
  batch: string;
  role: string;
  createdAt: string;
  // Placement fields
  isPlaced?: boolean;
  companyName?: string;
  companyName2?: string;
  packageOffered?: string;
  packageOffered2?: string;
  location?: string;
  placementDate?: string;
  jobRole?: string;
}

interface ApiResponse<T> {
  status: "SUCCESS" | "ERROR";
  data?: T;
  message?: string;
  count?: number;
}

export const studentApi = {
  getStudents: async (filters?: {
    department?: string;
    year?: number;
    batch?: string;
    search?: string;
  }): Promise<ApiResponse<StudentData[]>> => {
    try {
      const params = new URLSearchParams();
      if (filters?.department) params.append("department", filters.department);
      if (filters?.year) params.append("year", filters.year.toString());
      if (filters?.batch) params.append("batch", filters.batch);
      if (filters?.search) params.append("search", filters.search);

      const response = await authAxios.get(`/students?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        status: "ERROR",
        message: error.response?.data?.message || "Failed to fetch students",
      };
    }
  },

  getDepartments: async (): Promise<ApiResponse<string[]>> => {
    try {
      const response = await authAxios.get("/students/departments");
      return response.data;
    } catch (error: any) {
      return {
        status: "ERROR",
        message: error.response?.data?.message || "Failed to fetch departments",
      };
    }
  },

  getBatches: async (): Promise<ApiResponse<string[]>> => {
    try {
      const response = await authAxios.get("/students/batches");
      return response.data;
    } catch (error: any) {
      return {
        status: "ERROR",
        message: error.response?.data?.message || "Failed to fetch batches",
      };
    }
  },

  uploadStudents: async (
    file: File,
    department: string,
    year: number,
    batch: string
  ): Promise<ApiResponse<{ added: number; updated: number; errors: string[] }>> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("department", department);
      formData.append("year", year.toString());
      formData.append("batch", batch);

      const response = await authAxios.post("/students/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return {
        status: "ERROR",
        message: error.response?.data?.message || "Failed to upload students",
      };
    }
  },

  deleteStudent: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await authAxios.delete(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        status: "ERROR",
        message: error.response?.data?.message || "Failed to delete student",
      };
    }
  },

  updatePlacement: async (
    id: string,
    placementData: {
      isPlaced: boolean;
      companyName?: string;
      companyName2?: string;
      packageOffered?: string;
      packageOffered2?: string;
      location?: string;
      jobRole?: string;
      placementDate?: string;
    }
  ): Promise<ApiResponse<StudentData>> => {
    try {
      const response = await authAxios.put(`/students/${id}/placement`, placementData);
      return response.data;
    } catch (error: any) {
      return {
        status: "ERROR",
        message: error.response?.data?.message || "Failed to update placement",
      };
    }
  },

  getPlacedStudents: async (filters?: {
    department?: string;
    year?: number;
    batch?: string;
  }): Promise<ApiResponse<StudentData[]>> => {
    try {
      const params = new URLSearchParams();
      if (filters?.department) params.append("department", filters.department);
      if (filters?.year) params.append("year", filters.year.toString());
      if (filters?.batch) params.append("batch", filters.batch);

      const response = await authAxios.get(`/students/placed?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        status: "ERROR",
        message: error.response?.data?.message || "Failed to fetch placed students",
      };
    }
  },

  downloadPlacedStudents: async (filters?: {
    department?: string;
    year?: number;
    batch?: string;
  }): Promise<void> => {
    try {
      const params = new URLSearchParams();
      if (filters?.department) params.append("department", filters.department);
      if (filters?.year) params.append("year", filters.year.toString());
      if (filters?.batch) params.append("batch", filters.batch);

      const response = await authAxios.get(`/students/placed/download?${params.toString()}`, {
        responseType: "blob",
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "placement_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to download placement data");
    }
  },

  uploadPlacements: async (file: File): Promise<ApiResponse<{ updated: number; notFound: number }>> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await authAxios.post("/students/placed/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return {
        status: "ERROR",
        message: error.response?.data?.message || "Failed to upload placement data",
      };
    }
  },

  getLeaderboard: async (): Promise<ApiResponse<{
    topThreePerDepartment: { [key: string]: Array<{ userName: string; registerNo: string; department: string; packageOffered: string; companyName: string }> };
    topFivePerDepartment: { [key: string]: Array<{ userName: string; registerNo: string; department: string; packageOffered: string; companyName: string }> };
    topThreeHighPackage: Array<{ userName: string; registerNo: string; department: string; packageOffered: string; companyName: string }>;
    topFiveQuizRankers: Array<{ studentName: string; registerNo: string; department: string; year: number; score: number; total: number; quizCount?: number; percentage?: number }>;
    topFiveQuizPerDepartment: { [key: string]: Array<{ studentName: string; registerNo: string; department: string; year: number; score: number; total: number; quizCount?: number; percentage?: number }> };
  }>> => {
    try {
      const response = await authAxios.get("/students/leaderboard");
      return response.data;
    } catch (error: any) {
      return {
        status: "ERROR",
        message: error.response?.data?.message || "Failed to fetch leaderboard",
      };
    }
  },
};
