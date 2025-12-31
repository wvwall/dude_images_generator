import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import BottomBar from "./components/BottomBar/BottomBar";
import FeatureTour from "./components/FeatureTour/FeatureTour";
import Header from "./components/Header/Header";
import PullToRefresh from "./components/PullToRefresh/PullToRefresh";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import Image from "./pages/ImageView";
import LoadingPage from "./pages/LoadingPage";
import sqliteService from "./services/sqliteService";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
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
      } finally {
        await document.fonts.ready;
        setTimeout(() => {
          setIsLoading(false);
        }, 1000); // Display loading page for 3 seconds
      }
    })();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <FeatureTour>
        {/* <PullToRefresh
          onRefresh={() => {
            // Hard reload the current page so the current route is fully refreshed
            window.location.reload();
          }}> */}
        <Header />
        <ScrollToTop />
        <section className="pb-12 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/image/:id" element={<Image />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>
        <BottomBar />
        {/* </PullToRefresh> */}
      </FeatureTour>
    </BrowserRouter>
  );
};

export default App;
