import React from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const EVENT_STYLES = {
  donation: {
    color: "#f97316",
    bg: "bg-[#f97316]/10",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  campaign: {
    color: "#03dac5",
    bg: "bg-[#03dac5]/10",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  milestone: {
    color: "#22c55e",
    bg: "bg-green-500/10",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

const formatRelativeTime = (minutes) => {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${Math.floor(minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const ActivityFeed = ({ events = [], maxItems = 8 }) => {
  const displayed = events.slice(0, maxItems);

  if (!displayed.length) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="font-epilogue text-sm text-white/30">No activity yet — campaigns and donations will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {displayed.map((event, idx) => {
        const style = EVENT_STYLES[event.type] || EVENT_STYLES.donation;

        return (
          <div
            key={event.id || idx}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-all duration-200 animate-staggerFadeUp"
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10">
              {event.address ? (
                <Jazzicon diameter={32} seed={jsNumberForAddress(event.address)} />
              ) : (
                <div className="w-full h-full bg-white/[0.06] flex items-center justify-center">
                  <span style={{ color: style.color }}>{style.icon}</span>
                </div>
              )}
            </div>

            {/* Event content */}
            <div className="flex-1 min-w-0">
              <p className="font-epilogue text-[13px] text-white/70 truncate">
                {event.description}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.bg}`}
                  style={{ color: style.color }}
                >
                  {style.icon}
                  {event.type}
                </span>
                <span className="font-epilogue text-[10px] text-white/25">
                  {formatRelativeTime(event.minutesAgo || 0)}
                </span>
              </div>
            </div>

            {/* Amount badge — only for donations */}
            {event.amount != null && (
              <div className="flex-shrink-0 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <p className="font-jakarta font-bold text-xs text-[#03dac5]">
                  {event.amount} ETH
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
