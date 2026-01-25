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
        ? "text-2xl text-friends-purple underline"
        : "text-xl hover:text-friends-yellow hover:underline"
    }`;

  return (
    <header className="w-full bg-friends-purple-light">
      <div className="flex items-center w-full px-4 py-4 bg-white border-b-4 shadow-sm md:px-0 rounded-b-2xl border-friends-purple">
        <div className="flex items-center justify-center flex-1 gap-4">
          <NavLink
            to="/"
            className="flex items-center gap-4 transition-opacity hover:opacity-80">
            <div className="flex items-center justify-center w-10 h-10 border-2 rounded-full shadow-lg bg-friends-purple border-friends-yellow">
              <Coffee size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="flex items-center gap-1 text-3xl tracking-wider text-black font-hand">
                D
                <span className="w-2 h-2 mt-2 rounded-full bg-friends-red"></span>
                U
                <span className="w-2 h-2 mt-2 rounded-full bg-friends-blue"></span>
                D
                <span className="w-2 h-2 mt-2 rounded-full bg-friends-yellow"></span>
                E
              </h1>
              <div className="flex items-center gap-1">
                <span className="text-[7px] font-bold tracking-widest uppercase  text-friends-purple sm:text-[10px]">
                  Central Perk Studio
                </span>
                <span className="text-[8px] text-gray-500 font-hand">
                  v{process.env.VITE_APP_VERSION}
                </span>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Desktop Nav */}

        {/* {isAuthenticated && (
          <> */}
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

        <div
          className={`flex items-center justify-end flex-1 md:justify-center gap-3 ${
            isAuthenticated ? "opacity-100" : "opacity-0"
          }`}>
          <div className="flex items-center justify-center w-12 h-12 gap-2 px-2 py-2 text-center border rounded-full bg-friends-yellow-light border-friends-yellow">
            <span className="text-sm font-bold tracking-tighter uppercase font-hand text-friends-purple">
              {user?.username[0].toUpperCase()}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 transition-colors rounded-full text-friends-purple hover:text-friends-red hover:bg-friends-red/10 hover:scale-110"
            title="Logout">
            <LogOut size={16} />
          </button>
        </div>
        {/* </>
        )} */}
      </div>
    </header>
  );
};

export default Header;
