import React, { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useGenerationStore } from "../store/useGenerationStore";
import {
  useImagesQuery,
  useGenerateMutation,
  useDeleteMutation,
} from "./useImagesQuery";
import { useVideoGeneration } from "./useVideoGeneration";
import { getImageUrl } from "../utils/imageUtils";
import { useToast } from "../context/ToastContext";
import { GeneratedImage } from "../types";
import { sendImageNotification } from "../services/notificationService";

/**
 * Orchestration-only hook — no subscriptions to UI state.
 * Uses getState() for imperative reads from the store,
 * and receives fileToBase64 from the caller to avoid
 * duplicating useFileHandling.
 */
export const useGenerationActions = (
  fileToBase64: (file: File) => Promise<string>,
) => {
  const location = useLocation();
  const { data: history = [] } = useImagesQuery();
  const generateMutation = useGenerateMutation();
  const deleteMutation = useDeleteMutation();
  const video = useVideoGeneration();
  const { scheduleDelete } = useToast();
  const queryClient = useQueryClient();

  const handleGenerate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const s = useGenerationStore.getState();
      if (!s.prompt.trim()) return;

      if (s.mode === "video") {
        await video.startVideoGeneration(
          s.prompt,
          fileToBase64,
          s.selectedFiles,
          s.videoDuration,
          s.videoResolution,
        );
      } else {
        s.setIsGenerating(true);
        s.setError(null);
        s.setCurrentImage(null);

        try {
          let referenceImagesBase64: string[] = [];
          if (s.mode === "image" && s.selectedFiles.length > 0) {
            referenceImagesBase64 = await Promise.all(
              s.selectedFiles.map((f) => fileToBase64(f)),
            );
          }

          const newImage = await generateMutation.mutateAsync({
            prompt: s.prompt,
            aspectRatio: s.aspectRatio,
            referenceImagesBase64,
            model: s.model,
          });

          useGenerationStore.getState().setCurrentImage(newImage);
          useGenerationStore
            .getState()
            .setSuccess("Image generated successfully!");
          sendImageNotification(s.prompt);
        } catch (err: any) {
          console.error(err);
          useGenerationStore
            .getState()
            .setError(
              err.message ||
                "Could not generate image. Please check API Key and Billing status.",
            );
        } finally {
          useGenerationStore.getState().setIsGenerating(false);
          setTimeout(
            () => useGenerationStore.getState().setSuccess(null),
            5000,
          );
        }
      }
    },
    [generateMutation, video, fileToBase64],
  );

  const handleDelete = useCallback(
    (id: string) => {
      // Optimistic: remove from cache immediately
      queryClient.setQueryData<GeneratedImage[]>(["images"], (prev) =>
        prev ? prev.filter((img) => img.id !== id) : [],
      );
      // Clear preview if it's the deleted image
      const { currentImage, setCurrentImage } = useGenerationStore.getState();
      if (currentImage?.id === id) {
        setCurrentImage(null);
      }

      scheduleDelete({
        id,
        type: "image",
        onExecute: () => deleteMutation.mutateAsync(id),
        onUndo: () =>
          queryClient.invalidateQueries({ queryKey: ["images"] }),
      });
    },
    [deleteMutation, scheduleDelete, queryClient],
  );

  const handleEdit = useCallback(
    async (id: string) => {
      const s = useGenerationStore.getState();
      s.setMode("image");
      const imgToEdit = history.find((img) => img.id === id);
      if (!imgToEdit) return;
      const imageUrl = getImageUrl(imgToEdit);
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], "edit.jpg", { type: blob.type });
      s.setPrompt(imgToEdit.prompt);
      s.setSelectedFiles([file]);
      s.setPreviewUrls([URL.createObjectURL(file)]);
      s.setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [history],
  );

  const handleDownloadCurrent = useCallback(async () => {
    const { currentImage } = useGenerationStore.getState();
    if (!currentImage) return;
    try {
      const imageUrl = getImageUrl(currentImage);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `dude-creation-${currentImage.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Pulizia memoria
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Errore durante il download:", error);
    }
  }, []);

  // Handle editId from navigation state
  useEffect(() => {
    const editId = location.state?.editId;
    if (!editId) return;

    const imgToEdit = history.find((img) => img.id === editId);
    if (!imgToEdit) return;

    const s = useGenerationStore.getState();
    s.setMode("image");
    s.setPrompt(imgToEdit.prompt);

    const imageUrl = getImageUrl(imgToEdit);
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "edit.jpg", { type: blob.type });
        const store = useGenerationStore.getState();
        store.setSelectedFiles([file]);
        store.setPreviewUrls([imageUrl]);
      });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.state, history]);

  return { handleGenerate, handleDelete, handleEdit, handleDownloadCurrent };
};
