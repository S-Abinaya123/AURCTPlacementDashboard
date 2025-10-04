import React, { useState } from "react";
import { CircleX } from "lucide-react";

const FailMessage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleButtonClick = () => {
    console.log("Retry clicked");
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
        <CircleX className="w-20 h-20 mb-4 text-red-500 animate-pulse" />
        <h2 className="text-3xl font-bold mb-2 text-red-500">Oops!</h2>
        <p className="text-gray-600 text-lg mb-6">
          Something went wrong. Please try again.
        </p>
        <button
          onClick={handleButtonClick}
          className="px-8 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 bg-red-500 hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default FailMessage;