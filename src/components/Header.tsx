import React from "react";
import { Coffee } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b-4 border-friends-purple bg-white top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-friends-purple rounded-full flex items-center justify-center shadow-lg border-2 border-friends-yellow">
          <Coffee size={24} className="text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-hand tracking-wider text-black flex items-center gap-1">
            DUDE
            <span className="w-2 h-2 rounded-full bg-friends-red mt-2"></span>
            <span className="w-2 h-2 rounded-full bg-friends-blue mt-2"></span>
            <span className="w-2 h-2 rounded-full bg-friends-yellow mt-2"></span>
          </h1>
          <span className="text-xs font-bold tracking-widest text-friends-purple uppercase">
            Creative Studio
          </span>
        </div>
      </div>
      {/* 
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-friends-yellow text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          The One With AI
        </span>
      </div> */}
    </header>
  );
};

export default Header;
