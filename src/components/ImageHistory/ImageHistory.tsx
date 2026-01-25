import { GalleryHorizontalEnd } from "lucide-react";
import ImageCard from "../ImageCard/ImageCard";
import React from "react";
import { useNavigate } from "react-router-dom";
import SkeletonCard from "../ImageCard/SkeletonCard";
import { GeneratedImage } from "@/types";

interface ImageHistoryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isLoading?: boolean;
}

const ImageHistory: React.FC<ImageHistoryProps> = ({
  images,
  onDelete,
  onEdit,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const isHomePath = window.location.pathname === "/";

  const IMAGES = isHomePath ? images.slice(0, 3) : images;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-1 pb-4 mb-8 border-b-2 border-dashed border-friends-purple/70">
        {isHomePath ? (
          <span className="px-3 py-1 text-xs font-bold rounded-lg shadow-xs text-friends-yellow bg-friends-purple">
            {images?.length >= 3 ? 3 : images?.length} of {images?.length} SNAPS
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-bold rounded-lg shadow-xs text-friends-yellow bg-friends-purple">
            {images?.length} SNAPS
          </span>
        )}
        {isHomePath && (
          <>
            <GalleryHorizontalEnd size={18} className="ml-auto text-black" />
            <button
              onClick={() => navigate("/gallery")}
              className="text-sm font-semibold text-black underline decoration-2 underline-offset-4 hover:text-friends-purple hover:brightness-110"
              title="See more">
              See all
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: isHomePath ? 3 : 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : IMAGES.map((image) => (
              <ImageCard
                key={image?.id}
                image={image}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
      </div>
    </div>
  );
};

export default ImageHistory;
