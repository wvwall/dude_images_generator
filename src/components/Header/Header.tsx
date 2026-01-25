import { Coffee, LogOut, Moon, Sun } from "lucide-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
            className="p-2 transition-colors rounded-full text-friends-purple dark:text-friends-yellow hover:bg-friends-purple/10 dark:hover:bg-friends-yellow/10 hover:scale-110"
            title={isDark ? "Light mode" : "Dark mode"}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User info and logout - only visible when authenticated */}
          {isAuthenticated && (
            <>
              <div className="flex items-center justify-center w-12 h-12 gap-2 px-2 py-2 text-center border rounded-full bg-friends-yellow-light dark:bg-friends-purple border-friends-yellow">
                <span className="text-sm font-bold tracking-tighter uppercase font-hand text-friends-purple dark:text-friends-yellow">
                  {user?.username[0].toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 transition-colors rounded-full text-friends-purple dark:text-gray-300 hover:text-friends-red hover:bg-friends-red/10 hover:scale-110"
                title="Logout">
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
