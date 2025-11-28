import React from "react";
import { Save, Armchair } from "lucide-react";
import { GeneratedImage } from "../types";
import AudioPlayer, { AudioType } from "./AudioPlayer";

interface PreviewPanelProps {
  currentImage: GeneratedImage | null;
  handleDownloadCurrent: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  currentImage,
  handleDownloadCurrent,
}) => {
  return (
    <div className="w-full lg:w-7/12 min-h[350px] sm:min-h-[500px] mt-[12px]">
      <div
        className={`
          relative w-full h-full bg-white border-4 border-friends-purple rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-xl
          ${
            !currentImage
              ? 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]'
              : ""
          }
        `}>
        {currentImage ? (
          <div className="relative w-full h-full p-6 group bg-gray-50">
            <div className="relative w-full h-full overflow-hidden border-8 border-white rounded-lg shadow-lg">
              <img
                src={currentImage.url}
                alt="Generated result"
                className="object-contain w-full h-full bg-gray-200"
              />
            </div>

            <div className="absolute transition-opacity duration-300 opacity-0 top-10 right-10 group-hover:opacity-100">
              <button
                onClick={handleDownloadCurrent}
                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-white transition-colors border-2 border-white rounded-full shadow-lg bg-friends-purple hover:bg-purple-800">
                <Save size={18} />
                Save This
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-sm p-12 mx-auto space-y-6 text-center">
            <div className="w-24 h-24 bg-friends-yellow rounded-full flex items-center justify-center mx-auto border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Armchair size={40} className="text-black" />
            </div>
            <div>
              <div className="flex justify-center gap-2">
                <h3 className="mb-2 text-2xl text-friends-purple font-hand">
                  Oh. My. God.
                </h3>
                <AudioPlayer type={AudioType.OH_MY_GOD} volume={0.3} />
              </div>

              <p className="text-base font-medium text-gray-500">
                It's empty in here! Enter a prompt to start creating.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
