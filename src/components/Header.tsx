import React, { useState } from "react";
import { Coffee, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `text-xl font-hand transition-colors underline-offset-4 decoration-4 ${
      isActive
        ? "text-friends-purple underline"
        : " hover:text-friends-yellow hover:underline"
    }`;

  const mobileNavClasses = ({ isActive }: { isActive: boolean }) =>
    `p-4 text-lg font-hand text-center underline-offset-2 decoration-2 ${
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

      {/* Mobile Menu Button */}
      <button
        className="p-2 transition-colors rounded-lg md:hidden text-friends-purple hover:bg-friends-cream"
        onClick={toggleMenu}
        aria-label="Toggle menu">
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-[84px] sm:top-[88px] z-50 left-0 w-full bg-white border-b-4 border-friends-purple shadow-xl md:hidden flex flex-col animate-in slide-in-from-top-5 duration-200">
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={mobileNavClasses}>
            Home
          </NavLink>

          <NavLink
            to="/gallery"
            onClick={() => setIsMenuOpen(false)}
            className={mobileNavClasses}>
            Gallery
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
