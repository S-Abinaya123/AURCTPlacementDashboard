import "@fortawesome/fontawesome-free/css/all.min.css";
// import { useContext } from "react";
// import { ThemeContext } from "../context/ThemeContext";

import darkModeIcon from "../assets/icons/dark-mode.png";
import lightModeIcon from "../assets/icons/light-mode.png";

export default function Header() {
  // const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <header className="h-[60px] flex items-center justify-between px-5 border-b border-gray-300 bg-white sticky top-0 z-10 transition-colors duration-300">
      {/* Left Side Title */}
      <h2 className="m-0 text-[20px] text-[#8b5e3c] font-semibold">
        AURCT PLACEMENT DASHBOARD
      </h2>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        {/* Bell Icon */}
        <i className="fas fa-bell text-[20px] cursor-pointer text-[#8b5e3c]"></i>

        {/* Dark Mode Toggle Button */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:scale-105 transition-transform"
        >
          <img
            src={darkModeIcon}
            alt="toggle theme"
            className="w-5 h-5"
          />
        </button>
      </div>
    </header>
  );
}
