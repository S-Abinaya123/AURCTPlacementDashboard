import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";

import StudentLoginSection from "./section/StudentLoginSection";
import FacultyLoginSection from "./section/FacultyLoginSection";

import FailToast from "../../components/messages/FailToast";
import type { ToastDataType } from "../../types/messageType";

import collegeLogo from "../../assets/mainImage/college-logo.jpeg";
import CreateUserPopup from "../../components/loginPageComponent/CreateUserPopup";

const LoginPage: React.FC = () => {
    const location = useLocation();
    const redirectPath = location.state?.from?.pathname || '/student/home';

    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') || 'student';
    const [tab, setTab] = useState<'student'|'faculty'>(tabParam as any);

     useEffect(() => {
        setSearchParams({ tab });
    }, [tab]);
    useEffect(() => {
        const param = searchParams.get("tab") || "student";
        if (param !== tab) {
            setTab(param as 'student' | 'faculty');
        }
    }, [searchParams]);


  const [showFailToast, setShowFailToast] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [toastData, setToastData] = useState<ToastDataType>({
    title: "",
    message: "",
  });

  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const triggerFailToast = (title: string, message: string) => {
    setToastData({ title, message });
    setToastKey((k) => k + 1);
    setShowFailToast(true);
  };

  return (
    <div
      className="h-dvh flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage:
          'url("https://ugcounselor-content.s3.ap-south-1.amazonaws.com/wp-content/uploads/2024/10/28193100/Anna-University-Regional-Campus-Tirunelveli.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 🔥 Background overlay ONLY when popup is closed */}
      {!showCreatePopup && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      )}

      {/* 🔥 Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">
        {/* Logo */}
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
            onClick={() => setTab("student")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              tab === "student"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600"
            }`}
          >
            Student
          </button>

          <button
            onClick={() => setTab("faculty")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              tab === "faculty"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600"
            }`}
          >
            Faculty
          </button>
        </div>

        {tab === "student" ? (
          <StudentLoginSection
            onFail={triggerFailToast}
            onCreateAccount={() => setShowCreatePopup(true)}
          />
        ) : (
          <FacultyLoginSection onFail={triggerFailToast} redirectPath={redirectPath} />
        )}
      </div>

      {/* 🔥 Popup */}
      {showCreatePopup && (
        <CreateUserPopup onClose={() => setShowCreatePopup(false)} />
      )}

      {/* 🔥 Toast */}
      <FailToast
        key={toastKey}
        title={toastData.title}
        message={toastData.message}
        show={showFailToast}
        onClose={() => setShowFailToast(false)}
      />
    </div>
  );
};

export default LoginPage;
