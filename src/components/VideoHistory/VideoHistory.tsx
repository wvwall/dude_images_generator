import VideoCard from "../VideoCard/VideoCard";
import React from "react";
import SkeletonCard from "../ImageCard/SkeletonCard";
import { GeneratedVideo } from "@/types";

interface VideoHistoryProps {
  videos: GeneratedVideo[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
  limit?: number;
}

const VideoHistory: React.FC<VideoHistoryProps> = ({
  videos,
  onDelete,
  isLoading = false,
  limit,
}) => {
  const displayVideos = limit ? videos.slice(0, limit) : videos;

  if (!isLoading && videos.length === 0) {
    return (
      <div className="py-20 text-center bg-white dark:bg-dark-surface border-2 border-gray-300 dark:border-dark-border border-dashed rounded-2xl">
        <p className="text-xl text-gray-400 font-hand">
          No videos yet...
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Select Video mode to create something!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: limit || 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        : displayVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDelete={onDelete}
            />
          ))}
    </div>
  );
};

export default VideoHistory;
