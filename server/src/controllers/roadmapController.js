import Groq from "groq-sdk";
import mongoose from "mongoose";
import RoadmapSearchHistory from "../models/RoadmapSearchHistory.js";
import StudentRoadmapProgress from "../models/StudentRoadmapProgress.js";
import CompanyRoadmap from "../models/CompanyRoadmap.js";
import https from "https";

const getGroqClient = () => {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
};

const searchYouTube = (query) => {
  return new Promise((resolve) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey || apiKey === "YOUR_YOUTUBE_API_KEY_HERE") {
      console.log("YouTube API key not configured");
      resolve([]);
      return;
    }
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${encodedQuery}&type=video&key=${apiKey}`;
    
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const videos = json.items ? json.items.map(item => ({
            title: item.snippet.title,
            videoId: item.id.videoId,
            channel: item.snippet.channelTitle
          })) : [];
          resolve(videos);
        } catch {
          resolve([]);
        }
      });
    }).on("error", () => resolve([]));
  });
};

export const getCompaniesByDepartment = async (req, res) => {
  try {
    const { department } = req.query;
    console.log("getCompaniesByDepartment called with:", department);
    
    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required"
      });
    }

    let companies = [];
    let PlacementRecord;
    try {
      const pr = await import('../models/PlacementRecord.js');
      PlacementRecord = pr.default;
      if (PlacementRecord) {
        companies = await PlacementRecord.distinct("companyName", { department });
        console.log("PlacementRecord query returned:", companies.length, "companies");
      }
    } catch (dbError) {
      console.log("PlacementRecord query error:", dbError.message);
      companies = [];
    }
    
    const defaultCompanies = {
      "CSE": ["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Adobe", "Goldman Sachs", "Morgan Stanley", "TCS", "Infosys", "Wipro", "Cognizant"],
      "ECE": ["Qualcomm", "Intel", "Samsung", "Texas Instruments", "Broadcom", "NVIDIA", "TSMC", "Apple", "Google", "TCS", "Infosys", "Wipro"],
      "Mechanical": ["Tata Motors", "Mahindra", "Maruti Suzuki", "Hyundai", "Bosch", "L&T", "Thermax", "Ashok Leyland", "GE", "Siemens"],
      "Geoinformatics": ["ESRI", "Google", "NASA", "ISRO", "NRSC", "MapMyIndia", "Blue Planet", "RMSI"]
    };
    
    const allCompanies = [...new Set([...(companies || []), ...(defaultCompanies[department] || [])])];
    console.log("Returning total companies:", allCompanies.length);
    
    res.status(200).json({
      success: true,
      companies: allCompanies
    });
  } catch (error) {
    console.error("Error getting companies:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error getting companies: " + error.message
    });
  }
};

export const generateRoadmap = async (req, res) => {
  try {
    const { department, company, role, studentId } = req.body;

    console.log("generateRoadmap called:", { department, company, role });

    if (!department || !company) {
      return res.status(400).json({
        success: false,
        message: "Department and company are required"
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    console.log("GROQ_API_KEY exists:", !!groqApiKey);
    
    if (!groqApiKey) {
      return res.status(500).json({
        success: false,
        message: "Groq API key not configured. Please contact administrator."
      });
    }

    const prompt = `Generate a detailed placement preparation roadmap for ${company} for a ${department} student${role ? ` targeting ${role} role` : ''}. 

Generate EXACTLY 4 levels with EXACTLY 4 topics each. For each topic, include exactly 3 resources: YouTube video, GeeksforGeeks article, and HackerRank practice link.

Format the response as a JSON array with this EXACT structure:
[
  {
    "level": "Beginner",
    "taskId": "task-1",
    "topics": [
      {
        "name": "Topic name",
        "resources": [
          { "type": "video", "title": "[YouTube] Tutorial", "url": "https://www.youtube.com/watch?v=..." },
          { "type": "article", "title": "[GeeksforGeeks] Tutorial", "url": "https://www.geeksforgeeks.org/..." },
          { "type": "practice", "title": "[HackerRank] Practice", "url": "https://www.hackerrank.com/..." }
        ]
      }
    ]
  }
]

IMPORTANT:
- MUST have exactly 4 levels: Beginner, Intermediate, Advanced, Company Ready
- Each level MUST have exactly 4 topics
- Each topic MUST have exactly 3 resources
- Use REAL working URLs from YouTube, GeeksforGeeks, HackerRank

Respond ONLY with valid JSON, no additional text.`;

    const groq = getGroqClient();
    console.log("Calling Groq API...");
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4000
    });

    const roadmapContent = completion.choices[0]?.message?.content;

    if (!roadmapContent) {
      throw new Error("No content generated from Groq API");
    }

    let syllabus;
    try {
      const cleanedContent = roadmapContent
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/\t/g, ' ');
      
      syllabus = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Error parsing Groq response:", parseError);
      const jsonMatch = roadmapContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const cleanedJson = jsonMatch[0]
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
            .replace(/\n/g, ' ')
            .replace(/\r/g, ' ')
            .replace(/\t/g, ' ');
          syllabus = JSON.parse(cleanedJson);
        } catch (e) {
          syllabus = getFallbackRoadmap(company, department);
        }
      } else {
        syllabus = getFallbackRoadmap(company, department);
      }
    }

    syllabus.forEach((level, index) => {
      if (!level.taskId) {
        level.taskId = `task-${index + 1}`;
      }
    });

    for (const level of syllabus) {
      for (const topic of level.topics) {
        try {
          const searchQuery = `${topic.name} ${company} placement tutorial`;
          const videos = await searchYouTube(searchQuery);
          
          for (const video of videos) {
            topic.resources.push({
              type: "video",
              title: video.title,
              url: `https://www.youtube.com/watch?v=${video.videoId}`
            });
          }
        } catch (e) {
          console.log("YouTube search error for:", topic.name);
        }
      }
    }

    let historyId = null;
    if (studentId) {
      const history = await RoadmapSearchHistory.create({
        studentId,
        department,
        company,
        role: role || "",
        syllabus
      });
      historyId = history._id;
    }

    res.status(200).json({
      success: true,
      syllabus,
      historyId
    });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    const errorMessage = error.message?.substring(0, 200) || "Error generating roadmap";
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

