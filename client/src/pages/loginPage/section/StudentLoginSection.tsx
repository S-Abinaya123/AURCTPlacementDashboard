import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { isValidRegisterNo } from "../../../utils/validation";
import { authService } from "../../../service/auth.service";
import LoginLoading from "../../../components/loadingComponent/loginPageLoading/LoginLoading";
import StudentResetPassword from "../../../components/loginPageComponent/StudentResetPassword";

type Props = {
  onFail: (title: string, message: string) => void;
  onSuccess: (title: string, message: string) => void;
  redirectPath: string;
};

const StudentLoginSection: React.FC<Props> = ({
  onFail,
  onSuccess,
  redirectPath,
}) => {
  const navigate = useNavigate();

  const [registerNo, setRegisterNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const regNo = registerNo.trim();
    const pwd = password.trim();

    if (!isValidRegisterNo(regNo)) {
      onFail("Login Failed", "Enter a valid register number.");
      return;
    }

    if (!pwd) {
      onFail("Login Failed", "Enter your password.");
      return;
    }

    try {
      setLoginLoading(true);

      const response = await authService.login({
        registerNo: regNo,
        password: pwd,
        role: "STUDENT",
      });

      if (
        response.status === 200 &&
        response.data.status === "SUCCESS"
      ) {
        // Auth service now handles storing all user data
        window.dispatchEvent(new Event("userUpdated"));

        // Navigate to student dashboard
        navigate("/student");
      } else {
        onFail(
          "Login Failed",
          response.data.message || "Invalid credentials"
        );
      }
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 401) {
        onFail("Invalid Credentials", "Check register number or password");
      } else if (err.response) {
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
      {/* Register Number */}
      <input
        type="text"
        placeholder="Register Number"
        value={registerNo}
        onChange={(e) => setRegisterNo(e.target.value)}
        className="w-full p-3 rounded-lg bg-white border border-gray-300"
      />

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-white border border-gray-300"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-800"
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
        <StudentResetPassword
          onClose={() => setShowResetPassword(false)}
          onSuccess={onSuccess}
        />
      )}
    </form>
  );
};

export default StudentLoginSection;