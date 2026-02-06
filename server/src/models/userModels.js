import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    registerNo: { type: Number },
    mobileNo: { type: Number },
    deptName: { type: String },
    year: { type: Number },
    role: { type: String, enum: ['STUDENT', 'FACULTY', 'ALUMNI', 'MODERATOR', 'ADMIN'], required: true },
    gender: { type: String, enum: ["female", "male"] },

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

const User = mongoose.model('User', userSchema);

export default User;