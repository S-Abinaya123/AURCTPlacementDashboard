import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { placementInterviewApi, type PlacementInterviewData } from "../api/placementInterviewApi";
import { FaBuilding, FaBriefcase, FaCalendar, FaClock, FaLink, FaFile, FaDownload, FaTimes } from "react-icons/fa";
import { openGoogleCalendar, createInterviewEvent } from "../utils/googleCalendar";

export default function InterviewCalendarPage() {
  const [placements, setPlacements] = useState<PlacementInterviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPlacements, setSelectedPlacements] = useState<PlacementInterviewData[]>([]);
  const [selectedPlacement, setSelectedPlacement] = useState<PlacementInterviewData | null>(null);
  const [searchParams] = useSearchParams();

  // Fetch all placements
  const fetchPlacements = async () => {
    setLoading(true);
    try {
      console.log("Fetching placements...");
      const response = await placementInterviewApi.getAllPlacementInterviews();
      console.log("API Response:", response);
      
      if (response.status === "SUCCESS" && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        console.log("Fetched placements:", data);
        console.log("First placement interviewDate:", data[0]?.interviewDate);
        setPlacements(data);
        
        // Check for job ID in URL params
        const jobId = searchParams.get("jobId");
        if (jobId) {
          const job = data.find(p => p._id === jobId);
          if (job) {
            setSelectedPlacement(job);
            setSelectedDate(new Date(job.interviewDate));
          }
        }
      }
    } catch (err) {
      console.error("Error fetching placements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, [searchParams]);

  // Auto-refresh when page becomes visible (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPlacements();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Filter placements by selected date
  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const filtered = placements.filter((p) => {
        const placementDate = new Date(p.interviewDate);
        const pdStr = `${placementDate.getFullYear()}-${String(placementDate.getMonth() + 1).padStart(2, '0')}-${String(placementDate.getDate()).padStart(2, '0')}`;
        return pdStr === dateStr;
      });
      setSelectedPlacements(filtered);
    } else {
      setSelectedPlacements([]);
    }
  }, [selectedDate, placements]);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPlacementsForDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    return placements.filter((p) => {
      const placementDate = new Date(p.interviewDate);
      const pdStr = `${placementDate.getFullYear()}-${String(placementDate.getMonth() + 1).padStart(2, '0')}-${String(placementDate.getDate()).padStart(2, '0')}`;
      return pdStr === dateStr;
    });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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

  // Render calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayPlacements = getPlacementsForDate(day);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      const isSelected = selectedDate?.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      const hasInterviews = dayPlacements.length > 0;

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
          className={`h-24 border p-1 cursor-pointer hover:bg-blue-50 transition overflow-y-auto ${
            isToday ? "bg-blue-100 border-blue-500" : isSelected ? "bg-blue-50 border-blue-500" : hasInterviews ? "bg-green-50" : "bg-white"
          }`}
        >
          <div className={`text-sm font-medium ${isToday ? "text-blue-600" : "text-gray-700"}`}>{day}</div>
          {dayPlacements.length > 0 && (
            <div className="mt-1">
              {dayPlacements.slice(0, 2).map((p, idx) => (
                <div 
                  key={idx} 
                  className="text-xs bg-green-100 text-green-700 px-1 rounded truncate cursor-pointer hover:bg-green-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlacement(p);
                  }}
                >
                  {p.companyName}
                </div>
              ))}
              {dayPlacements.length > 2 && (
                <div className="text-xs text-gray-500">+{dayPlacements.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Interview Calendar</h2>
            <p className="text-gray-600">View upcoming placement interviews and their details</p>
          </div>
          <button
            onClick={fetchPlacements}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : placements.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Upcoming Interviews</h3>
            <p className="text-gray-500">Placement interview details will appear here once posted by faculty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
              {/* Calendar Header */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={prevMonth}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  {"< Prev"}
                </button>
                <h3 className="text-lg font-semibold">
                  {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                </h3>
                <button
                  onClick={nextMonth}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  {"Next >"}
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium text-gray-600 py-2 bg-gray-100">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-100 border border-blue-500 rounded"></span>
                  Today
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-50 rounded"></span>
                  Interview Scheduled
                </span>
              </div>

              {/* All Placements List */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-3">All Upcoming Interviews ({placements.length})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {placements.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => {
                        setSelectedPlacement(p);
                        setSelectedDate(new Date(p.interviewDate));
                      }}
                      className="flex justify-between items-center p-2 bg-slate-50 rounded cursor-pointer hover:bg-blue-50 text-sm"
                    >
                      <span className="font-medium text-gray-800">{p.companyName} - {p.role}</span>
                      <span className="text-gray-500">{new Date(p.interviewDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Date Details */}
            <div className="bg-white p-6 rounded-2xl shadow h-fit">
              <h3 className="text-lg font-semibold mb-4">
                {selectedDate
                  ? `Interviews on ${selectedDate.toLocaleDateString()}`
                  : "Select a Date"}
              </h3>

              {!selectedDate ? (
                <p className="text-gray-500 text-sm">Click on a date in the calendar to view interview details.</p>
              ) : selectedPlacements.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaCalendar className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">No interviews scheduled for this date.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedPlacements.map((placement) => (
                    <div
                      key={placement._id}
                      onClick={() => setSelectedPlacement(placement)}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FaBuilding className="text-blue-500" />
                        <span className="font-semibold text-gray-800">{placement.companyName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <FaBriefcase className="text-gray-400" />
                        <span>{placement.role}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock className="text-gray-400" />
                        <span>{new Date(placement.interviewDate).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interview Details Popup Modal */}
      {selectedPlacement && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPlacement(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-2xl" />
                  <div>
                    <h3 className="font-bold text-lg">{selectedPlacement.companyName}</h3>
                    <p className="text-xs text-blue-200">Interview Details</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPlacement(null)}
                  className="text-white hover:text-blue-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            {/* Popup Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Role */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaBriefcase className="text-blue-600" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Role</label>
                    <p className="text-gray-800 font-medium">{selectedPlacement.role}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaCalendar className="text-green-600" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Date & Time</label>
                    <p className="text-gray-800 font-medium">
                      {new Date(selectedPlacement.interviewDate).toLocaleDateString()} at {new Date(selectedPlacement.interviewDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedPlacement.description && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaFile className="text-purple-600" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                      <p className="text-gray-800 mt-1">{selectedPlacement.description}</p>
                    </div>
                  </div>
                )}

                {/* Job Link */}
                {selectedPlacement.jobLink && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaLink className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Job Link</label>
                      <a
                        href={selectedPlacement.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block mt-1"
                      >
                        {selectedPlacement.jobLink}
                      </a>
                    </div>
                  </div>
                )}

                {/* File */}
                {selectedPlacement.fileName && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getFileIcon(selectedPlacement.fileType || "")}
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Attached File</label>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-800">{selectedPlacement.fileName}</span>
                        <button
                          onClick={() => downloadFile(selectedPlacement)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <FaDownload /> Download
                        </button>
                      </div>
                      {selectedPlacement.fileSize && (
                        <p className="text-xs text-gray-500">{formatFileSize(selectedPlacement.fileSize)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3 flex-wrap">
                {selectedPlacement.calendarEventLink ? (
                  <a
                    href={selectedPlacement.calendarEventLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition min-w-[150px]"
                  >
                    📅 Add to Calendar
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      const event = createInterviewEvent(
                        selectedPlacement.companyName,
                        selectedPlacement.role,
                        new Date(selectedPlacement.interviewDate),
                        selectedPlacement.description,
                        selectedPlacement.jobLink || undefined
                      );
                      openGoogleCalendar(event);
                    }}
                    className="flex-1 bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition min-w-[150px]"
                  >
                    📅 Add to Google Calendar
                  </button>
                )}
                {selectedPlacement.jobLink && (
                  <a
                    href={selectedPlacement.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition min-w-[100px]"
                  >
                    Apply Now
                  </a>
                )}
                <button
                  onClick={() => setSelectedPlacement(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition min-w-[100px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
