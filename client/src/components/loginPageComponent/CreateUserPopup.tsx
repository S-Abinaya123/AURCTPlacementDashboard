import { useState } from "react";

const CreateUserPopup = ({ onClose }: { onClose: () => void }) => {
  const [input, setInput] = useState("");

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-[420px] bg-white rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.3)] p-8 text-center animate-popupScale"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          onClick={onClose}
          className="absolute top-4 right-6 text-[22px] text-gray-500 cursor-pointer hover:text-gray-800 transition"
        >
          &times;
        </span>
        <h2 className="text-[28px] font-semibold mb-2 tracking-[2px] text-gray-800">
          Create Account
        </h2>

        <p className="text-[16px] mb-5 text-gray-500 tracking-wide">
          Enter your Register Number
        </p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="block w-[85%] mx-auto mb-8 px-4 py-3 text-lg border border-gray-300 rounded-lg outline-none transition tracking-[2px]
          focus:border-green-500 focus:shadow-[0_0_8px_rgba(0,204,102,0.3)]"
        />

        <div className="flex justify-center gap-5">
          <button
            onClick={onClose}
            className="w-[120px] py-2.5 rounded-lg text-white text-[16px] font-medium tracking-wide bg-red-500 transition transform
            hover:bg-red-600 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(255,77,77,0.4)] cursor-pointer"
          >
            Cancel
          </button>

          <button
            className="w-[120px] py-2.5 rounded-lg text-white text-[16px] font-medium tracking-wide bg-green-500 transition transform
            hover:bg-green-600 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(0,204,102,0.4)] cursor-pointer"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPopup;
