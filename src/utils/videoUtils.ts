import { GeneratedVideo } from "../types";

/**
 * Gets the video URL from a GeneratedVideo object
 * Supports both backend API videos (with asset.path) and local blob URLs
 */
export const getVideoUrl = (video: GeneratedVideo): string => {
  // If url is already set (for local blob URLs or legacy data), use it
  if (video.url) {
    return video.url;
  }

  // Otherwise, construct URL from asset path
  if (video.asset?.path) {
    return video.asset.path;
  }

  // Fallback to empty string if no URL available
  console.warn("No URL available for video:", video.id);
  return "";
};
