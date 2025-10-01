import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String }, //URL
    registerNo: { type: Number, required: true},
    deptName: { type: String, required: true},
    year: { type: Number, required: true},
    role: { type: String, enum: ["student", "faculty", "alumni"], required: true },
    gender: { type: String, enum: ["female", "male", "other"] },

    portfolioUrl: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    leetcodeUrl: {type: String },
    hackerRankUrl: { type: String },

    badge: [{ type: String}],
    score: { type: Number, default: 0},
},
    { timeStamps: true }
);
