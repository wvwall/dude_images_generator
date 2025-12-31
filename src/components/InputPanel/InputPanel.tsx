import React, { RefObject } from "react";
import { AspectRatio } from "@/src/types";
import InputForm from "../InputForm";
import InputHeader from "../InputHeader/InputHeader";
import ModeSelector from "../ModeSelector/ModeSelector";

interface InputPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (aspectRatio: AspectRatio) => void;
  isGenerating: boolean;
  mode: "text" | "image" | "video";
  setMode: (mode: "text" | "image" | "video") => void;
  selectedFiles: File[];
  previewUrls: string[];
  handleGenerate: (e: React.FormEvent) => void;
  error: string | null;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFiles: () => void;
  handleRemoveFile: (index: number) => void;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  model: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview";
  setModel: (
    model: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview"
  ) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  isGenerating,
  mode,
  setMode,
  previewUrls,
  handleGenerate,
  error,
  fileInputRef,
  handleFileSelect,
  clearFiles,
  handleRemoveFile,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  selectedFiles,
  model,
  setModel,
}) => {
  const isDisabled =
    isGenerating ||
    !prompt.trim() ||
    (mode === "image" && selectedFiles.length === 0);
  return (
    <div className="flex flex-col w-full gap-6 lg:w-5/12">
      <div className="relative flex flex-col flex-1 overflow-hidden bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
        <div className="absolute top-0 left-0 z-10 w-full h-1 bg-friends-yellow"></div>

        <ModeSelector mode={mode} setMode={setMode} />

        <InputForm
          prompt={prompt}
          setPrompt={setPrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          isGenerating={isGenerating}
          mode={mode}
          selectedFiles={selectedFiles}
          previewUrls={previewUrls}
          handleGenerate={handleGenerate}
          error={error}
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
      </div>
    </div>
  );
};

export default InputPanel;
