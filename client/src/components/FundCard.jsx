import React from "react";
import { useNavigate } from "react-router-dom";
import { tagType } from "../assets";
import { daysLeft } from "../utils";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const FundCard = ({
  id,
  owner,
  name,
  title,
  category,
  description,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
}) => {
  const remainingDays = daysLeft(deadline);
  const navigate = useNavigate();
  const handleNavigateDetails = () => navigate(`/campaign-details/${id}`);
  const progressPercentage = Math.min(
    (parseFloat(amountCollected) / parseFloat(target)) * 100,
    100
  );

  return (
    <div
      className="w-full rounded-2xl glass cursor-pointer group
        hover:shadow-[0_0_32px_rgba(249,115,22,0.25)] hover:-translate-y-1.5
        transition-all duration-300 overflow-hidden border border-white/[0.07]
        hover:border-[#f97316]/30"
      onClick={handleClick || handleNavigateDetails}
    >
      {/* Image with overlays */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt="fund"
          className="w-full h-[190px] object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-transparent to-transparent" />

        {/* Category pill — top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07070f]/70 backdrop-blur-md border border-[#f97316]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
          <span className="font-epilogue font-medium text-[11px] text-[#fdba74] tracking-wide">
            {category}
          </span>
        </div>

        {/* Progress badge — top right */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#07070f]/70 backdrop-blur-md border border-white/10">
          <span className="font-jakarta font-bold text-xs text-white">
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5 gap-4">
        {/* Title + description */}
        <div>
          <h3 className="font-jakarta font-bold text-base text-white leading-snug truncate group-hover:text-[#fdba74] transition-colors duration-200">
            {title}
          </h3>
          <p className="mt-1.5 font-epilogue text-[13px] text-white/40 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Progress bar with shimmer */}
        <div className="relative w-full h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#f97316] to-[#03dac5] relative overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.04] rounded-xl px-3 py-2.5 border border-white/[0.06]">
            <p className="font-jakarta font-bold text-sm text-white">{amountCollected} ETH</p>
            <p className="font-epilogue text-[11px] text-white/35 mt-0.5">of {target} ETH</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl px-3 py-2.5 border border-white/[0.06]">
            <p className="font-jakarta font-bold text-sm text-white">{remainingDays}</p>
            <p className="font-epilogue text-[11px] text-white/35 mt-0.5">days left</p>
          </div>
        </div>

        {/* Footer: creator + arrow */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-full ring-1 ring-[#f97316]/40 overflow-hidden flex-shrink-0">
              <Jazzicon diameter={30} seed={jsNumberForAddress(`${owner}`)} />
            </div>
            <p className="font-epilogue text-[12px] text-white/40">
              by <span className="text-white/70 font-semibold">{name}</span>
            </p>
          </div>
          <span className="text-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-bold">
            →
          </span>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
