import React, { useState, useEffect, useRef } from "react";
import { studentApi, type StudentData } from "../api/studentApi";
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendar, FaSearch, FaTrash, FaDownload, FaUpload } from "react-icons/fa";

const departments = [
  "Computer Science Engineering",
  
  "Electronics and Communication Engineering",
  
  "Mechanical Engineering",
  
  "Geo Informaticcs",
  "Artificial Intelligence and Data Science"
];

const currentYear = new Date().getFullYear();
const generateBatches = () => {
  const batches = [];
  for (let i = 0; i <= 7; i++) {
    const startYear = currentYear - 6 + i;
    const endYear = startYear + 4;
    batches.push(`${startYear}-${endYear}`);
  }
  return batches;
};

interface PlacementPageProps {
  isStudentView?: boolean;
}

export default function PlacementPage({ isStudentView = false }: PlacementPageProps) {
  const [placedStudents, setPlacedStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  
  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  // Fetch placed students
  const fetchPlacedStudents = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await studentApi.getPlacedStudents({
        department: selectedDepartment || undefined,
        batch: selectedBatch || undefined,
      });
      
      if (response.status === "SUCCESS" && response.data) {
        // Filter by search term if provided
        let filtered = response.data;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(s => 
            s.userName?.toLowerCase().includes(term) ||
            s.registerNo?.toLowerCase().includes(term) ||
            s.companyName?.toLowerCase().includes(term) ||
            s.department?.toLowerCase().includes(term)
          );
        }
        setPlacedStudents(filtered);
      } else {
        setError(response.message || "Failed to fetch placed students");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching placed students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacedStudents();
  }, [selectedDepartment, selectedBatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPlacedStudents();
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Handle delete placement
  const handleDeletePlacement = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove placement details?")) {
      return;
    }
    
    try {
      const response = await studentApi.updatePlacement(id, {
        isPlaced: false,
        companyName: "",
        packageOffered: "",
        location: "",
        jobRole: "",
        placementDate: ""
      });
      
      if (response.status === "SUCCESS") {
        fetchPlacedStudents();
      }
    } catch (err: any) {
      alert("Error removing placement");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedBatch("");
  };

  // Handle download Excel
  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError("");
      await studentApi.downloadPlacedStudents({
        department: selectedDepartment || undefined,
        batch: selectedBatch || undefined,
      });
    } catch (err: any) {
      setError(err.message || "Failed to download placement data");
    } finally {
      setDownloading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv"
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid Excel or CSV file");
        return;
      }
      
      setSelectedFile(file);
      setError("");
    }
  };

  // Handle upload Excel
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }
    
    try {
      setUploading(true);
      setError("");
      setUploadSuccess("");
      
      const response = await studentApi.uploadPlacements(selectedFile);
      
      if (response.status === "SUCCESS") {
        setUploadSuccess(`Successfully updated ${response.data?.updated || 0} placements. ${response.data?.notFound || 0} records not found.`);
        // Reset form
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Refresh list
        fetchPlacedStudents();
        // Close modal after delay
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadSuccess("");
        }, 3000);
      } else {
        setError(response.message || "Failed to upload placements");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error uploading placements");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Placements</h1>
          <p className="text-gray-600">View placement details of placed students</p>
        </div>
        
        {!isStudentView && (
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                downloading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <FaDownload />
              {downloading ? "Downloading..." : "Download Excel"}
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FaUpload />
              Upload Excel
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, register no, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          {/* Batch Filter */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Batches</option>
            {generateBatches().map((batch) => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
        
        {(selectedDepartment || selectedBatch || searchTerm) && (
          <button
            onClick={clearFilters}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <FaBriefcase className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Placed</p>
              <p className="text-2xl font-bold text-gray-800">{placedStudents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Placed Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading placed students...</div>
        ) : placedStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No placed students found.
          </div>
        ) : (
          <div className="">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">S.No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Student Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Register No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Batch</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Package</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Job Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  {!isStudentView && (
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {placedStudents.map((student, index) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{student.userName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.registerNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.batch}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-blue-500" />
                        {student.companyName || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium text-green-600">
                      {student.packageOffered || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.jobRole || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        {student.location || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        {student.placementDate ? new Date(student.placementDate).toLocaleDateString() : "-"}
                      </div>
                    </td>
                    {!isStudentView && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeletePlacement(student._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Remove placement"
                      >
                        <FaTrash />
                      </button>
                    </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && placedStudents.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
            Showing {placedStudents.length} placed student{placedStudents.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Upload Placement Details from Excel</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setError("");
                  setUploadSuccess("");
                  setSelectedFile(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Success Message */}
              {uploadSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {uploadSuccess}
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
                <p className="font-semibold mb-2">Excel file should contain these columns:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Register No (required) - Student register number</li>
                  <li>Student Name - Student name</li>
                  <li>Department - Department (e.g., Mechanical Engineering)</li>
                  <li>Batch - Batch (e.g., 2021-2025)</li>
                  <li>Company Name 1 - First company name</li>
                  <li>Package(company1) - First package offered (e.g., 500000)</li>
                  <li>Job Role 1 - First job role</li>
                  <li>Location - Location</li>
                  <li>Placement Date - Date of placement (e.g., 2024-01-15)</li>
                  <li className="mt-2 italic">Optional columns:</li>
                  <li>Company Name 2 - Second company name</li>
                  <li>Package(company2) - Second package offered</li>
                  <li>Job Role 2 - Second job role</li>
                </ul>
              </div>
              
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excel File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="placement-file-upload"
                  />
                  <label htmlFor="placement-file-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="text-green-600">
                        <FaUpload className="mx-auto mb-2" />
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">Click to change file</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <FaUpload className="mx-auto mb-2" />
                        <p className="font-medium">Click to select Excel file</p>
                        <p className="text-sm text-gray-400">Supports .xlsx, .xls, .csv</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              
              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className={`w-full py-2 rounded-lg transition ${
                  !selectedFile || uploading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {uploading ? "Uploading..." : "Upload Placements"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
