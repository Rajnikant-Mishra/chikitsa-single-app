import React from "react";
import { Cpu } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
        
        {/* Left Side */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <Cpu size={16} className="text-slate-400 flex-shrink-0" />
          <span className="break-words">
            Ecosystem Core Pipeline Version v4.8.2 (Stable Node)
          </span>
        </div>

        {/* Right Side */}
        <div className="text-center md:text-right">
          <p>© 2026 Evoquesys. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;