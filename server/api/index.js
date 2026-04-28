import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Use relative paths based on your structure (assuming this is in /api)
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

/* =================================
   CORS CONFIGURATION
================================= */
app.use(
  cors({
    origin: [
      "https://aurct-placement-dashboard-4vo1zx81e-aurct12-7196s-projects.vercel.app",
      "https://aurct-placement-dashboard-lju5.vercel.app",
      "http://localhost:5173", // Useful for local debugging
    ],
    credentials: true,
  })
);

/* =================================
   MIDDLEWARE
================================= */
app.use(express.json({ limit: "5mb" })); // Lowered limit to protect 512MB RAM
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

/* =================================
   MONGODB CONNECTION (Serverless Optimized)
================================= */
const MONGO_URI = process.env.MONGO_URI;

// Use global caching to prevent multiple connections in serverless environment
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      maxPoolSize: 10, // Crucial for 500+ users to prevent DB crash
    }).then((mongoose) => mongoose);
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

// Middleware to ensure DB is connected before any route logic
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

/* =================================
   ROUTES
================================= */
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/placement-interviews", placementInterviewRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/notifications", notificationRoutes);

/* =================================
   HEALTH CHECK
================================= */
app.get("/", (req, res) => {
  res.json({ success: true, message: "API Working 🚀", environment: process.env.NODE_ENV });
});

/* =================================
   EXPORT FOR VERCEL
================================= */
// Do NOT use app.listen() or serverless(app)
export default app;