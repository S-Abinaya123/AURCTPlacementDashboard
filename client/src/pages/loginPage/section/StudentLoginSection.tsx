import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CreateUserPopup from "../../../components/loginPageComponent/CreateUserPopup";
import ResetPasswordPopup from "../../../components/loginPageComponent/ResetPasswordPopup";

const StudentLoginSection: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const [registerNumberError, setRegisterNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ✅ Validation
  const handleLogin = () => {
    let valid = true;

    if (!registerNumber) {
      setRegisterNumberError("Enter the register number");
      valid = false;
    } else if (registerNumber.length !== 12) {
      setRegisterNumberError("Register Number must be 12 digits");
      valid = false;
    } else {
      setRegisterNumberError("");
    }

    if (!password) {
      setPasswordError("Enter the password");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      console.log("Login Success", { registerNumber, password });
    }
  };

  return (
    <div className="relative">
      {/* Login Box */}
      <div className="flex flex-col md:flex-row bg-white justify-center rounded-2xl shadow-lg w-full max-w-4xl border-2 border-[#8b5e3c] mb-3 mx-auto">
        <div className="mt-3 w-full px-6">
          <p className="text-black text-center font-bold text-3xl mb-6">
            Student Login
          </p>

          {/* Register Number */}
          <div className="w-[90%] max-w-md mx-auto mb-3">
            <input
              type="number"
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
              placeholder="Register Number"
              className={`block w-full p-2 rounded bg-white border ${
                registerNumberError ? "border-red-500" : "border-[#8b5e3c]"
              } text-[#5a3e2b] placeholder-black focus:outline-none focus:ring-2 ${
                registerNumberError
                  ? "focus:ring-red-500"
                  : "focus:ring-[#b77039]"
              }`}
            />
            {registerNumberError && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <span className="w-4 h-4 flex items-center justify-center border border-red-600 rounded-full mr-2">!</span>
                {registerNumberError}
              </p>
            )}
          </div>

          {/* Password + Eye */}
          <div className="w-[90%] max-w-md mx-auto mb-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full p-2 rounded bg-white border ${
                  passwordError ? "border-red-500" : "border-[#8b5e2c]"
                } text-[#5a3e2b] placeholder-black focus:outline-none focus:ring-2 ${
                  passwordError ? "focus:ring-red-500" : "focus:ring-[#b77039]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <span className="w-4 h-4 flex items-center justify-center border border-red-600 rounded-full mr-2">!</span>
                {passwordError}
              </p>
            )}
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
          <button
            onClick={handleLogin}
            className="block mx-auto w-[90%] max-w-md bg-[#8b4513] p-2 rounded mb-4 cursor-pointer text-white hover:bg-[#b77039] transition-colors duration-300"
          >
            Log in
          </button>

          {/* New User Link */}
          <p className="text-[#5a3e2b] mb-6 text-center">
            <button
              className="text-blue-800 underline cursor-pointer"
              onClick={() => setIsNewUser(true)}
            >
              New User?
            </button>
          </p>
        </div>
      </div>

      {/* Create User Popup */}
      {isNewUser && <CreateUserPopup onClose={() => setIsNewUser(false)} />}

      {/* Reset Password Popup */}
      {showReset && <ResetPasswordPopup onClose={() => setShowReset(false)} />}
    </div>
  );
};

export default StudentLoginSection;
