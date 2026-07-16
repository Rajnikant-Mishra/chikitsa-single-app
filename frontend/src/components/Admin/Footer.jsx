import React from "react";
import { Lock, Cpu } from "lucide-react";

const Footer = () => {
  return (
    <footer className="h-14 bg-white border-t border-slate-100 flex items-center justify-between px-8 text-xs font-medium text-slate-400">
      <div className="flex items-center gap-2">
        <Cpu size={14} className="text-slate-300" />
        <span>Ecosystem Core Pipeline Version v4.8.2 (Stable Node)</span>
      </div>
      <div className="flex items-center gap-6">
        <p>© 2026 Evoquesys . All rights reserved.</p>
        
      </div>
    </footer>
  );
};

export default Footer;