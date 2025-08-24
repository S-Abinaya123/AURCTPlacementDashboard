import React, { useState } from "react";
import StudentLoginSection from "./section/StudentLoginSection";
import FacultyLoginSection from "./section/FacultyLoginSection";
import collegeLogo from "../../assets/mainImage/college-logo.jpeg"



const LoginPage: React.FC = () => {
  const[activeTab,setActiveTab] = useState<"Student"|"Faculty">("Student");
return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
      <div className="flex flex-col md:flex-row bg-[#fffaf0] rounded-2xl shadow-lg w-full max-w-4xl border-2 border-[#8b5e3c]">

        <div className=" md:flex w-full md:w-1/2 p-8 bg-[#8b5e3c] items-center justify-center rounded-xl text-white">
          <div className="text-center space-y-4">
            <h1 className="text-2xl md:text-2xl font-extrabold tracking-tight drop-shadow-md ">
              Anna University Regional campus Tirunelveli
            </h1>
            <div className="flex justify-center mb-4">
              <img
                src={collegeLogo}
                alt="college-logo"
                className="rounded-full object-cover w-28 h-28 md:w-40 md:h-40 "
              />
            </div>
            <h1 className="text-2xl md:text-2xl font-extrabold tracking-tight drop-shadow-md">
              Welcome to the <br /> Placement Training Portal
            </h1>
            <p className="text-lg md:text-xl font-medium mt-2">
              Your gateway to a successful career.
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8 text-[#5a3e2b] flex flex-col bg-white rounded-2xl">
          <div className="grid grid-cols-2 gap-4 text-2l font-bold mb-5">
            <button className={`py-2 px-4 rounded-xl hover:bg-[#8b4513] transition-colors duration-300 ${
              activeTab === "Student" ? "bg-[#b77039] text-white":"bg-gray-200 text-[#5a3e2b]"}`}
              onClick={()=> setActiveTab("Student")}
            >Student</button>
            <button className={`py-2 px-4 rounded-xl hover:bg-[#8b4513] transition-colors duration-300 ${
              activeTab === "Faculty" ? "bg-[#b77039] text-white" : "bg-gray-200 text-[#5a3e2b]"}`}
              onClick={()=>setActiveTab("Faculty")}
            >Faculty</button>
        </div>
        {activeTab === "Student" ?
         <StudentLoginSection/> : <FacultyLoginSection/>}
        </div>

    </div>
    </div>
       
  );
};

export default LoginPage;
