import { FaBars } from "react-icons/fa";
import darkModeIcon from "../assets/icons/dark-mode.png";

export default function Header({ onMenuClick }: any) {
  return (
    <header className="h-[56px] flex items-center justify-between px-4 border-b bg-white sticky top-0 z-30">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-blue-500 text-xl"
        >
          <FaBars />
        </button>

        <h2 className="text-[20px] md:text-[24px] font-extrabold tracking-wide 
               text-blue-800">
  EDUGROW - 
  <span className="text-blue-500">(SMART STUDENT COMPANION)</span>
</h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <i className="fas fa-bell text-[18px] cursor-pointer text-blue-500"></i>

        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
          <img src={darkModeIcon} alt="theme" className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
