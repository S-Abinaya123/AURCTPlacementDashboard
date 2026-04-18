import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { isValidMobileNo } from "../../../utils/validation";
import { authService } from "../../../service/auth.service";
import LoginLoading from "../../../components/loadingComponent/loginPageLoading/LoginLoading";
import FacultyResetPassword from "../../../components/loginPageComponent/FacultyResetPassword";

type FacultyLoginSectionProps = {
  onFail: (title: string, message: string) => void;
  onSuccess: (title: string, message: string) => void;
  redirectPath: string;
};

const FacultyLoginSection: React.FC<FacultyLoginSectionProps> = ({
  onFail,
  onSuccess,
  redirectPath,
}) => {
  const navigate = useNavigate();

  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // ✅ LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMobile = mobileNo.trim();
    const trimmedPassword = password.trim();

    // validation
    if (!isValidMobileNo(trimmedMobile)) {
      onFail("Login Failed", "Enter a valid mobile number.");
      return;
    }

    if (!trimmedPassword) {
      onFail("Login Failed", "Enter your password.");
      return;
    }

    try {
      setLoginLoading(true);

      const response = await authService.login({
        mobileNo: trimmedMobile,
        password: trimmedPassword,
        role: "FACULTY",
      });

      // ✅ SUCCESS CHECK
      if (
        response?.status === 200 &&
        response?.data?.status === "SUCCESS"
      ) {
        // Auth service now handles storing all user data
        window.dispatchEvent(new Event("userUpdated"));

        // redirect to faculty dashboard
        navigate("/faculty");
      } else {
        onFail(
          "Login Failed",
          response?.data?.message || "Invalid credentials"
        );
      }
    } catch (err: any) {
      console.error("LOGIN ERROR:", err?.response?.data || err);

      if (err?.response?.status === 401) {
        onFail("Invalid credentials", "Check your mobile number or password");
      } else if (err?.response) {
        onFail(
          "Login Failed",
          err.response.data?.message || "Server error"
        );
      } else {
        onFail("Network Error", "Server not reachable");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {/* MOBILE INPUT */}
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobileNo}
        onChange={(e) => setMobileNo(e.target.value)}
        className="w-full p-3 rounded-lg bg-white border border-gray-300"
      />

      {/* PASSWORD INPUT */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 pr-12 rounded-lg bg-white border border-gray-300"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {/* LOGIN BUTTON */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
      >
        Log In
      </button>

      {/* Reset Password */}
      <p className="text-center text-sm text-gray-500">
        Forgot your password?{" "}
        <span
          onClick={() => setShowResetPassword(true)}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          Reset password
        </span>
      </p>

      {loginLoading && <LoginLoading />}

      {showResetPassword && (
        <FacultyResetPassword
          onClose={() => setShowResetPassword(false)}
          onSuccess={onSuccess}
        />
      )}
    </form>
  );
};

export default FacultyLoginSection;