function getFallbackRoadmap(company, department) {
  return [
    {
      level: "Beginner",
      taskId: "task-1",
      topics: [
        {
          name: "Data Structures & Algorithms Basics",
          resources: [
            { type: "video", title: "DSA Tutorial", url: "https://www.youtube.com/watch?v=RwRM-gP_5Io" },
            { type: "article", title: "GeeksforGeeks DSA", url: "https://www.geeksforgeeks.org/data-structures/" },
            { type: "practice", title: "HackerRank DSA", url: "https://www.hackerrank.com/domains/data-structures" }
          ]
        },
        {
          name: "Programming Fundamentals",
          resources: [
            { type: "video", title: "Programming Basics", url: "https://www.youtube.com/watch?v=zOjov-2OZ0E" },
            { type: "article", title: "JavaScript Basics", url: "https://www.geeksforgeeks.org/javascript/" },
            { type: "practice", title: "HackerRank Problem Solving", url: "https://www.hackerrank.com/domains/algorithms" }
          ]
        },
        {
          name: "Database Management",
          resources: [
            { type: "video", title: "DBMS Tutorial", url: "https://www.youtube.com/watch?v=4cWkVbC2bOU" },
            { type: "article", title: "GeeksforGeeks DBMS", url: "https://www.geeksforgeeks.org/database-management-system/" },
            { type: "practice", title: "HackerRank SQL", url: "https://www.hackerrank.com/domains/sql" }
          ]
        },
        {
          name: "Computer Networks",
          resources: [
            { type: "video", title: "CN Tutorial", url: "https://www.youtube.com/watch?v=5GPbJS1z2Wg" },
            { type: "article", title: "GeeksforGeeks CN", url: "https://www.geeksforgeeks.org/computer-networks/" },
            { type: "practice", title: "HackerRank Networks", url: "https://www.hackerrank.com/domains/network-security" }
          ]
        }
      ]
    },
    {
      level: "Intermediate",
      taskId: "task-2",
      topics: [
        {
          name: "Advanced Data Structures",
          resources: [
            { type: "video", title: "Trees & Graphs", url: "https://www.youtube.com/watch?v=0i2o88IJIoE" },
            { type: "article", title: "GeeksforGeeks Trees", url: "https://www.geeksforgeeks.org/tree-data-structure/" },
            { type: "practice", title: "HackerRank Trees", url: "https://www.hackerrank.com/domains/data-structures/trees" }
          ]
        },
        {
          name: "System Design Basics",
          resources: [
            { type: "video", title: "System Design", url: "https://www.youtube.com/watch?v=98rA1L-4rPQ" },
            { type: "article", title: "System Design Primer", url: "https://www.geeksforgeeks.org/system-design/" },
            { type: "practice", title: "Practice Problems", url: "https://www.hackerrank.com/domains/algorithms" }
          ]
        },
        {
          name: "Operating Systems",
          resources: [
            { type: "video", title: "OS Tutorial", url: "https://www.youtube.com/watch?v=2-wKEQ6-olJQ" },
            { type: "article", title: "GeeksforGeeks OS", url: "https://www.geeksforgeeks.org/operating-systems/" },
            { type: "practice", title: "OS Practice", url: "https://www.hackerrank.com/domains/operating-systems" }
          ]
        },
        {
          name: "Web Development",
          resources: [
            { type: "video", title: "React Tutorial", url: "https://www.youtube.com/watch?v=Ke90Tje7VS0" },
            { type: "article", title: "React Guide", url: "https://www.geeksforgeeks.org/react-tutorial/" },
            { type: "practice", title: "Frontend Practice", url: "https://www.hackerrank.com/domains/css" }
          ]
        }
      ]
    },
    {
      level: "Advanced",
      taskId: "task-3",
      topics: [
        {
          name: "Dynamic Programming",
          resources: [
            { type: "video", title: "DP Tutorial", url: "https://www.youtube.com/watch?v=oSgA8spw4yc" },
            { type: "article", title: "GeeksforGeeks DP", url: "https://www.geeksforgeeks.org/dynamic-programming/" },
            { type: "practice", title: "LeetCode DP", url: "https://leetcode.com/tag/dynamic-programming/" }
          ]
        },
        {
          name: "Advanced Algorithms",
          resources: [
            { type: "video", title: "Algorithms", url: "https://www.youtube.com/watch?v=0j3cKWPgOPo" },
            { type: "article", title: "Advanced Algos", url: "https://www.geeksforgeeks.org/greedy-algorithms/" },
            { type: "practice", title: "Codeforces", url: "https://codeforces.com/problemset/" }
          ]
        },
        {
          name: "Cloud Computing",
          resources: [
            { type: "video", title: "Cloud Tutorial", url: "https://www.youtube.com/watch?v=l0H3Q5D4yQ8" },
            { type: "article", title: "AWS Guide", url: "https://www.geeksforgeeks.org/cloud-computing/" },
            { type: "practice", title: "AWS Practice", url: "https://www.hackerrank.com/domains/cloud" }
          ]
        },
        {
          name: "Machine Learning Basics",
          resources: [
            { type: "video", title: "ML Tutorial", url: "https://www.youtube.com/watch?v=8ISil2I8j9Q" },
            { type: "article", title: "GeeksforGeeks ML", url: "https://www.geeksforgeeks.org/machine-learning/" },
            { type: "practice", title: "Kaggle Practice", url: "https://www.kaggle.com/" }
          ]
        }
      ]
    },
    {
      level: "Company Ready",
      taskId: "task-4",
      topics: [
        {
          name: "Previous Year Questions & Interview Experiences",
          resources: [
            { type: "article", title: "GeeksforGeeks Interview Corner", url: "https://www.geeksforgeeks.org/company-interview-corner/" },
            { type: "article", title: "LeetCode Interview", url: "https://leetcode.com/explore/" },
            { type: "article", title: "InterviewBit", url: "https://www.interviewbit.com/" }
          ]
        },
        {
          name: "Mock Interview Practice",
          resources: [
            { type: "practice", title: "Pramp Free Mock Interviews", url: "https://www.pramp.com/" },
            { type: "practice", title: "Interviewing.io", url: "https://interviewing.io/" },
            { type: "practice", title: "PeerMock", url: "https://peermock.co/" }
          ]
        },
        {
          name: "Practice Questions",
          resources: [
            { type: "practice", title: "LeetCode Problems", url: "https://leetcode.com/problem-list/" },
            { type: "practice", title: "InterviewBit Practice", url: "https://www.interviewbit.com/courses/" },
            { type: "practice", title: "Codeforces Problems", url: "https://codeforces.com/problemset/" }
          ]
        },
        {
          name: "Placement Preparation Guide",
          resources: [
            { type: "article", title: "Complete Placement Guide", url: "https://www.geeksforgeeks.org/placements-guru/" },
            { type: "video", title: "Placement Prep Playlist", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0q8-psmsrL4R8vC2W8C5Z5" },
            { type: "documentation", title: "Company Prep Guides", url: "https://www.geeksforgeeks.org/company-preparation/" }
          ]
        }
      ]
    }
  ];
}

export const getSearchHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required"
      });
    }

    const history = await RoadmapSearchHistory.find({ studentId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    console.error("Error getting search history:", error);
    res.status(500).json({
      success: false,
      message: "Error getting search history"
    });
  }
};

