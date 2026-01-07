import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  EyeOff,
  Eye,
} from "lucide-react";

const Auth: React.FC = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login({ username, password });
      } else {
        await register({ username, password });
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pt-8 h-[calc(100vh-92px)]">
      <div className="w-full max-w-md mx-auto overflow-hidden border shadow-2xl rounded-2xl backdrop-blur-lg bg-white/80 border-white/20">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-hand text-friends-purple">
              {isLogin ? "Welcome Back!" : "Join the Crew!"}
            </h1>
            <p className="font-sans text-gray-600">
              {isLogin
                ? "Sign in to generate more awesome dudes"
                : "Create an account to start your journey"}
            </p>
          </div>

          <div className="flex p-1 mb-8 rounded-xl bg-friends-purple-light">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                isLogin
                  ? "text-white shadow-lg bg-friends-purple"
                  : "text-friends-purple hover:bg-white/50"
              }`}>
              <LogIn size={18} />
              <span className="font-medium">Login</span>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                !isLogin
                  ? "text-white shadow-lg bg-friends-purple"
                  : "text-friends-purple hover:bg-white/50"
              }`}>
              <UserPlus size={18} />
              <span className="font-medium">Register</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <User size={18} />
              </div>
              <input
                autoComplete="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 pl-10 pr-4 transition-all bg-white border border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-friends-purple focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-12 transition-all bg-white border border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-friends-purple focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="p-3 text-sm border rounded-xl animate-pulse bg-friends-red/10 border-friends-red/20 text-friends-red">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full gap-2 py-4 font-bold transition-all duration-200 transform shadow-xl rounded-xl bg-friends-yellow hover:bg-friends-yellow/90 text-friends-purple hover:shadow-2xl active:translate-y-0 group">
              {loading ? (
                <div className="w-6 h-6 rounded-full animate-spin border-3 border-friends-purple border-t-transparent"></div>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full mt-6 text-sm font-medium transition-colors text-friends-purple/70 hover:text-friends-purple">
            {isLogin
              ? "Don't have an account? Sign up now!"
              : "Already have an account? Sign in!"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
