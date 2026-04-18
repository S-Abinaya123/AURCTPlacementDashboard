import mongoose from "mongoose";

const placementRecordSchema = new mongoose.Schema({
  registerNo: {
    type: String,
    required: true,
    index: true
  },
  userName: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  department: {
    type: String,
    default: ""
  },
  year: {
    type: Number,
    default: null
  },
  batch: {
    type: String,
    default: ""
  },
  isPlaced: {
    type: Boolean,
    default: true
  },
  companyName: {
    type: String,
    default: ""
  },
  companyName2: {
    type: String,
    default: ""
  },
  packageOffered: {
    type: String,
    default: ""
  },
  packageOffered2: {
    type: String,
    default: ""
  },
  jobRole: {
    type: String,
    default: ""
  },
  jobRole2: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  placementDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Create a unique index on registerNo to prevent duplicates
placementRecordSchema.index({ registerNo: 1 }, { unique: true });

export default mongoose.model("PlacementRecord", placementRecordSchema);
