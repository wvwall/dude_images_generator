import { X } from "lucide-react";
import React, { useEffect } from "react";

interface VideoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const VideoLightbox: React.FC<VideoLightboxProps> = ({
  isOpen,
  onClose,
  videoUrl,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center duration-200 z-9999 bg-black/90 animate-in fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute p-2 hover:cursor-pointer text-white transition-colors rounded-full top-4 right-4 hover:bg-white/20"
        aria-label="Close"
      >
        <X size={24} />
      </button>
      <video
        src={videoUrl}
        controls
        autoPlay
        className="max-h-[90vh] max-w-[90vw] rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default VideoLightbox;
