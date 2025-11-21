import React, { useState } from "react";
import { ImagePlus, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="top-0 z-50 flex items-center justify-between w-full px-4 py-4 bg-white border-b-4 shadow-sm md:px-12 border-friends-purple">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 border-2 rounded-full shadow-lg bg-friends-purple border-friends-yellow">
          <ImagePlus size={24} className="text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="flex items-center gap-1 text-3xl tracking-wider text-black font-hand">
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
      <nav className="items-center hidden gap-8 md:flex">
        <Link
          to="/"
          className="text-base font-bold transition-colors text-friends-purple hover:text-friends-yellow hover:underline decoration-2 underline-offset-4">
          Home
        </Link>
        <Link
          to="/gallery"
          className="text-base font-bold transition-colors text-friends-purple hover:text-friends-yellow hover:underline decoration-2 underline-offset-4">
          Gallery
        </Link>
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
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="p-4 text-lg font-bold text-center border-b border-gray-100 text-friends-purple hover:text-friends-yellow hover:underline decoration-2 underline-offset-4">
            Home
          </Link>
          <Link
            to="/gallery"
            onClick={() => setIsMenuOpen(false)}
            className="p-4 text-lg font-bold text-center text-friends-purple hover:text-friends-yellow hover:underline decoration-2 underline-offset-4">
            Gallery
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