export const deleteSearchHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "History ID is required"
      });
    }

    await RoadmapSearchHistory.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "History deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting search history:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting search history"
    });
  }
};

export const getRoadmapProgress = async (req, res) => {
  try {
    const { studentId, roadmapId } = req.params;
    
    if (!studentId || !roadmapId) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Roadmap ID are required"
      });
    }

    let progress = await StudentRoadmapProgress.findOne({ studentId, roadmapId });

    if (!progress) {
      progress = await StudentRoadmapProgress.create({
        studentId,
        roadmapId,
        completedTasks: [],
        completedResources: [],
        currentTaskId: "task-1"
      });
    }

    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    console.error("Error getting roadmap progress:", error);
    res.status(500).json({
      success: false,
      message: "Error getting roadmap progress"
    });
  }
};

export const completeTask = async (req, res) => {
  try {
    const { studentId, roadmapId, taskId, resourceUrl, resourceType } = req.body;

    if (!studentId || !roadmapId || !taskId) {
      return res.status(400).json({
        success: false,
        message: "Student ID, Roadmap ID, and Task ID are required"
      });
    }

    let progress = await StudentRoadmapProgress.findOne({ studentId, roadmapId });

    if (!progress) {
      progress = new StudentRoadmapProgress({
        studentId,
        roadmapId,
        completedTasks: [],
        completedResources: [],
        currentTaskId: "task-1"
      });
    }

    if (!progress.completedTasks.includes(taskId)) {
      progress.completedTasks.push(taskId);
    }

    if (resourceUrl) {
      const resourceKey = `${taskId}-${resourceUrl}`;
      if (!progress.completedResources.includes(resourceKey)) {
        progress.completedResources.push({
          taskId,
          resourceUrl,
          resourceType,
          completedAt: new Date()
        });
      }
    }

    const taskNumber = parseInt(taskId.replace('task-', ''));
    progress.currentTaskId = `task-${taskNumber + 1}`;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Task completed successfully",
      progress
    });
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({
      success: false,
      message: "Error completing task"
    });
  }
};

