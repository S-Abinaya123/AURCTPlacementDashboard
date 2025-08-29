import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ResetPasswordFaculty from "../../../components/loginPageComponent/ResetPasswordFaculty";

const FacultyLoginSection: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showReset, setShowReset] = useState<boolean>(false); // ✅ added state for popup

  return (
    <div className="flex flex-col md:flex-row bg-white justify-center rounded-2xl shadow-lg w-full max-w-4xl border-2 border-[#8b5e3c] mb-3 relative">
      <div className="mt-3 w-full px-6">
        <p className="text-black text-center font-bold text-3xl mb-6">
          Faculty Login
        </p>

        {/* Mobile Number */}
        <input
          type="tel"
          placeholder="Mobile Number"
          pattern="[0-9]{10}"
          className="block mx-auto w-[90%] max-w-md p-2 rounded mb-4 bg-white border border-[#8b5e3c] 
                     text-[#5a3e2b] placeholder-black 
                     focus:outline-none focus:ring-2 focus:ring-[#b77039]
                     appearance-none"
          required
        />

        {/* Password Field + Eye */}
        <div className="relative mb-1 w-[90%] max-w-md mx-auto">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full p-2 rounded bg-white border border-[#8b5e2c] 
                       text-[#5a3e2b] placeholder-black 
                       focus:outline-none focus:ring-2 focus:ring-[#b77039]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-3 text-black cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end w-[90%] max-w-md mx-auto mb-4">
          <button
            onClick={() => setShowReset(true)}
            className="text-sm text-blue-800 underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button className="block mx-auto w-[90%] max-w-md bg-[#8b4513] p-2 rounded mb-4 cursor-pointer text-white hover:bg-[#b77039] transition-colors duration-300">
          Log in
        </button>

        {/* Popup */}
        {showReset && <ResetPasswordFaculty onClose={() => setShowReset(false)} />}
      </div>
    </div>
  );
};

export default FacultyLoginSection;
