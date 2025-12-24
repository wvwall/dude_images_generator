import { Camera, Download, Edit2, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as sqliteService from "../services/sqliteService";
import { GeneratedImage } from "../types";

const Gallery: React.FC = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState<GeneratedImage | null>(null);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const img = await sqliteService.getImageById(id);
        setImage(img);
      } catch (err) {
        console.warn("Failed to load image", err);
      }
    })();
  }, []);

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement("a");
    link.href = image.url;
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
      await sqliteService.deleteImage(id);
      goToHome();
    } catch (err) {
      console.warn("Failed to delete image from DB", err);
    }
  }, []);

  return (
    <div className="min-h-screen pb-12 font-sans bg-friends-purple-light">
      {/* TODO: image card + prompt to modify it */}
      <main className="max-w-4xl px-4 pt-16 mx-auto">
        <h2 className="p-4 text-2xl text-center  border-friends-purple shadow-[3px_3px_0px_0px_rgba(93,63,106,1)] text-gray-800 border  text-balance font-hand bg-friends-yellow-light rounded-2xl">
          {image?.prompt}
        </h2>

        <div className="flex justify-center py-10">
          <div
            key={image?.id}
            className="group cursor-pointer bg-white p-3 pb-4 rounded-xl border-2 border-gray-200 hover:border-friends-purple transition-all duration-300 shadow-md hover:shadow-[5px_5px_0px_0px_rgba(93,63,106,0.2)]">
            <div className="relative w-full overflow-hidden bg-gray-100 border border-gray-200 rounded-lg aspect-square">
              <img
                src={image?.url}
                alt={image?.prompt}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute *:mb-3 *:mr-3 inset-0 flex items-end justify-end  transition-opacity duration-300 opacity-0 bg-black/40 group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(image?.id)}
                  className="p-2 text-black transition-transform border-2 border-black rounded-full shadow-lg bg-friends-red hover:bg-red-500 hover:scale-110"
                  title="Delete">
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => {
                    if (image) {
                      navigate("/", { state: { editId: image.id } });
                    }
                  }}
                  className="p-2 text-black transition-transform border-2 border-black rounded-full shadow-lg bg-friends-blue hover:bg-blue-500 hover:scale-110"
                  title="Edit">
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDownload(image)}
                  className="p-2 text-black transition-transform border-2 border-black rounded-full shadow-lg bg-friends-yellow hover:bg-yellow-400 hover:scale-110"
                  title="Download">
                  <Download size={16} />
                </button>
              </div>
            </div>

            <div className="px-1 mt-4">
              <div className="flex items-start gap-2">
                <Camera size={16} className="mt-1 text-gray-400 shrink-0" />
                <p className="text-sm font-medium leading-relaxed text-gray-600 line-clamp-2">
                  "{image?.prompt}"
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 mt-4 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t border-gray-100">
                <span>{new Date(image?.timestamp).toLocaleDateString()}</span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {image?.aspectRatio}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gallery;
