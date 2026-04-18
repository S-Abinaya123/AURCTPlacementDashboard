import React, { useState, useEffect } from "react";
import { notesApi } from "../api/notesApi";
import type { NoteData } from "../api/notesApi";

const allowedTypes = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

export default function FacultyNotesPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "list">("upload");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesApi.getAllNotes();
      if (response.status === "SUCCESS") {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!allowedTypes.includes(f.type)) {
      setError("Unsupported file type");
      setFile(null);
      return;
    }

    setError("");
    setFile(f);
  };

  const handleUpload = async () => {
    if (!title || !file) {
      setError("Title and file are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await notesApi.uploadNote(title, description, file);
      
      if (response.status === "SUCCESS") {
        const newNote = {
          ...response.data,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        };
        setNotes(prev => [...prev, newNote]);
        setTitle("");
        setDescription("");
        setFile(null);
        setActiveTab("list");
      } else {
        setError(response.message || "Failed to upload note");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Error uploading note");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await notesApi.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const downloadFile = async (note: NoteData) => {
    try {
      const token = localStorage.getItem("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://192.168.152.204:5000/api";
      
      // Remove duplicate /api if present
      const baseUrl = backendUrl.replace(/\/api$/, "");
      
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
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          fileName = match[1].replace(/['"]/g, "");
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
      const baseUrl = (import.meta.env.VITE_BACKEND_URL || "http://192.168.152.204:5000/api").replace(/\/api$/, "");
      window.open(`${baseUrl}/api/notes/download/${note.id}`, "_blank");
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes("pdf")) {
      return <span className="text-red-600 font-bold text-xs">PDF</span>;
    } else if (fileType?.includes("excel") || fileType?.includes("spreadsheet")) {
      return <span className="text-green-600 font-bold text-xs">XLS</span>;
    } else if (fileType?.includes("powerpoint") || fileType?.includes("presentation")) {
      return <span className="text-orange-600 font-bold text-xs">PPT</span>;
    } else if (fileType?.includes("image")) {
      return <span className="text-purple-600 font-bold text-xs">IMG</span>;
    } else {
      return <span className="text-gray-600 font-bold text-xs">FILE</span>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">Notes Management</h2>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-5 py-2 rounded-xl ${
              activeTab === "upload"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 border"
            }`}
          >
            Upload Notes
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`px-5 py-2 rounded-xl ${
              activeTab === "list"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 border"
            }`}
          >
            Uploaded Notes ({notes.length})
          </button>
        </div>

        {activeTab === "upload" && (
          <div className="bg-white p-6 rounded-2xl shadow">

            <div className="mb-4">
              <label className="block font-semibold mb-1">Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border p-2 rounded-xl"
                placeholder="Eg: DBMS Notes"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border p-2 rounded-xl"
                placeholder="Optional"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Upload File
              </label>

              <label className="flex items-center justify-center border-2 border-dashed border-blue-400 rounded-2xl h-28 cursor-pointer hover:bg-blue-50 transition">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!file && (
                  <span className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold">
                    Choose File
                  </span>
                )}

                {file && (
                  <div className="text-center px-3">
                    <p className="font-semibold text-sm">
                      Selected File
                    </p>
                    <p className="text-blue-600 text-sm truncate">
                      {file.name}
                    </p>
                  </div>
                )}
              </label>
            </div>

            {error && (
              <p className="text-red-500 font-semibold mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Notes"}
            </button>

          </div>
        )}

        {activeTab === "list" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {notes.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No notes uploaded yet</p>
              </div>
            )}

            {notes.map(n => (
              <div
                key={n.id}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(n.fileType)}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(n.fileSize)}
                  </span>
                </div>

                <h4 className="font-bold mb-1">{n.title}</h4>

                {n.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {n.description}
                  </p>
                )}

                <p className="text-sm text-blue-600 mb-4 truncate">
                  {n.fileName}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => downloadFile(n)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(n.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm mx-4">
              <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteNote(deleteConfirm)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
