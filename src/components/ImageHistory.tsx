import React from "react";
import { GeneratedImage } from "../types";
import { Download, Trash2 } from "lucide-react";

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
    <div className="mt-16 w-full max-w-5xl mx-auto px-4">
      <h2 className="font-serif text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        Your Collection
        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-sans">
          {images.length}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100">
            <div className="aspect-square w-full overflow-hidden bg-slate-50">
              <img
                src={img.url}
                alt={img.prompt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <p
                className="text-sm text-slate-600 line-clamp-2 mb-3"
                title={img.prompt}>
                "{img.prompt}"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(img.timestamp).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(img)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                    title="Download">
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(img.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageHistory;
