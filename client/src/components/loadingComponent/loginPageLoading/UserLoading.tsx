import React from "react";
import "./UserLoading.css";

const UserLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-2xl shadow-lg px-10 py-8 flex flex-col items-center">
        <div><h1 className="loader-heading">Verifying User</h1></div>
        {/* Hand Loader */}
        <div className="loading">
          <div className="finger finger-1">
            <div className="finger-item">
              <span></span><i></i>
            </div>
          </div>
          <div className="finger finger-2">
            <div className="finger-item">
              <span></span><i></i>
            </div>
          </div>
          <div className="finger finger-3">
            <div className="finger-item">
              <span></span><i></i>
            </div>
          </div>
          <div className="finger finger-4">
            <div className="finger-item">
              <span></span><i></i>
            </div>
          </div>
          <div className="last-finger">
            <div className="last-finger-item"><i></i></div>
          </div>
        </div>

        {/* Paragraph */}
        <p className="mt-5 text-gray-700 text-center text-sm font-medium tracking-wide">
          Please wait while we load your personalized user experience... <br /><br/>
          This may take a few seconds.
        </p>
      </div>
    </div>
  );
};

export default UserLoading;
