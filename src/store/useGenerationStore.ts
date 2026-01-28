import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension";
import { AspectRatio, GeneratedImage } from "../types";

export type Mode = "text" | "image" | "video";
export type Model = "gemini-2.5-flash-image" | "gemini-3-pro-image-preview";

interface GenerationState {
  // Form
  prompt: string;
  aspectRatio: AspectRatio;
  mode: Mode;
  model: Model;

  // Files
  selectedFiles: File[];
  previewUrls: string[];
  isDragging: boolean;

  // Generation UI
  isGenerating: boolean;
  currentImage: GeneratedImage | null;
  error: string | null;
  success: string | null;

  // Video
  videoStatus: string;
  videoProgress: number;
  completedVideoUri: string | null;
}

interface GenerationActions {
  setPrompt: (prompt: string) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setMode: (mode: Mode) => void;
  setModel: (model: Model) => void;

  setSelectedFiles: (files: File[] | ((prev: File[]) => File[])) => void;
  setPreviewUrls: (urls: string[] | ((prev: string[]) => string[])) => void;
  setIsDragging: (dragging: boolean) => void;

  setIsGenerating: (generating: boolean) => void;
  setCurrentImage: (image: GeneratedImage | null) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;

  setVideoStatus: (status: string) => void;
  setVideoProgress: (progress: number) => void;
  setCompletedVideoUri: (uri: string | null) => void;
  resetVideo: () => void;
}

export type GenerationStore = GenerationState & GenerationActions;

export const useGenerationStore = create<GenerationStore>()(
  devtools(
    (set) => ({
      // Form defaults
      prompt: "",
      aspectRatio: "1:1",
      mode: "text",
      model: "gemini-2.5-flash-image",

      // Files
      selectedFiles: [],
      previewUrls: [],
      isDragging: false,

      // Generation UI
      isGenerating: false,
      currentImage: null,
      error: null,
      success: null,

      // Video
      videoStatus: "",
      videoProgress: 0,
      completedVideoUri: null,

      // Form actions
      setPrompt: (prompt) => set({ prompt }, false, "form/setPrompt"),
      setAspectRatio: (aspectRatio) => set({ aspectRatio }, false, "form/setAspectRatio"),
      setMode: (mode) => set({ mode }, false, "form/setMode"),
      setModel: (model) => set({ model }, false, "form/setModel"),

      // File actions
      setSelectedFiles: (files) =>
        set(
          (state) => ({
            selectedFiles:
              typeof files === "function" ? files(state.selectedFiles) : files,
          }),
          false,
          "files/setSelectedFiles",
        ),
      setPreviewUrls: (urls) =>
        set(
          (state) => ({
            previewUrls:
              typeof urls === "function" ? urls(state.previewUrls) : urls,
          }),
          false,
          "files/setPreviewUrls",
        ),
      setIsDragging: (isDragging) => set({ isDragging }, false, "files/setIsDragging"),

      // Generation actions
      setIsGenerating: (isGenerating) => set({ isGenerating }, false, "generation/setIsGenerating"),
      setCurrentImage: (currentImage) => set({ currentImage }, false, "generation/setCurrentImage"),
      setError: (error) => set({ error }, false, "generation/setError"),
      setSuccess: (success) => set({ success }, false, "generation/setSuccess"),

      // Video actions
      setVideoStatus: (videoStatus) => set({ videoStatus }, false, "video/setVideoStatus"),
      setVideoProgress: (videoProgress) => set({ videoProgress }, false, "video/setVideoProgress"),
      setCompletedVideoUri: (completedVideoUri) =>
        set({ completedVideoUri }, false, "video/setCompletedVideoUri"),
      resetVideo: () =>
        set({ videoStatus: "", videoProgress: 0, completedVideoUri: null }, false, "video/resetVideo"),
    }),
    { name: "GenerationStore" },
  ),
);
