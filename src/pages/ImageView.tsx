import { Camera, Download, Edit2, Maximize2, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GeneratedImage } from "../types";
import { getImageUrl } from "../utils/imageUtils";
import { apiClient } from "../services/apiClient";
import { api } from "../services/api";
import Lightbox from "../components/Lightbox/Lightbox";

const ImageView: React.FC = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { id } = useParams();

  const handleTap = () => {
    setIsOverlayVisible((prev) => !prev);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
    setIsOverlayVisible(false);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<GeneratedImage>(
          api.backend.images.getById(id!),
        );
        const img = await response.json();
        setImage(img);
      } catch (err) {
        console.warn("Failed to load image from backend", err);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement("a");
    link.href = getImageUrl(image);
    link.download = `dude-creation-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const goToHome = () => {
    navigate(`/`);
  };
  const handleDelete = useCallback(async (id: string) => {
    try {
      await apiClient.delete(api.backend.images.delete(id));
      goToHome();
    } catch (err) {
      console.warn("Failed to delete image from backend", err);
    }
  }, []);

  return (
    <div className="min-h-screen pb-12 font-sans bg-friends-purple-light dark:bg-dark-bg">
      <main className="max-w-3xl px-4 pt-16 mx-auto">
        {/* Skeleton */}
        {isLoading && (
          <div className="animate-pulse">
            <div className="h-12 p-4 bg-gray-200 dark:bg-dark-card rounded-2xl" />

            <div className="py-10 ">
              <div className="p-3 pb-4 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border shadow-md rounded-xl">
                <div className="w-full bg-gray-200 dark:bg-dark-card rounded-lg aspect-square" />

                <div className="px-1 mt-4">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-1 bg-gray-200 dark:bg-dark-card rounded-sm shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="w-full h-4 bg-gray-200 dark:bg-dark-card rounded-sm" />
                      <div className="w-5/6 h-4 bg-gray-200 dark:bg-dark-card rounded-sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-100 dark:border-dark-border">
                    <div className="w-20 h-3 bg-gray-200 dark:bg-dark-card rounded-sm" />
                    <div className="w-10 h-5 bg-gray-200 dark:bg-dark-card rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <>
            <h2 className="p-4 text-2xl text-center border-friends-purple shadow-[3px_3px_0px_0px_rgba(93,63,106,1)] text-gray-800 dark:text-white border text-balance font-hand bg-friends-yellow-light dark:bg-dark-surface rounded-2xl">
              {image?.prompt}
            </h2>

            <div className="flex justify-center py-10">
              <div
                key={image?.id}
                className="group cursor-pointer bg-white dark:bg-dark-surface p-3 pb-4 rounded-xl border-2 border-gray-200 dark:border-dark-border hover:border-friends-purple dark:hover:border-friends-yellow transition-all duration-300 shadow-md hover:shadow-[5px_5px_0px_0px_rgba(93,63,106,0.2)] dark:hover:shadow-[5px_5px_0px_0px_rgba(244,196,48,0.2)]">
                <div
                  className="relative w-full overflow-hidden bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg aspect-square"
                  onClick={handleTap}>
                  <img
                    src={image ? getImageUrl(image) : ""}
                    alt={image?.prompt}
                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                  />

                  <div
                    className={`absolute *:mb-3 *:mr-3 inset-0 flex items-end justify-end transition-opacity duration-300 bg-black/40 ${isOverlayVisible ? "opacity-100" : "opacity-0"} [@media(hover:hover)]:group-hover:opacity-100`}>
                    <button
                      className="absolute p-3 transition-colors -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-white/20 hover:bg-white/30"
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
                        handleDelete(image?.id);
                      }}
                      className="p-2 text-black transition-transform border-2 border-black rounded-full shadow-lg bg-friends-red hover:bg-red-500 hover:scale-110"
                      title="Delete">
                      <Trash2 size={16} />
                    </button>
                    <button
                      aria-label="Edit image"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (image) {
                          navigate("/", { state: { editId: image.id } });
                        }
                      }}
                      className="p-2 text-black transition-transform border-2 border-black rounded-full shadow-lg bg-friends-blue hover:bg-blue-500 hover:scale-110"
                      title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button
                      aria-label="Download image"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image);
                      }}
                      className="p-2 text-black transition-transform border-2 border-black rounded-full shadow-lg bg-friends-yellow hover:bg-yellow-400 hover:scale-110"
                      title="Download">
                      <Download size={16} />
                    </button>
                  </div>
                </div>

                <div className="px-1 mt-4">
                  <div className="flex items-start gap-2">
                    <Camera size={16} className="mt-1 text-gray-400 shrink-0" />
                    <p className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-2">
                      "{image?.prompt}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-4 text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase border-t border-gray-100 dark:border-dark-border">
                    <span>
                      {new Date(image?.timestamp).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-dark-card rounded-sm">
                      {image?.aspectRatio}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {image && (
        <Lightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          imageUrl={getImageUrl(image)}
          alt={image.prompt}
        />
      )}
    </div>
  );
};

export default ImageView;