export const markResourceViewed = async (req, res) => {
  try {
    const { studentId, roadmapId, taskId, resourceUrl, resourceType } = req.body;

    if (!studentId || !roadmapId || !taskId || !resourceUrl) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    let progress = await StudentRoadmapProgress.findOne({ studentId, roadmapId });

    if (!progress) {
      progress = new StudentRoadmapProgress({
        studentId,
        roadmapId,
        completedTasks: [],
        completedResources: [],
        currentTaskId: "task-1"
      });
    }

    const alreadyViewed = progress.completedResources.some(
      r => r.taskId === taskId && r.resourceUrl === resourceUrl
    );

    if (!alreadyViewed) {
      progress.completedResources.push({
        taskId,
        resourceUrl,
        resourceType,
        completedAt: new Date()
      });
      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Resource marked as viewed",
      progress
    });
  } catch (error) {
    console.error("Error marking resource as viewed:", error);
    res.status(500).json({
      success: false,
      message: "Error marking resource as viewed"
    });
  }
};

export const createCompanyRoadmap = async (req, res) => {
  console.log("=== createCompanyRoadmap called ===");
  console.log("Body keys:", Object.keys(req.body));
  try {
    let { companyName, department, role, description, steps } = req.body;
    const facultyId = req.user?.userId || req.body.facultyId;

    console.log("Creating company roadmap:", { 
      companyName, 
      department, 
      role, 
      hasSteps: !!steps, 
      facultyId,
      stepsType: typeof steps,
      stepsIsArray: Array.isArray(steps),
      stepsLength: steps?.length
    });

    if (!companyName || !department || !steps) {
      console.log("Validation failed: missing required fields");
      return res.status(400).json({
        success: false,
        message: "Company name, department, and steps are required"
      });
    }

    if (typeof steps === 'string') {
      try {
        steps = JSON.parse(steps);
        console.log("Parsed steps from string");
      } catch (parseError) {
        console.log("Steps parse error:", parseError.message);
        return res.status(400).json({
          success: false,
          message: "Invalid steps format - could not parse JSON"
        });
      }
    }

    if (!Array.isArray(steps)) {
      console.log("Steps is not an array:", typeof steps);
      return res.status(400).json({
        success: false,
        message: "Steps must be an array"
      });
    }

    if (steps.length === 0) {
      console.log("Steps array is empty");
      return res.status(400).json({
        success: false,
        message: "Steps cannot be empty"
      });
    }

    console.log("Steps validation passed, count:", steps.length);

    let normalizedSteps;
    try {
      console.log("Steps sample before normalization:", typeof steps, steps?.[0]?.topics?.[0]?.resources);
      
      // Handle nested string parsing - if resources is a string, try to parse it
      steps = steps.map((step) => {
        if (!step) return step;
        return {
          ...step,
          topics: (step.topics || []).map((topic) => {
            if (!topic) return topic;
            let resources = topic.resources;
            
            // If resources is a string, try to parse it as JSON
            if (typeof resources === 'string') {
              try {
                resources = JSON.parse(resources);
              } catch (e) {
                console.log("Failed to parse resources string");
                resources = [];
              }
            }
            
            // If resources is not an array (could be single object), wrap it in array
            if (!Array.isArray(resources)) {
              resources = resources ? [resources] : [];
            }
            
          return {
            ...topic,
            resources: resources.map((resource) => {
              // Handle case where resource itself is a string
              if (typeof resource === 'string') {
                try {
                  const parsed = JSON.parse(resource);
                  return {
                    type: parsed.type || "link",
                    title: parsed.title || "Resource",
                    url: parsed.url || ""
                  };
                } catch {
                  return { type: "link", title: "Resource", url: "" };
                }
              }
              if (!resource) {
                return { type: "link", title: "Resource", url: "" };
              }
              return {
                type: resource.type || "link",
                title: resource.title || resource.name || "Resource",
                url: resource.url || resource.link || ""
              };
            })
          };
          })
        };
      });
      
      normalizedSteps = steps.map((step, index) => {
        if (!step) {
          return { level: `Level ${index + 1}`, taskId: `task-${index + 1}`, topics: [] };
        }
        return {
          level: step.level || `Level ${index + 1}`,
          taskId: step.taskId || `task-${index + 1}`,
          topics: (step.topics || []).map((topic) => {
            if (!topic) {
              return { name: "Topic", resources: [] };
            }
            return {
              name: topic.name || "Topic",
              resources: Array.isArray(topic.resources) ? topic.resources.map((resource) => {
                if (!resource) {
                  return { type: "link", title: "Resource", url: "" };
                }
                return {
                  type: resource.type || "link",
                  title: resource.title || "Resource",
                  url: resource.url || ""
                };
              }) : []
            };
          })
        };
      });
      console.log("Normalized steps count:", normalizedSteps.length);
      console.log("Sample resources:", JSON.stringify(normalizedSteps?.[0]?.topics?.[0]?.resources).substring(0, 200));
    } catch (mapError) {
      console.log("Error normalizing steps:", mapError.message);
      return res.status(400).json({
        success: false,
        message: "Error processing steps: " + mapError.message
      });
    }

    try {
      const roadmapData = {
        companyName,
        department,
        role: role || "Software Engineer",
        description: description || "Test description",
        steps: normalizedSteps,
        updatedAt: new Date()
      };

      console.log("=== FINAL DATA TO SAVE ===");
      console.log("companyName:", companyName);
      console.log("department:", department);
      console.log("steps length:", roadmapData.steps?.length);
      console.log("=== END FINAL DATA ===");

      let createResult;
      try {
        console.log("Checking for existing roadmap...");
        const existing = await CompanyRoadmap.findOne({ companyName, department });
        
        if (existing) {
          console.log("Updating existing roadmap:", existing._id);
          createResult = await CompanyRoadmap.findByIdAndUpdate(
            existing._id,
            roadmapData,
            { new: true }
          );
        } else {
          console.log("Creating new roadmap...");
          createResult = await CompanyRoadmap.create(roadmapData);
        }
        console.log("Result:", createResult?._id);
      } catch (crudError) {
        console.error("CRUD Error:", crudError.message);
        console.error("CRUD Error name:", crudError.name);
        console.error("CRUD Error stack:", crudError.stack);
        throw crudError;
      }

      console.log("Roadmap created successfully:", createResult._id);

      res.status(201).json({
        success: true,
        message: "Company roadmap created successfully",
        roadmap: createResult
      });
    } catch (createError) {
      console.error("Error during CompanyRoadmap.create:", createError);
      console.error("Error message:", createError.message);
      console.error("Error code:", createError.code);
      throw createError;
    }
  } catch (error) {
    console.error("Error creating company roadmap:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error creating company roadmap: " + error.message
    });
  }
};

