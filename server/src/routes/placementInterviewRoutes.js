import express from "express";
import {
  createPlacementInterview,
  getAllPlacementInterviews,
  getPlacementInterviewById,
  getPlacementInterviewsByDate,
  updatePlacementInterview,
  deletePlacementInterview,
  downloadPlacementInterviewFile,
  downloadICSFile,
} from "../controllers/placementInterviewController.js";

const router = express.Router();

// Create a new placement interview
router.post("/", createPlacementInterview);

// Get all placement interviews
router.get("/", getAllPlacementInterviews);

// Get placement interview by ID
router.get("/:id", getPlacementInterviewById);

// Get placement interviews by date
router.get("/date/:date", getPlacementInterviewsByDate);

// Download placement interview file
router.get("/download/:id", downloadPlacementInterviewFile);

// Download ICS calendar file
router.get("/ics/:id", downloadICSFile);

// Update placement interview
router.put("/:id", updatePlacementInterview);

// Delete placement interview
router.delete("/:id", deletePlacementInterview);

export default router;
