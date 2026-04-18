import Notification from "../models/Notification.js";
import User from "../models/userModels.js";

// Create a new notification (creates copies for each student for global notifications)
export const createNotification = async (data) => {
  const { title, message, type, relatedId, userId } = data;
  
  // If global notification (no userId or userId is null), create copies for all students
  if (!userId || userId === null) {
    try {
      const students = await User.find({ role: "STUDENT" }).select("_id");
      
      if (students && students.length > 0) {
        for (const student of students) {
          const notification = new Notification({
            title,
            message,
            type,
            relatedId,
            userId: student._id
          });
          await notification.save();
        }
      }
      return null;
    } catch (err) {
      console.error("Error creating notifications for students:", err);
      return null;
    }
  }
  
  // User-specific notification
  const notification = new Notification({
    title,
    message,
    type,
    relatedId,
    userId
  });
  
  await notification.save();
  return notification;
};

// Get all notifications (for a specific user)
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    // Get only notifications belonging to this user
    const notifications = await Notification.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({ userId: userId, isRead: false });
    
    res.status(200).json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications"
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    // Only mark as read if it belongs to this user
    await Notification.findOneAndUpdate(
      { _id: id, userId: userId },
      { isRead: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Notification marked as read"
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking notification as read"
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    // Mark all as read for this user
    await Notification.updateMany(
      { userId: userId, isRead: false },
      { isRead: true }
    );
    
    res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking all notifications as read"
    });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    // Only delete if it belongs to this user
    await Notification.findOneAndDelete({ _id: id, userId: userId });
    
    res.status(200).json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting notification"
    });
  }
};
