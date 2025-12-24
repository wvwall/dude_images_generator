import { AlertCircle } from "lucide-react";
import React, { RefObject } from "react";
import { AspectRatio } from "../types";
import AspectRatioSelector from "./AspectRatioSelector/AspectRatioSelector";
import ImageUploadArea from "./ImageUploadArea/ImageUploadArea";
import PivotButton from "./PivotButton/PivotButton";
import PromptInput from "./PromptInput/PromptInput";
import ModelSelectorDropdown from "./ModelSelectorDropdown/ModelSelectorDropdown";

interface InputFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (aspectRatio: AspectRatio) => void;
  isGenerating: boolean;
  mode: "text" | "image" | "video";
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
  model: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview";
  setModel: (
    model: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview"
  ) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  isGenerating,
  mode,
  selectedFile,
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
  model,
  setModel,
}) => {
  const isDisabled =
    isGenerating || !prompt.trim() || (mode === "image" && !selectedFile);

  return (
    <form onSubmit={handleGenerate} className="flex flex-col flex-1 gap-6 p-6">
      {mode === "image" && (
        <ImageUploadArea
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          clearFile={clearFile}
          isDragging={isDragging}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
        />
      )}

      {mode === "video" && (
        <div className="p-4 text-sm font-medium text-yellow-800 bg-yellow-100 border-2 border-yellow-200 rounded-xl">
          <strong className="font-bold">Note:</strong> Video generation may take
          longer to process.
        </div>
      )}

      <PromptInput
        mode={mode}
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
      />

      {(mode === "text" || mode === "image") && (
        <>
          <div className="space-y-3">
            <label className="block text-sm font-bold tracking-wide text-gray-700 uppercase">
              The Shape
            </label>
            <AspectRatioSelector
              selected={aspectRatio}
              onSelect={setAspectRatio}
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-bold tracking-wide text-gray-700 uppercase">
              The Model
            </label>
            {(mode === "text" || mode === "image") && (
              <div className="flex ">
                <ModelSelectorDropdown
                  model={model}
                  setModel={setModel}
                  mode={mode}
                />
              </div>
            )}
          </div>
        </>
      )}

      <div className="pt-2 mt-auto">
        <PivotButton isGenerating={isGenerating} isDisabled={isDisabled} />
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 text-sm font-medium border-2 border-red-100 bg-red-50 rounded-xl text-friends-red">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>Error, try again later.</span>
        </div>
      )}
    </form>
  );
};

export default InputForm;
