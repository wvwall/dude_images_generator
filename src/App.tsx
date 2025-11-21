import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Image from "./pages/Image";
import sqliteService from "./services/sqliteService";

const App: React.FC = () => {
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
