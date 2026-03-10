import React from "react";
import { useNavigate } from "react-router-dom";
import FundCard from "./FundCard";
import { v4 as uuidv4 } from "uuid";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigateDetails = (campaign) => {
    navigate(`/campaign-details/${campaign.id}`);
  };

  return (
    <div>
      {/* Optional section header (used by Profile page etc.) */}
      {title && (
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-jakarta font-bold text-2xl gradient-text">{title}</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-[#f97316]/20 border border-[#f97316]/30 font-epilogue font-semibold text-xs text-[#fdba74]">
            {campaigns?.length ?? 0}
          </span>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full h-[380px] rounded-2xl glass border border-white/[0.06] animate-pulse"
            >
              <div className="h-[190px] bg-white/[0.04] rounded-t-2xl" />
              <div className="p-5 flex flex-col gap-4">
                <div className="h-4 bg-white/[0.05] rounded-lg w-3/4" />
                <div className="h-3 bg-white/[0.04] rounded-lg w-full" />
                <div className="h-3 bg-white/[0.04] rounded-lg w-2/3" />
                <div className="h-1.5 bg-white/[0.04] rounded-full" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-14 bg-white/[0.04] rounded-xl" />
                  <div className="h-14 bg-white/[0.04] rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && campaigns?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center mb-6 glow-violet-sm">
            <svg className="w-9 h-9 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-jakarta font-bold text-lg text-white/70 mb-2">No campaigns yet</h3>
          <p className="font-epilogue text-sm text-white/30 max-w-xs">
            Be the first to launch a campaign and make a difference.
          </p>
        </div>
      )}

      {/* Campaign grid */}
      {!isLoading && campaigns?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {campaigns.map((campaign) => (
            <FundCard
              key={uuidv4()}
              {...campaign}
              handleClick={() => handleNavigateDetails(campaign)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayCampaigns;
