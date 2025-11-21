import React, { useEffect, useState, useCallback } from "react";
import ImageHistory from "../components/ImageHistory";
import { GeneratedImage } from "../types";
import * as sqliteService from "../services/sqliteService";

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const imgs = await sqliteService.getAllImages();
        setImages(imgs);
      } catch (err) {
        console.warn("Failed to load images for gallery", err);
      }
    })();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await sqliteService.deleteImage(id);
      setImages((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.warn("Failed to delete image from DB", err);
    }
  }, []);

  return (
    <div className="min-h-screen pb-12 font-sans bg-friends-purple-light">
      <main className="px-4 pt-10 mx-auto max-w-7xl">
        <h2 className="mb-6 text-4xl text-center text-gray-800 font-hand">
          Gallery
        </h2>
        <ImageHistory images={images} onDelete={handleDelete} />
      </main>
    </div>
  );
};

export default Gallery;
