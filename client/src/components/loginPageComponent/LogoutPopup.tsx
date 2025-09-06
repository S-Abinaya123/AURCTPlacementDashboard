
const LogoutPopup = () => {
  return (
    <div className="fixed inset-0 bg-[rgb(131,133,136)] flex justify-center items-center animate-fadeIn">
      <div className="w-[440px] bg-white p-[25px_30px_30px] rounded-[16px] shadow-[0_12px_35px_rgba(0,0,0,0.18)] relative animate-slideUp">
        <button className="absolute top-[12px] right-[15px] text-[20px] text-[#777] cursor-pointer transition duration-200 border-none bg-none hover:text-[#222]">
          &times;
        </button>

        <h2 className="text-[22px] font-bold mt-[25px] mb-[10px] text-[#1c1e21]">Logout Confirmation</h2>
        <p className="text-[15px] text-[#555] mb-[28px] leading-[1.5]">
          Are you sure you want to logout from your account?
        </p>

        <div className="flex justify-end gap-[12px]">
          <button className="px-[22px] py-[11px] rounded-[8px] font-semibold text-[14px] cursor-pointer transition duration-200 border-none bg-[#f0f2f5] text-[#333] hover:bg-[#e1e3e7]">
            Cancel
          </button>
          <button className="px-[22px] py-[11px] rounded-[8px] font-semibold text-[14px] cursor-pointer transition duration-200 border-none bg-[#1877f2] text-white shadow-[0_3px_6px_rgba(24,119,242,0.25)] hover:bg-[#0f65d2]">
            Logout
          </button>
        </div>
      </div>

      {/* Tailwind custom animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease;
          }

          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slideUp {
            animation: slideUp 0.35s ease;
          }
        `}
      </style>
    </div>
  );
};

export default LogoutPopup;
