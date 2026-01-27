import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageHistory from "../components/ImageHistory/ImageHistory";
import { useImagesQuery, useDeleteMutation } from "../hooks/useImagesQuery";

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const { data: images = [], isPending } = useImagesQuery();
  const deleteMutation = useDeleteMutation();

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.warn("Failed to delete image from backend", err);
    }
  }, [deleteMutation]);

  const handleEdit = useCallback((id: string) => {
    navigate("/", { state: { editId: id } });
  }, [navigate]);

  return (
    <div className="min-h-screen pb-12 font-sans bg-friends-purple-light dark:bg-dark-bg">
      <main className="px-4 pt-10 mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-4xl text-gray-800 dark:text-white font-hand">The Gallery</h2>
          <p className="font-medium text-gray-600 dark:text-gray-400">
            Every masterpiece you've created.
          </p>
        </div>
        {isPending || images.length > 0 ? (
          <ImageHistory
            images={images}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isLoading={isPending}
          />
        ) : (
          <div className="py-20 text-center bg-white dark:bg-dark-surface border-2 border-gray-300 dark:border-dark-border border-dashed rounded-2xl">
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
