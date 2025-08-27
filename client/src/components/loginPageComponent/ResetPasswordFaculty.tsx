import { useState } from "react";

const ResetPasswordFaculty = ({ onClose }: { onClose: () => void }) => {
    const [input, setInput] = useState("");

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="relative w-[420px] max-w-[90%] bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-3xl p-6 text-center  border border-gray-200"
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

                <p className="text-sm mb-6 text-gray-500">
                    Enter your Mobile Number
                </p>
                
                {/* Input */}
                <input
                    type="tel"
          placeholder="Mobile Number"
          pattern="[0-9]{10}"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="block w-[90%] mx-auto mb-6 px-4 py-3 text-base border border-gray-200 rounded-lg outline-none transition
          focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white shadow-sm"
                />

                {/* Buttons */}
                <div className="flex justify-center gap-5">
                    <button
                        onClick={onClose}
                        className="w-[120px] py-2.5 rounded-lg text-sm font-medium tracking-wide bg-gradient-to-r from-red-400 to-red-600 text-white shadow-md
            transition transform hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            alert("Password has been reset successfully");
                            onClose();
                        }}
                        className="w-[120px] py-2.5 rounded-lg text-sm font-medium tracking-wide bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md
            transition transform hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordFaculty;
