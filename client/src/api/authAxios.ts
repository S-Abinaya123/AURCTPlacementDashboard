import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// Dynamic backend URL based on access method
const getBackendUrl = () => {
  // For production, use environment variable if it is not localhost
  if (import.meta.env.VITE_BACKEND_URL && !import.meta.env.VITE_BACKEND_URL.includes('localhost')) { return import.meta.env.VITE_BACKEND_URL; }

  // For network access, use current window location - works on both mobile and laptop
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // Get the backend port from env, default to 5000
  let backendPort = '5000';
  if (import.meta.env.VITE_BACKEND_URL) { const portMatch = import.meta.env.VITE_BACKEND_URL.match(/:(\\d+)/); if (portMatch) backendPort = portMatch[1]; }

  return protocol + '//' + hostname + ':' + backendPort + '/api';
};

// Log the backend URL for debugging
console.log('Backend URL:', getBackendUrl());

const authAxios = axios.create({ baseURL: getBackendUrl() });

authAxios.interceptors.request.use(
    (config) => { const token = localStorage.getItem('Token'); if (token && config.headers) { config.headers['Authorization'] = 'Bearer ' + token; } return config; },
    (error) => Promise.reject(error)
);

export default authAxios;