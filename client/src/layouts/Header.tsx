import "@fortawesome/fontawesome-free/css/all.min.css";
import darkModeIcon from "../assets/icons/dark-mode.png";

export default function Header({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
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

        <h2 className="text-[15px] md:text-[24px] font-extrabold tracking-wide 
               text-blue-800">
  EDUGROW
  <span className="text-blue-500"> – (SMART STUDENT COMPANION)</span>
</h2>

      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <i className="fas fa-bell text-[20px] cursor-pointer text-blue-600"></i>

        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:scale-105 transition">
          <img src={darkModeIcon} alt="toggle theme" className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
