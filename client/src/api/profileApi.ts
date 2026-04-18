import authAxios from "./authAxios";

export const getProfile = async () => {
  try {
    const response = await authAxios.get("/profile/profile");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateProfile = async (data: {
  userName?: string;
  department?: string;
  year?: number;
  batch?: string;
  profilePicture?: File;
}) => {
  try {
    const formData = new FormData();
    
    if (data.userName) formData.append("userName", data.userName);
    if (data.department) formData.append("department", data.department);
    if (data.year) formData.append("year", data.year.toString());
    if (data.batch) formData.append("batch", data.batch);
    if (data.profilePicture) formData.append("profilePicture", data.profilePicture);
    
    const response = await authAxios.put("/profile/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
