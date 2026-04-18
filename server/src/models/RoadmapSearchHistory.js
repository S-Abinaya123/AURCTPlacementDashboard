import mongoose from "mongoose";

const roadmapSearchHistorySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  department: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: ""
  },
  syllabus: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  searchDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create index for efficient querying
roadmapSearchHistorySchema.index({ studentId: 1, searchDate: -1 });

export default mongoose.model("RoadmapSearchHistory", roadmapSearchHistorySchema);
