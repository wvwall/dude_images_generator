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
  Wand2,
  Loader2,
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
        await login({ username: username.trim(), password: password.trim() });
      } else {
        await register({
          username: username.trim(),
          password: password.trim(),
        });
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen p-4 pt-8">
      <div className="w-full max-w-md mx-auto mt-6 overflow-hidden border shadow-2xl rounded-2xl backdrop-blur-lg bg-white/80 border-white/20">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl text-black font-hand">
              {isLogin ? "Welcome Back!" : "Join the Crew!"}
            </h1>
            <p className="font-sans text-gray-600">
              {isLogin
                ? "Sign in to generate more awesome dudes"
                : "Create an account to start your journey"}
            </p>
          </div>

          <div className="flex gap-2 p-2 mb-8 rounded-xl bg-friends-purple-light">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                isLogin
                  ? "text-white shadow-lg bg-friends-purple"
                  : "text-friends-purple hover:bg-white/50"
              }`}>
              <LogIn size={18} />
              <span className="font-semibold">Login</span>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                !isLogin
                  ? "text-white shadow-lg bg-friends-purple"
                  : "text-friends-purple hover:bg-white/50"
              }`}>
              <UserPlus size={18} />
              <span className="font-semibold">Register</span>
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
                className="w-full py-3 pl-10 pr-4 transition-all bg-white border border-gray-200 outline-hidden rounded-xl focus:ring-2 focus:ring-friends-purple focus:border-transparent"
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
                className="w-full py-3 pl-10 pr-12 transition-all bg-white border border-gray-200 outline-hidden rounded-xl focus:ring-2 focus:ring-friends-purple focus:border-transparent"
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
              className="w-full flex items-center justify-center gap-2  bg-friends-yellow text-black hover:bg-yellow-400 py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              {loading ? (
                <Loader2
                  className="animate-spin text-friends-purple"
                  size={20}
                />
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
