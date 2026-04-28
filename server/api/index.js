import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import serverless from "serverless-http";
import dotenv from "dotenv";

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


app.use(
  cors({
    origin: [
      "https://aurct-placement-dashboard-4vo1zx81e-aurct12-7196s-projects.vercel.app",
      "https://aurct-placement-dashboard-lju5.vercel.app",
    ],
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

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({ success: true, message: "API Working 🚀" });
});

/* ================= MONGODB CACHE ================= */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

/* ================= SERVERLESS HANDLER ================= */
const handler = serverless(app);

export default async function (req, res) {
  try {
    await connectDB();
    return handler(req, res);
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}