import React from "react";

const VerifyingUserLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 flex flex-col items-center">
        <h1 className="text-[25px] font-semibold text-gray-800 mb-6">
          Verifying User
        </h1>

        {/* Hand Loader */}
        <div className="w-[112px] h-[70px] flex justify-center items-center">
          {/* Fingers */}
          <div className="finger finger-1">
            <div className="finger-item">
              <span></span>
              <i></i>
            </div>
          </div>
          <div className="finger finger-2">
            <div className="finger-item">
              <span></span>
              <i></i>
            </div>
          </div>
          <div className="finger finger-3">
            <div className="finger-item">
              <span></span>
              <i></i>
            </div>
          </div>
          <div className="finger finger-4">
            <div className="finger-item">
              <span></span>
              <i></i>
            </div>
          </div>

          {/* Thumb */}
          <div className="last-finger">
            <div className="last-finger-item">
              <i></i>
            </div>
          </div>
        </div>

        {/* Paragraph */}
        <p className="mt-5 text-gray-700 text-center text-sm font-medium tracking-wide">
          Please wait while we load your personalized user experience... <br />
          <br />
          This may take a few seconds.
        </p>

        {/* Animation Styles */}
        <style>{`
          .finger {
            float: left;
            margin: 0 2px 0 0;
            width: 20px;
            height: 100%;
          }
          .finger-item {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 6px 6px 8px 8px;
            background: #4492f4;
          }
          .finger-item span {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 5px 5px 0 5px;
          }
          .finger-item span::before,
          .finger-item span::after {
            content: "";
            display: block;
            margin-bottom: 2px;
            width: 100%;
            height: 2px;
            background: #fff;
          }
          .finger-item i {
            position: absolute;
            left: 3px;
            bottom: 3px;
            width: 14px;
            height: 14px;
            border-radius: 10px 10px 7px 7px;
            background: #fff;
          }
          .last-finger {
            position: relative;
            float: left;
            width: 24px;
            height: 100%;
            overflow: hidden;
          }
          .last-finger-item {
            position: absolute;
            right: 0;
            top: 32px;
            width: 110%;
            height: 20px;
            border-radius: 0 5px 14px 0;
            background: #4492f4;
            animation: finger-5-animation 2s infinite ease-out;
            animation-delay: 0.8s;
          }
          .last-finger-item i {
            position: absolute;
            left: 0;
            top: -8px;
            width: 22px;
            height: 8px;
            background: #4492f4;
            overflow: hidden;
          }
          .last-finger-item i::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 34px;
            height: 20px;
            border-radius: 0 0 15px 15px;
            background: #fff;
          }
          .finger-1 { animation: finger-1-animation 2s infinite ease-out; animation-delay: 0s; }
          .finger-1 span { animation: finger-1-animation-span 2s infinite ease-out; animation-delay: 0s !important; }
          .finger-1 i { animation: finger-1-animation-i 2s infinite ease-out; animation-delay: 0s !important; }
          @keyframes finger-1-animation {
            0%,20%,41%,100% { padding:12px 0 5px 0; }
            29%,35% { padding:4px 0 24px 0; }
          }
          @keyframes finger-1-animation-span {
            0%,20%,41%,100% { padding:5px 5px 0 5px; }
            29%,35% { padding:20px 5px 0 5px; }
          }
          @keyframes finger-1-animation-i {
            0%,20%,41%,100% { bottom:3px; }
            29%,35% { bottom:13px; }
          }
          .finger-2 { animation: finger-2-animation 2s infinite ease-out; animation-delay: 0.2s; }
          .finger-2 span { animation: finger-2-animation-span 2s infinite ease-out; animation-delay: 0.2s !important; }
          .finger-2 i { animation: finger-2-animation-i 2s infinite ease-out; animation-delay: 0.2s !important; }
          @keyframes finger-2-animation {
            0%,22%,43%,100% { padding:12px 0 5px 0; }
            31%,37% { padding:4px 0 24px 0; }
          }
          @keyframes finger-2-animation-span {
            0%,22%,43%,100% { padding:5px 5px 0 5px; }
            31%,37% { padding:20px 5px 0 5px; }
          }
          @keyframes finger-2-animation-i {
            0%,22%,43%,100% { bottom:3px; }
            31%,37% { bottom:13px; }
          }
          .finger-3 { animation: finger-3-animation 2s infinite ease-out; animation-delay: 0.4s; }
          .finger-3 span { animation: finger-3-animation-span 2s infinite ease-out; animation-delay: 0.4s !important; }
          .finger-3 i { animation: finger-3-animation-i 2s infinite ease-out; animation-delay: 0.4s !important; }
          @keyframes finger-3-animation {
            0%,24%,45%,100% { padding:12px 0 5px 0; }
            33%,39% { padding:4px 0 24px 0; }
          }
          @keyframes finger-3-animation-span {
            0%,24%,45%,100% { padding:5px 5px 0 5px; }
            33%,39% { padding:20px 5px 0 5px; }
          }
          @keyframes finger-3-animation-i {
            0%,24%,45%,100% { bottom:3px; }
            33%,39% { bottom:13px; }
          }
          .finger-4 { animation: finger-4-animation 2s infinite ease-out; animation-delay: 0.6s; }
          .finger-4 span { animation: finger-4-animation-span 2s infinite ease-out; animation-delay: 0.6s !important; }
          .finger-4 i { animation: finger-4-animation-i 2s infinite ease-out; animation-delay: 0.6s !important; }
          @keyframes finger-4-animation {
            0%,26%,47%,100% { padding:12px 0 5px 0; }
            35%,41% { padding:4px 0 24px 0; }
          }
          @keyframes finger-4-animation-span {
            0%,26%,47%,100% { padding:5px 5px 0 5px; }
            35%,41% { padding:20px 5px 0 5px; }
          }
          @keyframes finger-4-animation-i {
            0%,26%,47%,100% { bottom:3px; }
            35%,41% { bottom:13px; }
          }
          @keyframes finger-5-animation {
            0%,50%,100% { top:32px; }
            60%,70% { top:20px; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default VerifyingUserLoading;