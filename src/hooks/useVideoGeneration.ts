import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { checkVideoStatus, generateVideo } from "../services/geminiService";
import { useGenerationStore } from "../store/useGenerationStore";
import { uploadVideo } from "../services/uploadService";
import { VideoResolution, VideoDuration } from "../types";

export const useVideoGeneration = () => {
  const queryClient = useQueryClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const generationParamsRef = useRef<{
    prompt: string;
    duration: VideoDuration;
    resolution: VideoResolution;
  } | null>(null);

  // Only subscribe to the 3 values needed for rendering
  const { videoStatus, videoProgress, completedVideoUri } = useGenerationStore(
    useShallow((s) => ({
      videoStatus: s.videoStatus,
      videoProgress: s.videoProgress,
      completedVideoUri: s.completedVideoUri,
    })),
  );

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Use getState() for imperative actions — no subscription needed
  const pollVideoStatus = useCallback(
    async (operationName: string) => {
      const result = await checkVideoStatus(operationName);
      const s = useGenerationStore.getState();

      if (result.status === "completed") {
        s.setVideoStatus("Video ready!");
        s.setIsGenerating(false);
        stopPolling();

        if (result.videoBuffer) {
          const blob = new Blob([result.videoBuffer], { type: "video/mp4" });
          const url = URL.createObjectURL(blob);

          s.setCompletedVideoUri(url);

          // Upload to backend
          const params = generationParamsRef.current;
          if (params) {
            try {
              await uploadVideo(
                new File([blob], `generated-video-${Date.now()}.mp4`, {
                  type: "video/mp4",
                }),
                {
                  prompt: params.prompt,
                  duration: params.duration,
                  resolution: params.resolution,
                },
              );
              // Invalidate videos query to refetch the list
              queryClient.invalidateQueries({ queryKey: ["videos"] });
              s.setSuccess("Video saved to your gallery!");
            } catch (uploadError) {
              console.error("Failed to upload video to backend:", uploadError);
              s.setSuccess("Video generated! (Failed to save to gallery)");
            }
          } else {
            s.setSuccess("Video generated successfully!");
          }

          setTimeout(
            () => useGenerationStore.getState().setSuccess(null),
            5000,
          );
        }
      } else {
        s.setVideoProgress(result.progress || 0);
        s.setVideoStatus("Generating video...");
      }
    },
    [stopPolling, queryClient],
  );

  const startVideoGeneration = useCallback(
    async (
      prompt: string,
      fileToBase64: (file: File) => Promise<string>,
      selectedFiles: File[],
      duration: VideoDuration,
      resolution: VideoResolution,
    ) => {
      // Store params for backend upload
      generationParamsRef.current = { prompt, duration, resolution };

      const s = useGenerationStore.getState();
      s.setIsGenerating(true);
      s.setError(null);
      s.resetVideo();
      s.setVideoStatus("Starting video generation...");

      let referenceImageBase64: string | undefined;
      let mimeType: string | undefined;

      if (selectedFiles.length > 0) {
        referenceImageBase64 = await fileToBase64(selectedFiles[0]);
        mimeType = selectedFiles[0].type;
      }

      try {
        const { operationName } = await generateVideo(
          prompt,
          referenceImageBase64,
          mimeType,
          duration,
          resolution,
        );

        pollingIntervalRef.current = setInterval(() => {
          pollVideoStatus(operationName);
        }, 10000);

        await pollVideoStatus(operationName);
      } catch (err: any) {
        console.error(err);
        const store = useGenerationStore.getState();
        store.setError(
          err.message ||
            "Could not start video generation. Please check API Key and Billing status.",
        );
        store.resetVideo();
        store.setIsGenerating(false);
      }
    },
    [pollVideoStatus],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return {
    videoStatus,
    videoProgress,
    completedVideoUri,
    startVideoGeneration,
  };
};
