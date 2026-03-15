import React, { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, Navbar, Footer } from "./components";
import CommandPalette from "./components/CommandPalette";

const App = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const closePalette = useCallback(() => setCommandPaletteOpen(false), []);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#07070f] overflow-x-hidden transition-colors duration-200">
      {/* Dot grid background */}
      <div className="fixed inset-0 dot-grid opacity-100 pointer-events-none z-0" />

      {/* Ambient glow blobs */}
      <div className="ambient-violet" />
      <div className="ambient-teal" />

      {/* Layout */}
      <div className="relative z-10 flex sm:p-8 p-4 min-h-screen">
        {/* Sidebar */}
        <div className="sm:flex hidden mr-8 relative z-[100]">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex flex-col justify-between w-full gap-10">
          <div className="flex-1 max-sm:w-full sm:pr-5">
            <Navbar onOpenCommandPalette={openPalette} />
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>

      {/* Command Palette (global, above everything) */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={closePalette} />
    </div>
  );
};

export default App;
