import express from "express";
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
import mongoose from "mongoose";

let isConnected = false;
dotenv.config();

const app = express();

/* ================= ONLY ONE CORS ================= */
app.use(
  cors({
    origin: [
      "https://aurct-placement-dashboard-4vo1zx81e-aurct12-7196s-projects.vercel.app",
      "https://aurct-placement-dashboard-lju5.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

/* IMPORTANT for preflight */
app.options("*", cors());

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

/* ================= DB ================= */

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });

    isConnected = conn.connections[0].readyState;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err);
    throw err;
  }
};

/* ================= EXPORT ================= */
export default async function handler(req, res) {
  await connectDB();
  return serverless(app)(req, res);
}