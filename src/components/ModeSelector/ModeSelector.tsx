import React from "react";
import { Type, Image, Video } from "lucide-react";

interface ModeSelectorProps {
  mode: "text" | "image" | "video";
  setMode: (mode: "text" | "image" | "video") => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode }) => {
  return (
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
  );
};

export default ModeSelector;
