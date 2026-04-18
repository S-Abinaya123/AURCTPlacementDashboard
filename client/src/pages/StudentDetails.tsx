import React, { useState, useEffect, useRef } from "react";
import { studentApi, type StudentData } from "../api/studentApi";
import { FaSearch, FaUpload, FaTimes, FaTrash, FaBriefcase } from "react-icons/fa";

const departments = [
  "Computer Science Engineering",
  "Information Technology",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Artificial Intelligence and Data Science"
];

const years = [1, 2, 3, 4];

// Generate batch years
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

export default function StudentDetails() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | "">("");
  const [selectedBatch, setSelectedBatch] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [uploadDepartment, setUploadDepartment] = useState("");
  const [uploadYear, setUploadYear] = useState<number | "">("");
  const [uploadBatch, setUploadBatch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  
  // Placement Modal state
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [placementData, setPlacementData] = useState({
    isPlaced: false,
    companyName: "",
    companyName2: "",
    packageOffered: "",
    packageOffered2: "",
    location: "",
    jobRole: "",
    placementDate: ""
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch students with filters
  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await studentApi.getStudents({
        department: selectedDepartment || undefined,
        year: selectedYear ? Number(selectedYear) : undefined,
        batch: selectedBatch || undefined,
        search: searchTerm || undefined,
      });
      
      if (response.status === "SUCCESS" && response.data) {
        setStudents(response.data);
      } else {
        setError(response.message || "Failed to fetch students");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and filter changes
  useEffect(() => {
    fetchStudents();
  }, [selectedDepartment, selectedYear, selectedBatch]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchStudents();
    }, 500);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

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

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }
    
    setUploading(true);
    setError("");
    setUploadSuccess("");
    
    try {
      const response = await studentApi.uploadStudents(
        selectedFile,
        uploadDepartment,
        uploadYear ? Number(uploadYear) : 0,
        uploadBatch
      );
      
      if (response.status === "SUCCESS") {
        setUploadSuccess(`Successfully uploaded ${response.data?.added || 0} new students, updated ${response.data?.updated || 0} existing students`);
        // Reset form
        setUploadDepartment("");
        setUploadYear("");
        setUploadBatch("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Refresh student list
        fetchStudents();
        // Close modal after delay
        setTimeout(() => {
          setShowModal(false);
          setUploadSuccess("");
        }, 2000);
      } else {
        setError(response.message || "Failed to upload students");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error uploading students");
    } finally {
      setUploading(false);
    }
  };

  // Handle delete student
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    
    try {
      const response = await studentApi.deleteStudent(id);
      if (response.status === "SUCCESS") {
        setStudents(students.filter(s => s._id !== id));
      } else {
        setError(response.message || "Failed to delete student");
      }
    } catch (err: any) {
      setError(err.message || "Error deleting student");
    }
  };

  // Handle placement checkbox click
  const handlePlacementClick = (student: StudentData) => {
    setSelectedStudent(student);
    setPlacementData({
      isPlaced: student.isPlaced || false,
      companyName: student.companyName || "",
      companyName2: student.companyName2 || "",
      packageOffered: student.packageOffered || "",
      packageOffered2: student.packageOffered2 || "",
      location: student.location || "",
      jobRole: student.jobRole || "",
      placementDate: student.placementDate ? student.placementDate.split('T')[0] : ""
    });
    setShowPlacementModal(true);
  };

  // Handle placement save
  const handlePlacementSave = async () => {
    if (!selectedStudent) return;
    
    try {
      const response = await studentApi.updatePlacement(selectedStudent._id, placementData);
      
      if (response.status === "SUCCESS") {
        // Update the student in the list
        setStudents(students.map(s => 
          s._id === selectedStudent._id ? { ...s, ...placementData } : s
        ));
        setShowPlacementModal(false);
        setSelectedStudent(null);
      } else {
        setError(response.message || "Failed to update placement");
      }
    } catch (err: any) {
      setError(err.message || "Error updating placement");
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedYear("");
    setSelectedBatch("");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>
          <p className="text-gray-600">Manage and view student information</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaUpload />
          Upload Students
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, register number, or email..."
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
          
          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : "")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>Year {year}</option>
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
        
        {/* Clear filters button */}
        {(selectedDepartment || selectedYear || selectedBatch || searchTerm) && (
          <button
            onClick={clearFilters}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaTimes /> Clear filters
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button onClick={() => setError("")} className="float-right font-bold">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Student Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No students found. Add a batch to get started.
          </div>
        ) : (
          <div className="">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">S.No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Register No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mobile</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Year</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Batch</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.userName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.registerNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.mobileNo || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.year}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.batch}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete student"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Results count */}
        {!loading && students.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
            Showing {students.length} student{students.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Upload Students from Excel</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                  setUploadSuccess("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
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
              
              {/* Department (optional - can also be in Excel) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={uploadDepartment}
                  onChange={(e) => setUploadDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department (or leave blank if in Excel)</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              {/* Year (optional - can also be in Excel) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  value={uploadYear}
                  onChange={(e) => setUploadYear(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Year (or leave blank if in Excel)</option>
                  {years.map((year) => (
                    <option key={year} value={year}>Year {year}</option>
                  ))}
                </select>
              </div>
              
              {/* Batch (optional - can also be in Excel) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch
                </label>
                <select
                  value={uploadBatch}
                  onChange={(e) => setUploadBatch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Batch (or leave blank if in Excel)</option>
                  {generateBatches().map((batch) => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </select>
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
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                    {selectedFile ? (
                      <p className="text-sm text-green-600 font-medium">{selectedFile.name}</p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Click to upload Excel file
                      </p>
                    )}
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Expected columns: userName, registerNo, email, mobileNo (optional), department, year, batch
                </p>
              </div>
              
              {/* Error in modal */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}
              
              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Upload Students
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placement Modal */}
      {showPlacementModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Update Placement Details</h2>
              <button
                onClick={() => {
                  setShowPlacementModal(false);
                  setSelectedStudent(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Student Info */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-800">{selectedStudent.userName}</p>
                <p className="text-sm text-gray-600">{selectedStudent.registerNo}</p>
              </div>
              
              {/* Is Placed Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPlaced"
                  checked={placementData.isPlaced}
                  onChange={(e) => setPlacementData({ ...placementData, isPlaced: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <label htmlFor="isPlaced" className="text-sm font-medium text-gray-700">
                  Student is Placed
                </label>
              </div>
              
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={placementData.companyName}
                  onChange={(e) => setPlacementData({ ...placementData, companyName: e.target.value })}
                  placeholder="e.g., Google, Microsoft, TCS"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Company Name 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Second Company (Optional)
                </label>
                <input
                  type="text"
                  value={placementData.companyName2}
                  onChange={(e) => setPlacementData({ ...placementData, companyName2: e.target.value })}
                  placeholder="e.g., Amazon, Apple"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Package Offered */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package (CTC)
                </label>
                <input
                  type="text"
                  value={placementData.packageOffered}
                  onChange={(e) => setPlacementData({ ...placementData, packageOffered: e.target.value })}
                  placeholder="e.g., 10 LPA, 15,00,000 INR"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Second Package */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Second Package (Optional)
                </label>
                <input
                  type="text"
                  value={placementData.packageOffered2}
                  onChange={(e) => setPlacementData({ ...placementData, packageOffered2: e.target.value })}
                  placeholder="e.g., 12 LPA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={placementData.location}
                  onChange={(e) => setPlacementData({ ...placementData, location: e.target.value })}
                  placeholder="e.g., Bangalore, Chennai, Remote"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Job Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Role
                </label>
                <input
                  type="text"
                  value={placementData.jobRole}
                  onChange={(e) => setPlacementData({ ...placementData, jobRole: e.target.value })}
                  placeholder="e.g., Software Engineer, Data Analyst"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Placement Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placement Date
                </label>
                <input
                  type="date"
                  value={placementData.placementDate}
                  onChange={(e) => setPlacementData({ ...placementData, placementDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Save Button */}
              <button
                onClick={handlePlacementSave}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <FaBriefcase />
                Save Placement Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
