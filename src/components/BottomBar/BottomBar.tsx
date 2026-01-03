import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Image } from "lucide-react";

const BottomBar: React.FC = () => {
  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center p-3 text-sm font-hand transition-colors ${
      isActive
        ? "text-friends-purple"
        : "text-gray-400 hover:text-friends-yellow"
    }`;

  return (
    <section className="fixed rounded-t-2xl inset-x-0 bottom-0 z-[99] flex justify-around  bg-white border-t-4 shadow-lg md:hidden border-friends-purple">
      <NavLink to="/" className={navClasses}>
        <Home size={18} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/gallery" className={navClasses}>
        <Image size={18} />
        <span>Gallery</span>
      </NavLink>
    </section>
  );
};

export default BottomBar;
