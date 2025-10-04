// LogoutPopup.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate

// Define the expected prop interface
interface LogoutPopupProps {
  onClose: () => void; // Function to close the popup
}

const LogoutPopup: React.FC<LogoutPopupProps> = ({ onClose }) => {
  // 2. Initialize the navigate function
  const navigate = useNavigate(); 
  
  const handleConfirmLogout = () => {
    // 3. Perform your logout logic
    
    // Clear ALL data from local storage (e.g., tokens, user info)
    localStorage.clear(); 
    
    console.log('Local storage cleared. User logging out...');
    
    // 4. Navigate to the /auth route (login page)
    navigate('/auth');
    
    // 5. Close the popup (This is optional, as navigation will unmount the Sidebar and the Popup)
    onClose(); 
  };

  return (
    // Fixed overlay...
    <div 
      className="fixed inset-0 bg-black/30 flex justify-center items-center animate-fadeIn z-50"
      onClick={onClose}
    >
      <div 
        className="w-[440px] bg-white p-[25px_30px_30px] rounded-[16px] shadow-[0_12px_35px_rgba(0,0,0,0.18)] relative animate-slideUp"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute top-[12px] right-[15px] text-[20px] text-[#777] cursor-pointer transition duration-200 border-none bg-none hover:text-[#222]"
        >
          &times;
        </button>

        <h2 className="text-[22px] font-bold mt-[25px] mb-[10px] text-[#1c1e21]">Logout Confirmation</h2>
        <p className="text-[15px] text-[#555] mb-[28px] leading-[1.5]">
          Are you sure you want to log out of your account?
        </p>

        <div className="flex justify-end gap-[12px]">
          <button 
            onClick={onClose} 
            className="px-[22px] py-[11px] rounded-[8px] font-semibold text-[14px] cursor-pointer transition duration-200 border-none bg-[#f0f2f5] text-[#333] hover:bg-[#e1e3e7]"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirmLogout} 
            className="px-[22px] py-[11px] rounded-[8px] font-semibold text-[14px] cursor-pointer transition duration-200 border-none bg-[#1877f2] text-white shadow-[0_3px_6px_rgba(24,119,242,0.25)] hover:bg-[#0f65d2]"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Styles (omitted for brevity) */}
      <style>
        {`
          @keyframes fadeIn { /* ... */ }
          .animate-fadeIn { /* ... */ }
          @keyframes slideUp { /* ... */ }
          .animate-slideUp { /* ... */ }
        `}
      </style>
    </div>
  );
};

export default LogoutPopup;