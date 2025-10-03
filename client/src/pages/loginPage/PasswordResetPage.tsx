import { useState } from "react";
import collegeLogo from "../../assets/mainImage/college-logo.jpeg";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [strengthError, setStrengthError] = useState<string>("");
  const [mismatchError, setMismatchError] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");


  const togglePassword = (field: "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.id]: e.target.value });
};



  const isStrongPassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStrengthError("");
    setMismatchError("");

    if (!formData.newPassword ) {
      setNewPassword("Enter the new password");
    } else {
      setNewPassword("");
    }

    if (!formData.confirmPassword ) {
      setConfirmPassword("Enter the confirm password");
    } else {
      setConfirmPassword("");
    }

    if (!isStrongPassword(formData.newPassword) && formData.newPassword.length > 0) {
      setStrengthError(
        "Use at least 8 characters, including uppercase, lowercase, number, and a special symbol."
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword && formData.confirmPassword.length > 0) {
      setMismatchError("Passwords do not match. Please try again.");
      return;
    }

  };


  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#141e30] to-[#243b55] relative overflow-hidden">
      <div className="absolute w-[400px] h-[400px] bg-[#00c6ff] rounded-full blur-[100px] opacity-50 top-[-100px] left-[-100px] animate-[float_10s_infinite_alternate_ease-in-out]" />
      <div className="absolute w-[500px] h-[500px] bg-[#ff512f] rounded-full blur-[100px] opacity-50 bottom-[-150px] right-[-150px] animate-[float_10s_infinite_alternate_ease-in-out_2s]" />

      <div className="relative w-[400px] p-10 bg-white/10 rounded-2xl backdrop-blur-[15px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white text-center z-10 animate-[fadeIn_0.8s_ease]">
        <img
          src={collegeLogo}
          alt="logo"
          className="w-[70px] h-[70px] rounded-[15px] mb-4 shadow-[0_4px_12px_rgba(0,0,0,0.4)] mx-auto"
        />
        <h1 className="text-[22px] font-bold mb-2">AURCT Placement Dashboard</h1>
        <p className="text-[14px] text-[#ddd] mb-7">
          Reset your password to continue
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-left mb-1.5 text-[13px] font-semibold text-[#eee]"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className={`w-full px-3 pr-10 py-3 rounded-lg text-[14px] bg-white/15 text-white backdrop-blur-[5px] outline-none placeholder:text-[#bbb] focus:border ${
                  strengthError
                    ? "border-red-400 focus:shadow-[0_0_8px_#ff4d4d80]"
                    : "focus:border-[#00c6ff] focus:shadow-[0_0_8px_#00c6ff50]"
                }`}
              />
              <svg
                onClick={() => togglePassword("new")}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-[22px] h-[22px] absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer fill-[#bbb] hover:fill-[#00c6ff] transition"
              >
                {showPassword.new ? (
                  <path d="M2 2l20 20M12 6a9.77 9.77 0 0 0-9 6 9.77 9.77 0 0 0 9 6 9.77 9.77 0 0 0 9-6 9.77 9.77 0 0 0-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                ) : (
                  <>
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </>
                )}
              </svg>
            </div>
            {strengthError && (
              <p className="text-red-400 text-xs mt-1 text-left">
                {strengthError}
              </p>
            )}
            {newPassword && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <span className="w-4 h-4 flex items-center justify-center border border-red-400 rounded-full mr-2">!</span>
                {newPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-left mb-1.5 text-[13px] font-semibold text-[#eee]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full px-3 pr-10 py-3 rounded-lg text-[14px] bg-white/15 text-white backdrop-blur-[5px] outline-none placeholder:text-[#bbb] focus:border focus:border-[#00c6ff] focus:shadow-[0_0_8px_#00c6ff50]"
              />
              <svg
                onClick={() => togglePassword("confirm")}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-[22px] h-[22px] absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer fill-[#bbb] hover:fill-[#00c6ff] transition"
              >
                {showPassword.confirm ? (
                  <path d="M2 2l20 20M12 6a9.77 9.77 0 0 0-9 6 9.77 9.77 0 0 0 9 6 9.77 9.77 0 0 0 9-6 9.77 9.77 0 0 0-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                ) : (
                  <>
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </>
                )}
              </svg>
            </div>
          </div>
          {confirmPassword && (
              <p className="text-red-400 text-sm -mt-4 flex items-center">
                <span className="w-4 h-4 flex items-center justify-center border border-red-400 rounded-full mr-2">!</span>
                {confirmPassword}
              </p>
          )}

          {mismatchError && (
            <p className="text-red-400 text-sm text-center -mt-2">
              {mismatchError}
            </p>
          )}
          

          <button
            type="submit"
            className="w-full py-3.5 rounded-lg font-semibold text-[15px] bg-gradient-to-br from-[#00c6ff] to-[#0072ff] hover:from-[#0072ff] hover:to-[#004e92] transition transform hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(0,0,0,0.4)]"
          >
            Reset Password
          </button>
        </form>

        <p className="mt-5 text-[13px] text-[#ccc]">
          Remembered your password?{" "}
          <a
            href="#"
            className="text-[#00c6ff] font-semibold hover:underline"
          >
            Login here
          </a>
        </p>
      </div>

      <style>
        {`
          @keyframes float {
            from { transform: translateY(0px); }
            to { transform: translateY(40px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}   