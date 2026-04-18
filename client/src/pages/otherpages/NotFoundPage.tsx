import sadStudent from "../../assets/images/sad-student.jpg";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center w-[100dvw] h-[100dvh]">
      <div className="flex flex-col-reverse md:flex-row items-center justify-center px-6 md:px-12 max-w-5xl w-full">
        
        {/* Left side */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 flex-1">
          <h1 className="text-8xl font-extrabold text-[#68330c] drop-shadow-sm">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#c97148]">
            Page Not Found
          </h2>
          <p className="text-[#5a3e2b] text-base md:text-lg max-w-md">
            Oops! Looks like you've reached a page that doesn't exist in the
            Placement Dashboard.
          </p>
          <button
            className="mt-4 px-6 py-3 rounded-2xl bg-[#b97128] text-white font-semibold shadow-md border-2 border-[#68330c] transition-all duration-300 hover:bg-[#8B4513] hover:scale-105"
            onClick={() => (window.location.href = "/auth")}
          >
            Go Back to Dashboard
          </button>
        </div>

        {/* Right side */}
        <div className="flex justify-center flex-1">
          <img
            src={sadStudent}
            alt="Sad Student Illustration"
            className="w-64 md:w-[500px] object-contain drop-shadow-xl mr-auto"
          />
        </div>
      </div>
    </div>
  );
}
