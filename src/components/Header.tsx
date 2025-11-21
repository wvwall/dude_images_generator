import React, { useState } from "react";
import { Coffee, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
    
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          to="/"
          className="text-base font-bold text-friends-purple hover:text-friends-red hover:underline decoration-2 underline-offset-4 transition-colors">
          Home
        </Link>
        <Link
          to="/gallery"
          className="text-base font-bold text-friends-purple hover:text-friends-red hover:underline decoration-2 underline-offset-4 transition-colors">
          Gallery
        </Link>
      </nav>

        {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-friends-purple p-2 hover:bg-friends-cream rounded-lg transition-colors"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b-4 border-friends-purple shadow-xl md:hidden flex flex-col animate-in slide-in-from-top-5 duration-200">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="p-4 text-center text-lg font-bold text-friends-purple hover:bg-friends-cream border-b border-gray-100">
            Home
          </Link>
          <Link
            to="/gallery"
            onClick={() => setIsMenuOpen(false)}
            className="p-4 text-center text-lg font-bold text-friends-purple hover:bg-friends-cream">
            Gallery
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
