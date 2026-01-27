import { create } from "zustand";
import { AspectRatio, GeneratedImage } from "../types";

type Mode = "text" | "image" | "video";
type Model = "gemini-2.5-flash-image" | "gemini-3-pro-image-preview";

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

export const useGenerationStore = create<GenerationState & GenerationActions>(
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
    setPrompt: (prompt) => set({ prompt }),
    setAspectRatio: (aspectRatio) => set({ aspectRatio }),
    setMode: (mode) => set({ mode }),
    setModel: (model) => set({ model }),

    // File actions
    setSelectedFiles: (files) =>
      set((state) => ({
        selectedFiles:
          typeof files === "function" ? files(state.selectedFiles) : files,
      })),
    setPreviewUrls: (urls) =>
      set((state) => ({
        previewUrls:
          typeof urls === "function" ? urls(state.previewUrls) : urls,
      })),
    setIsDragging: (isDragging) => set({ isDragging }),

    // Generation actions
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setCurrentImage: (currentImage) => set({ currentImage }),
    setError: (error) => set({ error }),
    setSuccess: (success) => set({ success }),

    // Video actions
    setVideoStatus: (videoStatus) => set({ videoStatus }),
    setVideoProgress: (videoProgress) => set({ videoProgress }),
    setCompletedVideoUri: (completedVideoUri) => set({ completedVideoUri }),
    resetVideo: () =>
      set({ videoStatus: "", videoProgress: 0, completedVideoUri: null }),
  }),
);
