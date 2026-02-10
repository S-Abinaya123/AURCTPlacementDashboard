import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Overlay (mobile only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex flex-col min-h-screen md:ml-56">
        <Header onMenuClick={toggleSidebar} />

        <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
