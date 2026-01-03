import { AlertCircle, CheckCircle } from "lucide-react";
import React, { RefObject } from "react";
import { AspectRatio } from "../types";
import AspectRatioSelector from "./AspectRatioSelector/AspectRatioSelector";
import ImageUploadArea from "./ImageUploadArea/ImageUploadArea";
import ModelSelectorDropdown from "./ModelSelectorDropdown/ModelSelectorDropdown";
import PivotButton from "./PivotButton/PivotButton";
import PromptInput from "./PromptInput/PromptInput";

interface InputFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (aspectRatio: AspectRatio) => void;
  isGenerating: boolean;
  mode: "text" | "image" | "video";
  selectedFiles: File[];
  previewUrls: string[];
  handleGenerate: (e: React.FormEvent) => void;
  error: string | null;
  success: string | null;
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

const InputForm: React.FC<InputFormProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  isGenerating,
  mode,
  selectedFiles,
  previewUrls,
  handleGenerate,
  error,
  success,
  fileInputRef,
  handleFileSelect,
  clearFiles,
  handleRemoveFile,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  model,
  setModel,
}) => {
  const LIMITS: Record<"image" | "video" | "text", number> = {
    image: 3,
    video: 1,
    text: 0,
  };

  const isMaxImagesReached = (
    mode: keyof typeof LIMITS
  ): { isReached: boolean; limit: number } => {
    const limit = LIMITS[mode];

    return {
      isReached: selectedFiles.length > limit,
      limit,
    };
  };

  const isDisabled =
    isGenerating ||
    !prompt.trim() ||
    (mode === "image" && selectedFiles.length === 0) ||
    isMaxImagesReached(mode)?.isReached;

  return (
    <form onSubmit={handleGenerate} className="flex flex-col flex-1 gap-6 p-6">
      {mode === "video" && (
        <div className="p-4 text-sm font-medium text-yellow-800 bg-yellow-100 border-2 border-yellow-200 rounded-xl">
          <strong className="font-bold">Note:</strong> Video generation may take
          longer to process.
        </div>
      )}
      {(mode === "image" || mode === "video") && (
        <ImageUploadArea
          selectedFiles={selectedFiles}
          previewUrls={previewUrls}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          clearFiles={clearFiles}
          handleRemoveFile={handleRemoveFile}
          isDragging={isDragging}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          maxImages={isMaxImagesReached(mode)}
        />
      )}

      <PromptInput
        mode={mode}
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
      />

      {(mode === "text" || mode === "image") && (
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <div className="w-[250px] space-y-3">
            <span className="block text-sm font-bold tracking-wide text-gray-700 uppercase">
              The Shape
            </span>
            <AspectRatioSelector
              selected={aspectRatio}
              onSelect={setAspectRatio}
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-3 w-[180px]">
            <span className="block text-sm font-bold tracking-wide text-gray-700 uppercase">
              The Model
            </span>
            {(mode === "text" || mode === "image") && (
              <div>
                <ModelSelectorDropdown
                  model={model}
                  setModel={setModel}
                  mode={mode}
                />
              </div>
            )}
          </div>
        </div>
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
      {success && (
        <div className="flex items-start gap-3 p-4 text-sm font-medium text-green-600 border-2 border-green-100 bg-green-50 rounded-xl">
          <CheckCircle size={18} className="shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}
    </form>
  );
};

export default InputForm;
