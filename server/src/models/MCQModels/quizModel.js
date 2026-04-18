import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const quizSchema = new mongoose.Schema(
  {
    topic: String,
    time: Number,
    dueDate: {
      type: Date,
      default: null
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);