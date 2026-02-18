import React from "react";

const Footer = () => {
  return (
    <div className="relative mt-10">
      {/* Gradient top line */}
      <div className="h-px bg-gradient-to-r from-[#f97316]/60 via-[#03dac5]/40 to-transparent mb-4" />

      <div className="flex items-center justify-center gap-2 py-3">
        <p className="font-epilogue text-xs text-white/25">
          &copy; {new Date().getFullYear()}
        </p>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <p className="font-jakarta font-semibold text-xs gradient-text-violet">
          Sentinel
        </p>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <p className="font-epilogue text-xs text-white/25">All rights reserved</p>
      </div>
    </div>
  );
};

export default Footer;
