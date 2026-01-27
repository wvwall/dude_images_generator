import { useCallback, useEffect, useRef } from "react";
import { checkVideoStatus, generateVideo } from "../services/geminiService";
import { useGenerationStore } from "../store/useGenerationStore";

export const useVideoGeneration = () => {
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    videoStatus,
    videoProgress,
    completedVideoUri,
    setVideoStatus,
    setVideoProgress,
    setCompletedVideoUri,
    setIsGenerating,
    setError,
    setSuccess,
    resetVideo,
  } = useGenerationStore();

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const pollVideoStatus = useCallback(
    async (operationName: string) => {
      const result = await checkVideoStatus(operationName);

      if (result.status === "completed") {
        setVideoStatus("Video ready!");
        setIsGenerating(false);
        stopPolling();

        if (result.videoBuffer) {
          const blob = new Blob([result.videoBuffer], { type: "video/mp4" });
          const url = URL.createObjectURL(blob);

          setCompletedVideoUri(url);
          setSuccess("Video generated successfully!");

          const link = document.createElement("a");
          link.href = url;
          link.download = "generated_video.mp4";
          link.click();
          setTimeout(() => setSuccess(null), 5000);
        }
      } else {
        setVideoProgress(result.progress || 0);
        setVideoStatus("Generating video...");
      }
    },
    [stopPolling, setVideoStatus, setIsGenerating, setCompletedVideoUri, setSuccess, setVideoProgress],
  );

  const startVideoGeneration = useCallback(
    async (
      prompt: string,
      fileToBase64: (file: File) => Promise<string>,
      selectedFiles: File[],
    ) => {
      setIsGenerating(true);
      setError(null);
      resetVideo();
      setVideoStatus("Starting video generation...");

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
        );

        pollingIntervalRef.current = setInterval(() => {
          pollVideoStatus(operationName);
        }, 10000);

        await pollVideoStatus(operationName);
      } catch (err: any) {
        console.error(err);
        setError(
          err.message ||
            "Could not start video generation. Please check API Key and Billing status.",
        );
        resetVideo();
        setIsGenerating(false);
      }
    },
    [pollVideoStatus, setIsGenerating, setError, setVideoStatus, resetVideo],
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
