import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ImageCard from "../components/ImageCard/ImageCard";
import VideoCard from "../components/VideoCard/VideoCard";
import MediaTabs from "../components/MediaTabs/MediaTabs";
import SkeletonCard from "../components/ImageCard/SkeletonCard";
import { useImagesQuery, useDeleteMutation } from "../hooks/useImagesQuery";
import {
  useVideosQuery,
  useDeleteVideoMutation,
} from "../hooks/useVideosQuery";
import { useToast } from "../context/ToastContext";
import { GeneratedImage, GeneratedVideo } from "../types";

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: images = [], isPending: isLoadingImages } = useImagesQuery();
  const { data: videos = [], isPending: isLoadingVideos } = useVideosQuery();
  const deleteMutation = useDeleteMutation();
  const deleteVideoMutation = useDeleteVideoMutation();
  const { scheduleDelete } = useToast();

  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");

  const handleDelete = useCallback(
    (id: string) => {
      queryClient.setQueryData<GeneratedImage[]>(["images"], (prev) =>
        prev ? prev.filter((img) => img.id !== id) : [],
      );
      scheduleDelete({
        id,
        type: "image",
        onExecute: () => deleteMutation.mutateAsync(id),
        onUndo: () =>
          queryClient.invalidateQueries({ queryKey: ["images"] }),
      });
    },
    [deleteMutation, scheduleDelete, queryClient],
  );

  const handleDeleteVideo = useCallback(
    (id: string) => {
      queryClient.setQueryData<GeneratedVideo[]>(["videos"], (prev) =>
        prev ? prev.filter((v) => v.id !== id) : [],
      );
      scheduleDelete({
        id,
        type: "video",
        onExecute: () => deleteVideoMutation.mutateAsync(id),
        onUndo: () =>
          queryClient.invalidateQueries({ queryKey: ["videos"] }),
      });
    },
    [deleteVideoMutation, scheduleDelete, queryClient],
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate("/", { state: { editId: id } });
    },
    [navigate],
  );

  const hasContent = images.length > 0 || videos.length > 0;
  const isLoading = isLoadingImages || isLoadingVideos;

  return (
    <div className="min-h-screen pb-12 font-sans bg-friends-purple-light dark:bg-dark-bg">
      <main className="px-4 pt-10 mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-4xl text-gray-800 dark:text-white font-hand">
            The Gallery
          </h2>
          <p className="font-medium text-gray-600 dark:text-gray-400">
            Every masterpiece you've created.
          </p>
        </div>

        {isLoading || hasContent ? (
          <div>
            <MediaTabs
              imagesCount={images.length}
              videosCount={videos.length}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {activeTab === "images" ? (
                isLoadingImages ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : images.length > 0 ? (
                  images.map((image) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white dark:bg-dark-surface border-2 border-gray-300 dark:border-dark-border border-dashed rounded-2xl">
                    <p className="text-xl text-gray-400 font-hand">
                      No images yet...
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
                )
              ) : isLoadingVideos ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : videos.length > 0 ? (
                videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onDelete={handleDeleteVideo}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white dark:bg-dark-surface border-2 border-gray-300 dark:border-dark-border border-dashed rounded-2xl">
                  <p className="text-xl text-gray-400 font-hand">
                    No videos yet...
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Go to{" "}
                    <Link
                      to="/"
                      className="underline transition-colors hover:text-friends-yellow decoration-2 underline-offset-4">
                      home
                    </Link>{" "}
                    and select Video mode to create something!
                  </p>
                </div>
              )}
            </div>
          </div>
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
