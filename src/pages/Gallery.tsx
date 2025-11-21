import React, { useEffect, useState, useCallback } from "react";
import ImageHistory from "../components/ImageHistory";
import { GeneratedImage } from "../types";
import * as sqliteService from "../services/sqliteService";
import { Link } from "react-router-dom";

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
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-4xl text-gray-800 font-hand">The Gallery</h2>
          <p className="font-medium text-gray-600">
            Every masterpiece you've created.
          </p>
        </div>
        {images.length > 0 ? (
          <ImageHistory images={images} onDelete={handleDelete} />
        ) : (
          <div className="py-20 text-center bg-white border-2 border-gray-300 border-dashed rounded-2xl">
            <p className="text-xl text-gray-400 font-hand">
              No memories yet...
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Go to{" "}
              <Link
                to="/"
                className="underline transition-colors hover:text-friends-yellow decoration-2 underline-offset-4">
                home
              </Link>{" "}
              to create something!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;
