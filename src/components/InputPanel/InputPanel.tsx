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
  selectedFile: File | null;
  previewUrl: string | null;
  handleGenerate: (e: React.FormEvent) => void;
  error: string | null;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  isGenerating,
  mode,
  setMode,
  previewUrl,
  handleGenerate,
  error,
  fileInputRef,
  handleFileSelect,
  clearFile,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  selectedFile,
}) => {
  const isDisabled =
    isGenerating || !prompt.trim() || (mode === "image" && !selectedFile);
  return (
    <div className="flex flex-col w-full gap-6 lg:w-5/12">
      <InputHeader />

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
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          handleGenerate={handleGenerate}
          error={error}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          clearFile={clearFile}
          isDragging={isDragging}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
        />
      </div>
    </div>
  );
};

export default InputPanel;
