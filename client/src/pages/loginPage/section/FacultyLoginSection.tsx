import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FacultyLoginSection: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-5">

      <div className="relative">
        <input
          type="tel"
          placeholder="Mobile Number"
          className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
        />

      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="peer w-full p-3 rounded-lg bg-white border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          type="button"
          className="absolute right-3 top-3 text-gray-500 cursor-pointer"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div className="text-right">
        <button className="text-sm text-blue-600 hover:underline cursor-pointer">
          Forgot Password?
        </button>
      </div>

      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-800 hover:shadow-lg transition cursor-pointer">
        Log In
      </button>
    </div>
  );
};

export default FacultyLoginSection;
