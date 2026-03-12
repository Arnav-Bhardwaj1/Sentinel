import React, { useMemo } from "react";
import { useStateContext } from "../context";
import AnimatedBarChart from "../components/AnimatedBarChart";
import DoughnutChart from "../components/DoughnutChart";
import SparklineChart from "../components/SparklineChart";
import ActivityFeed from "../components/ActivityFeed";
import { daysLeft } from "../utils";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

/* ─── Stat Card with Sparkline ─────────────────────────────────────────── */
const SparkStatCard = ({ value, label, sparkData, accentColor, icon, delay = 0 }) => (
  <div
    className="glass rounded-2xl p-5 border border-white/[0.06] animate-staggerFadeUp group hover:border-[#f97316]/20 hover:shadow-[0_0_24px_rgba(249,115,22,0.08)] transition-all duration-300"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-start justify-between mb-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accentColor}15` }}
      >
        {icon}
      </div>
      <SparklineChart data={sparkData} width={100} height={32} strokeColor={accentColor} />
    </div>
    <p className="font-jakarta font-bold text-xl sm:text-2xl text-white leading-none">{value}</p>
    <p className="font-epilogue text-[11px] text-white/35 mt-1.5">{label}</p>
  </div>
);

/* ─── Leaderboard Row ──────────────────────────────────────────────────── */
const LeaderboardRow = ({ rank, campaign, maxRaised, delay = 0 }) => {
  const raised = parseFloat(campaign.amountCollected || 0);
  const pct = maxRaised > 0 ? (raised / maxRaised) * 100 : 0;
  const days = daysLeft(campaign.deadline);

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-all duration-200 animate-staggerFadeUp group"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Rank */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-jakarta font-bold text-sm ${rank === 1
            ? "bg-[#f97316]/20 text-[#f97316] shadow-[0_0_12px_rgba(249,115,22,0.3)]"
            : rank === 2
              ? "bg-[#03dac5]/15 text-[#03dac5]"
              : rank === 3
                ? "bg-[#fb923c]/15 text-[#fb923c]"
                : "bg-white/[0.04] text-white/30"
          }`}
      >
        #{rank}
      </div>

      {/* Avatar + Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/10 flex-shrink-0">
          <Jazzicon diameter={32} seed={jsNumberForAddress(campaign.owner || "0x0")} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-epilogue text-sm text-white truncate group-hover:text-[#fdba74] transition-colors duration-200">
            {campaign.title}
          </p>
          <p className="font-epilogue text-[11px] text-white/30 truncate">
            by {campaign.name} · {days > 0 ? `${days}d left` : "Ended"}
          </p>
        </div>
      </div>

      {/* Bar + amount */}
      <div className="hidden sm:flex items-center gap-3 flex-shrink-0 w-[180px]">
        <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#f97316] to-[#03dac5] animate-barGrow"
            style={{ width: `${Math.max(pct, 4)}%`, animationDelay: `${delay + 0.2}s` }}
          />
        </div>
        <span className="font-jakarta font-bold text-xs text-[#03dac5] w-[72px] text-right">
          {raised.toFixed(2)} ETH
        </span>
      </div>

      {/* Mobile amount */}
      <span className="sm:hidden font-jakarta font-bold text-xs text-[#03dac5] flex-shrink-0">
        {raised.toFixed(2)}
      </span>
    </div>
  );
};

