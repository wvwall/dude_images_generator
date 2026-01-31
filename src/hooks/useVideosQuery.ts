import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient";
import { api } from "../services/api";
import { uploadVideo, CreateVideoDto } from "../services/uploadService";
import { GeneratedVideo } from "../types";

const VIDEOS_KEY = ["videos"] as const;

export const useVideoByIdQuery = (id: string | undefined) => {
  return useQuery<GeneratedVideo>({
    queryKey: [...VIDEOS_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get<GeneratedVideo>(
        api.backend.videos.getById(id!),
      );
      return response.json();
    },
    enabled: !!id,
  });
};

export const useVideosQuery = () => {
  return useQuery<GeneratedVideo[]>({
    queryKey: VIDEOS_KEY,
    queryFn: async () => {
      const response = await apiClient.get<GeneratedVideo[]>(
        api.backend.videos.getAll(),
      );
      return response.json();
    },
  });
};

interface UploadVideoParams {
  videoBlob: Blob;
  prompt: string;
  duration: number;
  resolution: string;
}

export const useUploadVideoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<GeneratedVideo, Error, UploadVideoParams>({
    mutationFn: async ({ videoBlob, prompt, duration, resolution }) => {
      const file = new File([videoBlob], `generated-video-${Date.now()}.mp4`, {
        type: "video/mp4",
      });

      return uploadVideo(file, {
        prompt,
        duration,
        resolution,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VIDEOS_KEY });
    },
  });
};

export const useDeleteVideoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await apiClient.delete(api.backend.videos.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VIDEOS_KEY });
    },
  });
};
