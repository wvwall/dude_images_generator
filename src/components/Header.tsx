import React from "react";
import { Sparkles } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 md:px-12 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
          <Sparkles size={20} fill="currentColor" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
            Dude
          </h1>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Creative Studio
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <span className="text-sm text-slate-500 italic">
          "Imagination is the beginning of creation."
        </span>
      </div>
    </header>
  );
};

export default Header;
