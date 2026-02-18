import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStateContext } from "../context";
import { WithdrawCard } from "../components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Withdraw = () => {
  const {
    withdraw,
    isLoading,
    address,
    contract,
    campaigns,
    getUserCampaigns,
    userCampaigns,
  } = useStateContext();
  const navigate = useNavigate();

  const handleWithdraw = async (campaign) => {
    if (campaign?.amountCollected == 0) {
      toast.warning("No donations found for this campaign", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }
    if (campaign?.deadline >= Date.now()) {
      toast.error("You can't withdraw before the campaign deadline", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }
    await withdraw(campaign?.id);
    navigate("/");
  };

  useEffect(() => {
    getUserCampaigns();
  }, [contract, address, campaigns]);

  return (
    <div className="animate-fadeIn">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-[#f97316]/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4.5 h-4.5 text-[#f97316]" style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="font-jakarta font-bold text-2xl gradient-text">Withdraw Funds</h1>
        {!isLoading && (
          <span className="px-2.5 py-0.5 rounded-full bg-[#f97316]/20 border border-[#f97316]/30 font-epilogue font-semibold text-xs text-[#fdba74]">
            {userCampaigns?.length ?? 0}
          </span>
        )}
      </div>

      {/* ── Loading skeletons ──────────────────────────────────────── */}
      {isLoading && (
        <div className="flex flex-wrap gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="sm:w-[300px] w-full rounded-2xl glass border border-white/[0.06] animate-pulse"
            >
              <div className="h-[160px] bg-white/[0.04] rounded-t-2xl" />
              <div className="p-5 flex flex-col gap-4">
                <div className="h-4 bg-white/[0.05] rounded-lg w-3/4" />
                <div className="h-3 bg-white/[0.04] rounded-lg w-1/2" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="h-12 bg-white/[0.04] rounded-xl" />
                  <div className="h-12 bg-white/[0.04] rounded-xl" />
                </div>
                <div className="h-10 bg-white/[0.04] rounded-xl mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────── */}
      {!isLoading && userCampaigns?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-3xl glass border border-[#f97316]/15 flex items-center justify-center glow-violet-sm">
              <svg className="w-11 h-11 text-[#f97316]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            {/* Floating ring */}
            <div className="absolute inset-0 rounded-3xl border border-[#f97316]/10 scale-110 animate-pulse" />
          </div>

          <h3 className="font-jakarta font-bold text-xl text-white/75 mb-2">
            No campaigns to withdraw from
          </h3>
          <p className="font-epilogue text-sm text-white/30 max-w-[280px] leading-relaxed mb-8">
            You haven't created any campaigns yet. Start one and come back after the deadline to withdraw your funds.
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate("/create-campaign")}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-jakarta font-bold text-sm
              text-white bg-gradient-to-r from-[#f97316] to-[#fb923c]
              hover:shadow-[0_0_24px_rgba(249,115,22,0.5)] hover:scale-[1.03]
              transition-all duration-200 active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Start a Campaign
          </button>
        </div>
      )}

      {/* ── Campaign cards ────────────────────────────────────────── */}
      {!isLoading && userCampaigns?.length > 0 && (
        <div className="flex flex-wrap gap-6">
          {userCampaigns.map((campaign) => (
            <WithdrawCard
              key={uuidv4()}
              {...campaign}
              handleClick={() => handleWithdraw(campaign)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Withdraw;
