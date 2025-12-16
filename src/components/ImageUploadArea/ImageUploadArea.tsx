import React, { RefObject } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadAreaProps {
  selectedFile: File | null;
  previewUrl: string | null;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  previewUrl,
  fileInputRef,
  handleFileSelect,
  clearFile,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
}) => {
  return (
    <div className="space-y-3 duration-200 animate-in fade-in zoom-in-95">
      <label className="block text-sm font-bold tracking-wide text-gray-700 uppercase">
        Your Reference
      </label>

      {!previewUrl ? (
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
          <Upload
            className={`transition-transform text-friends-purple ${
              isDragging ? "scale-110" : "group-hover:scale-110"
            }`}
            size={24}
          />

          <span className="text-sm font-bold text-friends-purple">
            {isDragging ? "Drop it!" : "Upload a photo to pivot"}
          </span>

          {!isDragging && (
            <span className="text-xs text-gray-500">JPG or PNG, max 4MB</span>
          )}
        </div>
      ) : (
        <div className="relative w-full h-32 overflow-hidden bg-gray-100 border-2 rounded-xl border-friends-purple">
          <img
            src={previewUrl}
            alt="Preview"
            className="object-cover w-full h-full"
          />
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg"
        className="hidden"
      />
    </div>
  );
};

export default ImageUploadArea;
