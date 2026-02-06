import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { isValidRegisterNo } from "../../../utils/validation";

type StudentLoginSectionProps = {
    onFail: (title: string, message: string) => void;
};

const StudentLoginSection: React.FC<StudentLoginSectionProps> = ({ onFail }) => {

    const [registerNo, setRegisterNo] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    // onFail("hello", "world");

    const handleLogin = async (e: any) => {
        e.preventDefault();
        if(!isValidRegisterNo(registerNo.trim())) {
            onFail('Login Failed', 'Enter a valid register no.');
            return;
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
                <input
                type="text"
                placeholder="Register Number"
                value={registerNo}
                onChange={(e) => setRegisterNo(e.target.value)}
                className="peer w-full p-3 rounded-lg bg-white border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                />
            </div>

            <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-800 hover:shadow-lg transition cursor-pointer">
                Log In
            </button>

            <p className="text-center text-sm text-gray-500">
                New student? <span className="text-blue-600 font-medium cursor-pointer hover:underline">Create account</span>
            </p>
            
        </form>
    );
};

export default StudentLoginSection;
