import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaQuestionCircle,
  FaBook,
  FaBriefcase,
  FaCalendar,
  FaGraduationCap,
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
      `flex items-center gap-2 px-3 py-2 font-bold rounded-lg transition-colors
       ${
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

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-56 bg-blue-100 text-black flex flex-col justify-between
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Top */}
        <div>
          {/* Profile */}
          <div className="text-center p-4 border-b border-white/40">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto">
              <img
                src="https://res.cloudinary.com/djbmyn0fw/image/upload/v1752897230/default-profile_n6tn9o.jpg"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-2 text-lg font-semibold">Hi Candidate</h3>
            <button className="mt-2 border border-black px-3 py-1 rounded-full text-xs hover:bg-black hover:text-white transition">
              9500
            </button>
          </div>

          {/* Links */}
          <div className="p-3 space-y-1">
            <SideLink to="/" icon={<FaHome />} onClick={onClose}>
              Home
            </SideLink>
            <SideLink to="/topics" icon={<FaQuestionCircle />} onClick={onClose}>
              MCQ
            </SideLink>
            <SideLink to="/resources" icon={<FaBook />} onClick={onClose}>
              Resources
            </SideLink>
            <SideLink to="/job-post" icon={<FaBriefcase />} onClick={onClose}>
              Job Post
            </SideLink>
            <SideLink to="/calendar" icon={<FaCalendar />} onClick={onClose}>
              Calendar
            </SideLink>
            <SideLink to="/placement" icon={<FaGraduationCap />} onClick={onClose}>
              Placement
            </SideLink>
             <SideLink to="/roadmap" icon={<FaUniversity />} onClick={onClose}>
              Roadmap
            </SideLink>
          </div>
        </div>

        {/* Bottom */}
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
