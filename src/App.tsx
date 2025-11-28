import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import Image from "./pages/ImageView";
import sqliteService from "./services/sqliteService";

const App: React.FC = () => {
  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    return null;
  }
  useEffect(() => {
    (async () => {
      try {
        await sqliteService.initDB();
      } catch (err) {
        console.warn("Failed to init db", err);
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/image/:id" element={<Image />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
