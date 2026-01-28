import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import BottomBar from "./components/BottomBar/BottomBar";
import Header from "./components/Header/Header";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Auth from "./pages/Auth";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import Image from "./pages/ImageView";
import LoadingPage from "./pages/LoadingPage";
const queryClient = new QueryClient();

import { useAuth } from "./context/AuthContext";

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingPage />;
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <Header />
      <ScrollToTop />
      <section className="pb-12 md:pb-0 bg-friends-purple-light dark:bg-dark-bg">
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/image/:id" element={<Image />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </section>
      <BottomBar />
    </BrowserRouter>
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
