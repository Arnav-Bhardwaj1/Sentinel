import React, { useEffect, useMemo, useState } from "react";
import { useStateContext } from "../context";
import { DisplayCampaigns } from "../components";
import ollamaService from "../services/ollamaService";

const Profile = () => {
  const {
    isLoading,
    address,
    contract,
    campaigns,
    getUserCampaigns,
    userCampaigns,
  } = useStateContext();

  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState(null);
  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    getUserCampaigns();
  }, [contract, address, campaigns]);

  // Aggregate analytics for the signed-in creator
  const analytics = useMemo(() => {
    if (!userCampaigns || userCampaigns.length === 0) {
      return {
        totalRaised: 0,
        totalTarget: 0,
        totalBackers: 0,
        avgDonation: 0,
        categoryBreakdown: [],
        topDonors: [],
      };
    }

    let totalRaised = 0;
    let totalTarget = 0;
    const donorMap = new Map();
    const categoryMap = new Map();

    userCampaigns.forEach((c) => {
      const raised = parseFloat(c.amountCollected || 0);
      const target = parseFloat(c.target || 0);
      totalRaised += isNaN(raised) ? 0 : raised;
      totalTarget += isNaN(target) ? 0 : target;

      // Category totals
      if (c.category) {
        const prev = categoryMap.get(c.category) || { raised: 0, count: 0 };
        categoryMap.set(c.category, {
          raised: prev.raised + (isNaN(raised) ? 0 : raised),
          count: prev.count + 1,
        });
      }

      // Donor aggregates – use rich data when available
      if (Array.isArray(c.donators) && Array.isArray(c.donations)) {
        c.donators.forEach((donor, idx) => {
          const amount = parseFloat(c.donations[idx] || 0);
          if (!donor) return;
          const prev = donorMap.get(donor) || {
            total: 0,
            contributions: 0,
            campaigns: new Set(),
          };
          prev.total += isNaN(amount) ? 0 : amount;
          prev.contributions += 1;
          prev.campaigns.add(c.id);
          donorMap.set(donor, prev);
        });
      }
    });

    const uniqueDonors = donorMap.size;
    const totalDonatedAcrossTx = Array.from(donorMap.values()).reduce(
      (sum, d) => sum + d.total,
      0
    );
    const totalContributions = Array.from(donorMap.values()).reduce(
      (sum, d) => sum + d.contributions,
      0
    );

    const avgDonation =
      totalContributions > 0 ? totalDonatedAcrossTx / totalContributions : 0;

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, info]) => ({
        category,
        raised: info.raised,
        count: info.count,
      }))
      .sort((a, b) => b.raised - a.raised);

    const topDonors = Array.from(donorMap.entries())
      .map(([address, info]) => ({
        address,
        total: info.total,
        contributions: info.contributions,
        campaignsInvolved: info.campaigns.size,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      totalRaised,
      totalTarget,
      totalBackers: uniqueDonors,
      avgDonation,
      categoryBreakdown,
      topDonors,
    };
  }, [userCampaigns]);

  const formatEth = (value, decimals = 2) =>
    `${Number(value || 0).toFixed(decimals)} ETH`;

  const formatAddress = (addr) =>
    !addr ? "Unknown" : `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleGenerateInsight = async () => {
    if (!userCampaigns || userCampaigns.length === 0) return;
    setInsightLoading(true);
    setInsightError(null);

    try {
      const prompt = `You are an analytics coach for creators on Sentinel, a decentralized crowdfunding platform.

Creator wallet: ${address}
Number of campaigns: ${userCampaigns.length}
Total raised (all my campaigns): ${analytics.totalRaised.toFixed(4)} ETH
Combined funding goal: ${analytics.totalTarget.toFixed(4)} ETH
Unique donors: ${analytics.totalBackers}
Average on-chain donation size: ${analytics.avgDonation.toFixed(4)} ETH

Category breakdown (category -> raised ETH, campaigns):
${analytics.categoryBreakdown
  .map(
    (c) =>
      `- ${c.category}: ${c.raised.toFixed(4)} ETH across ${c.count} campaigns`
  )
  .join("\n")}

Top donors (address -> total ETH, contributions, campaigns):
${analytics.topDonors
  .map(
    (d) =>
      `- ${d.address}: ${d.total.toFixed(4)} ETH via ${d.contributions} tx across ${d.campaignsInvolved} campaigns`
  )
  .join("\n")}

Write a concise insight report (3 short bullet points) that:
- Highlights what I'm doing well as a campaign creator
- Points out 1–2 specific growth opportunities based on the numbers
- Suggests one actionable experiment I should run for my next campaign

