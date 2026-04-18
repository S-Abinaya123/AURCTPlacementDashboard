import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { 
  getCompaniesByDepartment, 
  generateRoadmap, 
  getSearchHistory,
  deleteSearchHistory,
  getRoadmapProgress,
  completeTask,
  markResourceViewed,
  createCompanyRoadmap,
  updateCompanyRoadmap,
  getCompanyRoadmaps,
  getCompanyRoadmapById,
  deleteCompanyRoadmap
} from "../controllers/roadmapController.js";

const router = express.Router();

// Helper wrapper for async route handlers to properly catch errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Simple test endpoint
router.get("/test", (req, res) => {
  console.log("TEST ENDPOINT CALLED");
  res.json({ success: true, message: "Test works!" });
});

// Debug test
router.get("/test2", (req, res) => {
  res.status(200).json({ success: true, message: "Direct test works!" });
});

// Debug endpoint that doesn't use any models
router.get("/companies-debug", (req, res) => {
  const { department } = req.query;
  console.log("/companies-debug called with:", department);
  const defaultCompanies = {
    "CSE": ["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Adobe"],
    "ECE": ["Qualcomm", "Intel", "Samsung", "Texas Instruments", "Broadcom", "NVIDIA"],
    "Mechanical": ["Tata Motors", "Mahindra", "Maruti Suzuki", "Hyundai", "Bosch", "L&T"],
    "Geoinformatics": ["ESRI", "Google", "NASA", "ISRO", "NRSC", "MapMyIndia"]
  };
  res.json({ success: true, companies: defaultCompanies[department] || [] });
});

// Debug endpoint to test PlacementRecord model
router.get("/test-placement-record", async (req, res) => {
  console.log("/test-placement-record called");
  try {
    const PlacementRecord = (await import('../models/PlacementRecord.js')).default;
    console.log("PlacementRecord model loaded:", typeof PlacementRecord);
    const count = await PlacementRecord.countDocuments();
    console.log("PlacementRecord count:", count);
    res.json({ success: true, count });
  } catch (err) {
    console.error("PlacementRecord error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get companies by department
router.get("/companies", asyncHandler(async (req, res) => {
  console.log("/companies called with query:", req.query);
  await getCompaniesByDepartment(req, res);
}));

// Generate roadmap using Groq API
router.post("/generate", asyncHandler(async (req, res) => {
  await generateRoadmap(req, res);
}));

// Get search history for a student
router.get("/history/:studentId", asyncHandler(async (req, res) => {
  await getSearchHistory(req, res);
}));

// Delete search history entry
router.delete("/history/:id", asyncHandler(async (req, res) => {
  await deleteSearchHistory(req, res);
}));

// Get student roadmap progress
router.get("/progress/:studentId/:roadmapId", asyncHandler(async (req, res) => {
  await getRoadmapProgress(req, res);
}));

// Mark task as completed and unlock next task
router.post("/complete-task", asyncHandler(async (req, res) => {
  await completeTask(req, res);
}));

// Mark resource as viewed
router.post("/mark-resource-viewed", asyncHandler(async (req, res) => {
  await markResourceViewed(req, res);
}));

// Company Roadmap routes (Faculty uploads)
router.post("/company", asyncHandler(async (req, res) => {
  console.log("POST /company body:", JSON.stringify(req.body).substring(0, 300));
  await createCompanyRoadmap(req, res);
}));

router.get("/company", asyncHandler(async (req, res) => {
  console.log("GET /company called with query:", req.query);
  await getCompanyRoadmaps(req, res);
}));

router.get("/company/:id", asyncHandler(async (req, res) => {
  console.log("GET /company/:id called:", req.params.id);
  await getCompanyRoadmapById(req, res);
}));

router.put("/company/:id", asyncHandler(async (req, res) => {
  await updateCompanyRoadmap(req, res);
}));

router.delete("/company/:id", asyncHandler(async (req, res) => {
  await deleteCompanyRoadmap(req, res);
}));

export default router;
