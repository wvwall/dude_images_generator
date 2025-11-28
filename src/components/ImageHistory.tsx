import React from "react";
import { GeneratedImage } from "../types";
import { Download, Trash2, History, Camera, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ImageHistoryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const ImageHistory: React.FC<ImageHistoryProps> = ({
  images,
  onDelete,
  onEdit,
}) => {
  const navigate = useNavigate();

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = `dude-creation-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToDetails = (image: GeneratedImage) => {
    navigate(`/image/${image.id}`);
  };

  return (
    <div className="w-full pb-20 mt-16">
      <div className="flex items-center gap-2 pb-4 mb-8 border-b-2 border-friends-purple">
        <span className="px-3 py-1 text-xs font-bold rounded-lg shadow-sm text-friends-yellow bg-friends-purple">
          {images.length} SNAPS
        </span>
        {window.location.pathname === "/" && (
          <>
            <button
              onClick={() => navigate("/gallery")}
              className="ml-auto font-semibold text-black underline text-md underline-offset-4 hover:text-friends-purple hover:brightness-110"
              title="See all">
              See all
            </button>
            <History size={20} className="text-black " />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <div
            onClick={() => goToDetails(img)}
            key={img.id}
            className="group cursor-pointer bg-white p-3 pb-4 rounded-xl border-2 border-gray-200 hover:border-friends-purple transition-all duration-300 shadow-md hover:shadow-[5px_5px_0px_0px_rgba(93,63,106,0.2)]">
            <div className="relative w-full overflow-hidden bg-gray-100 border border-gray-200 rounded-lg aspect-square">
              <img
                src={img.url}
                alt={img.prompt}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 opacity-0 bg-black/40 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(img);
                  }}
                  className="p-3 text-black transition-transform border-2 border-black rounded-full shadow-lg bg-friends-yellow hover:bg-yellow-400 hover:scale-110"
                  title="Download">
                  <Download size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(img.id);
                  }}
                  className="p-3 text-black transition-transform border-2 border-black rounded-full shadow-lg bg-friends-blue hover:bg-blue-500 hover:scale-110"
                  title="Delete">
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(img.id);
                  }}
                  className="p-3 text-black transition-transform border-2 border-black rounded-full shadow-lg bg-friends-red hover:bg-red-500 hover:scale-110"
                  title="Delete">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="px-1 mt-4">
              <div className="flex items-start gap-2">
                <Camera size={16} className="mt-1 text-gray-400 shrink-0" />
                <p className="text-sm font-medium leading-relaxed text-gray-600 line-clamp-2">
                  "{img.prompt}"
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 mt-4 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t border-gray-100">
                <span>{new Date(img.timestamp).toLocaleDateString()}</span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {img.aspectRatio}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageHistory;
