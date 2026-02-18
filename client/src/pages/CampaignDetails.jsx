import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import {
  CountBox,
  CustomButton,
  Loader,
  Expandable,
  FormField,
} from "../components";
import ThermometerChart from "../components/ThermometerChart";
import CircularMilestoneGauge from "../components/CircularMilestoneGauge";
import ImpactTooltip from "../components/ImpactTooltip";
import ChatbotWidget from "../components/ChatbotWidget";
import MilestoneNotification from "../components/MilestoneNotification";
import milestoneService from "../services/milestoneService";
import { calculateBarPercentage, daysLeft } from "../utils";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { share } from "../assets";

const SectionHeader = ({ label }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-[3px] h-5 bg-gradient-to-b from-[#f97316] to-[#03dac5] rounded-full" />
    <span className="section-label text-white/50">{label}</span>
  </div>
);

const CampaignDetails = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const {
    getDonations,
    contract,
    address,
    donate,
    deleteCampaign,
    campaigns,
    isLoading,
    setIsLoading,
  } = useStateContext();
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const [campaign, setCampaign] = useState([]);
  const [injectMetaTags, setInjectMetaTags] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [showImpactTooltip, setShowImpactTooltip] = useState(false);
  const [milestoneNotification, setMilestoneNotification] = useState(null);

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      const foundCampaign = campaigns.find((c) => c.id === Number(campaignId));
      setCampaign(foundCampaign);
      if (foundCampaign) {
        setMilestones(milestoneService.calculateMilestones(foundCampaign));
      }
    }
  }, [campaigns, campaignId]);

  const fetchDonators = async () => {
    const data = await getDonations(campaignId);
    setDonators(data);
  };

  const handleDonate = async () => {
    setIsLoading(true);
    if (!address) {
      toast.error("Please connect to MetaMask🦊", { position: "top-right", autoClose: 5000, theme: "dark" });
      setIsLoading(false);
      return;
    }
    if (amount === 0 || amount === "") {
      toast.error("Please enter a valid donation amount.", { position: "top-right", autoClose: 5000, theme: "dark" });
      setIsLoading(false);
      return;
    }
    try {
      const previousAmount = campaign?.amountCollected;
      await donate(campaign?.id, amount);
      const newAmount = parseFloat(previousAmount) + parseFloat(amount);
      const milestoneReached = milestoneService.checkMilestoneReached(
        campaign?.id, previousAmount, newAmount.toString(), campaign?.target
      );
      if (milestoneReached) {
        const report = await milestoneService.generateMilestoneReport(campaign, milestoneReached, donators);
        await milestoneService.notifyDonors(donators, report, campaign?.title, milestoneReached.name);
        setMilestoneNotification({ milestone: milestoneReached, report });
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error donating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ image: campaign?.image, title: campaign?.title, text: campaign?.description, url: window.location.href })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
    setInjectMetaTags(true);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const confirmDelete = confirm("Do you really want to delete this Campaign");
    if (!confirmDelete) {
      toast.warning("🤔 No campaign is deleted. You've canceled the operation.", { position: "top-right", autoClose: 5000, theme: "dark" });
      setIsLoading(false);
      return;
    }
    await deleteCampaign(campaign?.id);
    navigate("/");
    setIsLoading(false);
  };

  const remainingDays = daysLeft(campaign?.deadline);
  const progressPct = Math.min(calculateBarPercentage(campaign?.target, campaign?.amountCollected), 100);

  if (campaigns?.length <= 0) return <Loader />;

  return (
    <div className="animate-fadeIn">
      {injectMetaTags && (
        <Helmet>
          <meta property="og:title" content={campaign?.title} />
          <meta property="og:description" content={campaign?.description} />
          {campaign?.image && <meta property="og:image" content={campaign?.image} />}
        </Helmet>
      )}
      {isLoading && <Loader />}

      {/* ── Hero image ── */}
      <div className="relative w-full h-[360px] rounded-3xl overflow-hidden mb-8">
        <img
          src={campaign?.image}
          alt="campaign"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-[#07070f]/40 to-transparent" />

        {/* Title + category + share — over the image */}
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full bg-[#f97316]/30 border border-[#f97316]/40 font-epilogue text-[11px] text-[#fdba74] font-medium tracking-wide">
                  {campaign?.category}
                </span>
              </div>
              <h1 className="font-jakarta font-bold text-2xl text-white leading-snug max-w-xl">
                {campaign?.title}
              </h1>
            </div>
            <button
              onClick={handleShare}
              className="flex-shrink-0 w-10 h-10 glass rounded-xl flex items-center justify-center hover:border-[#f97316]/50 transition-colors"
            >
              <img src={share} alt="share" className="w-4 h-4 object-contain opacity-70" />
            </button>
          </div>
        </div>

        {/* Progress bar at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#f97316] to-[#03dac5]"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="flex flex-wrap gap-4 mb-10">
        <CountBox title="Days Left" value={remainingDays === 0 ? "Ended" : remainingDays.toString()} />
        <CountBox title={`Raised of ${campaign?.target} ETH`} value={campaign?.amountCollected} />
        <CountBox title="Total Backers" value={donators?.length} />
      </div>

      {/* ── Visualizations ── */}
      <div className="w-full flex lg:flex-row flex-col gap-6 mb-10">
        <div className="flex-1 glass rounded-2xl p-6 flex justify-center items-center border border-white/[0.06]">
          <ThermometerChart
            current={parseFloat(campaign?.amountCollected || 0)}
            target={parseFloat(campaign?.target || 1)}
            height={320}
          />
        </div>
        <div className="flex-[2] glass rounded-2xl p-6 border border-white/[0.06]">
          <h3 className="font-jakarta font-bold text-base text-white mb-5">Campaign Milestones</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {milestones.map((milestone, index) => (
              <CircularMilestoneGauge key={index} milestone={milestone} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content + donation panel ── */}
      <div className="flex lg:flex-row flex-col gap-6">

        {/* Left: content sections */}
        <div className="flex-[2] flex flex-col gap-6">

          {/* Organizer */}
          <div className="glass rounded-2xl p-6 border border-white/[0.06]">
            <SectionHeader label="Organizer" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full ring-2 ring-[#f97316]/30 overflow-hidden flex-shrink-0">
                <Jazzicon diameter={48} seed={jsNumberForAddress(`${campaign?.owner}`)} />
              </div>
              <div className="min-w-0">
                <p className="font-epilogue font-semibold text-sm text-white truncate">
                  {campaign?.name}
                  <span className="font-normal text-white/40"> · organizing for </span>
                  <span className="text-[#fdba74]">{campaign?.category}</span>
                </p>
                <p className="font-epilogue text-[12px] text-white/30 truncate mt-0.5">
                  {campaign?.owner}
                </p>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="glass rounded-2xl p-6 border border-white/[0.06]">
            <SectionHeader label="Story" />
            <Expandable>{campaign?.description}</Expandable>
          </div>

          {/* Donors */}
          <div className="glass rounded-2xl p-6 border border-white/[0.06]">
            <SectionHeader label={`Donors · ${donators?.length}`} />
            {donators?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className={`flex justify-between items-center px-4 py-3 rounded-xl ${
                      index % 2 === 0 ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <p className="font-epilogue text-[13px] text-white/40 truncate flex-1 mr-4">
                      <span className="text-[#f97316] font-semibold mr-2">{index + 1}</span>
                      {item.donator}
                    </p>
                    <p className="font-jakarta font-semibold text-sm text-[#03dac5] flex-shrink-0">
                      {item.donation} ETH
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-epilogue text-sm text-white/30 text-center py-6">
                No donors yet — be the first to contribute!
              </p>
            )}
          </div>
        </div>

        {/* Right: donation panel */}
        <div className="flex-1 min-w-[280px]">
          <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden sticky top-5">
            {/* Gradient header */}
            <div className="relative p-5 border-b border-white/[0.07]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#f97316]/10 to-[#03dac5]/5" />
              <h4 className="relative font-jakarta font-bold text-base text-white">Fund This Campaign</h4>
              <p className="relative font-epilogue text-xs text-white/35 mt-1">
                Every contribution makes a difference
              </p>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <FormField
                labelName="Amount (ETH)"
                placeholder="0.1"
                inputType="number"
                value={amount}
                handleChange={(e) => {
                  setAmount(e.target.value);
                  setShowImpactTooltip(true);
                }}
              />

              {/* AI Impact Tooltip */}
              <ImpactTooltip
                amount={amount}
                campaignData={{
                  title: campaign?.title,
                  category: campaign?.category,
                  description: campaign?.description,
                  target: campaign?.target,
                }}
                visible={showImpactTooltip}
              />

              {/* Empower block */}
              <div className="relative overflow-hidden rounded-xl p-4 border border-[#f97316]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/10 to-transparent" />
                <p className="relative font-jakarta font-semibold text-sm text-white mb-1">
                  Empower change. Support now.
                </p>
                <p className="relative font-epilogue text-xs text-white/35 leading-relaxed">
                  Your donation fuels progress and transforms lives.
                </p>
              </div>

              <CustomButton
                btnType="button"
                title={remainingDays === 0 ? "Campaign Ended" : "Fund Campaign →"}
                styles={`w-full ${
                  remainingDays === 0
                    ? "bg-white/10 text-white/40"
                    : "bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:shadow-[0_0_24px_rgba(249,115,22,0.5)]"
                }`}
                isDisabled={remainingDays === 0}
                handleClick={handleDonate}
              />
            </div>
          </div>

          {/* Owner actions */}
          {address === campaign?.owner && (
            <div className="flex flex-col gap-3 mt-4">
              <Link to={`/update-campaign/${campaign?.id}`}>
                <CustomButton
                  btnType="button"
                  title="Edit Campaign"
                  styles="w-full bg-[#03dac5]/20 text-[#03dac5] border border-[#03dac5]/30 hover:bg-[#03dac5]/30"
                  isDisabled={isLoading}
                />
              </Link>
              <CustomButton
                btnType="button"
                title="Delete Campaign"
                styles="w-full bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20"
                handleClick={handleDelete}
                isDisabled={isLoading}
              />
            </div>
          )}
        </div>
      </div>

      {/* AI Chatbot Widget */}
      <ChatbotWidget
        campaignData={{
          title: campaign?.title,
          category: campaign?.category,
          target: campaign?.target,
          amountCollected: campaign?.amountCollected,
          daysLeft: remainingDays,
          description: campaign?.description,
        }}
      />

      {/* Milestone Notification */}
      {milestoneNotification && (
        <MilestoneNotification
          milestone={milestoneNotification.milestone}
          report={milestoneNotification.report}
          onClose={() => {
            setMilestoneNotification(null);
            navigate("/");
          }}
        />
      )}
    </div>
  );
};

export default CampaignDetails;
