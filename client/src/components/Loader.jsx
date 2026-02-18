import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07070f]/85 backdrop-blur-sm">
      {/* Dual ring spinner */}
      <div className="relative w-16 h-16 mb-6">
        {/* Outer ring — teal */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent animate-spin-ring"
          style={{ borderTopColor: "#03dac5", animationDuration: "1s" }}
        />
        {/* Inner ring — violet */}
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent animate-spin-ring"
          style={{ borderTopColor: "#f97316", animationDirection: "reverse", animationDuration: "0.7s" }}
        />
        {/* Center dot */}
        <div className="absolute inset-[28%] rounded-full bg-[#f97316]/40" />
      </div>

      <p className="font-jakarta font-semibold text-base text-white/80">
        Transaction in progress
      </p>
      <p className="font-epilogue text-sm text-white/35 mt-1.5">
        Please wait and don't close this window
      </p>
    </div>
  );
};

export default Loader;
