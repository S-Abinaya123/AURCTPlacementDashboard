import React from "react";

const AccountLoading: React.FC = () => {
  return (
    <>
      <style>
        {`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        @keyframes move1 { 50% { transform: translate(-20%, -20%) scale(0.3); } }
        @keyframes move2 { 50% { transform: translate(10%, -15%) scale(0.5); } }
        @keyframes move3 { 50% { transform: translate(20%, 20%) scale(0.3); } }
        @keyframes move4 { 50% { transform: translate(-10%, 15%) scale(0.5); } }
        `}
      </style>

      <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50">
        {/* Responsive white division */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl flex flex-col items-center text-center w-11/12 max-w-xs sm:max-w-sm">
          
          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFA07A] via-[#FF7F50] to-[#FFDAB9] mb-3 drop-shadow-md">
            CREATING YOUR ACCOUNT
          </h2>

          {/* Loader */}
          <div className="relative w-3/4 max-w-[180px] aspect-square" style={{ animation: "spin 1.5s infinite" }}>
            
            {/* Circle 1 */}
            <div
              className="absolute top-[28%] left-[28%] w-[25%] aspect-square rounded-full"
              style={{
                animation: "move1 1.5s infinite",
                background: "linear-gradient(135deg, #FFB88C, #FF8C42, #FFE5B4)",
                boxShadow: "0 0 12px rgba(255,140,66,0.6)",
              }}
            />
            {/* Circle 2 */}
            <div
              className="absolute top-[30%] right-[30%] w-[12%] aspect-square rounded-full"
              style={{
                animation: "move2 1.5s infinite",
                background: "linear-gradient(135deg, #FFD1A9, #FF914D, #FFF0D1)",
                boxShadow: "0 0 10px rgba(255,145,77,0.6)",
              }}
            />
            {/* Circle 3 */}
            <div
              className="absolute bottom-[28%] right-[28%] w-[25%] aspect-square rounded-full"
              style={{
                animation: "move3 1.5s infinite",
                background: "linear-gradient(135deg, #FFB88C, #FF6F3C, #FFE5B4)",
                boxShadow: "0 0 12px rgba(255,111,60,0.6)",
              }}
            />
            {/* Circle 4 */}
            <div
              className="absolute bottom-[30%] left-[30%] w-[12%] aspect-square rounded-full"
              style={{
                animation: "move4 1.5s infinite",
                background: "linear-gradient(135deg, #FFD1A9, #FF914D, #FFF0D1)",
                boxShadow: "0 0 10px rgba(255,145,77,0.6)",
              }}
            />
          </div>

          {/* Description */}
          <p className="mt-3 text-sm sm:text-base md:text-base text-gray-700 font-medium italic max-w-xs drop-shadow-sm">
            This may take a few seconds as we verify your details and get everything ready for you.
          </p>

          {/* Note */}
          <p className="mt-3 text-sm sm:text-base md:text-base text-orange-500 font-semibold flex items-center justify-center gap-2">
            ⚠️ Please do not close this window
          </p>
        </div>
      </div>
    </>
  );
};

export default AccountLoading;
