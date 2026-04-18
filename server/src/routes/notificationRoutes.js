import express from "express";
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
} from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notifications (protected - requires authentication)
router.get("/", verifyToken, getNotifications);

// Mark notification as read
router.put("/:id/read", verifyToken, markAsRead);

// Mark all notifications as read
router.put("/read-all", verifyToken, markAllAsRead);

// Delete a notification
router.delete("/:id", verifyToken, deleteNotification);

export default router;
