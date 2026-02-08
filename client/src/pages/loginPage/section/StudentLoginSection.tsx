import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { isValidRegisterNo } from "../../../utils/validation";

type Props = {
  onFail: (title: string, message: string) => void;
  onCreateAccount: () => void;
};

const StudentLoginSection: React.FC<Props> = ({
  onFail,
  onCreateAccount,
}) => {
  const [registerNo, setRegisterNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidRegisterNo(registerNo.trim())) {
      onFail("Login Failed", "Enter a valid register number.");
      return;
    }

    if (!password.trim()) {
      onFail("Login Failed", "Enter your password.");
      return;
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <input
        type="text"
        placeholder="Register Number"
        value={registerNo}
        onChange={(e) => setRegisterNo(e.target.value)}
        className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div className="text-right">
        <button className="text-sm text-blue-600 hover:underline cursor-pointer">
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Log In
      </button>

      <p className="text-center text-sm text-gray-500">
        New student?{" "}
        <span
          onClick={onCreateAccount}
          className="text-blue-600 font-medium cursor-pointer hover:underline"
        >
          Create account
        </span>
      </p>
    </form>
  );
};

export default StudentLoginSection;
