import React, { useState } from "react";
import { CircleCheck } from "lucide-react";

const SuccessMessage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleButtonClick = () => {
    console.log("Success confirmed");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Popup */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-2xl w-80 sm:w-96 text-center transition-all duration-300">
        <CircleCheck className="w-20 h-20 mb-4 text-green-500 animate-pulse" />
        <h2 className="text-3xl font-bold mb-2 text-green-500">Success!</h2>
        <p className="text-gray-600 text-lg mb-6">
          Your operation was successful.
        </p>
        <button
          onClick={handleButtonClick}
          className="px-8 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 bg-green-500 hover:bg-green-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;