// MainLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar fixed */}
      <Sidebar />

      {/* Main content shifted right */}
      <div className="flex-1 flex flex-col ml-56">
        <Header />
        <main className="flex-1 p-5 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
