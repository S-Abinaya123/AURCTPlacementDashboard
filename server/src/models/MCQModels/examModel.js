import mongoose from "mongoose";

const examQuestionSchema = new mongoose.Schema({
    mcqId: { type: mongoose.Schema.Types.ObejctId, ref: "MCQTest", required: true },
    question: { type: String, required: true },
    type: {
        type: String,
        enum: ["fillup", "mcq", "msq", "coding"],
        required: true
    },
    options: {
        a: { type: String },
        b: { type: String },
        c: { type: String },
        d: { type: String }
    },
    correctAnswer: { type: String, required: true },
},  {timeStamps: true});

export default mongoose.model("ExamQuestion", examQuestionSchema);

