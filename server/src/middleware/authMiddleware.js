import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found." });
    }

    req.user = {
      userId: user._id,
      role: user.role,
      userName: user.userName,
      email: user.email,
      registerNo: user.registerNo || "",
      mobileNo: user.mobileNo || "",
      profilePicture: user.profilePicture || "",
      department: user.department || "",
    };

    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token." });
  }
};