import React, { useEffect, useState } from 'react';

const CircularMilestoneGauge = ({ milestone, index }) => {
  const [progress, setProgress] = useState(0);
  const percentage = Math.min((milestone.current / milestone.target) * 100, 100);
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100 + index * 200);
    return () => clearTimeout(timer);
  }, [percentage, index]);

  const isComplete = percentage >= 100;

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-[#f2f2f2] dark:bg-[#1c1c24] rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2}>
          {/* Background circle */}
          <circle
            stroke="#e5e5e5"
            className="dark:stroke-[#3a3a43]"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={isComplete ? '#03dac5' : '#f97316'}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 1s ease-in-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              strokeLinecap: 'round',
            }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isComplete ? (
            <span className="text-3xl">✓</span>
          ) : (
            <>
              <span className="font-epilogue font-bold text-xl text-black dark:text-white">
                {percentage.toFixed(0)}%
              </span>
              <span className="font-epilogue text-xs text-[#4d4d4d] dark:text-[#808191]">
                Complete
              </span>
            </>
          )}
        </div>
      </div>

      <div className="text-center">
        <h4 className="font-epilogue font-semibold text-sm text-black dark:text-white">
          {milestone.name}
        </h4>
        <p className="font-epilogue text-xs text-[#4d4d4d] dark:text-[#808191] mt-1">
          {milestone.current} / {milestone.target} ETH
        </p>
      </div>
    </div>
  );
};

export default CircularMilestoneGauge;
