import { Image, Type, Video } from "lucide-react";
import React from "react";

interface ModeSelectorProps {
  mode: "text" | "image" | "video";
  setMode: (mode: "text" | "image" | "video") => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode }) => {
  return (
    <div
      className="flex border-b-2 border-gray-100 dark:border-dark-border"
      data-tour="mode-selector">
      <button
        onClick={() => setMode("text")}
        className={`flex-1 py-4 hover:cursor-pointer font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
          mode === "text"
            ? "bg-white dark:bg-dark-surface text-friends-purple dark:text-friends-yellow"
            : "bg-gray-50 dark:bg-dark-card text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border"
        }`}>
        <Type size={18} />
        Text
      </button>
      <div className="w-[2px] bg-gray-100 dark:bg-dark-border"></div>
      <button
        onClick={() => setMode("image")}
        className={`flex-1 hover:cursor-pointer py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
          mode === "image"
            ? "bg-white dark:bg-dark-surface text-friends-purple dark:text-friends-yellow"
            : "bg-gray-50 dark:bg-dark-card text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border"
        }`}>
        <Image size={18} />
        Image
      </button>
      <div className="w-0.5 bg-gray-100 dark:bg-dark-border"></div>
      <button
        onClick={() => setMode("video")}
        className={`flex-1 hover:cursor-pointer py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
          mode === "video"
            ? "bg-white dark:bg-dark-surface text-friends-purple dark:text-friends-yellow"
            : "bg-gray-50 dark:bg-dark-card text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border"
        }`}>
        <Video size={18} />
        Video
      </button>
    </div>
  );
};

export default ModeSelector;
