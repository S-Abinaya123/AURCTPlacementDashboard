import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { isValidRegisterNo } from "../../../utils/validation";
import { authService } from "../../../service/auth.service";
import LoginLoading from "../../../components/loadingComponent/loginPageLoading/LoginLoading";

import CreateUserPopup from "../../../components/loginPageComponent/CreateUserPopup";

type Props = {
    onFail: (title: string, message: string) => void;
    redirectPath: string;  
};

const StudentLoginSection: React.FC<Props> = ({
  onFail,
  redirectPath
}) => {
    const navigate = useNavigate();

    const [loginLoading, setLoginLoading] = useState<boolean>(false);

    const [showCreatePopup, setShowCreatePopup] = useState<boolean>(false);

  const [registerNo, setRegisterNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidRegisterNo(registerNo.trim())) {
            onFail("Login Failed", "Enter a valid register number.");
            return;
        }

        if (!password.trim()) {
            onFail("Login Failed", "Enter your password.");
            return;
        }
        try {
            setLoginLoading(true);
            const response = await authService.login({
                registerNo: registerNo.trim(),
                password: password.trim(),
                role: 'STUDENT'
            });
            const data = response.data.data;
            setLoginLoading(false);
            if(response.status === 200) {
                localStorage.setItem('Token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('profilePicture', data.profilePicture);
                localStorage.setItem('userName', data.userName);
                localStorage.setItem('role', data.role);
                navigate(redirectPath || '/student/home');
            }
        }
        catch(err: any) {
            setLoginLoading(false);
            if (err.response) {
            if (err.response.status === 401) {
                onFail("Invalid credentials", "Check your credentials");
            } else {
                onFail(
                "Login Failed",
                err.response.data?.message || "Something went wrong"
                );
            }
            } else {
            // Network / CORS / server down
            onFail("Network Error", "Please try again later");
            }
        }
        finally { setLoginLoading(false); }
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
          onClick={() => setShowCreatePopup(true)}
          className="text-blue-600 font-medium cursor-pointer hover:underline"
        >
          Create account
        </span>
      </p>
      { loginLoading && <LoginLoading /> }

      {showCreatePopup && (
        <CreateUserPopup onFail={onFail} onClose={() => setShowCreatePopup(false)} />
      )}
    </form>
  );
};

export default StudentLoginSection;
