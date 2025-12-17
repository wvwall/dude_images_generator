import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Image } from "lucide-react";

const BottomBar: React.FC = () => {
  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center p-2 text-xs font-hand transition-colors ${
      isActive
        ? "text-friends-purple"
        : "text-gray-400 hover:text-friends-yellow"
    }`;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[99] flex justify-around bg-white border-t-4 shadow-lg md:hidden border-friends-purple">
      <NavLink to="/" className={navClasses}>
        <Home size={16} />
        <span className="p-1">Home</span>
      </NavLink>
      <NavLink to="/gallery" className={navClasses}>
        <Image size={16} />
        <span className="p-">Gallery</span>
      </NavLink>
    </nav>
  );
};

export default BottomBar;
