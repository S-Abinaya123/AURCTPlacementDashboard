import express from "express";
import { login, verifyUserToken, requestPasswordReset, verifyOtp, resetPassword } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Auth routes updated!" });
});

router.post("/login", login);

/* ✅ PASSWORD RESET ROUTES */
router.post("/request-password-reset", requestPasswordReset);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

/* ✅ THIS WAS MISSING */
router.get("/verify-token", verifyToken, verifyUserToken);

export default router;