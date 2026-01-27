import React, { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGenerationStore } from "../store/useGenerationStore";
import { useImagesQuery, useGenerateMutation, useDeleteMutation } from "./useImagesQuery";
import { useFileHandling } from "./useFileHandling";
import { useVideoGeneration } from "./useVideoGeneration";
import { getImageUrl } from "../utils/imageUtils";

export const useGenerationLogic = () => {
  const location = useLocation();

  // Zustand — UI state
  const store = useGenerationStore();

  // TanStack Query — server state
  const { data: history = [], isLoading: isLoadingHistory } = useImagesQuery();
  const generateMutation = useGenerateMutation();
  const deleteMutation = useDeleteMutation();

  // Composed hooks
  const files = useFileHandling();
  const video = useVideoGeneration();

  // --- Actions ---

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store.prompt.trim()) return;

    if (store.mode === "video") {
      await video.startVideoGeneration(
        store.prompt,
        files.fileToBase64,
        files.selectedFiles,
      );
    } else {
      store.setIsGenerating(true);
      store.setError(null);
      store.setCurrentImage(null);

      try {
        let referenceImagesBase64: string[] = [];
        if (store.mode === "image" && files.selectedFiles.length > 0) {
          referenceImagesBase64 = await Promise.all(
            files.selectedFiles.map((f) => files.fileToBase64(f)),
          );
        }

        const newImage = await generateMutation.mutateAsync({
          prompt: store.prompt,
          aspectRatio: store.aspectRatio,
          referenceImagesBase64,
          model: store.model,
        });

        store.setCurrentImage(newImage);
        store.setSuccess("Image generated successfully!");
      } catch (err: any) {
        console.error(err);
        store.setError(
          err.message ||
            "Could not generate image. Please check API Key and Billing status.",
        );
      } finally {
        store.setIsGenerating(false);
        setTimeout(() => store.setSuccess(null), 5000);
      }
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.warn("Failed to delete image from backend", err);
      }
      if (store.currentImage?.id === id) {
        store.setCurrentImage(null);
      }
    },
    [store.currentImage, deleteMutation],
  );

  const handleEdit = useCallback(
    async (id: string) => {
      store.setMode("image");
      const imgToEdit = history.find((img) => img.id === id);
      if (!imgToEdit) return;
      const imageUrl = getImageUrl(imgToEdit);
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], "edit.jpg", { type: blob.type });
      store.setPrompt(imgToEdit.prompt);
      store.setSelectedFiles([file]);
      store.setPreviewUrls([URL.createObjectURL(file)]);
      store.setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [history, store],
  );

  const handleDownloadCurrent = () => {
    if (!store.currentImage) return;
    const link = document.createElement("a");
    link.href = getImageUrl(store.currentImage);
    link.download = `dude-creation-${store.currentImage.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle editId from navigation state
  useEffect(() => {
    const editId = location.state?.editId;
    if (!editId) return;

    const imgToEdit = history.find((img) => img.id === editId);
    if (!imgToEdit) return;

    store.setMode("image");
    store.setPrompt(imgToEdit.prompt);

    const imageUrl = getImageUrl(imgToEdit);
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "edit.jpg", { type: blob.type });
        store.setSelectedFiles([file]);
        store.setPreviewUrls([imageUrl]);
      });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.state, history]);

  // --- Return same shape as before ---

  return {
    state: {
      prompt: store.prompt,
      aspectRatio: store.aspectRatio,
      isGenerating: store.isGenerating,
      currentImage: store.currentImage,
      history,
      error: store.error,
      success: store.success,
      isLoadingHistory,
      mode: store.mode,
      selectedFiles: files.selectedFiles,
      previewUrls: files.previewUrls,
      model: store.model,
      fileInputRef: files.fileInputRef,
      isDragging: files.isDragging,
      videoStatus: video.videoStatus,
      videoProgress: video.videoProgress,
      completedVideoUri: video.completedVideoUri,
    },
    actions: {
      setPrompt: store.setPrompt,
      setAspectRatio: store.setAspectRatio,
      setMode: store.setMode,
      setModel: store.setModel,
      handleDragOver: files.handleDragOver,
      handleDragLeave: files.handleDragLeave,
      handleDrop: files.handleDrop,
      handleFileSelect: files.handleFileSelect,
      clearFiles: files.clearFiles,
      handleRemoveFile: files.handleRemoveFile,
      handleGenerate,
      handleDelete,
      handleEdit,
      handleDownloadCurrent,
    },
  };
};
