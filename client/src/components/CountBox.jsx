import React from "react";

const CountBox = ({ title = "", value = "" }) => {
  return (
    <div className="relative flex flex-col items-center w-[150px] glass rounded-2xl overflow-hidden border border-white/[0.08]">
      {/* Violet top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#f97316] via-[#fb923c] to-transparent" />

      <div className="w-full px-4 pt-5 pb-3 text-center">
        <h4 className="font-jakarta font-bold text-[28px] leading-tight text-white truncate">
          {value}
        </h4>
      </div>

      <div className="w-full px-3 pb-4 text-center">
        <p className="font-epilogue text-[11px] text-white/40 leading-relaxed tracking-wide">
          {title}
        </p>
      </div>
    </div>
  );
};

export default CountBox;
