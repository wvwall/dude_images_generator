import { api } from "./api";
import { apiClient } from "./apiClient";
import { GeneratedImage, GeneratedVideo } from "../types";

export interface CreateImageDto {
  prompt: string;
  description?: string;
  aspectRatio: string;
}

export type UploadedImage = GeneratedImage;

export const uploadImage = async (
  file: File,
  imageData: CreateImageDto
): Promise<UploadedImage> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("prompt", imageData.prompt);
  formData.append("aspectRatio", imageData.aspectRatio);

  if (imageData.description) {
    formData.append("description", imageData.description);
  }

  const response = await apiClient.post<UploadedImage, FormData>(
    api.backend.images.create(),
    formData
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to upload image");
  }

  return response.json();
};

export interface CreateVideoDto {
  prompt: string;
  duration: number;
  resolution: string;
}

export type UploadedVideo = GeneratedVideo;

export const uploadVideo = async (
  file: File,
  videoData: CreateVideoDto
): Promise<UploadedVideo> => {
  const formData = new FormData();
  formData.append("video", file);
  formData.append("prompt", videoData.prompt);
  formData.append("duration", String(videoData.duration));
  formData.append("resolution", videoData.resolution);

  const response = await apiClient.post<UploadedVideo, FormData>(
    api.backend.videos.create(),
    formData
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to upload video");
  }

  return response.json();
};
