import React, { useEffect, useState } from "react";
import { MdErrorOutline, MdClose } from "react-icons/md";

import '../../styles/otherStyle.css';

type ToastProps = {
  title: string;
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
};

const FailToast: React.FC<ToastProps> = ({
  title,
  message,
  show,
  onClose,
  duration = 3000,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, [show, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // match animation duration
  };

  if (!show) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`flex items-center gap-3 bg-red-500/90 backdrop-blur-md text-white px-5 py-4 rounded-xl shadow-2xl min-w-[320px]
        ${isClosing ? "animate-toast-up" : "animate-toast-down"}`}
      >
        {/* Icon */}
        <MdErrorOutline className="text-2xl flex-shrink-0" />

        {/* Text */}
        <div className="flex-1">
          <p className="font-semibold leading-tight">{title}</p>
          <p className="text-sm text-white/90">{message}</p>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 transition cursor-pointer"
        >
          <MdClose className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default FailToast;
