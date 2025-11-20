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
    <div className="w-full max-w-6xl px-6 pb-20 mx-auto mt-16">
      <div className="flex items-center gap-3 pb-4 mb-8 border-b-2 border-friends-yellow">
        <History size={24} className="text-gray-800" />
        <h2 className="text-2xl text-gray-800 font-hand">The Archive</h2>
        <span className="px-3 py-1 ml-auto text-xs font-bold text-white rounded-full shadow-sm bg-friends-blue">
          {images.length} SNAPS
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="group bg-white p-3 pb-4 rounded-xl border-2 border-gray-200 hover:border-friends-purple transition-all duration-300 shadow-md hover:shadow-[5px_5px_0px_0px_rgba(93,63,106,0.2)]">
            <div className="relative w-full overflow-hidden bg-gray-100 border border-gray-200 rounded-lg aspect-square">
              <img
                src={img.url}
                alt={img.prompt}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 opacity-0 bg-black/40 group-hover:opacity-100">
                <button
                  onClick={() => handleDownload(img)}
                  className="p-3 text-black transition-transform border-2 border-black rounded-full shadow-lg bg-friends-yellow hover:bg-yellow-400 hover:scale-110"
                  title="Download">
                  <Download size={20} />
                </button>
                <button
                  onClick={() => onDelete(img.id)}
                  className="p-3 text-white transition-transform border-2 border-black rounded-full shadow-lg bg-friends-red hover:bg-red-500 hover:scale-110"
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
