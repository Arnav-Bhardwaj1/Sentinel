import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { logo } from "../assets";
import { navlinks } from "../constants";
import ThemeModes from "./ThemeModes";
import PaymentModal from "./PaymentModal";

/* ── Inline SVG icon set ─────────────────────────────────────── */
const NavIcons = {
  Dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Campaign: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
      <path d="M17.5 3.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 8.5-8.5z" />
    </svg>
  ),
  Withdraw: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <circle cx="7" cy="15" r="1" fill="currentColor" stroke="none" />
      <path d="M11 15h4" />
    </svg>
  ),
  Profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Disconnect: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Analytics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  ),
};

/* ── Tooltip wrapper ─────────────────────────────────────────── */
const Tip = ({ label }) => (
  <div className="absolute left-[calc(100%+14px)] px-3 py-1.5 rounded-lg glass text-slate-700 dark:text-white text-xs font-epilogue font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999]">
    {label}
  </div>
);

const Sidebar = () => {
  const [payOpen, setPayOpen] = useState(false);

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh] select-none">

      {/* Logo */}
      <NavLink to="/">
        <div className="w-[52px] h-[52px] rounded-2xl glass flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          <img src={logo} alt="Sentinel" className="w-8 h-8 object-contain" />
        </div>
      </NavLink>

      {/* Nav panel */}
      <div className="flex-1 flex flex-col justify-between items-center glass rounded-3xl w-[76px] py-5 mt-10">

        {/* Nav links */}
        <div className="flex flex-col items-center gap-1.5">
          {navlinks.map(({ name, route }) => (
            <NavLink key={name} to={route}>
              {({ isActive }) => (
                <div
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group
                    ${isActive
                      ? "bg-gradient-to-br from-[#f97316]/30 to-[#f97316]/10 shadow-[0_0_18px_rgba(249,115,22,0.4)] text-[#f97316]"
                      : "text-slate-400 dark:text-white/35 hover:text-slate-700 dark:hover:text-white/80 hover:bg-slate-200/60 dark:hover:bg-white/[0.07]"
                    }`}
                >
                  {/* Active bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-[#f97316] to-[#fb923c] rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  )}

                  {/* Icon */}
                  <span className={`w-[22px] h-[22px] transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                    {NavIcons[name]}
                  </span>

                  <Tip label={name} />
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Quick Pay */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={() => setPayOpen(true)}
            className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group text-slate-400 dark:text-white/35 hover:text-[#03dac5] hover:bg-[#03dac5]/[0.08]"
          >
            <span className="w-[22px] h-[22px] transition-transform duration-200 group-hover:scale-110">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
                <path d="M6 15h3M13 15h3" />
              </svg>
            </span>
            <Tip label="Quick Pay" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Theme toggle */}
        <div className="flex flex-col items-center gap-1">
          <ThemeModes />
        </div>
      </div>

      <PaymentModal
        isOpen={payOpen}
        onClose={() => setPayOpen(false)}
        campaignTitle="Quick Donation"
      />
    </div>
  );
};

export default Sidebar;
