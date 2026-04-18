import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import User from "../models/userModels.js";
import Student from "../models/studentModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { response } from "../utils/response.js";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

/* =================================
   GET PROFILE - Fetch from User and Student models
================================ */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json(response("FAILED", "User not found", null));
    }

    // For students, also fetch from Student collection
    let studentData = null;
    if (user.role === "STUDENT" && user.registerNo) {
      studentData = await Student.findOne({ registerNo: user.registerNo });
    }

    // Build profile picture URL if base64 data exists
    let profilePictureUrl = "";
    if (user.profilePictureData) {
      profilePictureUrl = `data:${user.profilePictureContentType};base64,${user.profilePictureData}`;
    } else if (user.profilePicture) {
      profilePictureUrl = user.profilePicture;
    }

    // Merge data from both collections
    const profileData = {
      userName: user.userName || "",
      email: user.email || "",
      registerNo: user.registerNo || "",
      mobileNo: user.mobileNo || "",
      department: user.department || "",
      year: user.year || (studentData?.year || null),
      batch: user.batch || (studentData?.batch || ""),
      profilePicture: profilePictureUrl,
      hasProfilePicture: !!user.profilePictureData,
      role: user.role || "",
      theme: user.theme || "light",
    };

    return res.status(200).json(response("SUCCESS", "Profile fetched", profileData));
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return res
      .status(500)
      .json(response("FAILED", "Server error", null));
  }
});

/* =================================
   UPDATE PROFILE - Store image as base64 in MongoDB
================================ */
router.put(
  "/profile",
  verifyToken,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { userName, department, year, batch } = req.body;
      const profilePictureFile = req.file;

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res
          .status(404)
          .json(response("FAILED", "User not found", null));
      }

      // Update allowed fields in User model
      if (userName) user.userName = userName;
      if (department) user.department = department;
      if (year) user.year = parseInt(year);
      if (batch) user.batch = batch;

      // Handle profile picture upload - Store as base64 in MongoDB
      if (profilePictureFile) {
        // Convert buffer to base64
        const base64Data = profilePictureFile.buffer.toString("base64");
        
        user.profilePictureData = base64Data;
        user.profilePictureContentType = profilePictureFile.mimetype;
        user.profilePicture = ""; // Clear old path-based field
      }

      await user.save();

      // For students, also update Student collection
      if (user.role === "STUDENT" && user.registerNo) {
        const student = await Student.findOne({ registerNo: user.registerNo });
        if (student) {
          if (userName) student.userName = userName;
          if (department) student.department = department;
          if (year) student.year = parseInt(year);
          if (batch) student.batch = batch;
          await student.save();
        }
      }

      // Build response profile picture URL
      let profilePictureUrl = "";
      if (user.profilePictureData) {
        profilePictureUrl = `data:${user.profilePictureContentType};base64,${user.profilePictureData}`;
      }

      return res.status(200).json(
        response("SUCCESS", "Profile updated successfully", {
          userName: user.userName,
          email: user.email,
          registerNo: user.registerNo || "",
          mobileNo: user.mobileNo || "",
          department: user.department,
          year: user.year,
          batch: user.batch,
          profilePicture: profilePictureUrl,
          hasProfilePicture: !!user.profilePictureData,
          role: user.role,
        })
      );
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      return res
        .status(500)
        .json(response("FAILED", "Server error", null));
    }
  }
);

/* =================================
   DELETE PROFILE PICTURE - Remove from MongoDB
================================ */
router.delete("/profile-picture", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json(response("FAILED", "User not found", null));
    }

    // Clear profile picture data
    user.profilePictureData = null;
    user.profilePictureContentType = null;
    user.profilePicture = "";
    await user.save();

    return res.status(200).json(
      response("SUCCESS", "Profile picture deleted successfully", null)
    );
  } catch (error) {
    console.error("DELETE PROFILE PICTURE ERROR:", error);
    return res
      .status(500)
      .json(response("FAILED", "Server error", null));
  }
});

/* =================================
   UPDATE THEME - Set user theme preference
================================ */
router.put("/theme", verifyToken, async (req, res) => {
  try {
    const { theme } = req.body;

    if (!theme || !["light", "dark"].includes(theme)) {
      return res.status(400).json(response("FAILED", "Invalid theme. Use 'light' or 'dark'", null));
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json(response("FAILED", "User not found", null));
    }

    user.theme = theme;
    await user.save();

    return res.status(200).json(response("SUCCESS", "Theme updated successfully", { theme }));
  } catch (error) {
    console.error("UPDATE THEME ERROR:", error);
    return res.status(500).json(response("FAILED", "Server error", null));
  }
});

export default router;
