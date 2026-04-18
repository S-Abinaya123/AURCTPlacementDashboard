import React, { useState, useEffect } from "react";
import { notesApi } from "../api/notesApi";
import type { NoteData } from "../api/notesApi";

export default function StudentResources() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await notesApi.getAllNotes();
      if (response.status === "SUCCESS") {
        setNotes(response.data);
      } else {
        setError(response.message || "Failed to fetch notes");
      }
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      setError(error.response?.data?.message || "Error fetching notes");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFileExtension = (fileType: string) => {
    const mimeToExt: Record<string, string> = {
      "application/pdf": ".pdf",
      "application/vnd.ms-excel": ".xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
      "text/csv": ".csv",
      "image/png": ".png",
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "application/vnd.ms-powerpoint": ".ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    };
    return mimeToExt[fileType] || "";
  };

  const getDownloadFileName = (note: NoteData) => {
    if (note.fileName) return note.fileName;
    const ext = getFileExtension(note.fileType);
    return note.title ? `${note.title}${ext}` : `document_${note.id}`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes("pdf")) {
      return (
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="text-red-600 font-bold text-xs">PDF</span>
        </div>
      );
    } else if (fileType?.includes("excel") || fileType?.includes("spreadsheet")) {
      return (
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <span className="text-green-600 font-bold text-xs">XLS</span>
        </div>
      );
    } else if (fileType?.includes("powerpoint") || fileType?.includes("presentation")) {
      return (
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <span className="text-orange-600 font-bold text-xs">PPT</span>
        </div>
      );
    } else if (fileType?.includes("image")) {
      return (
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-purple-600 font-bold text-xs">IMG</span>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-600 font-bold text-xs">FILE</span>
        </div>
      );
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadFile = async (note: NoteData) => {
    try {
      const token = localStorage.getItem("token");
      
      // Dynamic backend URL - works on both mobile and laptop
      const getBaseUrl = () => {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        let backendPort = '5000';
        if (import.meta.env.VITE_BACKEND_URL) {
          const portMatch = import.meta.env.VITE_BACKEND_URL.match(/:(\d+)/);
          if (portMatch) {
            backendPort = portMatch[1];
          }
        }
        return `${protocol}//${hostname}:${backendPort}`;
      };
      
      const baseUrl = getBaseUrl();
      
      const response = await fetch(`${baseUrl}/api/notes/download/${note.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      
      let fileName = note.fileName || note.title || `document_${note.id}`;
      const contentDisposition = response.headers.get("content-disposition");
      if (contentDisposition) {
        // Try to get filename* first (RFC 5987)
        const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''(.+?)(?:;|$)/);
        if (filenameStarMatch && filenameStarMatch[1]) {
          fileName = decodeURIComponent(filenameStarMatch[1]);
        } else {
          // Fallback to regular filename
          const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (match && match[1]) {
            fileName = match[1].replace(/['"]/g, "");
          }
        }
      }
      
      if (note.fileType && !fileName.includes(".")) {
        const extMap: Record<string, string> = {
          "application/pdf": ".pdf",
          "application/vnd.ms-excel": ".xls",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
          "text/csv": ".csv",
          "image/png": ".png",
          "image/jpeg": ".jpg",
          "application/vnd.ms-powerpoint": ".ppt",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
        };
        const ext = extMap[note.fileType] || "";
        if (ext) fileName = fileName + ext;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      
      // Dynamic backend URL fallback - works on both mobile and laptop
      const getBaseUrl = () => {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        let backendPort = '5000';
        if (import.meta.env.VITE_BACKEND_URL) {
          const portMatch = import.meta.env.VITE_BACKEND_URL.match(/:(\d+)/);
          if (portMatch) {
            backendPort = portMatch[1];
          }
        }
        return `${protocol}//${hostname}:${backendPort}`;
      };
      
      const baseUrl = getBaseUrl();
      window.open(`${baseUrl}/api/notes/download/${note.id}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Study Resources
          </h2>
          <p className="text-gray-600">
            Access notes and study materials uploaded by faculty
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <input
            type="text"
            placeholder="Search notes by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredNotes.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchTerm ? "No matching notes found" : "No notes available"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Study materials will appear here once uploaded by faculty"}
            </p>
          </div>
        )}

        {!loading && !error && filteredNotes.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    {getFileIcon(note.fileType)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-800 truncate">
                        {note.title}
                      </h3>
                      {note.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {note.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.fileName && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {note.fileName}
                      </span>
                    )}
                    {note.fileSize && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        {formatFileSize(note.fileSize)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{formatDate(note.createdAt)}</span>
                    {note.uploadedBy && <span>By: {note.uploadedBy}</span>}
                  </div>

                  <button
                    onClick={() => downloadFile(note)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredNotes.length > 0 && (
          <div className="mt-6 text-center text-gray-500">
            Showing {filteredNotes.length} of {notes.length} notes
          </div>
        )}
      </div>
    </div>
  );
}
