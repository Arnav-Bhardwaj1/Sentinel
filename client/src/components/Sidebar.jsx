import React from "react";
import { NavLink } from "react-router-dom";
import { logo } from "../assets";
import { navlinks } from "../constants";
import Icon from "./Icon";
import ThemeModes from "./ThemeModes";

const Sidebar = () => {
  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh] select-none">
      {/* Logo */}
      <NavLink to="/">
        <div className="w-[52px] h-[52px] rounded-2xl glass flex items-center justify-center animate-pulse-glow transition-all duration-300 hover:scale-105">
          <img src={logo} alt="Sentinel" className="w-8 h-8 object-contain" />
        </div>
      </NavLink>

      {/* Nav panel */}
      <div className="flex-1 flex flex-col justify-between items-center glass rounded-3xl w-[76px] py-5 mt-10">
        {/* Nav icons */}
        <div className="flex flex-col justify-center items-center gap-2">
          {navlinks.map((Link) => (
            <NavLink key={Link.name} to={Link.route}>
              {({ isActive }) => (
                <div
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 group
                    ${isActive
                      ? "bg-[#f97316]/25 shadow-[0_0_16px_rgba(249,115,22,0.45)]"
                      : "hover:bg-white/[0.06]"
                    }`}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#f97316] rounded-r-full" />
                  )}
                  <Icon {...Link} isActive={isActive} />

                  {/* Tooltip */}
                  <div className="absolute left-[calc(100%+12px)] px-3 py-1.5 rounded-lg glass text-white text-xs font-epilogue font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999]">
                    {Link.name}
                  </div>
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-3" />

        {/* Theme modes */}
        <div className="flex flex-col items-center gap-1">
          <ThemeModes />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
