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
            D <span className="w-2 h-2 rounded-full bg-friends-red mt-2"></span>
            U<span className="w-2 h-2 rounded-full bg-friends-blue mt-2"></span>
            D
            <span className="w-2 h-2 rounded-full bg-friends-yellow mt-2"></span>
            E
          </h1>
          <span className="text-xs font-bold tracking-widest text-friends-purple uppercase">
            Central Perk Studio
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
