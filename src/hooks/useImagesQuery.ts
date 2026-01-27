import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient";
import { api } from "../services/api";
import { uploadImage } from "../services/uploadService";
import { generateImage } from "../services/geminiService";
import { GeneratedImage, AspectRatio } from "../types";

const IMAGES_KEY = ["images"] as const;

export const useImagesQuery = () => {
  return useQuery<GeneratedImage[]>({
    queryKey: IMAGES_KEY,
    queryFn: async () => {
      const response = await apiClient.get<GeneratedImage[]>(
        api.backend.images.getAll(),
      );
      return response.json();
    },
  });
};

interface GenerateParams {
  prompt: string;
  aspectRatio: AspectRatio;
  referenceImagesBase64: string[];
  model: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview";
}

export const useGenerateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<GeneratedImage, Error, GenerateParams>({
    mutationFn: async ({ prompt, aspectRatio, referenceImagesBase64, model }) => {
      const imageUrl = await generateImage(
        prompt,
        aspectRatio,
        referenceImagesBase64,
        model,
      );

      // Convert generated image to File for upload
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `generated-${Date.now()}.png`, {
        type: blob.type || "image/png",
      });

      return uploadImage(file, {
        prompt,
        description: `Generated with ${model}, aspect ratio: ${aspectRatio}`,
        aspectRatio,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGES_KEY });
    },
  });
};

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await apiClient.delete(api.backend.images.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGES_KEY });
    },
  });
};
