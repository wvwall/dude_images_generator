import { GeneratedImage } from "@/types";
import { Camera, Download, Edit2, Maximize2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { getImageUrl } from "@/utils/imageUtils";
import Lightbox from "../Lightbox/Lightbox";

interface ImageCardProps {
  image: GeneratedImage;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete, onEdit }) => {
  const imageUrl = getImageUrl(image);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleTap = () => {
    setIsOverlayVisible((prev) => !prev);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
    setIsOverlayVisible(false);
  };

  const handleDownload = async (img: GeneratedImage) => {
    try {
      const imageUrl = getImageUrl(img);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `dude-creation-${img.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Errore durante il download:", error);
    }
  };

  return (
    <div
      key={image.id}
      className="group bg-white dark:bg-dark-surface p-3 pb-4 rounded-xl border-2 border-gray-200 dark:border-dark-border hover:border-friends-purple dark:hover:border-friends-yellow transition-all duration-300 shadow-md hover:shadow-[5px_5px_0px_0px_rgba(93,63,106,0.2)] dark:hover:shadow-[5px_5px_0px_0px_rgba(244,196,48,0.2)]">
      <div
        className="relative w-full overflow-hidden bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg aspect-square"
        onClick={handleTap}>
        <img
          loading="lazy"
          src={imageUrl}
          alt={image.prompt}
          className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
        />

        <div
          className={`absolute *:mb-3 *:mr-3 inset-0 flex items-end justify-end transition-opacity duration-300 bg-black/40 ${isOverlayVisible ? "opacity-100" : "opacity-0"} [@media(hover:hover)]:group-hover:opacity-100`}>
          {/* Bottone centrale - Expand */}
          <button
            className="absolute p-3 hover:cursor-pointer transition-colors -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-white/20 hover:bg-white/30"
            onClick={(e) => {
              e.stopPropagation();
              openLightbox();
            }}
            aria-label="Expand image"
            title="Expand">
            <Maximize2 size={25} className="text-white" />
          </button>

          <button
            aria-label="Delete image"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id);
            }}
            className="p-2 text-black hover:cursor-pointer transition-transform border-2 border-black rounded-full shadow-lg bg-friends-red hover:bg-red-500 hover:scale-110"
            title="Delete">
            <Trash2 size={16} />
          </button>

          <button
            aria-label="Edit image"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(image.id);
            }}
            className="p-2 text-black hover:cursor-pointer transition-transform border-2 border-black rounded-full shadow-lg bg-friends-blue hover:bg-blue-500 hover:scale-110"
            title="Edit">
            <Edit2 size={16} />
          </button>

          <button
            aria-label="Download image"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(image);
            }}
            className="p-2 text-black hover:cursor-pointer transition-transform border-2 border-black rounded-full shadow-lg bg-friends-yellow hover:bg-yellow-400 hover:scale-110"
            title="Download">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="px-1 mt-4">
        <div className="flex items-start gap-2">
          <Camera size={16} className="mt-1 text-gray-400 shrink-0" />
          <p className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-2">
            "{image.prompt}"
          </p>
        </div>
        <div className="flex items-center justify-between pt-3 mt-4 text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase border-t border-gray-100 dark:border-dark-border">
          <span>{new Date(image.timestamp).toLocaleDateString()}</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-card rounded-sm">
            {image.aspectRatio}
          </span>
        </div>
      </div>

      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageUrl={imageUrl}
        alt={image.prompt}
      />
    </div>
  );
};

export default ImageCard;