/* ─── Analytics Page ───────────────────────────────────────────────────── */
const Analytics = () => {
  const { campaigns = [], isLoading } = useStateContext();

  /* ── Aggregated stats ── */
  const {
    totalRaised,
    activeCampaigns,
    totalBackers,
    avgDonation,
    sparkRaised,
    sparkBackers,
    categorySegments,
    barData,
    topCampaigns,
    activityEvents,
  } = useMemo(() => {
    if (!campaigns.length)
      return {
        totalRaised: 0,
        activeCampaigns: 0,
        totalBackers: 0,
        avgDonation: 0,
        sparkRaised: [],
        sparkBackers: [],
        categorySegments: [],
        barData: [],
        topCampaigns: [],
        activityEvents: [],
      };

    let totalRaised = 0;
    let totalDonations = 0;
    const donorSet = new Set();
    const categoryMap = new Map();
    const events = [];

    // Sort campaigns by id to get chronological order
    const sorted = [...campaigns].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
    const raisedOverTime = [];
    const backersOverTime = [];
    let runningRaised = 0;
    let runningBackers = 0;

    sorted.forEach((c) => {
      const raised = parseFloat(c.amountCollected || 0);
      const target = parseFloat(c.target || 0);
      totalRaised += raised;

      // Category aggregation
      if (c.category) {
        categoryMap.set(c.category, (categoryMap.get(c.category) || 0) + raised);
      }

      // Donor counting
      if (Array.isArray(c.donators)) {
        c.donators.forEach((d, dIdx) => {
          if (d) {
            donorSet.add(d);
            totalDonations++;

            // Build activity events
            events.push({
              id: `don-${c.id}-${dIdx}`,
              type: "donation",
              address: d,
              description: `${d.slice(0, 6)}...${d.slice(-4)} donated to "${c.title}"`,
              amount: Array.isArray(c.donations)
                ? parseFloat(c.donations[dIdx] || 0).toFixed(3)
                : null,
              minutesAgo: Math.floor(Math.random() * 1440), // synthetic relative time
            });
          }
        });
      }

      // Campaign creation event
      events.push({
        id: `camp-${c.id}`,
        type: "campaign",
        address: c.owner,
        description: `New campaign "${c.title}" launched`,
        minutesAgo: Math.floor(Math.random() * 2880),
      });

      // Milestone events
      const progress = target > 0 ? (raised / target) * 100 : 0;
      if (progress >= 75) {
        events.push({
          id: `mile-${c.id}-75`,
          type: "milestone",
          description: `"${c.title}" reached 75% funding!`,
          minutesAgo: Math.floor(Math.random() * 720),
        });
      }

      // Sparkline data points
      runningRaised += raised;
      runningBackers += Array.isArray(c.donators) ? c.donators.length : 0;
      raisedOverTime.push(runningRaised);
      backersOverTime.push(runningBackers);
    });

    const active = campaigns.filter((c) => daysLeft(c.deadline) > 0).length;
    const avgDon = totalDonations > 0 ? totalRaised / totalDonations : 0;

    // Category segments for doughnut
    const categorySegments = Array.from(categoryMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);

    // Bar chart — last N campaigns by raised amount
    const recentCampaigns = sorted.slice(-12);
    const barData = recentCampaigns.map((c) => ({
      label: c.title?.length > 10 ? c.title.slice(0, 10) + "…" : c.title || "Untitled",
      value: parseFloat(c.amountCollected || 0),
    }));

    // Top campaigns by amount raised
    const topCampaigns = [...campaigns]
      .sort((a, b) => parseFloat(b.amountCollected || 0) - parseFloat(a.amountCollected || 0))
      .slice(0, 8);

    // Sort events by "recency"
    events.sort((a, b) => (a.minutesAgo || 0) - (b.minutesAgo || 0));

    return {
      totalRaised,
      activeCampaigns: active,
      totalBackers: donorSet.size,
      avgDonation: avgDon,
      sparkRaised: raisedOverTime.length > 1 ? raisedOverTime : [0, 0],
      sparkBackers: backersOverTime.length > 1 ? backersOverTime : [0, 0],
      categorySegments,
      barData,
      topCampaigns,
      activityEvents: events,
    };
  }, [campaigns]);

  const maxRaised = topCampaigns.length
    ? parseFloat(topCampaigns[0].amountCollected || 0)
    : 0;

  if (isLoading) {
    return (
      <div className="animate-fadeIn flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin-ring" />
          <p className="font-epilogue text-sm text-white/40">Loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* ══════════════════════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════════════════════ */}
      <div className="relative mb-10 px-1">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden">
          <div
            className="w-[500px] h-[250px] rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(3,218,197,0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
              marginTop: "-40px",
            }}
          />
        </div>

        <div className="relative text-center lg:text-left max-w-2xl pt-2 pb-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#03dac5]/25 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#03dac5] animate-pulse" />
            <span className="font-epilogue text-[10px] font-bold text-[#03dac5] tracking-[0.18em] uppercase">
              Platform Pulse · Live
            </span>
          </div>

          <h1
            className="font-jakarta font-extrabold leading-[1.05] mb-3 tracking-tight"
            style={{ fontSize: "clamp(28px, 6vw, 48px)" }}
          >
            <span className="text-white">Platform </span>
            <span className="gradient-text">Analytics</span>
          </h1>

          <p className="font-epilogue text-[14px] text-white/40 leading-relaxed max-w-[480px]">
            Real-time overview of all campaigns, donations, and on-chain activity
            across the Sentinel platform.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STAT CARDS WITH SPARKLINES
      ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
        <SparkStatCard
          value={`${totalRaised.toFixed(2)} ETH`}
          label="Total Raised"
          sparkData={sparkRaised}
          accentColor="#f97316"
          delay={0}
          icon={
            <svg className="w-5 h-5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <SparkStatCard
          value={activeCampaigns}
          label="Active Campaigns"
          sparkData={sparkRaised.map((_, i) => Math.max(1, Math.floor(i * 0.7)))}
          accentColor="#03dac5"
          delay={0.08}
          icon={
            <svg className="w-5 h-5 text-[#03dac5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        <SparkStatCard
          value={totalBackers}
          label="Unique Backers"
          sparkData={sparkBackers}
          accentColor="#f97316"
          delay={0.16}
          icon={
            <svg className="w-5 h-5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <SparkStatCard
          value={avgDonation > 0 ? `${avgDonation.toFixed(3)} ETH` : "—"}
          label="Avg. Donation Size"
          sparkData={sparkRaised.map((v, i) => (i > 0 ? v / (i + 1) : 0))}
          accentColor="#03dac5"
          delay={0.24}
          icon={
            <svg className="w-5 h-5 text-[#03dac5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* ══════════════════════════════════════════════════════════
          CHARTS — Bar + Doughnut
      ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5 mb-8 sm:mb-12">
        {/* Bar Chart */}
        <div className="lg:col-span-3 glass rounded-2xl p-5 sm:p-6 border border-white/[0.06]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-[3px] h-5 bg-gradient-to-b from-[#f97316] to-[#03dac5] rounded-full" />
            <h2 className="font-jakarta font-bold text-sm text-white/60 uppercase tracking-wide">
              Campaign Volumes
            </h2>
          </div>
          <AnimatedBarChart data={barData} labelKey="label" valueKey="value" unit="ETH" />
        </div>

        {/* Doughnut */}
        <div className="lg:col-span-2 glass rounded-2xl p-5 sm:p-6 border border-white/[0.06]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-[3px] h-5 bg-gradient-to-b from-[#03dac5] to-[#f97316] rounded-full" />
            <h2 className="font-jakarta font-bold text-sm text-white/60 uppercase tracking-wide">
              By Category
            </h2>
          </div>
          <DoughnutChart segments={categorySegments} unit="ETH" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ACTIVITY FEED
      ══════════════════════════════════════════════════════════ */}
      <div className="glass rounded-2xl p-5 sm:p-6 border border-white/[0.06] mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-5 bg-gradient-to-b from-[#f97316] to-[#22c55e] rounded-full" />
            <h2 className="font-jakarta font-bold text-sm text-white/60 uppercase tracking-wide">
              Recent Activity
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="font-epilogue text-[10px] text-white/30 uppercase tracking-wider">Live</span>
          </div>
        </div>
        <ActivityFeed events={activityEvents} maxItems={10} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          TOP CAMPAIGNS LEADERBOARD
      ══════════════════════════════════════════════════════════ */}
      <div className="glass rounded-2xl p-5 sm:p-6 border border-white/[0.06] mb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[3px] h-5 bg-gradient-to-b from-[#f97316] to-[#fb923c] rounded-full" />
          <h2 className="font-jakarta font-bold text-sm text-white/60 uppercase tracking-wide">
            Top Campaigns
          </h2>
          {topCampaigns.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#f97316]/20 border border-[#f97316]/30 font-epilogue font-semibold text-xs text-[#fdba74]">
              {topCampaigns.length}
            </span>
          )}
        </div>

        {topCampaigns.length > 0 ? (
          <div className="flex flex-col gap-1">
            {topCampaigns.map((campaign, idx) => (
              <LeaderboardRow
                key={campaign.id ?? idx}
                rank={idx + 1}
                campaign={campaign}
                maxRaised={maxRaised}
                delay={idx * 0.06}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-10">
            <p className="font-epilogue text-sm text-white/30">
              No campaigns yet — start one to see it on the leaderboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
