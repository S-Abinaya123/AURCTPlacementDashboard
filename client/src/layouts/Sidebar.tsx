import React from "react";
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
} from "react-icons/fa";

// ✅ Reusable Sidebar Link Component
const SideLink = ({
  icon,
  to,
  children,
}: {
  icon: React.ReactNode;
  to: string;
  children: React.ReactNode;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 font-bold rounded-lg border-b-2 border-white transition-colors
       ${isActive ? "bg-[#e4ac74] text-black" : "text-black hover:bg-[#e4ac74]"}`
    }
  >
    {icon}
    {children}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-orange-200/80 text-black flex flex-col justify-between overflow-y-auto">
      {/* Top Section */}
      <div>
        {/* Profile Section */}
        <div className="text-center p-4 border-b border-white/30">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto">
            <img
              src="https://res.cloudinary.com/djbmyn0fw/image/upload/v1752897230/default-profile_n6tn9o.jpg"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="mt-2 text-lg font-semibold">Hi Candidate</h3>
          <button className="mt-2 border border-black text-black px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-black hover:text-white transition">
            9500
          </button>
        </div>

        {/* Nav Links */}
        <div className="p-3 space-y-1">
          <SideLink to="/" icon={<FaHome />}>Home</SideLink>
          <SideLink to="/topics" icon={<FaQuestionCircle />}>MCQ</SideLink>
          <SideLink to="/resources" icon={<FaBook />}>Resources</SideLink>
          <SideLink to="/job-post" icon={<FaBriefcase />}>Job Post</SideLink>
          <SideLink to="/calendar" icon={<FaCalendar />}>Calendar</SideLink>
          <SideLink to="/placement" icon={<FaGraduationCap />}>Placement</SideLink>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-2 border-t border-white/30">
        <SideLink to="/settings" icon={<FaCog />}>
          Settings
        </SideLink>
        <button className="w-full flex items-center gap-2 px-3 py-2 font-bold rounded-lg text-red-600 hover:bg-red-100 transition-colors">
          <FaPowerOff />
          Logout
        </button>
      </div>
    </aside>
  );
}
