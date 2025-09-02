import React from "react";
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

// ✅ Reusable NavLink Component
const NavLink = ({
  icon,
  children,
  href = "#",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
}) => (
  <a
    href={href}
    className="flex items-center gap-2 px-3 py-2 font-bold text-black rounded-lg border-b-2 border-white hover:bg-[#e4ac74] transition-colors"
  >
    {icon}
    {children}
  </a>
);

export default function Sidebar() {
  return (
    <aside className="w-56  bg-orange-200/80 text-black flex flex-col justify-between">
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

        {/* Links */}
        <div className="p-3 space-y-1">
          <NavLink icon={<FaHome />}>Home</NavLink>
          <NavLink icon={<FaQuestionCircle />}>Quiz</NavLink>
          <NavLink icon={<FaBook />}>Resources</NavLink>
          <NavLink icon={<FaBriefcase />}>Job Post</NavLink>
          <NavLink icon={<FaCalendar />}>Calendar</NavLink>
          <NavLink icon={<FaGraduationCap />}>Placement</NavLink>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="p-4 space-y-2">
        <a
          href="#"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#e4ac74] transition-colors"
        >
          <FaCog />
          Settings
        </a>
        <a
          href="#"
          className="flex items-center gap-2 px-3 py-2 font-bold rounded-lg text-red-600 hover:bg-red-100 transition-colors"
        >
          <FaPowerOff />
          Logout
        </a>
      </div>
    </aside>
  );
}
