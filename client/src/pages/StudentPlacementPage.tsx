import React, { useState, useEffect } from "react";
import { studentApi, type StudentData } from "../api/studentApi";
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendar, FaSearch } from "react-icons/fa";

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

export default function StudentPlacementPage() {
  const [placedStudents, setPlacedStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedBatch("");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Placements</h1>
        <p className="text-gray-600">View placement details of placed students</p>
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

      {/* Stats */}
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

      {/* Placed Students Table - No Delete for Students */}
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
    </div>
  );
}
