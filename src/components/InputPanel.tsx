import React, { RefObject } from "react";
import {
  Wand2,
  Loader2,
  AlertCircle,
  Upload,
  Image,
  Type,
  X,
  Video,
} from "lucide-react";
import { AspectRatio } from "../types";
import AspectRatioSelector from "./AspectRatioSelector";
import AudioPlayer, { AudioType } from "./AudioPlayer";

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
      <div className="mb-2">
        <div className="flex gap-2">
          <h2 className="mb-3 text-4xl text-gray-800 md:text-6xl font-hand drop-shadow-sm">
            How you doin'?
          </h2>
          <AudioPlayer type={AudioType.HOW_YOU_DOIN} volume={0.3} />
        </div>
        <div className="flex gap-2">
          <p className="font-medium text-gray-600">
            Describe what you want to see, I'll be there for you.
          </p>
          <AudioPlayer type={AudioType.FRIENDS_THEME} volume={0.3} />
        </div>
      </div>

      <div className="relative flex flex-col flex-1 overflow-hidden bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
        <div className="absolute top-0 left-0 z-10 w-full h-1 bg-friends-yellow"></div>

        {/* Tab Switcher */}
        <div className="flex border-b-2 border-gray-100">
          <button
            onClick={() => setMode("text")}
            className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
              mode === "text"
                ? "bg-white text-friends-purple"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}>
            <Type size={18} />
            Text
          </button>
          <div className="w-[2px] bg-gray-100"></div>
          <button
            onClick={() => setMode("image")}
            className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
              mode === "image"
                ? "bg-white text-friends-purple"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}>
            <Image size={18} />
            Image
          </button>
          <div className="w-[2px] bg-gray-100"></div>
          <button
            onClick={() => setMode("video")}
            className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
              mode === "video"
                ? "bg-white text-friends-purple"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}>
            <Video size={18} />
            Video
          </button>
        </div>

        <form
          onSubmit={handleGenerate}
          className="flex flex-col flex-1 gap-6 p-6">
          {/* Image Upload Area (Only in Image Mode) */}
          {mode === "image" && (
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
                    <span className="text-xs text-gray-500">
                      JPG or PNG, max 4MB
                    </span>
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
          )}

          {mode === "video" && (
            <div className="p-4 text-sm font-medium text-yellow-800 bg-yellow-100 border-2 border-yellow-200 rounded-xl">
              <strong className="font-bold">Note:</strong> Video generation may
              take longer to process.
            </div>
          )}
          <div className="space-y-3">
            <label className="block text-sm font-bold tracking-wide text-gray-700 uppercase">
              {mode === "image" ? "Modify it how?" : "The Prompt"}
            </label>
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === "image"
                    ? "Make it look like a comic book, add a turkey on the head..."
                    : "A couch in a fountain, 90s sitcom style, cozy coffee shop vibe..."
                }
                className="w-full min-h-[120px] p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-friends-purple focus:bg-white focus:ring-0 transition-all outline-none resize-none placeholder:text-gray-400"
                disabled={isGenerating}
              />
              <div className="absolute text-xs font-bold text-gray-400 bottom-3 right-3 group-focus-within:text-friends-purple">
                {prompt.length} chars
              </div>
            </div>
          </div>
          {(mode === "text" || mode === "image") && (
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
          )}

          <div className="pt-2 mt-auto">
            <button
              type="submit"
              disabled={isDisabled}
              className={`
                            w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black
                            ${
                              isDisabled
                                ? "bg-gray-100 text-gray-400 border-gray-300 shadow-none cursor-not-allowed"
                                : "bg-friends-yellow text-black hover:bg-yellow-400"
                            }
                          `}>
              {isGenerating ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2
                    className="animate-spin text-friends-purple"
                    size={20}
                  />
                  <span>Pivot... Pivot!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Wand2 size={20} />
                  <span>PIVOT!</span>
                </div>
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 text-sm font-medium border-2 border-red-100 bg-red-50 rounded-xl text-friends-red">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>Error, try again later.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InputPanel;
