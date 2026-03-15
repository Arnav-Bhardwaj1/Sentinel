import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { daysLeft } from "../utils";

/* ─── Icons ───────────────────────────────────────────────────────────────── */
const Icons = {
  search: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  dashboard: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v16m8-8H4" />
    </svg>
  ),
  analytics: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
    </svg>
  ),
  profile: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  theme: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  wallet: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  ),
  arrow: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  campaign: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
};

/* ─── Fuzzy match helper ──────────────────────────────────────────────────── */
const fuzzyMatch = (query, text) => {
  if (!query || !text) return false;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  // Character-by-character fuzzy
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
};

/* ─── Quick Actions ───────────────────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { id: "nav-home", label: "Go to Dashboard", icon: Icons.dashboard, route: "/", section: "Navigation" },
  { id: "nav-create", label: "Create Campaign", icon: Icons.plus, route: "/create-campaign", section: "Navigation" },
  { id: "nav-analytics", label: "View Analytics", icon: Icons.analytics, route: "/analytics", section: "Navigation" },
  { id: "nav-profile", label: "View Profile", icon: Icons.profile, route: "/profile", section: "Navigation" },
  { id: "nav-withdraw", label: "Withdraw Funds", icon: Icons.wallet, route: "/withdraw", section: "Navigation" },
  { id: "action-theme", label: "Toggle Theme (Dark / Light)", icon: Icons.theme, action: "toggle-theme", section: "Actions" },
];

/* ─── Keyboard badge ──────────────────────────────────────────────────────── */
const Kbd = ({ children }) => (
  <kbd className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-[5px] bg-white/[0.06] border border-white/[0.1] text-[10px] font-jakarta font-semibold text-white/40">
    {children}
  </kbd>
);

/* ═══════════════════════════════════════════════════════════════════════════
   COMMAND PALETTE
   ═══════════════════════════════════════════════════════════════════════════ */
