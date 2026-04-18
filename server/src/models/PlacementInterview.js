import mongoose from "mongoose";

const placementInterviewSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  interviewDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  jobLink: {
    type: String,
    trim: true,
  },
  fileName: {
    type: String,
  },
  fileType: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  fileSize: {
    type: Number,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  calendarEventLink: {
    type: String,
  },
  icsFileUrl: {
    type: String,
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
placementInterviewSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const PlacementInterview = mongoose.model(
  "PlacementInterview",
  placementInterviewSchema
);

export default PlacementInterview;
