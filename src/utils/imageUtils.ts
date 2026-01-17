import { GeneratedImage } from "../types";

const API_BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:3001";

/**
 * Gets the image URL from a GeneratedImage object
 * Supports both backend API images (with asset.path) and local blob URLs
 */
export const getImageUrl = (image: GeneratedImage): string => {
  // If url is already set (for local blob URLs or legacy data), use it
  if (image.url) {
    return image.url;
  }

  // Otherwise, construct URL from asset path
  if (image.asset?.path) {
    return `${API_BASE_URL}/${image.asset.path}`;
  }

  // Fallback to empty string if no URL available
  console.warn("No URL available for image:", image.id);
  return "";
};
