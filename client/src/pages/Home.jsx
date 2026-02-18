import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useStateContext } from "../context";
import { DisplayCampaigns } from "../components";
import { daysLeft } from "../utils";
import featuredBg from "../assets/featured-campaign.png";

/* ─── Featured Campaign Card ─────────────────────────────────────────────── */
const FeaturedCard = ({ campaign, onNavigate, overrideImage }) => {
  const progress = Math.min(
    (parseFloat(campaign.amountCollected) / parseFloat(campaign.target)) * 100,
    100
  );
  const days = daysLeft(campaign.deadline);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden cursor-pointer group mb-10
        border border-[#f97316]/20 glass
        hover:border-[#f97316]/40 hover:shadow-[0_0_48px_rgba(249,115,22,0.12)]
        transition-all duration-300"
      onClick={onNavigate}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image panel */}
        <div className="relative sm:w-[32%] h-[180px] sm:h-[260px] overflow-hidden flex-shrink-0">
          <img
            src={overrideImage || campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient fade into content on desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d0d1a]/90 hidden sm:block" />
          {/* Gradient fade downward on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-transparent to-transparent sm:hidden" />

          {/* Featured badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f97316] shadow-[0_0_12px_rgba(249,115,22,0.5)]">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-epilogue font-bold text-[10px] text-white tracking-[0.15em] uppercase">
              Top Funded
            </span>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex-1 flex flex-col justify-between p-5 sm:p-6">

          {/* Top: category + title + description */}
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {campaign.category && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/25 text-[#fdba74] font-epilogue text-[11px] font-semibold">
                  {campaign.category}
                </span>
              )}
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#03dac5]/10 border border-[#03dac5]/20 text-[#03dac5] font-epilogue text-[11px] font-semibold">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                On-chain Verified
              </span>
            </div>

            <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-white mb-3 leading-snug group-hover:text-[#fdba74] transition-colors duration-200">
              {campaign.title}
            </h3>

            <p className="font-epilogue text-[13px] text-white/45 line-clamp-3 leading-relaxed">
              {campaign.description}
            </p>

            {/* Trust badges */}
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              {[
                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Transparent" },
                { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", label: "Community Driven" },
                { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Blockchain Powered" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-white/30">
                  <svg className="w-3.5 h-3.5 text-[#f97316]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                  <span className="font-epilogue text-[11px]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: progress + stats + CTA */}
          <div className="mt-6">
            {/* Progress label + bar */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-epilogue text-[11px] text-white/30">Funding progress</span>
              <span className="font-jakarta font-bold text-xs text-[#f97316]">{progress.toFixed(0)}% funded</span>
            </div>
            <div className="relative w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#f97316] to-[#03dac5] relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>

            {/* Stats + creator + CTA */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-5">
                <div>
                  <p className="font-jakarta font-bold text-sm text-white">{campaign.amountCollected} ETH</p>
                  <p className="font-epilogue text-[11px] text-white/30">of {campaign.target} ETH</p>
                </div>
                <div className="w-px h-8 bg-white/[0.08]" />
                <div>
                  <p className="font-jakarta font-bold text-sm text-white">{days === 0 ? "Ended" : `${days}d`}</p>
                  <p className="font-epilogue text-[11px] text-white/30">days left</p>
                </div>
                <div className="w-px h-8 bg-white/[0.08]" />
                {/* Creator */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full ring-1 ring-[#f97316]/40 overflow-hidden">
                    <Jazzicon diameter={24} seed={jsNumberForAddress(`${campaign.owner}`)} />
                  </div>
                  <p className="font-epilogue text-xs text-white/35">
                    by <span className="text-white/65">{campaign.name}</span>
                  </p>
                </div>
              </div>

              {/* CTA button */}
              <div className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2 rounded-xl font-jakarta font-bold text-sm
                text-white bg-gradient-to-r from-[#f97316] to-[#fb923c]
                group-hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all duration-200">
                View Campaign
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
const StatCard = ({ value, label, icon, accentColor }) => (
  <div
    className="glass rounded-2xl px-5 py-4 flex items-center gap-4"
    style={{ borderColor: `${accentColor}18`, borderWidth: 1, borderStyle: "solid" }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${accentColor}12` }}
    >
      {icon}
    </div>
    <div>
      <p className="font-jakarta font-bold text-lg sm:text-xl text-white leading-none">{value}</p>
      <p className="font-epilogue text-[11px] text-white/35 mt-0.5">{label}</p>
    </div>
  </div>
);

/* ─── Home Page ───────────────────────────────────────────────────────────── */
const Home = () => {
  const { campaigns, isLoading } = useStateContext();
  const navigate = useNavigate();
  const campaignsRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");

  /* Live stats */
  const stats = useMemo(() => {
    const totalRaised = campaigns.reduce(
      (sum, c) => sum + parseFloat(c.amountCollected || 0),
      0
    );
    const active = campaigns.filter((c) => daysLeft(c.deadline) > 0).length;
    return { totalRaised, active, total: campaigns.length };
  }, [campaigns]);

  /* Category list derived from real data */
  const categories = useMemo(() => {
    const cats = [...new Set(campaigns.map((c) => c.category).filter(Boolean))];
    return ["All", ...cats];
  }, [campaigns]);

  /* Top-funded campaign for featured card */
  const featured = useMemo(() => {
    if (!campaigns.length) return null;
    return [...campaigns].sort(
      (a, b) => parseFloat(b.amountCollected) - parseFloat(a.amountCollected)
    )[0];
  }, [campaigns]);

  /* Filtered campaign list */
  const filteredCampaigns = useMemo(() => {
    if (activeCategory === "All") return campaigns;
    return campaigns.filter((c) => c.category === activeCategory);
  }, [campaigns, activeCategory]);

  return (
    <div className="animate-fadeIn">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <div className="relative mb-14">
        {/* Hero ambient glow behind text */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden">
          <div
            className="w-[560px] h-[300px] rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(249,115,22,0.09) 0%, transparent 70%)",
              filter: "blur(40px)",
              marginTop: "-20px",
            }}
          />
        </div>

        <div className="relative text-center max-w-[640px] mx-auto px-4 pt-4 pb-2">

          {/* Platform badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#f97316]/25 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
            <span className="font-epilogue text-[10px] font-bold text-[#f97316] tracking-[0.18em] uppercase">
              Decentralised · Transparent · On-Chain
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-jakarta font-extrabold leading-[1.0] mb-5 tracking-tight"
            style={{ fontSize: "clamp(44px, 8vw, 72px)" }}>
            <span className="text-white">Fund the</span>
            <br />
            <span className="gradient-text">Future.</span>
          </h1>

          <p className="font-epilogue text-[15px] text-white/40 leading-relaxed mb-8 max-w-[400px] mx-auto">
            Back ideas that matter. Every transaction is on-chain, every donor
            is protected, every campaign is fully accountable.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate("/create-campaign")}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-jakarta font-bold text-sm
                text-white bg-gradient-to-r from-[#f97316] to-[#fb923c]
                hover:shadow-[0_0_28px_rgba(249,115,22,0.55)] hover:scale-[1.03]
                transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Start a Campaign
            </button>

            <button
              onClick={() => campaignsRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-jakarta font-semibold text-sm
                glass border border-white/[0.1] text-white/55 hover:text-white
                hover:border-[#f97316]/30 hover:bg-[#f97316]/[0.06]
                transition-all duration-200"
            >
              Explore Campaigns
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          LIVE STATS
      ══════════════════════════════════════════════════════════ */}
      {!isLoading && campaigns.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
          <StatCard
            value={stats.total}
            label="Total Campaigns"
            accentColor="#f97316"
            icon={
              <svg className="w-5 h-5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatCard
            value={`${stats.totalRaised.toFixed(2)} ETH`}
            label="Total Raised"
            accentColor="#03dac5"
            icon={
              <svg className="w-5 h-5 text-[#03dac5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <StatCard
            value={stats.active}
            label="Active Now"
            accentColor="#f97316"
            icon={
              <svg className="w-5 h-5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          FEATURED CAMPAIGN
      ══════════════════════════════════════════════════════════ */}
      {!isLoading && featured && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-5 h-5 rounded-md bg-[#f97316]/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-[#f97316]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
            <h2 className="font-jakarta font-bold text-sm text-white/50 tracking-wide uppercase">
              Featured Campaign
            </h2>
          </div>
          <FeaturedCard
            campaign={featured}
            onNavigate={() => navigate(`/campaign-details/${featured.id}`)}
            overrideImage={featuredBg}
          />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          CAMPAIGNS SECTION
      ══════════════════════════════════════════════════════════ */}
      <div ref={campaignsRef}>

        {/* Section header + category filter */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-jakarta font-bold text-xl gradient-text">
              {activeCategory === "All" ? "All Campaigns" : activeCategory}
            </h2>
            {!isLoading && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#f97316]/20 border border-[#f97316]/30 font-epilogue font-semibold text-xs text-[#fdba74]">
                {filteredCampaigns.length}
              </span>
            )}
          </div>

          {/* Category pills — only visible when there's more than just "All" */}
          {categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full font-epilogue text-[11px] font-semibold
                    transition-all duration-200 border
                    ${activeCategory === cat
                      ? "bg-[#f97316] text-white border-transparent shadow-[0_0_14px_rgba(249,115,22,0.45)]"
                      : "glass border-white/[0.08] text-white/45 hover:text-white/75 hover:border-[#f97316]/20"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-[#f97316]/20 via-white/[0.05] to-transparent" />
        </div>

        {/* Grid */}
        <DisplayCampaigns isLoading={isLoading} campaigns={filteredCampaigns} />
      </div>
    </div>
  );
};

export default Home;
