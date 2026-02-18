import React, { useEffect, useState } from 'react';

const ThermometerChart = ({ current, target, height = 400 }) => {
  const [fillHeight, setFillHeight] = useState(0);
  const percentage = Math.min((current / target) * 100, 100);

  useEffect(() => {
    // Animate fill on mount and when values change
    const timer = setTimeout(() => {
      setFillHeight(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h3 className="font-epilogue font-bold text-2xl text-black dark:text-white">
          {percentage.toFixed(1)}%
        </h3>
        <p className="font-epilogue text-sm text-[#4d4d4d] dark:text-[#808191]">
          {current} / {target} ETH
        </p>
      </div>
      
      <div 
        className="relative bg-[#e5e5e5] dark:bg-[#3a3a43] rounded-full overflow-hidden shadow-lg"
        style={{ width: '80px', height: `${height}px` }}
      >
        {/* Thermometer bulb at bottom */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 bg-[#e5e5e5] dark:bg-[#3a3a43] rounded-full flex items-center justify-center z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#f97316] to-[#fb923c] rounded-full shadow-inner" />
        </div>

        {/* Liquid fill with animation */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#f97316] via-[#8b2fc9] to-[#fb923c] transition-all duration-1000 ease-out"
          style={{ 
            height: `${fillHeight}%`,
            boxShadow: '0 -4px 20px rgba(249,115,22, 0.5)'
          }}
        >
          {/* Liquid wave effect */}
          <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
            <div 
              className="absolute w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-wave"
              style={{
                animation: 'wave 3s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Measurement marks */}
        <div className="absolute inset-0 flex flex-col justify-between py-4 px-2">
          {[100, 75, 50, 25, 0].map((mark) => (
            <div key={mark} className="flex items-center">
              <div className="w-3 h-0.5 bg-black/20 dark:bg-white/20" />
              <span className="ml-2 text-xs font-epilogue text-[#4d4d4d] dark:text-[#808191]">
                {mark}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default ThermometerChart;
