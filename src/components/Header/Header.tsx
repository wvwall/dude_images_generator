import { Coffee } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `font-hand transition-colors underline-offset-4 decoration-2 ${
      isActive
        ? "text-xl text-friends-purple underline"
        : "text-sm hover:text-friends-yellow hover:underline"
    }`;

  return (
    <header className="px-2 w-full bg-friends-purple-light">
      <div className="flex relative top-2 justify-between items-center px-4 py-4 w-full bg-white rounded-2xl border-b-4 shadow-sm md:px-24 border-friends-purple">
        <div className="flex gap-4 items-center">
          <div className="flex justify-center items-center w-12 h-12 rounded-full border-2 shadow-lg bg-friends-purple border-friends-yellow">
            <Coffee size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="flex gap-1 items-center text-4xl tracking-wider text-black font-hand">
              D
              <span className="mt-2 w-2 h-2 rounded-full bg-friends-red"></span>
              U
              <span className="mt-2 w-2 h-2 rounded-full bg-friends-blue"></span>
              D
              <span className="mt-2 w-2 h-2 rounded-full bg-friends-yellow"></span>
              E
            </h1>
            <div className="flex gap-1 items-center">
              <span className="text-[8px] font-bold tracking-widest uppercase  text-friends-purple sm:text-xs">
                Central Perk Studio
              </span>
              <span className="text-[8px] text-gray-500 font-hand">
                v{process.env.VITE_APP_VERSION}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden gap-4 items-center md:flex">
          <NavLink to="/" className={navClasses}>
            Home
          </NavLink>

          <NavLink to="/gallery" className={navClasses}>
            Gallery
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