Keep it friendly and practical. Do not restate raw numbers; focus on interpretation and next steps.`;

      const response = await ollamaService.generateResponse(prompt, false);
      setAiInsight(response.trim());
    } catch (error) {
      console.error("Error generating creator insight:", error);
      setInsightError(
        "Unable to generate insights. Please ensure Ollama is running locally."
      );
    } finally {
      setInsightLoading(false);
    }
  };

  const hasCampaigns = userCampaigns && userCampaigns.length > 0;

  return (
    <div className="animate-fadeIn flex flex-col gap-8">
      {/* Impact Analytics */}
      <section className="glass rounded-2xl border border-white/[0.06] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="font-epilogue text-[11px] uppercase tracking-[0.18em] text-[#f97316] mb-1">
              Creator Analytics
            </p>
            <h1 className="font-jakarta font-bold text-xl sm:text-2xl text-white">
              My Impact Dashboard
            </h1>
            <p className="font-epilogue text-xs sm:text-sm text-white/40 mt-1 max-w-lg">
              See how your campaigns are performing on-chain — donors, volume,
              and category traction in one place.
            </p>
          </div>

          <button
            onClick={handleGenerateInsight}
            disabled={!hasCampaigns || insightLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-epilogue text-xs sm:text-sm font-semibold
              ${
                !hasCampaigns
                  ? "bg-white/5 text-white/25 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#03dac5] to-[#14b8a6] text-[#021010] hover:shadow-[0_0_24px_rgba(20,184,166,0.45)]"
              } transition-all duration-200`}
          >
            {insightLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#021010] border-t-transparent rounded-full animate-spin" />
                Generating coach insight…
              </>
            ) : (
              <>
                <span className="w-4 h-4 rounded-full bg-[#021010]/10 flex items-center justify-center">
                  <span className="w-2 h-2 bg-[#021010] rounded-full" />
                </span>
                Get AI insight
              </>
            )}
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="glass rounded-xl p-4 border border-white/[0.05]">
            <p className="font-epilogue text-[11px] text-white/40 mb-1">
              Total Raised
            </p>
            <p className="font-jakarta font-bold text-lg sm:text-xl text-white">
              {formatEth(analytics.totalRaised, 3)}
            </p>
          </div>
          <div className="glass rounded-xl p-4 border border-white/[0.05]">
            <p className="font-epilogue text-[11px] text-white/40 mb-1">
              Funding Goal Coverage
            </p>
            <p className="font-jakarta font-bold text-lg sm:text-xl text-white">
              {analytics.totalTarget > 0
                ? `${Math.min(
                    (analytics.totalRaised / analytics.totalTarget) * 100,
                    999
                  ).toFixed(1)}%`
                : "—"}
            </p>
          </div>
          <div className="glass rounded-xl p-4 border border-white/[0.05]">
            <p className="font-epilogue text-[11px] text-white/40 mb-1">
              Unique Backers
            </p>
            <p className="font-jakarta font-bold text-lg sm:text-xl text-white">
              {analytics.totalBackers}
            </p>
          </div>
          <div className="glass rounded-xl p-4 border border-white/[0.05]">
            <p className="font-epilogue text-[11px] text-white/40 mb-1">
              Avg. Donation Size
            </p>
            <p className="font-jakarta font-bold text-lg sm:text-xl text-white">
              {analytics.avgDonation > 0
                ? formatEth(analytics.avgDonation, 3)
                : "—"}
            </p>
          </div>
        </div>

        {/* Breakdown + leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
          {/* Category breakdown */}
          <div className="glass rounded-xl border border-white/[0.05] p-4 lg:col-span-2">
            <p className="font-epilogue text-[11px] uppercase tracking-[0.18em] text-white/45 mb-3">
              Category performance
            </p>
            {analytics.categoryBreakdown.length === 0 ? (
              <p className="font-epilogue text-sm text-white/30">
                Launch a campaign to start seeing category insights.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {analytics.categoryBreakdown.map((item) => {
                  const percentOfTotal =
                    analytics.totalRaised > 0
                      ? (item.raised / analytics.totalRaised) * 100
                      : 0;
                  return (
                    <div key={item.category} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <p className="font-epilogue text-sm text-white/80">
                          {item.category}
                        </p>
                        <p className="font-epilogue text-xs text-white/40">
                          {formatEth(item.raised, 3)} ·{" "}
                          {percentOfTotal.toFixed(1)}%
                        </p>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#03dac5]"
                          style={{
                            width: `${Math.max(
                              6,
                              Math.min(percentOfTotal, 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top donors */}
          <div className="glass rounded-xl border border-white/[0.05] p-4">
            <p className="font-epilogue text-[11px] uppercase tracking-[0.18em] text-white/45 mb-3">
              Top supporters
            </p>
            {analytics.topDonors.length === 0 ? (
              <p className="font-epilogue text-sm text-white/30">
                Once donors support your campaigns, your top supporters will
                show up here.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {analytics.topDonors.map((donor, index) => (
                  <div
                    key={donor.address}
                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#f97316]/20 flex items-center justify-center text-[11px] font-jakarta font-bold text-[#f97316]">
                        #{index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-epilogue text-xs text-white truncate">
                          {formatAddress(donor.address)}
                        </p>
                        <p className="font-epilogue text-[11px] text-white/40">
                          {donor.campaignsInvolved} campaigns ·{" "}
                          {donor.contributions} tx
                        </p>
                      </div>
                    </div>
                    <p className="font-jakarta font-semibold text-xs text-[#03dac5] flex-shrink-0">
                      {donor.total.toFixed(3)} ETH
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI coach insight */}
        {(aiInsight || insightError) && (
          <div className="mt-6 rounded-xl border border-[#03dac5]/30 bg-[#00302b]/40 p-4">
            <p className="font-epilogue text-[11px] uppercase tracking-[0.18em] text-[#a7f3d0] mb-2">
              AI coach summary
            </p>
            {insightError ? (
              <p className="font-epilogue text-sm text-red-300">
                {insightError}
              </p>
            ) : (
              <p className="font-epilogue text-sm text-[#ecfeff] whitespace-pre-wrap leading-relaxed">
                {aiInsight}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Original "My Campaigns" grid */}
      <section>
        <DisplayCampaigns
          title="My Campaigns"
          isLoading={isLoading}
          campaigns={userCampaigns}
        />
      </section>
    </div>
  );
};

export default Profile;
