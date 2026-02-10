import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
} from "react-icons/fa";
import LogoutPopup from "../components/loginPageComponent/LogoutPopup";

const SideLink = ({ icon, to, children, end = false, onClick }: any) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 font-semibold rounded-lg transition-colors
      ${isActive ? "bg-blue-600 text-white" : "text-white hover:bg-blue-600"}`
    }
  >
    {icon}
    {children}
  </NavLink>
);

export default function Sidebar({ isOpen, setIsOpen }: any) {
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

  return (
    <>
      {/* OVERLAY (MOBILE ONLY) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-56 bg-blue-500 text-white flex flex-col justify-between overflow-y-auto shadow-lg z-50
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* HEADER */}
        <div>
          <div className="flex justify-between items-center py-6 px-4 border-b border-white/20">
            <div>
              <h3 className="text-xl font-bold">Faculty Name</h3>
              <p className="text-sm">AURCT</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="md:hidden">
              <FaTimes />
            </button>
          </div>

          {/* LINKS */}
          <div className="p-3 space-y-2">
            <SideLink to="/faculty" end icon={<FaHome />} onClick={() => setIsOpen(false)}>Home</SideLink>
            <SideLink to="/faculty/mcqpage" icon={<FaQuestionCircle />} onClick={() => setIsOpen(false)}>MCQ</SideLink>
            <SideLink to="/faculty/uploadnotes" icon={<FaBuilding />} onClick={() => setIsOpen(false)}>Upload Notes</SideLink>
            <SideLink to="/faculty/details" icon={<FaBook />} onClick={() => setIsOpen(false)}>Student Details</SideLink>
            <SideLink to="/faculty/job-post" icon={<FaBriefcase />} onClick={() => setIsOpen(false)}>Job Post</SideLink>
            <SideLink to="/faculty/placement" icon={<FaGraduationCap />} onClick={() => setIsOpen(false)}>Placement</SideLink>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/20 space-y-2">
          <SideLink to="/settings" icon={<FaCog />} onClick={() => setIsOpen(false)}>Settings</SideLink>

          <button
            onClick={() => setIsLogoutPopupOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-lg text-red-200 hover:bg-red-600"
          >
            <FaPowerOff /> Logout
          </button>
        </div>
      </aside>

      {isLogoutPopupOpen && <LogoutPopup onClose={() => setIsLogoutPopupOpen(false)} />}
    </>
  );
}
