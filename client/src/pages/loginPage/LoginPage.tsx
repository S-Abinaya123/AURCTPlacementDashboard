import React, { useState } from "react";
import StudentLoginSection from "./section/StudentLoginSection";
import FacultyLoginSection from "./section/FacultyLoginSection";

import FailToast from '../../components/messages/FailToast';
import type { ToastDataType } from "../../types/messageType";

import collegeLogo from "../../assets/mainImage/college-logo.jpeg";

const LoginPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"Student" | "Faculty">("Student");

    const [showFailToast, setShowFailToast] = useState<boolean>(false);
    const [toastKey, setToastKey] = useState(0);
    const [toastData, setToastData] = useState<ToastDataType>({
        title: '',
        message: ''
    });
    const triggerFailToast = (title: string, message: string) => {
        setToastData({ title, message });
        setToastKey((k) => k + 1); // 🔥 force remount
        setShowFailToast(true);
    };

  return (
    <div
      className="h-dvh flex items-center justify-center p-4 relative"
      style={{
        backgroundImage:
          'url("https://ugcounselor-content.s3.ap-south-1.amazonaws.com/wp-content/uploads/2024/10/28193100/Anna-University-Regional-Campus-Tirunelveli.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* 🔥 Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

      {/* 🔥 Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">
        
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <img
            src={collegeLogo}
            alt="logo"
            className="w-20 h-20 mx-auto rounded-full shadow-md mb-4 border-2 border-white"
          />
          <h1 className="text-xl font-bold text-gray-800">
            Anna University - Tirunelveli
          </h1>
          <p className="text-sm text-gray-600">
            Training & Placement Portal
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          <button
            onClick={() => setActiveTab("Student")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
              activeTab === "Student"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveTab("Faculty")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
              activeTab === "Faculty"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600"
            }`}
          >
            Faculty
          </button>
        </div>

        {activeTab === "Student" ? (
          <StudentLoginSection onFail={triggerFailToast} />
        ) : (
          <FacultyLoginSection />
        )}
      </div>

      <FailToast key={toastKey} title={toastData.title} message={toastData.message} show={showFailToast} onClose={() => setShowFailToast(false)} />
    </div>
  );
};

export default LoginPage;
