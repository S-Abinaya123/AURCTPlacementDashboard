import express from "express";
import Score from "../models/scoreModel.js";

const router = express.Router();

/* ================= Save Score ================= */

router.post("/", async (req, res) => {
  try {
    const score = new Score(req.body);
    await score.save();
    res.json(score);
  } catch (error) {
    res.status(500).json({ message: "Failed to save score" });
  }
});

/* ================= Get Scores ================= */

router.get("/", async (req, res) => {
  const { quizId } = req.query;

  let scores;

  if (quizId) {
    scores = await Score.find({ quizId }).sort({ createdAt: -1 });
  } else {
    scores = await Score.find().sort({ createdAt: -1 });
  }

  res.json(scores);
});

export default router;