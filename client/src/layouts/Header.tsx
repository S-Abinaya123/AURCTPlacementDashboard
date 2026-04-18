import "@fortawesome/fontawesome-free/css/all.min.css";
import { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "../api/notificationApi";
import darkModeIcon from "../assets/icons/dark-mode.png";
import lightModeIcon from "../assets/icons/light-mode.png";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "MCQ" | "NOTES" | "JOB_POST";
  isRead: boolean;
  createdAt: string;
}

export default function Header({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isStudent, setIsStudent] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check role from localStorage
    const role = localStorage.getItem("role") || "";
    const isStudentUser = role.toUpperCase() === "STUDENT";
    setIsStudent(isStudentUser);

    if (isStudentUser) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
        setSelectedNotification(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.notifications || []);
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Show popup with details
    setSelectedNotification(notification);
    
    // Mark as read if not already
    if (!notification.isRead) {
      try {
        await markAsRead(notification._id);
        setNotifications(prev =>
          prev.map(n =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      const deleted = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (deleted && !deleted.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const closePopup = () => {
    setSelectedNotification(null);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "MCQ":
        return "📝";
      case "NOTES":
        return "📚";
      case "JOB_POST":
        return "💼";
      default:
        return "🔔";
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "MCQ":
        return "New MCQ";
      case "NOTES":
        return "New Notes";
      case "JOB_POST":
        return "New Job";
      default:
        return "Notification";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <header className="h-[60px] flex items-center justify-between px-4 border-b bg-white sticky top-0 z-20">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Hamburger */}
          <button
            className="md:hidden text-2xl text-blue-600"
            onClick={onMenuClick}
          >
            ☰
          </button>

          <h2 className="text-[15px] md:text-[24px] font-extrabold tracking-wide text-blue-800">
            EDUGROW
            <span className="text-blue-500"> – (SMART STUDENT COMPANION)</span>
          </h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {isStudent && (
            <div className="relative" ref={notificationRef}>
              <div className="relative">
                <i 
                  className="fas fa-bell text-[20px] cursor-pointer text-blue-600"
                  onClick={() => setShowNotifications(!showNotifications)}
                ></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="sticky top-0 bg-white border-b border-gray-100 p-3 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No notifications yet</p>
                      <p className="text-xs text-gray-400 mt-1">New MCQs, Notes, and Jobs will appear here</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-3 cursor-pointer hover:bg-gray-50 transition ${
                            !notification.isRead ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.isRead ? "font-semibold" : "font-medium"} text-gray-800`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{getTimeAgo(notification.createdAt)}</p>
                            </div>
                            <button
                              onClick={(e) => handleDeleteNotification(notification._id, e)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <i className="fas fa-times text-xs"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button 
            onClick={toggleDarkMode}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:scale-105 transition"
          >
            <img src={darkMode ? lightModeIcon : darkModeIcon} alt="toggle theme" className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Notification Details Popup */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closePopup}>
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getNotificationIcon(selectedNotification.type)}</span>
                  <div>
                    <h3 className="font-bold text-lg">{selectedNotification.title}</h3>
                    <p className="text-xs text-blue-200">{getNotificationTypeLabel(selectedNotification.type)}</p>
                  </div>
                </div>
                <button 
                  onClick={closePopup}
                  className="text-white hover:text-blue-200"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            {/* Popup Body */}
            <div className="p-6">
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase">Message</label>
                <p className="text-gray-800 mt-1">{selectedNotification.message}</p>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase">Received</label>
                <p className="text-gray-800 mt-1">{getFullDate(selectedNotification.createdAt)}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className={`text-xs px-2 py-1 rounded ${selectedNotification.isRead ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {selectedNotification.isRead ? '✓ Read' : '● Unread'}
                </span>
                <button
                  onClick={closePopup}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
