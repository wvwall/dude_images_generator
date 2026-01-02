import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ImageHistory from "../components/ImageHistory/ImageHistory";
import InputPanel from "../components/InputPanel/InputPanel";
import PreviewPanel from "../components/PreviewPanel";
import {
  checkVideoStatus,
  generateImage,
  generateVideo,
} from "../services/geminiService";
import * as sqliteService from "../services/sqliteService";
import { AspectRatio, GeneratedImage } from "../types";
import { useTour } from "@reactour/tour";
import InputHeader from "../components/InputHeader/InputHeader";

const Home: React.FC = () => {
  const location = useLocation();
  const { setIsOpen } = useTour();
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    null
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
      URL.revokeObjectURL(URL.createObjectURL(file))
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

  const filesToBase64 = async (files: File[]): Promise<string[]> => {
    return Promise.all(files.map((file) => fileToBase64(file)));
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
        model
      );

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        aspectRatio: aspectRatio,
      };

      try {
        await sqliteService.addImage(newImage);
      } catch (dbErr) {
        console.warn("Failed to persist image to local sqlite DB", dbErr);
      }

      setCurrentImage(newImage);
      setHistory((prev) => [newImage, ...prev]);
      setSuccess("Generated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Could not generate image. Please check API Key and Billing status."
      );
    } finally {
      setIsGenerating(false);
      setTimeout(() => setSuccess(null), 5000);
    }
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

        // Download
        const link = document.createElement("a");
        link.href = url;
        link.download = "generated_video.mp4";
        link.click();
      }
    } else {
      // Still processing
      setVideoProgress(result.progress || 0);
      setVideoStatus("Generating video...");
    }
  };

  const videoModeGeneration = async () => {
    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);
    setCompletedVideoUri(null);
    setVideoStatus("Starting video generation...");
    setVideoProgress(0);

    try {
      const { operationName } = await generateVideo(prompt);

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
          "Could not start video generation. Please check API Key and Billing status."
      );
      setVideoProgress(0);
      setVideoStatus("");
      setIsGenerating(false);
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

  useEffect(() => {
    const tourSeen = localStorage.getItem("tourSeen");
    if (!tourSeen) {
      setIsOpen(true);
    }
  }, [setIsOpen]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await sqliteService.deleteImage(id);
      } catch (dbErr) {
        console.warn("Failed to delete image from local sqlite DB", dbErr);
      }

      setHistory((prev) => prev.filter((img) => img.id !== id));
      if (currentImage?.id === id) {
        setCurrentImage(null);
      }
    },
    [currentImage, history]
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
      const file = await urlToFile(imgToEdit.url);
      setPrompt(imgToEdit.prompt);
      setSelectedFiles([file]);
      setPreviewUrls([URL.createObjectURL(file)]);
      setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [history]
  );

  useEffect(() => {
    const editId = location.state?.editId;
    if (!editId) return;

    const imgToEdit = history.find((img) => img.id === editId);
    if (!imgToEdit) return;

    setMode("image");
    setPrompt(imgToEdit.prompt);

    fetch(imgToEdit.url)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "edit.jpg", { type: blob.type });
        setSelectedFiles([file]);
        setPreviewUrls([imgToEdit.url]);
      });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.state, history]);

  useEffect(() => {
    (async () => {
      try {
        const imgs = await sqliteService.getAllImages();
        setHistory(imgs);
      } catch (err) {
        console.warn("Failed to load images from local sqlite DB", err);
      }
    })();
  }, []);

  const handleDownloadCurrent = () => {
    if (!currentImage) return;
    const link = document.createElement("a");
    link.href = currentImage.url;
    link.download = `dude-creation-${currentImage.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="min-h-screen pb-12 font-sans bg-friends-purple-light">
      <main className="px-4 pt-12 mx-auto md:pt-16 max-w-7xl">
        <InputHeader />
        <div className="flex flex-col gap-8 mt-12 lg:items-start lg:flex-row">
          <InputPanel
            prompt={prompt}
            setPrompt={setPrompt}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            isGenerating={isGenerating}
            mode={mode}
            setMode={setMode}
            selectedFiles={selectedFiles}
            previewUrls={previewUrls}
            handleGenerate={handleGenerate}
            error={error}
            success={success}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
            clearFiles={clearFiles}
            handleRemoveFile={handleRemoveFile}
            isDragging={isDragging}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            model={model}
            setModel={setModel}
          />
          <PreviewPanel
            currentImage={currentImage}
            handleDownloadCurrent={handleDownloadCurrent}
            videoStatus={mode === "video" ? videoStatus : undefined}
            videoProgress={mode === "video" ? videoProgress : undefined}
            completedVideoUri={completedVideoUri}
            previewUrls={previewUrls}
          />
        </div>
        {history.length > 0 && (
          <ImageHistory
            images={history}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </main>
    </section>
  );
};

export default Home;
