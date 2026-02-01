import { GeneratedVideo } from "@/types";
import { Download, Maximize2, Trash2, Video } from "lucide-react";
import React, { useState, useRef } from "react";
import { getVideoUrl } from "@/utils/videoUtils";
import VideoLightbox from "../VideoLightbox/VideoLightbox";

interface VideoCardProps {
  video: GeneratedVideo;
  onDelete: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = getVideoUrl(video);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleTap = () => {
    setIsOverlayVisible((prev) => !prev);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
    setIsOverlayVisible(false);
    // Pause the card video when opening lightbox
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `dude-video-${video.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  return (
    <div
      key={video.id}
      className="group bg-white dark:bg-dark-surface p-3 pb-4 rounded-xl border-2 border-gray-200 dark:border-dark-border hover:border-friends-purple dark:hover:border-friends-yellow transition-all duration-300 shadow-md hover:shadow-[5px_5px_0px_0px_rgba(93,63,106,0.2)] dark:hover:shadow-[5px_5px_0px_0px_rgba(244,196,48,0.2)]">
      <div
        className="relative w-full overflow-hidden bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg aspect-video"
        onClick={handleTap}>
        <video
          ref={videoRef}
          src={videoUrl}
          className="object-cover w-full h-full"
          muted
          playsInline
        />

        {/* Duration badge */}
        <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-md flex items-center gap-1">
          <Video size={14} className="text-white" />
          <span className="text-xs text-white font-medium">{video.duration}s</span>
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/40 ${isOverlayVisible ? "opacity-100" : "opacity-0"} [@media(hover:hover)]:group-hover:opacity-100`}>
          {/* Expand button - opens lightbox */}
          <button
            className="absolute p-3 hover:cursor-pointer transition-colors -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-white/20 hover:bg-white/30"
            onClick={(e) => {
              e.stopPropagation();
              openLightbox();
            }}
            aria-label="Expand video"
            title="Expand">
            <Maximize2 size={25} className="text-white" />
          </button>

          {/* Action buttons */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              aria-label="Delete video"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(video.id);
              }}
              className="p-2 text-black hover:cursor-pointer transition-transform border-2 border-black rounded-full shadow-lg bg-friends-red hover:bg-red-500 hover:scale-110"
              title="Delete">
              <Trash2 size={16} />
            </button>

            <button
              aria-label="Download video"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-2 text-black hover:cursor-pointer transition-transform border-2 border-black rounded-full shadow-lg bg-friends-yellow hover:bg-yellow-400 hover:scale-110"
              title="Download">
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-1 mt-4">
        <div className="flex items-start gap-2">
          <Video size={16} className="mt-1 text-gray-400 shrink-0" />
          <p className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-2">
            "{video.prompt}"
          </p>
        </div>
        <div className="flex items-center justify-between pt-3 mt-4 text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase border-t border-gray-100 dark:border-dark-border">
          <span>{new Date(video.timestamp).toLocaleDateString()}</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-card rounded-sm">
            {video.resolution}
          </span>
        </div>
      </div>

      <VideoLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        videoUrl={videoUrl}
      />
    </div>
  );
};

export default VideoCard;
