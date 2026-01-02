import { BrushCleaning, MessageSquareWarning, Upload, X } from "lucide-react";
import React, { RefObject, useState } from "react";

interface ImageUploadAreaProps {
  selectedFiles: File[];
  previewUrls: string[];
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFiles: () => void;
  handleRemoveFile: (index: number) => void;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  maxImages: {
    isReached: boolean;
    limit: number;
  };
}

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  previewUrls,
  fileInputRef,
  handleFileSelect,
  clearFiles,
  handleRemoveFile,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  maxImages,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3 duration-200 animate-in fade-in zoom-in-95">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold tracking-wide text-gray-700 uppercase">
          Your Reference
        </label>
        {previewUrls.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap gap-1">
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative w-8 h-8 overflow-hidden transition-transform rounded-md group hover:scale-105"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}>
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-full"
                  />
                  {hoveredIndex === index && (
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/50"
                      onClick={() => handleRemoveFile(index)}>
                      <X size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {previewUrls.length > 1 && (
              <button
                type="button"
                onClick={clearFiles}
                className="p-1.5 text-black transition-colors border-2 border-black rounded-full shadow-md bg-friends-red hover:bg-red-600">
                <BrushCleaning size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
                flex flex-col items-center justify-center h-32 gap-2 transition-colors border-2 border-dashed cursor-pointer rounded-xl group
                ${
                  isDragging
                    ? "border-friends-purple bg-friends-cream"
                    : "border-friends-purple/30 bg-friends-cream/30 hover:bg-friends-cream"
                }
              `}>
        {maxImages.isReached ? (
          <MessageSquareWarning className="text-friends-red" />
        ) : (
          <Upload
            className={`transition-transform text-friends-purple ${
              isDragging ? "scale-110" : "group-hover:scale-110"
            }`}
            size={24}
          />
        )}
        <span className="text-sm font-bold text-friends-purple">
          {!maxImages.isReached &&
            (isDragging ? "Drop it!" : "Upload photos to pivot")}
        </span>

        {!isDragging && !maxImages.isReached && (
          <span className="text-xs text-gray-500">
            JPG or PNG, max 4MB per image
          </span>
        )}
        {maxImages.isReached && (
          <span className="text-sm font-semibold text-friends-purple">
            Images limit reached.
            <span className="text-[10px] text-friends-red ml-1">
              ( {maxImages.limit} )
            </span>
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg"
        className="hidden"
        multiple
        disabled={maxImages.isReached}
      />
    </div>
  );
};

export default ImageUploadArea;
