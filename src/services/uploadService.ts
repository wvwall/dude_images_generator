import { api } from "./api";
import { apiClient } from "./apiClient";
import { GeneratedImage } from "../types";

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
