import express from "express";
import mongoose from "mongoose";
import Result from "../models/Result.js";
import User from "../models/userModels.js";

const router = express.Router();

/* =================================
   SUBMIT RESULT
================================= */
router.post("/", async (req, res) => {
  try {
    const { userId, quizId, score, total } = req.body;

    console.log("Incoming Result Body:", req.body);

    // Basic validation
    if (!userId || !quizId) {
      return res.status(400).json({
        success: false,
        message: "userId and quizId are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId format",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quizId format",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check duplicate attempt
    const existing = await Result.findOne({ userId, quizId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already attempted this quiz",
      });
    }

    const result = new Result({
      userId,
      quizId,
      score,
      total,
      registerNo: user.registerNo,
      studentName: user.userName,
      department: user.department || "",
      year: user.year || null,
    });

    await result.save();

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("RESULT SAVE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while saving result",
    });
  }
});

/* =================================
   CHECK ATTEMPT
================================= */
router.get("/check/:userId/:quizId", async (req, res) => {
  try {
    const { userId, quizId } = req.params;

    const result = await Result.findOne({ userId, quizId });

    if (result) {
      return res.json({
        attempted: true,
        result,
      });
    }

    res.json({ attempted: false });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error checking attempt",
    });
  }
});

/* =================================
   LEADERBOARD
================================= */
router.get("/leaderboard/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;

    const results = await Result.find({ quizId })
      .sort({ score: -1 })
      .select("studentName registerNo score total");

    res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
    });
  }
});

export default router;