import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import { generateJwtToken } from "../utils/jwtToken.js";

export const loginUserService = async (data) => {
  try {
    const { registerNo, mobileNo, password, role } = data;

    console.log("Login attempt:", { registerNo, mobileNo, role });

    let user;
    
    // For STUDENT login, use registerNo
    if (role === "STUDENT") {
      // Try finding user with registerNo as string first
      user = await User.findOne({
        registerNo: registerNo,
        role: role,
      });

      console.log("User found (string):", user);

      // If not found, try with number conversion (for Excel import issues)
      if (!user) {
        user = await User.findOne({
          registerNo: Number(registerNo),
          role: role,
        });
        console.log("User found (number):", user);
      }
    } 
    // For FACULTY login, use mobileNo
    else if (role === "FACULTY") {
      user = await User.findOne({
        mobileNo: mobileNo,
        role: role,
      });
      console.log("Faculty user found:", user);
    }

    if (!user) {
      console.log("User not found for registerNo:", registerNo, "role:", role);
      return {
        status: 401,
        condition: "FAILED",
        message: "User not found",
      };
    }

    // Use bcrypt to compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return {
        status: 401,
        condition: "FAILED",
        message: "Invalid password",
      };
    }

    // Generate JWT token
    const token = generateJwtToken(
      { userId: user._id, role: user.role },
      "7d"
    );

    console.log("Login successful for user:", user.userName);

    return {
      status: 200,
      condition: "SUCCESS",
      message: "Login successful",
      data: {
        token: token,
        userId: user._id,
        userName: user.userName,
        registerNo: user.registerNo,
        role: user.role,
        profilePicture: user.profilePicture || "",
        email: user.email || "",
        deptName: user.deptName || "",
        mobileNo: user.mobileNo || "",
      },
    };
  } catch (error) {
    console.log("Login error:", error);
    return {
      status: 500,
      condition: "FAILED",
      message: "Server error",
    };
  }
};