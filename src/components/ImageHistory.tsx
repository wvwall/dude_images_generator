import React from "react";
import { GeneratedImage } from "../types";
import { Download, Trash2, History, Camera } from "lucide-react";

interface ImageHistoryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ images, onDelete }) => {
  if (images.length === 0) {
    return null;
  }

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = `dude-creation-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-16 w-full max-w-6xl mx-auto px-6 pb-20">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-gray-200 pb-4">
        <History size={24} className="text-friends-purple" />
        <h2 className="text-2xl font-hand text-gray-800">The Archive</h2>
        <span className="ml-auto text-xs font-bold text-white bg-friends-red px-3 py-1 rounded-full shadow-sm">
          {images.length} SNAPS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img) => (
          <div
            key={img.id}
            className="group bg-white p-3 pb-4 rounded-xl border-2 border-gray-200 hover:border-friends-purple transition-all duration-300 shadow-md hover:shadow-[5px_5px_0px_0px_rgba(93,63,106,0.2)]">
            <div className="aspect-square w-full overflow-hidden bg-gray-100 rounded-lg relative border border-gray-200">
              <img
                src={img.url}
                alt={img.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button
                  onClick={() => handleDownload(img)}
                  className="bg-friends-yellow text-black p-3 rounded-full hover:bg-yellow-400 transition-transform hover:scale-110 shadow-lg border-2 border-black"
                  title="Download">
                  <Download size={20} />
                </button>
                <button
                  onClick={() => onDelete(img.id)}
                  className="bg-friends-red text-white p-3 rounded-full hover:bg-red-500 transition-transform hover:scale-110 shadow-lg border-2 border-black"
                  title="Delete">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="mt-4 px-1">
              <div className="flex items-start gap-2">
                <Camera size={16} className="text-gray-400 mt-1 shrink-0" />
                <p className="text-sm text-gray-600 line-clamp-2 font-medium leading-relaxed">
                  "{img.prompt}"
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                <span>{new Date(img.timestamp).toLocaleDateString()}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">
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
