import User from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { response } from "../utils/response.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

/* =============================
   LOGIN
============================= */
export const login = async (req, res) => {
  try {
    const { registerNo, mobileNo, password, role } = req.body;

    if (!password || !role) {
      return res
        .status(400)
        .json(response("FAILED", "Missing required fields", null));
    }

    let user = null;

    if (role === "STUDENT") {
      if (!registerNo) {
        return res
          .status(400)
          .json(response("FAILED", "Register number required", null));
      }

      console.log("Searching for user with registerNo:", registerNo, "role: STUDENT");
      user = await User.findOne({
        registerNo: String(registerNo),
        role: "STUDENT",
      });
      console.log("Found user:", user ? user.userName : "NOT FOUND");

    } else if (role === "FACULTY" || role === "ADMIN") {
      if (!mobileNo) {
        return res
          .status(400)
          .json(response("FAILED", "Mobile number required", null));
      }

      user = await User.findOne({
        mobileNo: String(mobileNo),
        role: role,
      });

    } else {
      return res
        .status(400)
        .json(response("FAILED", "Invalid role", null));
    }

    if (!user) {
      console.log("User not found for registerNo:", registerNo, "role: STUDENT");
      return res
        .status(401)
        .json(response("FAILED", "User not found", null));
    }

    console.log("Comparing passwords with bcrypt");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password, user.password); // Log the plaintext and hashed passwords
    console.log("Password match result:", isMatch);
    if (!isMatch) {
      return res
        .status(401)
        .json(response("FAILED", "Invalid password", null));
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json(
      response("SUCCESS", "Login successful", {
        token,
        userId: user._id,
        userName: user.userName,
        role: user.role,
        registerNo: user.registerNo || "",
        mobileNo: user.mobileNo || "",
        email: user.email || "",
        profilePicture: user.profilePicture || "",
        profilePictureData: user.profilePictureData || null,
        profilePictureContentType: user.profilePictureContentType || null,
        department: user.department || "",
        theme: user.theme || "light",
      })
    );

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res
      .status(500)
      .json(response("FAILED", "Server error", null));
  }
};

/* =============================
   REQUEST PASSWORD RESET (OTP)
============================= */
export const requestPasswordReset = async (req, res) => {
  try {
    const { registerNo, mobileNo, role } = req.body;

    if (!role) {
      return res
        .status(400)
        .json(response("FAILED", "Role is required", null));
    }

    let user = null;

    if (role === "STUDENT") {
      if (!registerNo) {
        return res
          .status(400)
          .json(response("FAILED", "Register number is required", null));
      }

      user = await User.findOne({
        registerNo: String(registerNo),
        role: "STUDENT",
      });

    } else if (role === "FACULTY" || role === "ADMIN") {
      if (!mobileNo) {
        return res
          .status(400)
          .json(response("FAILED", "Mobile number is required", null));
      }

      user = await User.findOne({
        mobileNo: String(mobileNo),
        role: role,
      });

    } else {
      return res
        .status(400)
        .json(response("FAILED", "Invalid role", null));
    }

    if (!user) {
      return res
        .status(404)
        .json(response("FAILED", "User not found", null));
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiration (10 minutes)

    await User.updateOne({ _id: user._id }, {
      resetOtp: otp,
      resetOtpExpires: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP via email
    const emailResult = await sendOtpEmail({
      to: user.email,
      name: user.userName,
      registerNo: user.registerNo || user.mobileNo,
      otp: otp,
    });

    if (!emailResult.success) {
      return res
        .status(500)
        .json(response("FAILED", "Failed to send OTP email", null));
    }

    return res.status(200).json(
      response("SUCCESS", "OTP sent to your email address", {
        email: user.email,
      })
    );

  } catch (error) {
    console.error("REQUEST PASSWORD RESET ERROR:", error);
    return res
      .status(500)
      .json(response("FAILED", "Server error", null));
  }
};

/* =============================
    VERIFY OTP
============================= */
export const verifyOtp = async (req, res) => {
  try {
    const { registerNo, mobileNo, role, otp } = req.body;

    if (!role || !otp) {
      return res
        .status(400)
        .json(response("FAILED", "Role and OTP are required", null));
    }

    if (!registerNo && !mobileNo) {
      return res
        .status(400)
        .json(response("FAILED", "Register number or mobile number is required", null));
    }

    let user = null;
    let identifier = registerNo || mobileNo;

    if (role === "STUDENT") {
      if (!registerNo) {
        return res
          .status(400)
          .json(response("FAILED", "Register number is required", null));
      }

      // Check if user has a valid OTP that was recently requested
      user = await User.findOne({
        registerNo: String(registerNo),
        role: "STUDENT",
      });

    } else if (role === "FACULTY" || role === "ADMIN") {
      if (!mobileNo) {
        return res
          .status(400)
          .json(response("FAILED", "Mobile number is required", null));
      }

      user = await User.findOne({
        mobileNo: String(mobileNo),
        role: role,
      });

    } else {
      return res
        .status(400)
        .json(response("FAILED", "Invalid role", null));
    }

    if (!user) {
      return res
        .status(404)
        .json(response("FAILED", "User not found", null));
    }

    // Check if user has a valid OTP that was recently requested
    if (!user.resetOtp || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res
        .status(400)
        .json(response("FAILED", "No OTP requested. Please request OTP first", null));
    }

    // Check if OTP matches and not expired
    if (user.resetOtp !== otp) {
      return res
        .status(400)
        .json(response("FAILED", "Invalid OTP", null));
    }

    if (user.resetOtpExpires < new Date()) {
      // Clear expired OTP
      user.resetOtp = null;
      user.resetOtpExpires = null;
      await user.save();
      return res
        .status(400)
        .json(response("FAILED", "OTP has expired", null));
    }

    // OTP is valid - generate a temp token for password reset
    const resetToken = jwt.sign(
      { userId: user._id, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json(
      response("SUCCESS", "OTP verified successfully", {
        resetToken,
      })
    );

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res
      .status(500)
      .json(response("FAILED", "Server error", null));
  }
};

/* =============================
   RESET PASSWORD
============================= */
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const authHeader = req.headers.authorization;

    if (!newPassword) {
      return res
        .status(400)
        .json(response("FAILED", "New password is required", null));
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(response("FAILED", "Invalid or missing token", null));
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.purpose !== "password-reset") {
        return res
          .status(401)
          .json(response("FAILED", "Invalid token", null));
      }

      const user = await User.findById(decoded.userId);

      if (!user) {
        return res
          .status(404)
          .json(response("FAILED", "User not found", null));
      }

      // Hash the new password and clear OTP
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetOtp = null;
      user.resetOtpExpires = null;
      await user.save();

      return res.status(200).json(
        response("SUCCESS", "Password reset successfully", null)
      );

    } catch (jwtError) {
      return res
        .status(401)
        .json(response("FAILED", "Invalid or expired token", null));
    }

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res
      .status(500)
      .json(response("FAILED", "Server error", null));
  }
};

/* =============================
   VERIFY TOKEN ROUTE
============================= */
export const verifyUserToken = (req, res) => {
  return res
    .status(200)
    .json(response("SUCCESS", "Token valid", req.user));
};