export const updateCompanyRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, department, role, description, steps } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Roadmap ID is required"
      });
    }

    const roadmap = await CompanyRoadmap.findById(id);

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found"
      });
    }

    if (companyName) roadmap.companyName = companyName;
    if (department) roadmap.department = department;
    if (role !== undefined) roadmap.role = role;
    if (description !== undefined) roadmap.description = description;
    if (steps) roadmap.steps = steps;
    roadmap.updatedAt = new Date();

    await roadmap.save();

    res.status(200).json({
      success: true,
      message: "Company roadmap updated successfully",
      roadmap
    });
  } catch (error) {
    console.error("Error updating company roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Error updating company roadmap"
    });
  }
};

export const getCompanyRoadmaps = async (req, res) => {
  try {
    const { department, company, role, search } = req.query;
    console.log("getCompanyRoadmaps - params:", { department, company, role, search });
    
    const filter = {};
    
    if (department) {
      filter.department = department;
    }
    
    if (company) {
      filter.companyName = { $regex: company, $options: 'i' };
    }
    
    if (role) {
      filter.role = { $regex: role, $options: 'i' };
    }
    
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    console.log("getCompanyRoadmaps - filter:", JSON.stringify(filter));

    const roadmaps = await CompanyRoadmap.find(filter)
      .sort({ createdAt: -1 });
    
    console.log("getCompanyRoadmaps - found:", roadmaps.length, "roadmaps");

    res.status(200).json({
      success: true,
      roadmaps
    });
  } catch (error) {
    console.error("Error getting company roadmaps:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error getting companies: " + error.message
    });
  }
};

export const getCompanyRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Roadmap ID is required"
      });
    }

    const roadmap = await CompanyRoadmap.findById(id)
      .populate('createdBy', 'name email');

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found"
      });
    }

    res.status(200).json({
      success: true,
      roadmap
    });
  } catch (error) {
    console.error("Error getting company roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Error getting company roadmap"
    });
  }
};

export const deleteCompanyRoadmap = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Roadmap ID is required"
      });
    }

    const roadmap = await CompanyRoadmap.findByIdAndDelete(id);

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Roadmap deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting company roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting company roadmap"
    });
  }
};
