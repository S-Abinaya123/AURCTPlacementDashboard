import React, { useEffect, useState } from "react";

// Tailwind + custom animations
const injectStyles = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 70px rgba(240, 142, 22, 0.9); }
      50% { box-shadow: 0 0 70px rgba(240, 142, 22, 0.9); }
    }
    @keyframes lightning-border {
      0%, 100% { border-color: rgba(196, 93, 38, 0.7); }
      50% { border-color: rgba(215, 106, 59, 1); }
    }
    @keyframes domino-effect {
      0% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(1); opacity: 0.5; }
    }
    .animate-domino-effect {
      animation: domino-effect 1.2s infinite ease-in-out;
    }
    @media (max-width: 400px) {
      .extra-padding {
        padding-top: 2rem !important;
        padding-bottom: 2rem !important;
      }
    }
  `;
  document.head.appendChild(style);
};

const ResetLinkLoading: React.FC = () => {
  const [visibleDominos, setVisibleDominos] = useState<number>(6);

  useEffect(() => {
    injectStyles();

    const handleResize = () => {
      if (window.innerWidth < 400) {
        setVisibleDominos(3); // small phones → 3 dominos
      } else if (window.innerWidth < 640) {
        setVisibleDominos(4); // medium phones → 4 dominos
      } else if (window.innerWidth < 768) {
        setVisibleDominos(5); // tablets → 5 dominos
      } else {
        setVisibleDominos(6); // desktops → full dominos
      }
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Peach → Orange → Beige tones for dominoes
  const dominos = [
    "bg-orange-300",
    "bg-orange-300",
    "bg-orange-400",
    "bg-orange-400",
    "bg-amber-500",
    "bg-amber-500",
  ].slice(0, visibleDominos);

  return (
    <div className="bg-black/30 w-[100dvw] h-[100dvh] fixed top-0 left-0">

       <div
  className="flex items-center justify-center min-h-screen relative "
>
      {/* Subtle background peach-beige glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(73, 10, 93, 0.1),transparent_70%)]"></div>

      {/* Center Box */}
      <div
        className="
        w-[300px] h-[300px] 
        sm:w-[300px] sm:h-[300px] 
        md:w-[450px] md:h-[280px] 
        lg:w-[500px] lg:h-[320px] 
        rounded-xl shadow-2xl flex flex-col items-center justify-center 
        p-4 sm:p-4 md:p-8 text-center text-white space-y-4 
        animate-[glow_4s_infinite_ease-in-out] extra-padding bg-gray-100 
      "
      >
    <div
          className="relative z-10 flex flex-col items-center justify-center 
          w-full h-full border-5 border-orange-400 rounded-xl 
          p-6 sm:p-6 md:p-8 animate-[lightning-border_4s_infinite_ease-in-out]
          bg-white [@media(min-width:300px)_and_(max-width:350px)]:p-4 
  [@media(min-width:351px)_and_(max-width:400px)]:p-5 
  [@media(min-width:401px)_and_(max-width:650px)]:p-6">
          <h1 className="text-lg text-black sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
            Sending Reset Link to your email...
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-orange-900 text-bold font-light">
            Please wait while we generate your secure Reset Link.
          </p>

          {/* Domino Effect Loader */}
          <div className="relative flex flex-wrap items-center justify-center pt-4 sm:pt-6 md:pt-8">
            {dominos.map((bgClass, idx) => (
              <div
                key={idx}
                className={`${bgClass} w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] md:w-[28px] md:h-[28px] 
                  rounded-lg inline-flex m-[5px] sm:m-[7px] md:m-[9px] animate-domino-effect`}
                style={{ animationDelay: `${0.2 * idx}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>


    </div>
  
  );
};

export default ResetLinkLoading;
