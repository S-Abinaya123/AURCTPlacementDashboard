import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userName: String,
    registerNo: { type: String, unique: true },
    email: String,
    mobileNo: String,
    department: String,
    year: Number,
    batch: String,
    role: {
      type: String,
      default: "STUDENT"
    },
    // Placement details
    isPlaced: {
      type: Boolean,
      default: false
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
    location: {
      type: String,
      default: ""
    },
    placementDate: {
      type: Date,
      default: null
    },
    jobRole: {
      type: String,
      default: ""
    },
    jobRole2: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);