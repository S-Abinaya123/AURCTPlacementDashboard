import { useState, useEffect } from "react";
import { createCompanyRoadmap, getCompanyRoadmaps, deleteCompanyRoadmap, getCompaniesByDepartment, generateRoadmap, testApi } from "../api/roadmapApi";
import { openGoogleCalendar, createRoadmapTaskEvent } from "../utils/googleCalendar";

const FacultyRoadmap = () => {
  const [department, setDepartment] = useState("");
  const [company, setCompany] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [showCompanyInput, setShowCompanyInput] = useState(false);
  const [role, setRole] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [companies, setCompanies] = useState<string[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [existingRoadmaps, setExistingRoadmaps] = useState<any[]>([]);
  const [showList, setShowList] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null);

  const facultyId = localStorage.getItem("userId") || "";

  const departments = ["CSE", "ECE", "Mechanical", "Geoinformatics"];
  const commonRoles = ["Software Engineer", "Data Scientist", "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Machine Learning Engineer", "Cloud Engineer"];

  // Test API on load
  useEffect(() => {
    testApi().then(r => console.log("Test result:", r)).catch(e => console.log("Test error:", e.message));
  }, []);

  useEffect(() => {
    if (department) {
      loadCompanies(department);
    } else {
      setCompanies([]);
    }
  }, [department]);

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

  const handleGenerateRoadmap = async () => {
    const finalCompany = showCompanyInput ? companyInput : company;
    const finalRole = showRoleInput ? roleInput : role;
    
    if (!department || !finalCompany) {
      setMessage("Please select or type department and company");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setGeneratedRoadmap(null);

    try {
      const response = await generateRoadmap({
        department,
        company: finalCompany,
        role: finalRole || "",
        studentId: undefined
      });

      if (response.success) {
        setGeneratedRoadmap(response.syllabus);
        setMessage("Roadmap generated successfully! Review and upload.");
        setMessageType("success");
      } else {
        setMessage(response.message || "Failed to generate roadmap");
        setMessageType("error");
      }
    } catch (error: any) {
      console.error("Generate error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error generating roadmap";
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadToStudents = async () => {
    if (!generatedRoadmap) return;

    const finalCompany = showCompanyInput ? companyInput : company;
    const finalRole = showRoleInput ? roleInput : role;

    setLoading(true);
    setMessage("");

    try {
      const data = {
        companyName: finalCompany,
        department,
        role: finalRole,
        description: "",
        steps: generatedRoadmap,
        facultyId
      };

      const response = await createCompanyRoadmap(data);
      
      if (response.success) {
        setMessage("Roadmap uploaded to students successfully!");
        setMessageType("success");
        setGeneratedRoadmap(null);
        setDepartment("");
        setCompany("");
        setCompanyInput("");
        setRole("");
        setRoleInput("");
        setShowCompanyInput(false);
        setShowRoleInput(false);
      } else {
        setMessage(response.message || "Failed to upload roadmap");
        setMessageType("error");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      if (error.response) {
        setMessage(error.response.data?.message || error.response.data?.error || "Error uploading roadmap");
      } else if (error.request) {
        setMessage("Server not responding. Please try again.");
      } else {
        setMessage(error.message || "Error uploading roadmap");
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const loadRoadmaps = async () => {
    try {
      const response = await getCompanyRoadmaps();
      if (response.success) {
        setExistingRoadmaps(response.roadmaps);
      }
    } catch (error) {
      console.error("Error loading roadmaps:", error);
    }
  };

  const handleShowList = () => {
    loadRoadmaps();
    setShowList(!showList);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this roadmap?")) return;
    
    try {
      await deleteCompanyRoadmap(id);
      loadRoadmaps();
      setMessage("Roadmap deleted successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error deleting roadmap");
      setMessageType("error");
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

  const finalCompany = showCompanyInput ? companyInput : company;
  const finalRole = showRoleInput ? roleInput : role;

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-blue-900">
              Company Roadmap Generator
            </h1>
            <p className="text-gray-600 mt-2">
              Generate and upload company roadmaps for students 🚀
            </p>
          </div>
          <button
            onClick={handleShowList}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showList ? "Hide Roadmaps" : "View Roadmaps"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${messageType === "success" ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"}`}>
            {message}
          </div>
        )}

        {/* Existing Roadmaps List */}
        {showList && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Uploaded Roadmaps</h2>
            {existingRoadmaps.length === 0 ? (
              <p className="text-gray-500">No roadmaps uploaded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-2 text-left">Company</th>
                      <th className="px-4 py-2 text-left">Department</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Created</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {existingRoadmaps.map((roadmap) => (
                      <tr key={roadmap._id} className="border-t">
                        <td className="px-4 py-2">{roadmap.companyName}</td>
                        <td className="px-4 py-2">{roadmap.department}</td>
                        <td className="px-4 py-2">{roadmap.role || "-"}</td>
                        <td className="px-4 py-2">{new Date(roadmap.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleDelete(roadmap._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block font-semibold mb-2">Department *</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setCompany("");
                  setCompanyInput("");
                  setShowCompanyInput(false);
                }}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Company *</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={company}
                onChange={(e) => handleCompanyChange(e.target.value)}
                disabled={!department || companiesLoading}
              >
                <option value="">Select Company</option>
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
              <label className="block font-semibold mb-2">Role (Optional)</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                <option value="">Select Role</option>
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
            onClick={handleGenerateRoadmap}
            disabled={!department || !finalCompany || loading}
            className="mt-6 w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Roadmap with AI"}
          </button>
        </div>

        {/* Generated Roadmap Preview */}
        {generatedRoadmap && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-2xl font-bold text-blue-900">
                Generated Roadmap for {finalCompany}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    generatedRoadmap.forEach((step: any, idx: number) => {
                      const event = createRoadmapTaskEvent(
                        step.level,
                        finalCompany,
                        finalRole || "",
                        idx
                      );
                      openGoogleCalendar(event);
                    });
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-1"
                >
                  📅 Add All to Google Calendar
                </button>
                <button
                  onClick={handleUploadToStudents}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Upload to Students"}
                </button>
              </div>
            </div>

            {generatedRoadmap.map((step: any, stepIndex: number) => (
              <div
                key={stepIndex}
                className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-700"
              >
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📌</span>
                    <h3 className="text-xl font-bold text-blue-800">
                      Task {stepIndex + 1}: {step.level}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      const event = createRoadmapTaskEvent(
                        step.level,
                        finalCompany,
                        finalRole || "",
                        stepIndex
                      );
                      openGoogleCalendar(event);
                    }}
                    className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-200 transition flex items-center gap-1"
                  >
                    📅 Add to Calendar
                  </button>
                </div>
                
                <div className="space-y-4">
                  {step.topics?.map((topic: any, topicIndex: number) => (
                    <div key={topicIndex} className="border-b border-slate-100 pb-4 last:border-0">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {topic.name}
                      </h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {topic.resources?.map((resource: any, resourceIndex: number) => (
                          <a
                            key={resourceIndex}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg transition text-sm bg-slate-50 hover:bg-blue-50"
                          >
                            <span>{getResourceIcon(resource.type)}</span>
                            <span className="text-blue-600 truncate flex-1">
                              {resource.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyRoadmap;