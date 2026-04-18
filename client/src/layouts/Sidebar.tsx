import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaQuestionCircle,
  FaBook,
  FaCalendar,
  FaCog,
  FaPowerOff,
  FaUniversity,
} from "react-icons/fa";
import LogoutPopup from "../components/loginPageComponent/LogoutPopup";

const SideLink = ({
  icon,
  to,
  children,
  onClick,
}: {
  icon: React.ReactNode;
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <NavLink
    to={to}
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

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Candidate");
  const [registerNo, setRegisterNo] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const location = useLocation();

  // Check if we're on any MCQ-related page
  const isMcqActive = location.pathname.startsWith("/student/topics") || 
                      location.pathname.startsWith("/student/exam") || 
                      location.pathname.startsWith("/student/result");

  // Check if we're on home page (root "/" or student "/student")
  const isHomeActive = location.pathname === "/" || location.pathname === "/student";

  useEffect(() => {
    const loadUserData = () => {
      const storedUserName = localStorage.getItem('userName');
      const storedRegisterNo = localStorage.getItem('registerNo');
      const storedProfilePicture = localStorage.getItem('profilePicture');
      
      if (storedUserName) {
        setUserName(storedUserName);
      }
      if (storedRegisterNo) {
        setRegisterNo(storedRegisterNo);
      }
      if (storedProfilePicture) {
        setProfilePicture(storedProfilePicture);
      }
    };

    loadUserData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userName' || e.key === 'registerNo' || e.key === 'profilePicture') {
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
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-56 bg-blue-100 text-black flex flex-col justify-between transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div>
          <div className="text-center p-4 border-b border-white/40">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto">
              <img
                src={profilePicture || "https://res.cloudinary.com/djbmyn0fw/image/upload/v1752897230/default-profile_n6tn9o.jpg"}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-2 text-lg font-semibold">Hi {userName}</h3>
            <button className="mt-2 border border-black px-3 py-1 rounded-full text-xs hover:bg-black hover:text-white transition">
              {registerNo || "Candidate"}
            </button>
          </div>

          <div className="p-3 space-y-1">
            <NavLink
              to="/"
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2 font-bold rounded-lg transition-colors ${
                isHomeActive
                  ? "bg-blue-700 text-white"
                  : "text-black hover:bg-blue-600 hover:text-white"
              }`}
            >
              <FaHome />
              Home
            </NavLink>
            <NavLink
              to="/student/topics"
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2 font-bold rounded-lg transition-colors ${
                isMcqActive
                  ? "bg-blue-700 text-white"
                  : "text-black hover:bg-blue-600 hover:text-white"
              }`}
            >
              <FaQuestionCircle />
              MCQ
            </NavLink>
            <SideLink to="/student/resources" icon={<FaBook />} onClick={onClose}>
              Resources
            </SideLink>
            <SideLink to="/student/calendar" icon={<FaCalendar />} onClick={onClose}>
              Calendar
            </SideLink>
            <SideLink to="/student/roadmap" icon={<FaUniversity />} onClick={onClose}>
              Company Roadmap
            </SideLink>
          </div>
        </div>

        <div className="p-4 space-y-2 border-t border-white/40">
          <SideLink to="/settings" icon={<FaCog />} onClick={onClose}>
            Settings
          </SideLink>

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
