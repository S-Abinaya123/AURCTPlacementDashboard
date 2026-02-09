import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { isValidMobileNo } from "../../../utils/validation";
import { authService } from "../../../service/auth.service";
import LoginLoading from "../../../components/loadingComponent/loginPageLoading/LoginLoading";

type FacultyLoginSectionProps = {
    onFail: (title: string, message: string) => void;
    redirectPath: string;
};

const FacultyLoginSection: React.FC<FacultyLoginSectionProps> = ({ onFail, redirectPath }) => {
    const navigate = useNavigate();

    const [mobileNo, setMobileNo] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');

    const [loginLoading, setLoginLoading] = useState<boolean>(false);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        if(!isValidMobileNo(mobileNo.trim())) {
            onFail('Login Failed', 'Enter a valid mobile no.');
            return;
        }
        else if(!password.trim()) {
            onFail('Login Failed', 'Enter your password.');
            return;
        }
        try {
            setLoginLoading(true);
            const response = await authService.login({
                mobileNo: mobileNo.trim(),
                password: password.trim(),
                role: 'FACULTY'
            });
            const data = response.data.data;
            setLoginLoading(false);
            if(response.status === 200) {
                localStorage.setItem('Token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('profilePicture', data.profilePicture);
                localStorage.setItem('userName', data.userName);
                localStorage.setItem('role', data.role);
                navigate(redirectPath || '/faculty/home');
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
    }

  return (
    <form onSubmit={handleLogin} className="space-y-5">

      <div className="relative">
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
        />

      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="peer w-full p-3 pr-12 rounded-lg bg-white border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div className="text-right">
        <button className="text-sm text-blue-600 hover:underline cursor-pointer">
          Forgot Password?
        </button>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-800 hover:shadow-lg transition cursor-pointer">
        Log In
      </button>
      { loginLoading && <LoginLoading /> }
    </form>
  );
};

export default FacultyLoginSection;
