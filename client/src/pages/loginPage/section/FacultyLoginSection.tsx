import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ResetPasswordFaculty from "../../../components/loginPageComponent/ResetPasswordFaculty";

const FacultyLoginSection: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showReset, setShowReset] = useState<boolean>(false);

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

  const [mobileNumberError, setMobileNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = () => {
    let valid = true;

    if (!mobileNumber) {
      setMobileNumberError("Enter your mobile number");
      valid = false;
    } else if (mobileNumber.length !== 10) {
      setMobileNumberError("Mobile Number must be 10 digits");
      valid = false;
    } else {
      setMobileNumberError("");
    }

    if (!password) {
      setPasswordError("Enter your password");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      console.log("Login Success ", { mobileNumber, password });
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white justify-center rounded-2xl shadow-lg w-full max-w-4xl border-2 border-[#8b5e3c] mb-3 relative">
      <div className="mt-3 w-full px-6">
        <p className="text-black text-center font-bold text-3xl mb-6">
          Faculty Login
        </p>

        <div className="w-[90%] max-w-md mx-auto mb-4">
          <input
            type="number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Mobile Number"
            className={`block w-full p-2 rounded bg-white border ${
                mobileNumberError ? "border-red-500" : "border-[#8b5e3c]"
              } text-[#5a3e2b] placeholder-black focus:outline-none focus:ring-2 ${
                mobileNumberError
                  ? "focus:ring-red-500"
                  : "focus:ring-[#b77039]"
              }`}
          />
          {mobileNumberError && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <span className="w-4 h-4 flex items-center justify-center border border-red-600 rounded-full mr-2">!</span>
              {mobileNumberError}
            </p>
          )}
        </div>

        <div className="w-[90%] max-w-md mx-auto mb-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full p-2 rounded bg-white border ${
                passwordError ? "border-red-500" : "border-[#8b5e2c]"
              } text-[#5a3e2b] placeholder-black focus:outline-none focus:ring-2 ${
                passwordError ? "focus:ring-red-500" :"focus:ring-[#b77039] "
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-3 text-black cursor-pointer"
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



        <div className="flex justify-end w-[90%] max-w-md mx-auto mb-4">
          <button
            onClick={() => setShowReset(true)}
            className="text-sm text-blue-800 underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="block mx-auto w-[90%] max-w-md bg-[#8b4513] p-2 rounded mb-4 cursor-pointer text-white hover:bg-[#b77039] transition-colors duration-300"
        >
          Log in
        </button>

        {showReset && (
          <ResetPasswordFaculty onClose={() => setShowReset(false)} />
        )}
      </div>

    </div>
  );
};

export default FacultyLoginSection;
