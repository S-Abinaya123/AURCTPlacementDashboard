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

export interface NoteData {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  uploadedBy?: string;
}

export interface UploadNoteResponse {
  status: "SUCCESS" | "FAILED";
  message: string;
  data: NoteData;
}

export interface GetNotesResponse {
  status: "SUCCESS" | "FAILED";
  message: string;
  data: NoteData[];
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export const notesApi = {
  uploadNote: async (
    title: string,
    description: string,
    file: File
  ): Promise<UploadNoteResponse> => {
    const fileUrl = await fileToBase64(file);

    const response = await axios.post(
      `${BASE_URL}/notes/upload`,
      {
        title,
        description,
        fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
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

  getAllNotes: async (): Promise<GetNotesResponse> => {
    const response = await axios.get(`${BASE_URL}/notes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    });

    // Handle both wrapped and direct array responses
    if (Array.isArray(response.data)) {
      return {
        status: "SUCCESS",
        message: "Notes retrieved successfully",
        data: response.data.map((note: any) => ({
          id: note._id || note.id,
          title: note.title,
          description: note.description,
          fileName: note.fileName,
          fileType: note.fileType,
          fileSize: note.fileSize,
          createdAt: note.createdAt,
          uploadedBy: note.uploadedBy?.userName || note.uploadedBy,
        })),
      };
    }

    return response.data;
  },

  deleteNote: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    });
  },
};