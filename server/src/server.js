import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import placementInterviewRoutes from "./routes/placementInterviewRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

import PlacementInterview from "./models/PlacementInterview.js";
import { createNotification } from "./controllers/notificationController.js";


dotenv.config();

const app = express();

/* =================================
   CORS CONFIG
================================= */
app.use(
  cors({
    origin: "https://aurct-placement-dashboard-lju5.vercel.app/",
    credentials: true,
  })
);

/* =================================
   MIDDLEWARE
 ================================= */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Log all requests
app.use((req, res, next) => {
  if (req.path.includes('roadmap')) {
    const bodyStr = req.body ? JSON.stringify(req.body).substring(0, 200) : 'no body';
    console.log("REQUEST:", req.method, req.path, "body:", bodyStr);
  }
  next();
});

/* =================================
   STATIC FILES (for profile pictures)
================================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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
  res.status(200).json({
    success: true,
    message: "API Working",
  });
});

/* =================================
   GLOBAL ERROR HANDLER
 ================================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  console.error("Stack:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =================================
   DATABASE + SERVER START
 ================================= */
const PORT = process.env.PORT || 5000;

const checkAndSendReminders = async () => {
  try {
    console.log("Checking for upcoming interviews...");
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const upcomingInterviews = await PlacementInterview.find({
      interviewDate: {
        $gte: tomorrow,
        $lte: tomorrowEnd
      },
      reminderSent: { $ne: true }
    });

    console.log(`Found ${upcomingInterviews.length} interviews tomorrow`);

    for (const interview of upcomingInterviews) {
      try {
        await createNotification({
          title: "Interview Reminder",
          message: `Reminder: You have an interview with ${interview.companyName} for ${interview.role} tomorrow!`,
          type: "INTERVIEW_REMINDER",
          relatedId: interview._id
        });

        interview.reminderSent = true;
        await interview.save();
        console.log(`Reminder sent for ${interview.companyName}`);
      } catch (err) {
        console.error("Error sending reminder:", err.message);
      }
    }
  } catch (err) {
    console.error("Reminder check error:", err.message);
  }
};

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${PORT}`);
    });

    // Check for reminders every hour
    setInterval(checkAndSendReminders, 60 * 60 * 1000);
    
    // Also check on startup (delayed to allow server to fully start)
    setTimeout(checkAndSendReminders, 10000);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

startServer();

