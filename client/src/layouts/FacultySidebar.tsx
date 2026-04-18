import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaQuestionCircle,
  FaBook,
  FaBriefcase,
  FaGraduationCap,
  FaCog,
  FaPowerOff,
  FaTimes,
  FaBuilding,
  FaCalendar,
  FaUniversity,
} from "react-icons/fa";
import LogoutPopup from "../components/loginPageComponent/LogoutPopup";

const SideLink = ({ icon, to, children, end = false, onClick }: any) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 font-bold rounded-lg transition-colors ${
        isActive
          ? "bg-blue-700 text-white"
          : "text-black hover:bg-blue-600 hover:text-white"
      }`
    }
  >
    {icon}
    {children}
  </NavLink>
);

export default function Sidebar({ isOpen, setIsOpen }: any) {
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Faculty");
  const [role, setRole] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const location = useLocation();

  // Check if we're on home page (faculty "/faculty")
  const isHomeActive = location.pathname === "/faculty";

  useEffect(() => {
    const loadUserData = () => {
      const storedUserName = localStorage.getItem('userName');
      const storedRole = localStorage.getItem('role');
      const storedProfilePicture = localStorage.getItem('profilePicture');
      
      if (storedUserName) {
        setUserName(storedUserName);
      }
      if (storedRole) {
        setRole(storedRole);
      }
      if (storedProfilePicture) {
        setProfilePicture(storedProfilePicture);
      }
    };

    loadUserData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userName' || e.key === 'role' || e.key === 'profilePicture') {
        loadUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const handleUserUpdate = () => loadUserData();
    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-56 bg-blue-100 text-black flex flex-col justify-between transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div>
          <div className="text-center p-4 border-b border-white/40 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 md:hidden"
            >
              <FaTimes />
            </button>

            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto">
              <img
                src={profilePicture || "/college-logo.jpeg"}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="mt-2 text-lg font-semibold">{userName}</h3>
            <button className="mt-2 border border-black px-3 py-1 rounded-full text-xs hover:bg-black hover:text-white transition">
              TPO
            </button>
          </div>

          <div className="p-3 space-y-1">
            <NavLink
              to="/faculty"
              end
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 font-bold rounded-lg transition-colors ${
                  isActive || isHomeActive
                    ? "bg-blue-700 text-white"
                    : "text-black hover:bg-blue-600 hover:text-white"
                }`
              }
            >
              <FaHome />
              Home
            </NavLink>
            <SideLink to="/faculty/mcqpage" icon={<FaQuestionCircle />} onClick={() => setIsOpen(false)}>MCQ</SideLink>
            <SideLink to="/faculty/upload-notes" icon={<FaBuilding />} onClick={() => setIsOpen(false)}>Upload Notes</SideLink>
            <SideLink to="/faculty/details" icon={<FaBook />} onClick={() => setIsOpen(false)}>Student Details</SideLink>
            <SideLink to="/faculty/placements" icon={<FaGraduationCap />} onClick={() => setIsOpen(false)}>Placements</SideLink>
            <SideLink to="/faculty/job-post" icon={<FaBriefcase />} onClick={() => setIsOpen(false)}>Job Post</SideLink>
            <SideLink to="/faculty/calendar" icon={<FaCalendar />} onClick={() => setIsOpen(false)}>Calendar</SideLink>
            <SideLink to="/faculty/roadmap" icon={<FaUniversity />} onClick={() => setIsOpen(false)}>Roadmap</SideLink>
            
          </div>
        </div>

        <div className="p-4 space-y-2 border-t border-white/40">
          <SideLink to="/settings" icon={<FaCog />} onClick={() => setIsOpen(false)}>Settings</SideLink>

          <button
            onClick={() => setIsLogoutPopupOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 font-bold rounded-lg text-red-600 hover:bg-red-100"
          >
            <FaPowerOff />
            Logout
          </button>
        </div>
      </aside>

      {isLogoutPopupOpen && (
        <LogoutPopup onClose={() => setIsLogoutPopupOpen(false)} />
      )}
    </>
  );
}
