import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { checkVideoStatus, generateVideo } from "../services/geminiService";
import { useGenerationStore } from "../store/useGenerationStore";
import { uploadVideo } from "../services/uploadService";
import { VideoResolution, VideoDuration } from "../types";
import { sendVideoNotification } from "../services/notificationService";

export const useVideoGeneration = () => {
  const queryClient = useQueryClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const generationParamsRef = useRef<{
    prompt: string;
    duration: VideoDuration;
    resolution: VideoResolution;
  } | null>(null);
  // Persists the active operation name so polling can be resumed when
  // the app returns to the foreground after being backgrounded on iOS.
  const operationNameRef = useRef<string | null>(null);

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
        operationNameRef.current = null;
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
              sendVideoNotification(params.prompt);
            } catch (uploadError) {
              console.error("Failed to upload video to backend:", uploadError);
              s.setSuccess("Video generated! (Failed to save to gallery)");
              sendVideoNotification(params.prompt);
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

        operationNameRef.current = operationName;

        pollingIntervalRef.current = setInterval(() => {
          pollVideoStatus(operationName);
        }, 10000);

        await pollVideoStatus(operationName);
      } catch (err: any) {
        console.error(err);
        operationNameRef.current = null;
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

  // On iOS, locking the screen or switching apps suspends JS execution and
  // aborts in-flight network requests. When the user returns to the app,
  // resume polling if a video generation was still in progress.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) return;
      const s = useGenerationStore.getState();
      if (!s.isGenerating || !operationNameRef.current) return;

      // Restart the polling interval (it may have been cleared or stalled)
      stopPolling();
      const op = operationNameRef.current;
      pollVideoStatus(op);
      pollingIntervalRef.current = setInterval(() => {
        pollVideoStatus(op);
      }, 10000);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [stopPolling, pollVideoStatus]);

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
