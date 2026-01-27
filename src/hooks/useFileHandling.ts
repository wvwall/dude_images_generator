import React, { useRef } from "react";
import { useGenerationStore } from "../store/useGenerationStore";

export const useFileHandling = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedFiles,
    previewUrls,
    isDragging,
    setSelectedFiles,
    setPreviewUrls,
    setIsDragging,
    setError,
  } = useGenerationStore();

  const validateAndAddFiles = (files: File[]) => {
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
    }

    return !hasError;
  };

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

    if (validateAndAddFiles(files) && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (validateAndAddFiles(files)) {
      e.target.value = "";
    }
  };

  const clearFiles = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return {
    fileInputRef,
    selectedFiles,
    previewUrls,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    clearFiles,
    handleRemoveFile,
    fileToBase64,
  };
};
