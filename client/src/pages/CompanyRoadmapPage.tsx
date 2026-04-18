import { useState, useEffect } from "react";
import { getCompanyRoadmaps, getCompaniesByDepartment, markResourceViewed, completeTask, getRoadmapProgress as getRoadmapProgressApi } from "../api/roadmapApi";
import { openGoogleCalendar, createRoadmapTaskEvent } from "../utils/googleCalendar";

type Topic = {
  name: string;
  resources: { type: string; title: string; url: string }[];
};

type RoadmapStep = {
  level: string;
  taskId: string;
  topics: Topic[];
};

type CompanyRoadmap = {
  _id: string;
  companyName: string;
  department: string;
  role: string;
  steps: RoadmapStep[];
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
};

type Progress = {
  completedTasks: string[];
  completedResources: string[];
  currentTaskId: string;
};

const CompanyRoadmapPage = () => {
  const [roadmaps, setRoadmaps] = useState<CompanyRoadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [department, setDepartment] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");
  const [showDepartmentInput, setShowDepartmentInput] = useState(false);
  const [company, setCompany] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [showCompanyInput, setShowCompanyInput] = useState(false);
  const [role, setRole] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [companies, setCompanies] = useState<string[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<CompanyRoadmap | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  const studentId = localStorage.getItem("userId") || "";
  const departments = ["CSE", "ECE", "Mechanical", "Geoinformatics"];
  const commonRoles = ["Software Engineer", "Data Scientist", "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Machine Learning Engineer", "Cloud Engineer"];

  useEffect(() => {
    const userDept = localStorage.getItem("department");
    if (userDept && departments.includes(userDept)) {
      setDepartment(userDept);
    }
  }, []);

  useEffect(() => {
    if (department && !showDepartmentInput) {
      loadCompanies(department);
    }
  }, [department]);

  // Removed auto-load roadmaps - now only loads after search button is clicked

  const loadCompanies = async (dept: string) => {
    setCompaniesLoading(true);
    try {
      const response = await getCompaniesByDepartment(dept);
      if (response.success) {
        setCompanies(response.companies);
      }
    } catch (err) {
      console.error("Error loading companies:", err);
      const defaultCompanies: Record<string, string[]> = {
        "CSE": ["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Adobe", "Goldman Sachs", "Morgan Stanley", "TCS", "Infosys", "Wipro", "Cognizant"],
        "ECE": ["Qualcomm", "Intel", "Samsung", "Texas Instruments", "Broadcom", "NVIDIA", "TSMC", "Apple", "Google", "TCS", "Infosys", "Wipro"],
        "Mechanical": ["Tata Motors", "Mahindra", "Maruti Suzuki", "Hyundai", "Bosch", "L&T", "Thermax", "Ashok Leyland", "GE", "Siemens"],
        "Geoinformatics": ["ESRI", "Google", "NASA", "ISRO", "NRSC", "MapMyIndia", "Blue Planet", "RMSI"]
      };
      setCompanies(defaultCompanies[dept] || []);
    } finally {
      setCompaniesLoading(false);
    }
  };

  const loadRoadmaps = async () => {
    setLoading(true);
    setError("");
    try {
      const finalDept = showDepartmentInput ? departmentInput : department;
      const response = await getCompanyRoadmaps({ department: finalDept });
      if (response.success) {
        setRoadmaps(response.roadmaps);
      }
    } catch (err) {
      console.error("Error loading roadmaps:", err);
      setError("Failed to load roadmaps");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const finalDept = showDepartmentInput ? departmentInput : department;
    const finalCompany = showCompanyInput ? companyInput : company;
    const finalRole = showRoleInput ? roleInput : role;
    
    setLoading(true);
    setError("");
    setHasSearched(true);
    getCompanyRoadmaps({ department: finalDept, company: finalCompany, role: finalRole })
      .then((response) => {
        if (response.success) {
          setRoadmaps(response.roadmaps);
        }
      })
      .catch((err) => {
        setError("Failed to load roadmaps");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    if (value === "__type__") {
      setShowDepartmentInput(true);
      setDepartmentInput("");
      setCompanies([]);
    } else {
      setShowDepartmentInput(false);
      setDepartmentInput("");
    }
  };

  const handleCompanyChange = (value: string) => {
    setCompany(value);
    if (value === "__type__") {
      setShowCompanyInput(true);
      setCompanyInput("");
    } else {
      setShowCompanyInput(false);
      setCompanyInput("");
    }
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
    if (value === "__type__") {
      setShowRoleInput(true);
      setRoleInput("");
    } else {
      setShowRoleInput(false);
      setRoleInput("");
    }
  };

  const handleViewRoadmap = (roadmap: CompanyRoadmap) => {
    setSelectedRoadmap(roadmap);
    setShowModal(true);
    loadProgress(roadmap._id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoadmap(null);
    setProgress(null);
  };

  const handleResourceClick = async (resourceUrl: string, resourceType: string, taskId: string) => {
    if (!selectedRoadmap || !studentId) return;

    try {
      await markResourceViewed({
        studentId,
        roadmapId: selectedRoadmap._id,
        taskId,
        resourceUrl,
        resourceType
      });
      
      setProgress(prev => prev ? {
        ...prev,
        completedResources: [...prev.completedResources, `${taskId}-${resourceUrl}`]
      } : null);
    } catch (err) {
      console.error("Error marking resource as viewed:", err);
    }
  };

  const isResourceCompleted = (taskId: string, resourceUrl: string): boolean => {
    if (!progress) return false;
    return progress.completedResources.some(r => r === `${taskId}-${resourceUrl}`);
  };

  const isTaskCompleted = (taskId: string): boolean => {
    if (!progress) return false;
    return progress.completedTasks.includes(taskId);
  };

  const handleTaskComplete = async (taskId: string) => {
    if (!selectedRoadmap || !studentId) return;

    try {
      const response = await completeTask({
        studentId,
        roadmapId: selectedRoadmap._id,
        taskId
      });

      if (response.success) {
        // Transform the data to match our Progress type
        setProgress({
          completedTasks: response.progress.completedTasks || [],
          completedResources: response.progress.completedResources?.map((r: any) => 
            r.resourceUrl ? `${r.taskId}-${r.resourceUrl}` : r
          ) || [],
          currentTaskId: response.progress.currentTaskId || "task-1"
        });
      }
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  const loadProgress = async (roadmapId: string) => {
    if (!studentId) return;
    
    setProgressLoading(true);
    try {
      const data = await getRoadmapProgressApi(studentId, roadmapId);
      if (data.success) {
        // Transform the data to match our Progress type
        setProgress({
          completedTasks: data.progress.completedTasks || [],
          completedResources: data.progress.completedResources?.map((r: any) => 
            r.resourceUrl ? `${r.taskId}-${r.resourceUrl}` : r
          ) || [],
          currentTaskId: data.progress.currentTaskId || "task-1"
        });
      }
    } catch (err) {
      console.error("Error loading progress:", err);
      setProgress({
        completedTasks: [],
        completedResources: [],
        currentTaskId: "task-1"
      });
    } finally {
      setProgressLoading(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video": return "🎬";
      case "article": return "📄";
      case "documentation": return "📚";
      case "practice": return "💻";
      default: return "🔗";
    }
  };

  const finalDept = showDepartmentInput ? departmentInput : department;
  const finalCompany = showCompanyInput ? companyInput : company;
  const finalRole = showRoleInput ? roleInput : role;

  // Filter roadmaps based on selected filters
  const filteredRoadmaps = roadmaps.filter(roadmap => {
    if (finalCompany && roadmap.companyName.toLowerCase() !== finalCompany.toLowerCase()) return false;
    if (finalRole && roadmap.role && roadmap.role.toLowerCase() !== finalRole.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-blue-900">
            Company Roadmaps
          </h1>
          <p className="text-gray-600 mt-2">
            Browse company-specific preparation roadmaps uploaded by faculty 🎯
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2">Department *</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
                <option value="__type__">+ Type custom...</option>
              </select>
              {showDepartmentInput && (
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 mt-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter department"
                  value={departmentInput}
                  onChange={(e) => setDepartmentInput(e.target.value)}
                />
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">Company</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={company}
                onChange={(e) => handleCompanyChange(e.target.value)}
                disabled={!finalDept || companiesLoading}
              >
                <option value="">All Companies</option>
                {companies.map((comp) => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
                <option value="__type__">+ Type custom...</option>
              </select>
              {showCompanyInput && (
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 mt-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                />
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">Role</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                <option value="">All Roles</option>
                {commonRoles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
                <option value="__type__">+ Type custom...</option>
              </select>
              {showRoleInput && (
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 mt-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter role"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                />
              )}
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={!finalDept || loading}
            className="mt-4 w-full md:w-auto bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            <p className="mt-2 text-gray-600">Loading roadmaps...</p>
          </div>
        )}

        {/* Initial State - Show before user searches */}
        {!hasSearched && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            
            <p className="text-gray-400 mt-2">Browse roadmaps uploaded by faculty for your placement preparation</p>
          </div>
        )}

        {/* Results - Only show after search */}
        {hasSearched && !loading && finalDept && filteredRoadmaps.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">No roadmaps available for the selected filters.</p>
            <p className="text-gray-400 mt-2">Check back later for updates from faculty!</p>
          </div>
        )}

        {hasSearched && !loading && filteredRoadmaps.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.map((roadmap) => (
              <div
                key={roadmap._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">{roadmap.companyName}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      {roadmap.department}
                    </span>
                  </div>
                  <span className="text-3xl">🏢</span>
                </div>
                
                {roadmap.role && (
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Role:</span> {roadmap.role}
                  </p>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                  <span>{roadmap.steps?.length || 0} Steps</span>
                  <span>{roadmap.steps?.reduce((acc, step) => acc + (step.topics?.length || 0), 0) || 0} Topics</span>
                </div>
                
                <button
                  onClick={() => handleViewRoadmap(roadmap)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Roadmap
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && selectedRoadmap && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-4 md:my-8 max-h-[95vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-4 md:p-6 rounded-t-2xl flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">{selectedRoadmap.companyName}</h2>
                  <p className="text-blue-200 text-sm">
                    {selectedRoadmap.department} {selectedRoadmap.role && `• ${selectedRoadmap.role}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      selectedRoadmap.steps?.forEach((step, idx) => {
                        const event = createRoadmapTaskEvent(
                          step.level,
                          selectedRoadmap.companyName,
                          selectedRoadmap.role || "",
                          idx
                        );
                        openGoogleCalendar(event);
                      });
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                    title="Add all tasks to Google Calendar"
                  >
                    📅 Add All to Calendar
                  </button>
                  <button
                    onClick={closeModal}
                    className="text-white/80 hover:text-white text-2xl p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {progress && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 md:px-6 py-3 border-b border-green-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-green-800 text-sm">Your Progress</span>
                    <span className="text-sm text-green-600">
                      {progress.completedTasks.length} / {selectedRoadmap.steps?.length || 0} Tasks
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(progress.completedTasks.length / (selectedRoadmap.steps?.length || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {progressLoading && (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto mb-2"></div>
                  Loading your progress...
                </div>
              )}

              {/* Content */}
              <div className="p-4 md:p-6 overflow-y-auto flex-1">
                <div className="space-y-4 md:space-y-6">
                  {selectedRoadmap.steps?.map((step, stepIndex) => {
                    const taskId = step.taskId || `task-${stepIndex + 1}`;
                    const isCompleted = isTaskCompleted(taskId);
                    const isUnlocked = stepIndex === 0 || isTaskCompleted(selectedRoadmap.steps?.[stepIndex - 1]?.taskId || `task-${stepIndex}`);

                    return (
                      <div
                        key={stepIndex}
                        className={`rounded-xl md:rounded-2xl p-4 md:p-5 transition-all ${isUnlocked ? 'bg-gradient-to-br from-slate-50 to-white border-l-4 border-blue-600 shadow-sm' : 'bg-gray-50 border-l-4 border-gray-300 opacity-70'}`}
                      >
                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isCompleted ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : isUnlocked ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'bg-gray-400 text-white'}`}>
                            {isCompleted ? '✓' : stepIndex + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-lg font-bold ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>{step.level}</h3>
                            {isCompleted && <span className="text-green-600 text-xs font-medium">✓ Completed</span>}
                            {!isUnlocked && <span className="text-gray-500 text-xs">🔒 Locked</span>}
                          </div>
                        </div>

                        {isUnlocked && (
                          <div className="ml-10 md:ml-13 space-y-3 md:space-y-4">
                            {step.topics?.map((topic, topicIndex) => (
                              <div key={topicIndex} className="bg-white/80 rounded-lg p-3 md:p-4 border border-slate-100">
                                <h4 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">
                                  <span className="text-blue-600 mr-1">{topicIndex + 1}.</span> {topic.name}
                                </h4>
                                
                                {topic.resources && topic.resources.length > 0 && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {topic.resources.map((resource, resourceIndex) => {
                                      const completed = isResourceCompleted(taskId, resource.url);
                                      return (
                                        <div
                                          key={resourceIndex}
                                          className={`flex items-center gap-2 p-2 md:p-2.5 rounded-lg text-xs md:text-sm transition-all ${completed ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-slate-50 hover:bg-blue-50 border border-slate-100'}`}
                                        >
                                          <span className="text-base shrink-0">{getResourceIcon(resource.type)}</span>
                                          <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex-1 truncate transition-colors ${completed ? 'text-green-700 line-through decoration-green-400' : 'text-blue-600 hover:text-blue-800'}`}
                                            onClick={() => handleResourceClick(resource.url, resource.type, taskId)}
                                          >
                                            {completed && <span className="mr-1">✓</span>}
                                            {resource.title}
                                          </a>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Complete Task Button */}
                            {!isCompleted && step.topics?.every(topic => 
                              topic.resources?.every(resource => isResourceCompleted(taskId, resource.url))
                            ) && step.topics?.some(topic => topic.resources?.length > 0) && (
                              <div className="flex flex-wrap gap-2 ml-1">
                                <button
                                  onClick={() => handleTaskComplete(taskId)}
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-semibold text-sm shadow-md"
                                >
                                  ✓ Mark Task as Complete & Unlock Next
                                </button>
                                <button
                                  onClick={() => {
                                    const event = createRoadmapTaskEvent(
                                      step.level,
                                      selectedRoadmap.companyName,
                                      selectedRoadmap.role || "",
                                      stepIndex
                                    );
                                    openGoogleCalendar(event);
                                  }}
                                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all font-semibold text-sm shadow-md flex items-center gap-1"
                                >
                                  📅 Add to Google Calendar
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {!isUnlocked && (
                          <div className="ml-10 md:ml-13 text-gray-500 text-sm bg-gray-100 rounded-lg p-3">
                            Complete the previous task to unlock this step.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 text-xs md:text-sm text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
                  <p>📚 Created by: {selectedRoadmap.createdBy?.name || "Faculty"}</p>
                  <p>📅 Date: {new Date(selectedRoadmap.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyRoadmapPage;