import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useStateContext } from "../context";
import { cross, logo, menu, search } from "../assets";
import { navlinks } from "../constants";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { ConnectWallet, darkTheme, lightTheme } from "@thirdweb-dev/react";
import ThemeModes from "./ThemeModes";

const Navbar = ({ onOpenCommandPalette }) => {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { address, isDark } = useStateContext();

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      {/* Search trigger — opens Command Palette */}
      <button
        onClick={onOpenCommandPalette}
        className="lg:flex-1 flex flex-row items-center max-w-[480px] glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#f97316]/40 hover:shadow-[0_0_0_2px_rgba(249,115,22,0.15)] group cursor-pointer"
      >
        <div className="flex items-center gap-3 w-full px-5 py-3">
          <svg className="w-4 h-4 text-slate-400 dark:text-white/30 group-hover:text-[#f97316] transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <span className="font-epilogue font-normal text-sm text-slate-400 dark:text-white/30 flex-1 text-left">
            Search campaigns…
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <kbd className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-[5px] bg-white/[0.06] border border-white/[0.1] text-[10px] font-jakarta font-semibold text-white/30">
              Ctrl
            </kbd>
            <kbd className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-[5px] bg-white/[0.06] border border-white/[0.1] text-[10px] font-jakarta font-semibold text-white/30">
              K
            </kbd>
          </div>
        </div>
      </button>

      {/* Desktop right section */}
      <div className="sm:flex hidden flex-row items-center justify-end gap-4">
        <ConnectWallet
          className="!font-epilogue !font-semibold !text-sm !rounded-xl !px-5 !py-2.5 !border-0 !outline-none"
          style={{
            background: "linear-gradient(135deg, #03dac5, #00b4a0)",
            color: "#07070f",
            boxShadow: "0 0 20px rgba(3,218,197,0.3)",
          }}
          theme={!isDark ? lightTheme({
            colors: { accentButtonBg: "#03dac5", primaryButtonBg: "#03dac5", accentText: "#03dac5" },
          }) : darkTheme({
            colors: {
              accentButtonBg: "#03dac5",
              primaryButtonBg: "#03dac5",
              accentText: "#03dac5",
            },
          })}
          modalTitle="Sentinel"
          modalSize="wide"
          welcomeScreen={{
            img: { src: `${logo}`, width: 200, height: 200 },
            title: "Welcome to Sentinel",
          }}
          modalTitleIconUrl={logo}
          showThirdwebBranding={false}
        />
        <NavLink to="/profile">
          <div className="w-[46px] h-[46px] rounded-full ring-2 ring-[#f97316]/50 hover:ring-[#f97316] transition-all duration-200 overflow-hidden cursor-pointer hover:shadow-[0_0_16px_rgba(249,115,22,0.4)]">
            <Jazzicon diameter={46} seed={jsNumberForAddress(`${address}`)} />
          </div>
        </NavLink>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex justify-between items-center relative">
        <NavLink to="/">
          <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
          </div>
        </NavLink>

        <div className="flex items-center gap-2">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:border-[#f97316]/40 transition-colors"
          >
            <img src={search} alt="search" className="w-4 h-4 object-contain opacity-60" />
          </button>

          <button
            className="w-10 h-10 glass rounded-xl flex items-center justify-center"
            onClick={() => setToggleDrawer((prev) => !prev)}
          >
            <img
              src={toggleDrawer ? cross : menu}
              alt="menu"
              className={`w-5 h-5 object-contain transition-transform duration-200 ${toggleDrawer ? "-rotate-90" : ""}`}
            />
          </button>
        </div>

        {/* Drawer */}
        <div
          className={`absolute top-16 right-0 left-0 glass rounded-2xl z-50 overflow-hidden transition-all duration-300 ${toggleDrawer ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
        >
          <ul className="py-2">
            {navlinks.map((Link) => (
              <NavLink key={Link.name} to={Link.route}>
                {({ isActive }) => (
                  <li
                    className={`flex items-center gap-3 px-5 py-3 transition-colors duration-150 ${isActive ? "bg-[#f97316]/15" : "hover:bg-slate-200/60 dark:hover:bg-white/[0.05]"
                      }`}
                    onClick={() => setToggleDrawer(false)}
                  >
                    <img src={Link.imgUrl} alt={Link.name} className="w-5 h-5 object-contain opacity-70" />
                    <p className={`font-epilogue font-semibold text-sm ${isActive ? "text-[#f97316]" : "text-slate-600 dark:text-white/70"}`}>
                      {Link.name}
                    </p>
                  </li>
                )}
              </NavLink>
            ))}
          </ul>
          <div className="flex justify-between items-center px-5 py-4 border-t border-slate-200 dark:border-white/[0.07]">
            <ConnectWallet
              className="!font-epilogue !font-semibold !text-sm !rounded-xl !border-0 !outline-none"
              style={{
                background: "linear-gradient(135deg, #03dac5, #00b4a0)",
                color: "#07070f",
              }}
              theme={!isDark ? lightTheme({
                colors: { accentButtonBg: "#03dac5", primaryButtonBg: "#03dac5", accentText: "#03dac5" },
              }) : darkTheme({
                colors: { accentButtonBg: "#03dac5", primaryButtonBg: "#03dac5", accentText: "#03dac5" },
              })}
              modalTitle="Sentinel"
              modalSize="wide"
              welcomeScreen={{
                img: { src: `${logo}`, width: 200, height: 200 },
                title: "Welcome to Sentinel",
              }}
              modalTitleIconUrl={logo}
              showThirdwebBranding={false}
            />
            <ThemeModes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
