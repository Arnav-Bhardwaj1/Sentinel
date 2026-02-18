import React, { useEffect, useState } from 'react';

const MilestoneNotification = ({ milestone, report, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed top-20 right-6 max-w-md bg-white dark:bg-[#1c1c24] rounded-2xl shadow-2xl p-6 z-50 border-2 border-[#f97316] transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🎉</div>
          <div>
            <h3 className="font-epilogue font-bold text-lg text-black dark:text-white">
              Milestone Reached!
            </h3>
            <p className="font-epilogue text-sm text-[#f97316] dark:text-[#fb923c]">
              {milestone.name}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-[#4d4d4d] dark:text-[#808191] hover:text-black dark:hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-epilogue text-sm text-[#4d4d4d] dark:text-[#808191]">
            Progress
          </span>
          <span className="font-epilogue font-bold text-sm text-black dark:text-white">
            {milestone.percentage}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#e5e5e5] dark:bg-[#3a3a43] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#f97316] to-[#fb923c] rounded-full transition-all duration-1000"
            style={{ width: `${milestone.percentage}%` }}
          />
        </div>
      </div>

      {/* Report preview */}
      {report && (
        <div className="bg-[#f2f2f2] dark:bg-[#2c2f32] rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
          <p className="font-epilogue text-sm text-[#4d4d4d] dark:text-[#808191] leading-relaxed whitespace-pre-wrap">
            {report.substring(0, 200)}...
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleClose}
          className="flex-1 px-4 py-2 bg-[#f97316] text-white rounded-lg font-epilogue font-semibold text-sm hover:bg-[#c2410c] transition-colors"
        >
          Awesome!
        </button>
        <button
          onClick={() => {
            console.log('Full Report:', report);
            alert('Full report logged to console');
          }}
          className="px-4 py-2 bg-[#f2f2f2] dark:bg-[#2c2f32] text-black dark:text-white rounded-lg font-epilogue font-semibold text-sm hover:bg-[#e5e5e5] dark:hover:bg-[#3a3a43] transition-colors"
        >
          View Full Report
        </button>
      </div>
    </div>
  );
};

export default MilestoneNotification;
