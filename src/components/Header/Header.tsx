import { Coffee, LogIn, LogOut, User } from "lucide-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `font-hand transition-colors underline-offset-4 decoration-2 ${
      isActive
        ? "text-xl text-friends-purple underline"
        : "text-sm hover:text-friends-yellow hover:underline"
    }`;

  return (
    <header className="w-full bg-friends-purple-light">
      <div className="flex justify-between items-center px-4 py-4 w-full bg-white rounded-b-2xl border-b-4 shadow-sm md:px-24 border-friends-purple">
        <div className="flex gap-4 items-center">
          <NavLink
            to="/"
            className="flex gap-4 items-center transition-opacity hover:opacity-80">
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
              </div>
            </div>
          </NavLink>
        </div>

        {/* Desktop Nav */}

        <nav className="hidden gap-6 items-center md:flex">
          {isAuthenticated && (
            <>
              <NavLink to="/" className={navClasses}>
                Home
              </NavLink>

              <NavLink to="/gallery" className={navClasses}>
                Gallery
              </NavLink>
              <div className="flex gap-1 items-center">
                <div className="flex gap-2 items-center px-2 py-1 rounded-full border bg-friends-yellow-light border-friends-purple/20">
                  <span className="text-xs font-bold tracking-tighter uppercase text-friends-purple">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full transition-colors text-friends-red hover:bg-friends-red/10"
                  title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
