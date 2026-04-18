import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registerNo: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: "",
    },
    year: {
      type: Number,
      default: null,
    },
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent multiple attempts
resultSchema.index({ userId: 1, quizId: 1 }, { unique: true });

export default mongoose.model("Result", resultSchema);