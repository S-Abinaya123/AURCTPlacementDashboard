import axios from "axios";

// Dynamic backend URL based on access method
const getBackendUrl = () => {
  // For production, use environment variable if it's not localhost
  if (import.meta.env.VITE_BACKEND_URL && !import.meta.env.VITE_BACKEND_URL.includes('localhost')) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // For network access, use current window location
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Try to get the backend port from env, default to 5000
  let backendPort = '5000';
  if (import.meta.env.VITE_BACKEND_URL) {
    const portMatch = import.meta.env.VITE_BACKEND_URL.match(/:(\d+)/);
    if (portMatch) {
      backendPort = portMatch[1];
    }
  }
  
  return `${protocol}//${hostname}:${backendPort}/api`;
};

const API = axios.create({
  baseURL: getBackendUrl(),
});

export const getQuizzes = () => API.get("/quizzes");

export const getQuizById = (id: string) =>
  API.get(`/quizzes/${id}`);

export const submitResult = (data: {
  userId: string;
  quizId: string;
  score: number;
  total: number;
}) => API.post("/results", data);

export const getLeaderboard = (quizId: string) =>
  API.get(`/results/leaderboard/${quizId}`);

export const checkUserAttempt = (userId: string, quizId: string) =>
  API.get(`/results/check/${userId}/${quizId}`);