import React, { useState, useEffect } from "react";
import { placementInterviewApi, type PlacementInterviewData } from "../api/placementInterviewApi";
import { FaBriefcase, FaBuilding, FaTrash, FaUpload, FaFile, FaLink, FaCalendar, FaClock } from "react-icons/fa";

const allowedFileTypes = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export default function JobPostPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [placements, setPlacements] = useState<PlacementInterviewData[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [description, setDescription] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch all placements
  const fetchPlacements = async () => {
    setFetching(true);
    try {
      console.log("Fetching placements from API...");
      const response = await placementInterviewApi.getAllPlacementInterviews();
      console.log("API Response:", response);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      
      if (response.status === "SUCCESS" && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        console.log("Placements data:", data);
        setPlacements(data);
      } else {
        console.log("No data or failed status:", response);
      }
    } catch (err: any) {
      console.error("Error fetching placements:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!allowedFileTypes.includes(file.type)) {
        setError("Unsupported file type. Please select PDF, Excel, CSV, PPT, or image files.");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !role || !interviewDate) {
      setError("Company name, role, and interview date are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Ensure date has time component (set to noon to avoid timezone issues)
    const dateWithTime = interviewDate.includes("T") ? interviewDate : `${interviewDate}T12:00:00`;
    console.log("Submitting interview date:", dateWithTime);

    try {
      const response = await placementInterviewApi.createPlacementInterview(
        companyName,
        role,
        dateWithTime,
        description,
        jobLink,
        selectedFile || undefined
      );

      if (response.status === "SUCCESS") {
        setSuccess("Job details posted successfully!");
        // Reset form
        setCompanyName("");
        setRole("");
        setInterviewDate("");
        setDescription("");
        setJobLink("");
        setSelectedFile(null);
        // Refresh list and delay slightly to ensure backend saves
        setTimeout(() => fetchPlacements(), 500);
      } else {
        console.error("Failed to post job:", response);
        setError(response.message || "Failed to post job details");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error posting job details");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job post?")) {
      return;
    }

    try {
      await placementInterviewApi.deletePlacementInterview(id);
      fetchPlacements();
    } catch (err) {
      alert("Error deleting job post");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes("pdf")) return <span className="text-red-600 font-bold text-xs">PDF</span>;
    if (fileType?.includes("excel") || fileType?.includes("spreadsheet")) return <span className="text-green-600 font-bold text-xs">XLS</span>;
    if (fileType?.includes("powerpoint") || fileType?.includes("presentation")) return <span className="text-orange-600 font-bold text-xs">PPT</span>;
    if (fileType?.includes("image")) return <span className="text-purple-600 font-bold text-xs">IMG</span>;
    return <span className="text-gray-600 font-bold text-xs">FILE</span>;
  };

  // Download file
  const downloadFile = async (placement: PlacementInterviewData) => {
    try {
      const token = localStorage.getItem("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://192.168.152.204:5000/api";
      const baseUrl = backendUrl.replace(/\/api$/, "");
      
      const response = await fetch(`${baseUrl}/api/placement-interviews/download/${placement._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = placement.fileName || "document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Post New Job</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Form */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Job Details</h3>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Google, Microsoft, Amazon"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Software Engineer, Data Analyst"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Link
                </label>
                <div className="relative">
                  <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={jobLink}
                    onChange={(e) => setJobLink(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://careers.company.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Job description, requirements, etc."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attach File (PDF, Excel, CSV, PPT, Image)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.csv,.ppt,.pptx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                    id="job-file-upload"
                  />
                  <label htmlFor="job-file-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="text-green-600">
                        <FaFile className="mx-auto mb-2 text-2xl" />
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">Click to change file</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <FaUpload className="mx-auto mb-2 text-2xl" />
                        <p className="font-medium">Click to select file</p>
                        <p className="text-sm text-gray-400">PDF, Excel, CSV, PPT, Image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg transition ${
                  loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? "Posting..." : "Post Job"}
              </button>
            </form>
          </div>

          {/* Posted Jobs List */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Posted Jobs ({placements.length})</h3>
            
            {fetching ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : placements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No jobs posted yet</div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {placements.map((placement) => (
                  <div key={placement._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{placement.companyName}</h4>
                        <p className="text-sm text-gray-600">{placement.role}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(placement._id!)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <FaCalendar className="text-gray-400" />
                        {new Date(placement.interviewDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        {new Date(placement.interviewDate).toLocaleTimeString()}
                      </span>
                      {placement.jobLink && (
                        <a
                          href={placement.jobLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <FaLink className="text-xs" />
                          Apply Now
                        </a>
                      )}
                    </div>

                    {placement.description && (
                      <p className="text-sm text-gray-600 mb-2">{placement.description}</p>
                    )}

                    {placement.fileName && (
                      <div className="flex items-center gap-2 text-sm">
                        {getFileIcon(placement.fileType || "")}
                        <span className="text-gray-600">{placement.fileName}</span>
                        <span className="text-gray-400">({formatFileSize(placement.fileSize || 0)})</span>
                        {placement.fileUrl && (
                          <button
                            onClick={() => downloadFile(placement)}
                            className="text-blue-600 hover:text-blue-700 ml-2"
                          >
                            Download
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
