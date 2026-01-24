import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  checkVideoStatus,
  generateImage,
  generateVideo,
} from "../services/geminiService";
import { AspectRatio, GeneratedImage } from "../types";
import { uploadImage } from "../services/uploadService";
import { getImageUrl } from "../utils/imageUtils";
import { apiClient } from "../services/apiClient";
import { api } from "../services/api";

export const useGenerationLogic = () => {
  const location = useLocation();
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // New state for Image-to-Image mode
  const [mode, setMode] = useState<"text" | "image" | "video">("text");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [model, setModel] = useState<
    "gemini-2.5-flash-image" | "gemini-3-pro-image-preview"
  >("gemini-2.5-flash-image");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  // Video generation state
  const [videoStatus, setVideoStatus] = useState<string>("");
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [completedVideoUri, setCompletedVideoUri] = useState<string | null>(
    null,
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const newSelectedFiles: File[] = [];
    const newPreviewUrls: string[] = [];
    let hasError = false;

    files.forEach((file) => {
      if (file.size > 4 * 1024 * 1024) {
        setError(`File ${file.name} is too large! Please keep it under 4MB.`);
        hasError = true;
      } else {
        newSelectedFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      }
    });

    if (!hasError) {
      setSelectedFiles((prev) => [...prev, ...newSelectedFiles]);
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newSelectedFiles: File[] = [];
      const newPreviewUrls: string[] = [];
      let hasError = false;

      files.forEach((file) => {
        if (file.size > 4 * 1024 * 1024) {
          setError(`File ${file.name} is too large! Please keep it under 4MB.`);
          hasError = true;
        } else {
          newSelectedFiles.push(file);
          newPreviewUrls.push(URL.createObjectURL(file));
        }
      });

      if (!hasError) {
        setSelectedFiles((prev) => [...prev, ...newSelectedFiles]);
        setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
        setError(null);
        e.target.value = "";
      }
    }
  };

  const clearFiles = () => {
    selectedFiles.forEach((file) =>
      URL.revokeObjectURL(URL.createObjectURL(file)),
    ); // Revoke object URLs
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleRemoveFile = (index: number) => {
    const newSelectedFiles = [...selectedFiles];
    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]); // Clean up memory
    newSelectedFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const pollVideoStatus = async (operationName: string) => {
    const result = await checkVideoStatus(operationName);

    if (result.status === "completed") {
      setVideoStatus("Video ready!");
      setIsGenerating(false);

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      if (result.videoBuffer) {
        const blob = new Blob([result.videoBuffer], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        // Show in preview
        setCompletedVideoUri(url);
        setSuccess("Video generated successfully!");

        // Download
        const link = document.createElement("a");
        link.href = url;
        link.download = "generated_video.mp4";
        link.click();
        setTimeout(() => setSuccess(null), 5000);
      }
    } else {
      // Still processing
      setVideoProgress(result.progress || 0);
      setVideoStatus("Generating video...");
    }
  };

  const imageModeGeneration = async () => {
    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);

    try {
      let referenceImagesBase64: string[] = [];

      if (mode === "image" && selectedFiles.length > 0) {
        const promises = selectedFiles.map((file) => fileToBase64(file));
        referenceImagesBase64 = await Promise.all(promises);
      }

      const imageUrl = await generateImage(
        prompt,
        aspectRatio,
        referenceImagesBase64,
        model,
      );

      // Convert the generated image URL to a File for upload
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `generated-${Date.now()}.png`, {
        type: blob.type || "image/png",
      });

      try {
        const uploaded = await uploadImage(file, {
          prompt: prompt,
          description: `Generated with ${model}, aspect ratio: ${aspectRatio}`,
          aspectRatio,
        });
        // Use the uploaded image with backend data
        const newImage: GeneratedImage = uploaded;
        setCurrentImage(newImage);
        setHistory((prev) => [newImage, ...prev]);
        setSuccess("Image generated successfully!");
      } catch (dbErr) {
        console.warn("Failed to persist image to backend", dbErr);
        // Keep the temporary local image with blob URL
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Could not generate image. Please check API Key and Billing status.",
      );
    } finally {
      setIsGenerating(false);
      setTimeout(() => setSuccess(null), 5000);
    }
  };

  const videoModeGeneration = async () => {
    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);
    setCompletedVideoUri(null);
    setVideoStatus("Starting video generation...");
    setVideoProgress(0);
    let referenceImageBase64: string | undefined = undefined;
    let mimeType: string | undefined = undefined;

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

      // Start polling every 10 seconds
      pollingIntervalRef.current = setInterval(() => {
        pollVideoStatus(operationName);
      }, 10000);

      // First immediate check
      await pollVideoStatus(operationName);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Could not start video generation. Please check API Key and Billing status.",
      );
      setVideoProgress(0);
      setVideoStatus("");
      setIsGenerating(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (mode === "image" || mode === "text") {
      await imageModeGeneration();
    } else if (mode === "video") {
      await videoModeGeneration();
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        // Delete from backend API
        await apiClient.delete(api.backend.images.delete(id));
      } catch (err) {
        console.warn("Failed to delete image from backend", err);
      }

      setHistory((prev) => prev.filter((img) => img.id !== id));
      if (currentImage?.id === id) {
        setCurrentImage(null);
      }
    },
    [currentImage, history],
  );

  async function urlToFile(url: string, filename = "image.jpg"): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const handleEdit = useCallback(
    async (id: string) => {
      setMode("image");
      const imgToEdit = history.find((img) => img.id === id);
      if (!imgToEdit) return;
      const imageUrl = getImageUrl(imgToEdit);
      const file = await urlToFile(imageUrl);
      setPrompt(imgToEdit.prompt);
      setSelectedFiles([file]);
      setPreviewUrls([URL.createObjectURL(file)]);
      setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [history],
  );

  useEffect(() => {
    const editId = location.state?.editId;
    if (!editId) return;

    const imgToEdit = history.find((img) => img.id === editId);
    if (!imgToEdit) return;

    setMode("image");
    setPrompt(imgToEdit.prompt);

    const imageUrl = getImageUrl(imgToEdit);
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "edit.jpg", { type: blob.type });
        setSelectedFiles([file]);
        setPreviewUrls([imageUrl]);
      });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.state, history]);

  useEffect(() => {
    (async () => {
      try {
        // Fetch images from backend API
        const response = await apiClient.get<GeneratedImage[]>(
          api.backend.images.getAll(),
        );
        const imgs = await response.json();
        setHistory(imgs);
      } catch (err) {
        console.warn("Failed to load images from backend API", err);
      } finally {
        setIsLoadingHistory(false);
      }
    })();
  }, []);

  const handleDownloadCurrent = () => {
    if (!currentImage) return;
    const link = document.createElement("a");
    link.href = getImageUrl(currentImage);
    link.download = `dude-creation-${currentImage.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    state: {
      prompt,
      aspectRatio,
      isGenerating,
      currentImage,
      history,
      error,
      success,
      isLoadingHistory,
      mode,
      selectedFiles,
      previewUrls,
      model,
      fileInputRef,
      isDragging,
      videoStatus,
      videoProgress,
      completedVideoUri,
    },
    actions: {
      setPrompt,
      setAspectRatio,
      setMode,
      setModel,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleFileSelect,
      clearFiles,
      handleRemoveFile,
      handleGenerate,
      handleDelete,
      handleEdit,
      handleDownloadCurrent,
    },
  };
};
