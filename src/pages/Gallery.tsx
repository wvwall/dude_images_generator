import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageHistory from "../components/ImageHistory/ImageHistory";
import * as sqliteService from "../services/sqliteService";
import { GeneratedImage } from "../types";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { apiClient } from "../services/apiClient";

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const { data, isPending, error } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const response = await apiClient.get<GeneratedImage[]>(api.backend.images.getAll());
      return response.json();
    },
  });

  useEffect(() => {
    setImages(data);
  }, [data]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await apiClient.delete(api.backend.images.delete(id));
      setImages((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.warn("Failed to delete image from backend", err);
    }
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate("/", { state: { editId: id } });
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
        {isPending || images?.length > 0 ? (
          <ImageHistory
            images={images}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isLoading={isPending}
          />
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
