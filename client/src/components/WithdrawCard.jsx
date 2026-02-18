import React from "react";
import { daysLeft } from "../utils";
import CustomButton from "./CustomButton";

const WithdrawCard = ({
  id,
  title,
  category,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
}) => {
  const remainingDays = daysLeft(deadline);
  const progress = Math.min(
    (parseFloat(amountCollected) / parseFloat(target)) * 100,
    100
  );
  const isExpired = remainingDays <= 0;
  const hasBalance = parseFloat(amountCollected) > 0;
  const canWithdraw = isExpired && hasBalance;

  return (
    <div
      className="sm:w-[300px] w-full rounded-2xl glass overflow-hidden
        border border-white/[0.07] hover:border-[#f97316]/25
        hover:shadow-[0_0_28px_rgba(249,115,22,0.12)] hover:-translate-y-1
        transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt="campaign"
          className="w-full h-[160px] object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-transparent to-transparent" />

        {/* Category pill */}
        {category && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07070f]/70 backdrop-blur-md border border-[#f97316]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
            <span className="font-epilogue font-medium text-[11px] text-[#fdba74] tracking-wide">
              {category}
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full backdrop-blur-md border text-[11px] font-jakarta font-bold
          ${canWithdraw
            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
            : isExpired && !hasBalance
              ? "bg-white/10 border-white/15 text-white/50"
              : "bg-[#f97316]/15 border-[#f97316]/30 text-[#fdba74]"
          }`}
        >
          {canWithdraw ? "Ready" : isExpired ? "No funds" : `${remainingDays}d left`}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4">
        {/* Title + id */}
        <div>
          <h3 className="font-jakarta font-bold text-base text-white leading-snug truncate group-hover:text-[#fdba74] transition-colors duration-200">
            {title}
          </h3>
          <p className="mt-0.5 font-epilogue text-[11px] text-white/25">Campaign #{id}</p>
        </div>

        {/* Progress bar */}
        <div className="relative w-full h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#f97316] to-[#03dac5] relative overflow-hidden"
            style={{ width: `${progress}%` }}
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
            <p className={`font-jakarta font-bold text-sm ${isExpired ? "text-white/40" : "text-white"}`}>
              {isExpired ? "Ended" : `${remainingDays}d`}
            </p>
            <p className="font-epilogue text-[11px] text-white/35 mt-0.5">deadline</p>
          </div>
        </div>

        {/* Withdraw button */}
        <CustomButton
          btnType="button"
          title="Withdraw Funds"
          styles="w-full !text-white cursor-pointer"
          handleClick={handleClick}
        />
      </div>
    </div>
  );
};

export default WithdrawCard;
