import mongoose from "mongoose";

const studentRoadmapProgressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoadmapSearchHistory",
    required: true
  },
  company: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  completedTasks: [{
    taskId: {
      type: String,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    completedResources: [{
      resourceUrl: String,
      resourceType: String,
      completedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  currentTaskId: {
    type: String,
    default: "task-1"
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
studentRoadmapProgressSchema.index({ studentId: 1, roadmapId: 1 }, { unique: true });

const StudentRoadmapProgress = mongoose.model("StudentRoadmapProgress", studentRoadmapProgressSchema);

export default StudentRoadmapProgress;
