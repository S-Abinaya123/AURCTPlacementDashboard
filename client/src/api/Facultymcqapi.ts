// ===============================
// API Base Configuration
// ===============================

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

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Something went wrong");
  }

  return response.json();
}

// ===============================
// Type Definitions
// ===============================

export interface Question {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  _id?: string;
  topic: string;
  time: number;
  dueDate?: string | null;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Score {
  _id?: string;
  quizId: string;
  topic: string;
  score: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

// ===============================
// QUIZ APIs
// ===============================

// 🔹 Generate quiz (AI / Auto)
export const generateMCQ = async (data: {
  topic: string;
  numberOfQuestions: number;
}): Promise<Quiz> => {
  return request<Quiz>("/quizzes/generate-mcq", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// 🔹 Create quiz manually
export const createQuiz = async (quiz: {
  topic: string;
  time: number;
  dueDate?: string | null;
  questions: Question[];
}): Promise<Quiz> => {
  return request<Quiz>("/quizzes", {
    method: "POST",
    body: JSON.stringify(quiz),
  });
};

// 🔹 Get all quizzes
export const getQuizzes = async (): Promise<Quiz[]> => {
  return request<Quiz[]>("/quizzes");
};

// 🔹 Get quiz by ID
export const getQuizById = async (id: string): Promise<Quiz> => {
  return request<Quiz>(`/quizzes/${id}`);
};

// 🔹 Delete quiz
export const deleteQuiz = async (id: string): Promise<void> => {
  await request<void>(`/quizzes/${id}`, {
    method: "DELETE",
  });
};

// ===============================
// SCORE APIs
// ===============================

// 🔹 Save score
export const saveScore = async (data: {
  quizId: string;
  topic: string;
  score: number;
  total: number;
}): Promise<Score> => {
  return request<Score>("/scores", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// 🔹 Get all scores
export const getScores = async (): Promise<Score[]> => {
  return request<Score[]>("/scores");
};

// 🔹 Get scores by quiz
export const getScoresByQuiz = async (
  quizId: string
): Promise<Score[]> => {
  return request<Score[]>(`/scores?quizId=${quizId}`);
};