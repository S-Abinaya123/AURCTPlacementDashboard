import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    registerNo: {
      type: String,
      unique: true,
      sparse: true, // allows null for ADMIN
    },
    mobileNo: {
      type: String,
      unique: true,
      sparse: true, // allows null for STUDENT
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN"],
      default: "STUDENT",
    },
    department: {
      type: String,
      default: "",
    },
    year: {
      type: Number,
      min: 1,
      max: 4,
      default: null,
    },
    batch: {
      type: String,
      default: "", // e.g., "2021-2024"
    },
    profilePicture: {
      type: String,
      default: "",
    },
    // Profile picture stored as base64 in MongoDB
    profilePictureData: {
      type: String,
      default: null,
    },
    profilePictureContentType: {
      type: String,
      default: null,
    },
    // Password reset OTP fields
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpires: {
      type: Date,
      default: null,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;