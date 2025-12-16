import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Home, Image } from "lucide-react";

const BottomBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);
  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center p-2 text-xs font-hand transition-colors ${
      isActive
        ? "text-friends-purple"
        : "text-gray-400 hover:text-friends-yellow"
    }`;

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-50 flex justify-around p-2 bg-white border-t-4 shadow-lg md:hidden border-friends-purple transform transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}>
      <NavLink to="/" className={navClasses}>
        <Home size={18} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/gallery" className={navClasses}>
        <Image size={18} />
        <span>Gallery</span>
      </NavLink>
    </nav>
  );
};

export default BottomBar;
