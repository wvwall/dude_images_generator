import { Coffee } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `text-xl font-hand transition-colors underline-offset-4 decoration-4 ${
      isActive
        ? "text-friends-purple underline"
        : " hover:text-friends-yellow hover:underline"
    }`;

  return (
    <header className="top-0 z-50 flex items-center justify-between w-full px-4 py-4 bg-white border-b-4 shadow-sm md:px-24 border-friends-purple">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 border-2 rounded-full shadow-lg bg-friends-purple border-friends-yellow">
          <Coffee size={24} className="text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="flex items-center gap-1 text-4xl tracking-wider text-black font-hand">
            D <span className="w-2 h-2 mt-2 rounded-full bg-friends-red"></span>
            U<span className="w-2 h-2 mt-2 rounded-full bg-friends-blue"></span>
            D
            <span className="w-2 h-2 mt-2 rounded-full bg-friends-yellow"></span>
            E
          </h1>
          <span className="hidden text-xs font-bold tracking-widest uppercase text-friends-purple sm:inline-block">
            Central Perk Studio
          </span>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="items-center hidden gap-4 md:flex">
        <NavLink to="/" className={navClasses}>
          Home
        </NavLink>

        <NavLink to="/gallery" className={navClasses}>
          Gallery
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