const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { campaigns = [], toggleTheme, themeMode } = useStateContext();

  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIdx(0);
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  /* ── Build results ── */
  const results = useMemo(() => {
    const items = [];

    if (!query.trim()) {
      // Show all quick actions grouped
      QUICK_ACTIONS.forEach((a) =>
        items.push({ ...a, type: "action" })
      );
    } else {
      // Filter quick actions
      QUICK_ACTIONS.forEach((a) => {
        if (fuzzyMatch(query, a.label)) {
          items.push({ ...a, type: "action" });
        }
      });

      // Search campaigns
      campaigns.forEach((c) => {
        const matches =
          fuzzyMatch(query, c.title) ||
          fuzzyMatch(query, c.category) ||
          fuzzyMatch(query, c.description) ||
          fuzzyMatch(query, c.name);
        if (matches) {
          items.push({
            id: `campaign-${c.id}`,
            label: c.title,
            category: c.category,
            raised: c.amountCollected,
            target: c.target,
            owner: c.owner,
            ownerName: c.name,
            deadline: c.deadline,
            route: `/campaign-details/${c.id}`,
            type: "campaign",
            section: "Campaigns",
          });
        }
      });
    }

    return items;
  }, [query, campaigns]);

  // Clamp activeIdx when results change
  useEffect(() => {
    setActiveIdx((prev) => Math.min(prev, Math.max(results.length - 1, 0)));
  }, [results.length]);

  /* ── Execute result ── */
  const executeResult = useCallback(
    (item) => {
      if (!item) return;
      if (item.action === "toggle-theme") {
        toggleTheme(themeMode === "Dark" ? "Light" : "Dark");
      } else if (item.route) {
        navigate(item.route);
      }
      onClose();
    },
    [navigate, onClose, toggleTheme, themeMode]
  );

  /* ── Keyboard handler ── */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeResult(results[activeIdx]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [results, activeIdx, executeResult, onClose]
  );

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector(`[data-idx="${activeIdx}"]`);
    if (active) {
      active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIdx]);

  if (!isOpen) return null;

  /* ── Group results by section for rendering ── */
  const sections = [];
  let currentSection = null;
  results.forEach((item, idx) => {
    const section = item.section || "Results";
    if (section !== currentSection) {
      sections.push({ type: "header", label: section });
      currentSection = section;
    }
    sections.push({ type: "item", item, globalIdx: idx });
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 animate-backdropFade"
        style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[580px] glass-strong rounded-2xl border border-white/[0.1] shadow-[0_32px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(249,115,22,0.1)] overflow-hidden animate-scaleIn"
        onKeyDown={handleKeyDown}
      >
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#03dac5]" />

        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07]">
          <span className="text-white/30 flex-shrink-0">{Icons.search}</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search campaigns, navigate, or run actions…"
            className="flex-1 bg-transparent outline-none font-epilogue text-sm text-white placeholder:text-white/25"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Kbd>Esc</Kbd>
          </div>
        </div>

        {/* Results list */}
        <div
          ref={listRef}
          className="max-h-[360px] overflow-y-auto py-2 no-scrollbar"
        >
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="font-epilogue text-sm text-white/30 mb-1">No results found</p>
              <p className="font-epilogue text-xs text-white/15">Try a different search term</p>
            </div>
          ) : (
            sections.map((entry, sIdx) => {
              if (entry.type === "header") {
                return (
                  <div key={`h-${sIdx}`} className="px-5 pt-3 pb-1.5">
                    <p className="font-epilogue text-[10px] uppercase tracking-[0.18em] text-white/25 font-semibold">
                      {entry.label}
                    </p>
                  </div>
                );
              }

              const { item, globalIdx } = entry;
              const isActive = globalIdx === activeIdx;

              if (item.type === "campaign") {
                return (
                  <CampaignResultRow
                    key={item.id}
                    item={item}
                    isActive={isActive}
                    dataIdx={globalIdx}
                    onClick={() => executeResult(item)}
                    onMouseEnter={() => setActiveIdx(globalIdx)}
                  />
                );
              }

              return (
                <ActionResultRow
                  key={item.id}
                  item={item}
                  isActive={isActive}
                  dataIdx={globalIdx}
                  onClick={() => executeResult(item)}
                  onMouseEnter={() => setActiveIdx(globalIdx)}
                />
              );
            })
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span className="font-epilogue text-[10px] text-white/20 ml-1">navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <Kbd>↵</Kbd>
              <span className="font-epilogue text-[10px] text-white/20 ml-1">select</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Kbd>Esc</Kbd>
            <span className="font-epilogue text-[10px] text-white/20 ml-1">close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Action result row ───────────────────────────────────────────────────── */
const ActionResultRow = ({ item, isActive, dataIdx, onClick, onMouseEnter }) => (
  <div
    data-idx={dataIdx}
    className={`flex items-center gap-3 px-5 py-2.5 mx-2 rounded-xl cursor-pointer transition-all duration-150 ${
      isActive
        ? "bg-gradient-to-r from-[#f97316]/15 to-[#f97316]/5 shadow-[0_0_0_1px_rgba(249,115,22,0.2)]"
        : "hover:bg-white/[0.03]"
    }`}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
  >
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
        isActive ? "bg-[#f97316]/20 text-[#f97316]" : "bg-white/[0.04] text-white/30"
      }`}
    >
      {item.icon}
    </div>
    <span
      className={`font-epilogue text-sm flex-1 transition-colors duration-150 ${
        isActive ? "text-white" : "text-white/60"
      }`}
    >
      {item.label}
    </span>
    {isActive && (
      <span className="text-[#f97316]/60">{Icons.arrow}</span>
    )}
  </div>
);

/* ─── Campaign result row ─────────────────────────────────────────────────── */
const CampaignResultRow = ({ item, isActive, dataIdx, onClick, onMouseEnter }) => {
  const progress = Math.min(
    (parseFloat(item.raised || 0) / parseFloat(item.target || 1)) * 100,
    100
  );
  const days = daysLeft(item.deadline);

  return (
    <div
      data-idx={dataIdx}
      className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-xl cursor-pointer transition-all duration-150 ${
        isActive
          ? "bg-gradient-to-r from-[#f97316]/15 to-[#f97316]/5 shadow-[0_0_0_1px_rgba(249,115,22,0.2)]"
          : "hover:bg-white/[0.03]"
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10">
        <Jazzicon diameter={32} seed={jsNumberForAddress(item.owner || "0x0")} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p
            className={`font-epilogue text-sm truncate transition-colors duration-150 ${
              isActive ? "text-white font-semibold" : "text-white/60"
            }`}
          >
            {item.label}
          </p>
          {item.category && (
            <span className="px-2 py-0.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 text-[#fdba74] font-epilogue text-[9px] font-semibold flex-shrink-0">
              {item.category}
            </span>
          )}
        </div>
        {/* Progress bar + stats */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden max-w-[120px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f97316] to-[#03dac5]"
              style={{ width: `${Math.max(progress, 3)}%` }}
            />
          </div>
          <span className="font-epilogue text-[10px] text-white/30 flex-shrink-0">
            {parseFloat(item.raised || 0).toFixed(2)} / {parseFloat(item.target || 0).toFixed(2)} ETH
          </span>
          <span className="font-epilogue text-[10px] text-white/20 flex-shrink-0">
            · {days > 0 ? `${days}d` : "Ended"}
          </span>
        </div>
      </div>

      {isActive && (
        <span className="text-[#f97316]/60 flex-shrink-0">{Icons.arrow}</span>
      )}
    </div>
  );
};

export default CommandPalette;
