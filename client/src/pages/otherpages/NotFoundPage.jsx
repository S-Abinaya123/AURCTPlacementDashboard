import React from "react";
import sadStudent from "../../assets/images/sad-student.jpg";

export default function NotFoundPage() {
  return (
    <div className=" flex items-center justify-center  overflow-hidden ">
      <div className="h-full w-full flex flex-col md:flex-row items-center justify-center p-4">
        
        
        <div className="text-center md:text-left space-y-2 flex-shrink">
          <h1 className="text-8xl font-extrabold text-[#68330c]">404</h1>
          <h2 className="text-2xl font-semibold text-[#c97148]">Page Not Found</h2>
          
          <p className="text-brown-600 max-w-md">
            Oops! Looks like you’ve reached a page that doesn’t exist in the Placement Dashboard.
          </p>

          <button
            className="mt-3 px-6 py-3 rounded-2xl bg-[#b97128] text-white font-semibold shadow-md border-2 border-[#68330c] transition-transform duration-300 hover:bg-[#8B4513] hover:scale-105"
          >
            Go Back to Dashboard
          </button>    
        </div>

        {/* Right side - Student Illustration */}
        <div className="mt-6 md:mt-0 flex justify-center max-h-full">
          <img
            src={sadStudent}
            alt="Student Illustration"
            className="max-h-[70vh] w-auto object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}