import authAxios from "./authAxios";

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

const API_URL = getBackendUrl();

// Get all notifications
export const getNotifications = async () => {
  const response = await authAxios.get(`${API_URL}/notifications`);
  return response.data;
};

// Mark notification as read
export const markAsRead = async (id: string) => {
  const response = await authAxios.put(`${API_URL}/notifications/${id}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const response = await authAxios.put(`${API_URL}/notifications/read-all`);
  return response.data;
};

// Delete a notification
export const deleteNotification = async (id: string) => {
  const response = await authAxios.delete(`${API_URL}/notifications/${id}`);
  return response.data;
};
