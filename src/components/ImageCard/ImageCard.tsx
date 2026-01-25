import { GeneratedImage } from "@/types";
import { Camera, Download, Edit2, Eye, Trash2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "@/utils/imageUtils";

interface ImageCardProps {
  image: GeneratedImage;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const imageUrl = getImageUrl(image);

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `dude-creation-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToDetails = (image: GeneratedImage) => {
    navigate(`/image/${image.id}`);
  };

  return (
    <div
      onClick={() => goToDetails(image)}
      key={image.id}
      className="group cursor-pointer bg-white p-3 pb-4 rounded-xl border-2 border-gray-200 hover:border-friends-purple transition-all duration-300 shadow-md hover:shadow-[5px_5px_0px_0px_rgba(93,63,106,0.2)]">
      <div className="relative w-full overflow-hidden bg-gray-100 border border-gray-200 rounded-lg aspect-square">
        <img
          loading="lazy"
          src={imageUrl}
          alt={image.prompt}
          className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute top-[50%] right-[50%] opacity-0 transition-opacity duration-300  group-hover:opacity-100 translate-x-[50%] translate-y-[-50%] px-3 py-2 text-sm font-semibold text-gray-50">
          <Eye size={25} className="opacity-30 " />
        </div>
        <div className="absolute *:mb-3 *:mr-3 inset-0 flex items-end justify-end  transition-opacity duration-300 opacity-0 bg-black/40 group-hover:opacity-100">
          <button
            aria-label="Delete image"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id);
            }}
            className="p-2 text-black transition-colors border-2 border-black rounded-full shadow-lg bg-friends-red hover:bg-red-500 hover:scale-105"
            title="Delete">
            <Trash2 size={16} />
          </button>

          <button
            aria-label="Edit image"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(image.id);
            }}
            className="p-2 text-black transition-colors border-2 border-black rounded-full shadow-lg bg-friends-blue hover:bg-blue-500 hover:scale-105"
            title="Edit">
            <Edit2 size={16} />
          </button>
          <button
            aria-label="Download image"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(image);
            }}
            className="p-2 text-black transition-colors border-2 border-black rounded-full shadow-lg bg-friends-yellow hover:bg-yellow-400 hover:scale-105"
            title="Download">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="px-1 mt-4">
        <div className="flex items-start gap-2">
          <Camera size={16} className="mt-1 text-gray-400 shrink-0" />
          <p className="text-sm font-medium leading-relaxed text-gray-600 line-clamp-2">
            "{image.prompt}"
          </p>
        </div>
        <div className="flex items-center justify-between pt-3 mt-4 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t border-gray-100">
          <span>{new Date(image.timestamp).toLocaleDateString()}</span>
          <span className="px-2 py-1 bg-gray-100 rounded-sm">
            {image.aspectRatio}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
