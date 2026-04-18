import { useState, useEffect } from "react";
import { authService } from "../service/auth.service";
import { 
  getCompaniesByDepartment, 
  generateRoadmap, 
  getSearchHistory, 
  deleteSearchHistory,
  getRoadmapProgress,
  completeTask,
  markResourceViewed
} from "../api/roadmapApi";

type Resource = {
  type: string;
  title: string;
  url: string;
};

type Topic = {
  name: string;
  resources: Resource[];
};

type RoadmapStep = {
  level: string;
  taskId?: string;
  topics: Topic[];
};

type CompletedResource = {
  resourceUrl: string;
  resourceType: string;
  completedAt: string;
};

type CompletedTask = {
  taskId: string;
  completedAt: string;
  completedResources: CompletedResource[];
};

type RoadmapProgress = {
  _id: string;
  studentId: string;
  roadmapId: string;
  company: string;
  department: string;
  completedTasks: CompletedTask[];
  currentTaskId: string;
  lastUpdated: string;
};

type SearchHistoryItem = {
  _id: string;
  department: string;
  company: string;
  role: string;
  searchDate: string;
};

const Roadmap = () => {
  const [department, setDepartment] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<RoadmapProgress | null>(null);
  const [currentRoadmapId, setCurrentRoadmapId] = useState<string | null>(null);
  const [completingTask, setCompletingTask] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");
  const userDepartment = localStorage.getItem("department");

  // Auto-select department based on logged in user's department
  useEffect(() => {
    if (userDepartment) {
      setDepartment(userDepartment);
    }
  }, [userDepartment]);

  // Load companies when department changes
  useEffect(() => {
    if (department) {
      loadCompanies(department);
    } else {
      setCompanies([]);
    }
  }, [department]);

  // Load search history on mount
  useEffect(() => {
    if (userId) {
      loadSearchHistory();
    }
  }, [userId]);

  const loadCompanies = async (dept: string) => {
    setCompaniesLoading(true);
    try {
      const response = await getCompaniesByDepartment(dept);
      if (response.success) {
        setCompanies(response.companies);
      }
    } catch (err) {
      console.error("Error loading companies:", err);
      // Fallback to default companies
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

  const loadSearchHistory = async () => {
    try {
      const response = await getSearchHistory(userId!);
      if (response.success) {
        setSearchHistory(response.history);
      }
    } catch (err) {
      console.error("Error loading search history:", err);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await deleteSearchHistory(id);
      loadSearchHistory();
    } catch (err) {
      console.error("Error deleting history:", err);
    }
  };

  const generateRoadmapFromAI = async () => {
    if (!department || !company) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await generateRoadmap({
        department,
        company,
        role: role || "",
        studentId: userId || undefined
      });

      if (response.success) {
        // Ensure each step has a taskId
        const roadmapWithTaskIds = response.syllabus.map((step: RoadmapStep, index: number) => ({
          ...step,
          taskId: step.taskId || `task-${index + 1}`
        }));
        setRoadmap(roadmapWithTaskIds);
        // Reload search history after generating
        loadSearchHistory();
        
        // Load progress for the newly generated roadmap
        if (userId && response.historyId) {
          setCurrentRoadmapId(response.historyId);
          loadRoadmapProgress(userId, response.historyId);
        }
      } else {
        setError(response.message || "Failed to generate roadmap");
      }
    } catch (err: any) {
      console.error("Error generating roadmap:", err);
      const errorMessage = err.response?.data?.message || err.message || "Error generating roadmap. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadRoadmapProgress = async (studentId: string, roadmapId: string) => {
    try {
      const response = await getRoadmapProgress(studentId, roadmapId);
      if (response.success) {
        setProgress(response.progress);
      }
    } catch (err) {
      console.error("Error loading roadmap progress:", err);
    }
  };

  const handleHistoryClick = (item: SearchHistoryItem) => {
    setDepartment(item.department);
    setCompany(item.company);
    setRole(item.role);
    // Automatically generate roadmap for the selected history item
    setTimeout(() => {
      generateRoadmapFromAI();
    }, 100);
    setShowHistory(false);
  };

  const handleResourceClick = async (taskId: string, resourceUrl: string, resourceType: string) => {
    if (!userId || !currentRoadmapId) return;

    try {
      await markResourceViewed({
        studentId: userId,
        roadmapId: currentRoadmapId,
        taskId,
        resourceUrl,
        resourceType
      });
      
      // Reload progress after marking resource as viewed
      loadRoadmapProgress(userId, currentRoadmapId);
    } catch (err) {
      console.error("Error marking resource as viewed:", err);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!userId || !currentRoadmapId) return;

    setCompletingTask(taskId);
    try {
      const response = await completeTask({
        studentId: userId,
        roadmapId: currentRoadmapId,
        taskId
      });

      if (response.success) {
        setProgress(response.progress);
      }
    } catch (err) {
      console.error("Error completing task:", err);
    } finally {
      setCompletingTask(null);
    }
  };

  const isTaskLocked = (taskId: string): boolean => {
    if (!progress) return taskId !== "task-1";
    
    const taskNumber = parseInt(taskId.split('-')[1]);
    const currentTaskNumber = parseInt(progress.currentTaskId.split('-')[1]);
    
    return taskNumber > currentTaskNumber;
  };

  const isTaskCompleted = (taskId: string): boolean => {
    if (!progress) return false;
    return progress.completedTasks.some(t => t.taskId === taskId);
  };

  const isResourceViewed = (taskId: string, resourceUrl: string): boolean => {
    if (!progress) return false;
    const task = progress.completedTasks.find(t => t.taskId === taskId);
    if (!task) return false;
    return task.completedResources.some(r => r.resourceUrl === resourceUrl);
  };

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return "🎬";
      case "article":
        return "📄";
      case "documentation":
        return "📚";
      case "practice":
        return "💻";
      default:
        return "🔗";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-blue-900">
              Company Roadmap Generator
            </h1>
            <p className="text-gray-600 mt-2">
              Crack your dream company step by step 🚀
            </p>
          </div>
          {userId && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {showHistory ? "Hide History" : "Search History"}
            </button>
          )}
        </div>

        {/* Search History Panel */}
        {showHistory && searchHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Recent Searches</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchHistory.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer"
                  onClick={() => handleHistoryClick(item)}
                >
                  <div>
                    <span className="font-semibold text-blue-800">{item.company}</span>
                    <span className="text-gray-500 mx-2">|</span>
                    <span className="text-gray-600">{item.department}</span>
                    {item.role && (
                      <>
                        <span className="text-gray-500 mx-2">|</span>
                        <span className="text-gray-600">{item.role}</span>
                      </>
                    )}
                    <span className="text-gray-400 text-sm ml-2">
                      {new Date(item.searchDate).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHistory(item._id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Department */}
            <div>
              <label className="block font-semibold mb-2">
                Department
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setCompany("");
                }}
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Geoinformatics">Geoinformatics</option>
              </select>
            </div>

            {/* Company */}
            <div>
              <label className="block font-semibold mb-2">
                Target Company
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={!department || companiesLoading}
              >
                <option value="">
                  {companiesLoading ? "Loading..." : "Select Company"}
                </option>
                {companies.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>

            {/* Role (Optional) */}
            <div>
              <label className="block font-semibold mb-2">
                Role (Optional)
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Software Engineer"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={generateRoadmapFromAI}
            disabled={!department || !company || loading}
            className="mt-6 w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Generating Roadmap..." : "Generate Roadmap"}
          </button>
        </div>

        {/* Roadmap Output */}
        {roadmap.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-900">
              Your Roadmap for {company}
            </h2>
            {roadmap.map((step, stepIndex) => {
              const taskId = step.taskId || `task-${stepIndex + 1}`;
              const locked = isTaskLocked(taskId);
              const completed = isTaskCompleted(taskId);
              
              return (
                <div
                  key={stepIndex}
                  className={`bg-white rounded-xl shadow p-6 border-l-4 ${
                    locked 
                      ? 'border-gray-400 opacity-60' 
                      : completed 
                        ? 'border-green-500' 
                        : 'border-blue-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {locked && <span className="text-2xl">🔒</span>}
                      {completed && <span className="text-2xl">✅</span>}
                      {!locked && !completed && <span className="text-2xl">📌</span>}
                      <h3 className="text-xl font-bold text-blue-800">
                        Task {stepIndex + 1}: {step.level}
                      </h3>
                    </div>
                    {!locked && !completed && (
                      <button
                        onClick={() => handleCompleteTask(taskId)}
                        disabled={completingTask === taskId}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {completingTask === taskId ? "Completing..." : "Mark as Complete"}
                      </button>
                    )}
                    {completed && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Completed
                      </span>
                    )}
                  </div>
                  
                  {!locked && (
                    <div className="space-y-4">
                      {step.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="border-b border-slate-100 pb-4 last:border-0">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {topic.name}
                          </h4>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {topic.resources.map((resource, resourceIndex) => {
                              const viewed = isResourceViewed(taskId, resource.url);
                              return (
                                <a
                                  key={resourceIndex}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => handleResourceClick(taskId, resource.url, resource.type)}
                                  className={`flex items-center gap-2 p-2 rounded-lg transition text-sm ${
                                    viewed 
                                      ? 'bg-green-50 border border-green-200' 
                                      : 'bg-slate-50 hover:bg-blue-50'
                                  }`}
                                >
                                  <span>{getResourceIcon(resource.type)}</span>
                                  <span className="text-blue-600 truncate flex-1">
                                    {resource.title}
                                  </span>
                                  {viewed && <span className="text-green-600">✓</span>}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {locked && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-lg">Complete the previous task to unlock this section</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;
