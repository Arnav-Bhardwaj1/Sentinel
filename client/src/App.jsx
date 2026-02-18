import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, Navbar, Footer } from "./components";

const App = () => {
  return (
    <div className="relative min-h-screen bg-[#07070f] overflow-x-hidden">
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
            <Navbar />
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
