import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";

import authRoutes from "../src/routes/authRoutes.js";
import quizRoutes from "../src/routes/quizRoutes.js";
import resultRoutes from "../src/routes/resultRoutes.js";
import notesRoutes from "../src/routes/notesRoutes.js";
import studentRoutes from "../src/routes/studentRoutes.js";
import profileRoutes from "../src/routes/profileRoutes.js";
import placementInterviewRoutes from "../src/routes/placementInterviewRoutes.js";
import roadmapRoutes from "../src/routes/roadmapRoutes.js";
import notificationRoutes from "../src/routes/notificationRoutes.js";

dotenv.config();

const app = express();

/* ================= CORS ================= */
app.use(
  cors({
    origin: [
      "https://aurct-placement-dashboard-4vo1zx81e-aurct12-7196s-projects.vercel.app",
      "https://aurct-placement-dashboard-lju5.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/placement-interviews", placementInterviewRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/notifications", notificationRoutes);

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.json({ success: true, message: "API Working" });
});

/* ================= DB CONNECTION (IMPORTANT) ================= */
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB Connected");
};

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  await connectDB();
  return serverless(app)(req, res);
}