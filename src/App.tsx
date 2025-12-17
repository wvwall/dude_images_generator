import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header/Header";
import BottomBar from "./components/BottomBar/BottomBar";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import Image from "./pages/ImageView";
import sqliteService from "./services/sqliteService";
import FeatureTour from "./components/FeatureTour/FeatureTour";

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
      <FeatureTour>
        <Header />
        <ScrollToTop />
        <div className="pb-12 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/image/:id" element={<Image />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <BottomBar />
      </FeatureTour>
    </BrowserRouter>
  );
};

export default App;
