import React, { useState } from "react";

const AnimatedBarChart = ({ data = [], labelKey = "label", valueKey = "value", unit = "ETH" }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="font-epilogue text-sm text-white/30">No campaign data yet</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d[valueKey] || 0), 0.001);

  return (
    <div className="w-full flex flex-col">
      {/* Bars area */}
      <div className="flex items-end gap-2 sm:gap-3 w-full" style={{ height: 220 }}>
        {data.map((item, idx) => {
          const pct = Math.max(((item[valueKey] || 0) / maxVal) * 100, 4);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="relative flex-1 flex flex-col items-center justify-end h-full group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg glass text-white text-xs font-epilogue font-medium whitespace-nowrap z-10 shadow-lg border border-white/10">
                  {(item[valueKey] || 0).toFixed(3)} {unit}
                </div>
              )}

              {/* Bar */}
              <div
                className="w-full rounded-t-lg relative overflow-hidden cursor-pointer transition-all duration-200 animate-barGrow"
                style={{
                  height: `${pct}%`,
                  animationDelay: `${idx * 0.08}s`,
                  background: isHovered
                    ? "linear-gradient(to top, #f97316, #fb923c)"
                    : "linear-gradient(to top, #f97316, #03dac5)",
                  boxShadow: isHovered
                    ? "0 0 20px rgba(249,115,22,0.5), 0 -4px 16px rgba(249,115,22,0.3)"
                    : "none",
                  transform: isHovered ? "scaleY(1.03)" : undefined,
                  transformOrigin: "bottom",
                }}
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-60" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex gap-2 sm:gap-3 w-full mt-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 text-center">
            <p
              className={`font-epilogue text-[10px] sm:text-[11px] truncate transition-colors duration-200 ${hoveredIdx === idx ? "text-[#fdba74]" : "text-white/35"
                }`}
              title={item[labelKey]}
            >
              {item[labelKey]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedBarChart;
