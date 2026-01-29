import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, User } from "../services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (userData: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MIN_LOADING_MS = 300; // Minimum time to show LoadingPage

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const startTime = Date.now();

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        // Ensure LoadingPage is visible for at least MIN_LOADING_MS
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_MS - elapsed);

        if (remainingTime > 0) {
          setTimeout(() => setIsLoading(false), remainingTime);
        } else {
          setIsLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    const data = await authService.login(credentials);
    setUser(data.user);
  };

  const register = async (userData: { username: string; password: string }) => {
    const data = await authService.register(userData);
    setUser(data.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
