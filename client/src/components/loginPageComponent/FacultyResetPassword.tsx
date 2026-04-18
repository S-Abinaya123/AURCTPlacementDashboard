import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authService } from "../../service/auth.service";
import ResetLinkLoading from "../loadingComponent/loginPageLoading/ResetLinkLoading";
import VerifyOtpLoading from "../loadingComponent/loginPageLoading/VerifyOtpLoading";

type Props = {
  onClose: () => void;
  onSuccess: (title: string, message: string) => void;
  onFail?: (title: string, message: string) => void;
};

type Step = "email" | "otp" | "password";

const FacultyResetPassword: React.FC<Props> = ({ onClose, onSuccess, onFail }) => {
  const [step, setStep] = useState<Step>("email");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle request OTP
  const handleRequestOtp = async () => {
    if (!mobileNo.trim()) {
      setError("Please enter your mobile number");
      return;
    }

    if (mobileNo.trim().length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await authService.requestPasswordReset({
        mobileNo: mobileNo.trim(),
        role: "FACULTY",
      });

      if (response.data.status === "SUCCESS") {
        setEmail(response.data.data.email);
        setStep("otp");
        onSuccess("OTP Sent", "Please check your email for the OTP");
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await authService.verifyOtp({
        mobileNo: mobileNo.trim(),
        role: "FACULTY",
        otp: otp.trim(),
      });

      if (response.data.status === "SUCCESS") {
        setStep("password");
      } else {
        setError(response.data.message || "Invalid OTP");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async () => {
    // Validation
    if (!password) {
      setError("Please enter a new password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await authService.resetPassword(password);

      if (response.data.status === "SUCCESS") {
        onSuccess("Password Reset", "Your password has been reset successfully. Please login with your new password.");
        onClose();
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn z-50"
      onClick={onClose}
    >
      <div
        className="relative w-[420px] max-w-[90%] bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-3xl p-6 text-center border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <span
          onClick={onClose}
          className="absolute top-4 right-6 text-2xl text-gray-400 cursor-pointer hover:text-gray-700 transition"
        >
          &times;
        </span>

        {/* Title */}
        <h2 className="text-2xl font-extrabold mb-2 tracking-wide text-gray-800">
          Reset Password
        </h2>

        {/* Step 1: Mobile Input */}
        {step === "email" && (
          <>
            <p className="text-sm mb-6 text-gray-500">
              Enter your Mobile Number to receive OTP
            </p>

            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNo}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setMobileNo(val);
                setError("");
              }}
              className="block w-[90%] mx-auto mb-4 px-4 py-3 text-base border border-gray-200 rounded-lg outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white shadow-sm"
            />

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <div className="flex justify-center gap-5">
              <button
                onClick={onClose}
                className="w-[120px] py-2.5 rounded-lg text-sm font-medium tracking-wide bg-gradient-to-r from-red-400 to-red-600 text-white shadow-md transition transform hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleRequestOtp}
                disabled={loading}
                className="w-[120px] py-2.5 rounded-lg text-sm font-medium tracking-wide bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md transition transform hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </>
        )}

        {/* Step 2: OTP Input */}
        {step === "otp" && (
          <>
            <p className="text-sm mb-2 text-gray-500">
              Enter the OTP sent to your email
            </p>
            <p className="text-xs mb-4 text-gray-400">
              {email}
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(val);
                setError("");
              }}
              className="block w-[90%] mx-auto mb-4 px-4 py-3 text-base border border-gray-200 rounded-lg outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white shadow-sm text-center text-lg letter-spacing-4"
            />

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <div className="flex justify-center gap-5">
              <button
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                }}
                className="w-[120px] py-2.5 rounded-lg text-sm font-medium tracking-wide bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md transition transform hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-[120px] py-2.5 rounded-lg text-sm font-medium tracking-wide bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md transition transform hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </>
        )}

        {/* Step 3: New Password */}
        {step === "password" && (
          <>
            <p className="text-sm mb-4 text-gray-500">
              Create your new password
            </p>

            <div className="relative w-[90%] mx-auto mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white shadow-sm pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative w-[90%] mx-auto mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white shadow-sm pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-2 w-[90%] mx-auto text-left">
              Password must be at least 8 characters
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <div className="flex justify-center gap-5">
              <button
                onClick={() => {
                  setStep("otp");
                  setPassword("");
                  setConfirmPassword("");
                  setError("");
                }}
                className="w-[120px] py-2.5 rounded-lg text-sm font-medium tracking-wide bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md transition transform hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={handleResetPassword}
                disabled={loading || !password || !confirmPassword}
                className="w-[120px] py-2.5 rounded-lg text-sm font-medium tracking-wide bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md transition transform hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </>
        )}

        {loading && step === "email" && <ResetLinkLoading />}
        {(loading && (step === "otp" || step === "password")) && <VerifyOtpLoading />}
      </div>
    </div>
  );
};

export default FacultyResetPassword;
