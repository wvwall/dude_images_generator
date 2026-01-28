import { Coffee, LogOut, Moon, Sun } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `font-hand transition-colors underline-offset-4 decoration-2 ${
      isActive
        ? "text-2xl text-friends-purple dark:text-friends-yellow underline"
        : "text-xl hover:text-friends-yellow hover:underline dark:text-gray-300"
    }`;

  return (
    <header className="w-full bg-friends-purple-light dark:bg-dark-bg">
      <div className="flex items-center w-full px-4 py-4 bg-white dark:bg-dark-surface border-b-4 shadow-xs md:px-0 rounded-b-2xl border-friends-purple">
        <div className="flex items-center justify-center flex-1 gap-4">
          <NavLink
            to="/"
            className="flex items-center gap-4 transition-opacity hover:opacity-80">
            <div className="flex items-center justify-center w-12 h-12 border-2 rounded-full shadow-lg bg-friends-purple border-friends-yellow">
              <Coffee size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="flex items-center gap-1 text-3xl tracking-wider text-black dark:text-white font-hand">
                D
                <span className="w-2 h-2 mt-2 rounded-full bg-friends-red"></span>
                U
                <span className="w-2 h-2 mt-2 rounded-full bg-friends-blue"></span>
                D
                <span className="w-2 h-2 mt-2 rounded-full bg-friends-yellow"></span>
                E
              </h1>
              <div className="flex items-center gap-1">
                <span className="text-[7px] font-bold tracking-widest uppercase text-friends-purple dark:text-friends-purple-light sm:text-[10px]">
                  Central Perk Studio
                </span>
                <span className="text-[8px] text-gray-500 dark:text-gray-400 font-hand">
                  v{process.env.VITE_APP_VERSION}
                </span>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Desktop Nav - only visible when authenticated */}
        <nav
          className={`items-center justify-center flex-1 hidden gap-6 md:flex ${
            isAuthenticated ? "opacity-100" : "opacity-0"
          }`}>
          <>
            <NavLink to="/" className={navClasses}>
              Home
            </NavLink>

            <NavLink to="/gallery" className={navClasses}>
              Gallery
            </NavLink>
          </>
        </nav>

        <div className="flex items-center justify-end flex-1 md:justify-center gap-3">
          {/* Theme toggle - always visible */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 hover:cursor-pointer transition-colors rounded-full text-friends-purple dark:text-friends-yellow hover:bg-friends-purple/10 dark:hover:bg-friends-yellow/10 hover:scale-110"
            title={isDark ? "Light mode" : "Dark mode"}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User avatar with dropdown - only visible when authenticated */}
          {isAuthenticated && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex hover:cursor-pointer items-center justify-center w-12 h-12 gap-2 px-2 py-2 text-center border rounded-full bg-friends-yellow-light dark:bg-friends-purple border-friends-yellow cursor-pointer hover:scale-105 transition-transform">
                <span className="text-sm font-bold tracking-tighter uppercase font-hand text-friends-purple dark:text-friends-yellow">
                  {user?.username[0].toUpperCase()}
                </span>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-30 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border rounded-lg shadow-lg overflow-hidden z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex hover:cursor-pointer justify-center items-center gap-2 px-4 py-3 text-sm font-medium text-friends-purple dark:text-gray-300 hover:bg-friends-red/10 hover:text-friends-red transition-colors">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
