import React from "react";
import { Save, Armchair, Video, Loader2 } from "lucide-react";
import { GeneratedImage } from "../types";
import AudioPlayer, { AudioType } from "./AudioPlayer";

interface PreviewPanelProps {
  currentImage: GeneratedImage | null;
  handleDownloadCurrent: () => void;
  videoStatus?: string;
  videoProgress?: number;
  completedVideoUri?: string | null;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  currentImage,
  handleDownloadCurrent,
  videoStatus,
  videoProgress,
  completedVideoUri,
}) => {
  const isGeneratingVideo = videoStatus && videoStatus !== "Video ready!";
  // Variabile per determinare se il video è pronto per la visualizzazione
  const isVideoReady = !!completedVideoUri;

  return (
    <div className="w-full lg:w-7/12 min-h[350px] sm:min-h-[500px] mt-[12px]">
      <div
        className={`
          relative w-full h-full bg-white border-4 border-friends-purple rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-xl
          ${
            !currentImage && !isGeneratingVideo && !isVideoReady
              ? 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]'
              : ""
          }
        `}>
        {isGeneratingVideo ? (
          // Blocco 1: Video in Generazione
          <div className="max-w-md p-12 mx-auto space-y-6 text-center">
            <div className="relative w-24 h-24 bg-friends-yellow rounded-full flex items-center justify-center mx-auto border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Video size={40} className="text-black" />
            </div>

            <div>
              <h3 className="mb-3 text-2xl text-friends-purple font-hand">
                {videoStatus}
              </h3>

              {videoProgress !== undefined && videoProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div
                    className="h-full transition-all duration-500 rounded-full bg-friends-yellow"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              )}

              <p className="text-base font-medium text-gray-500">
                This might take a few minutes. Grab a coffee! ☕
              </p>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking status every 10 seconds...</span>
              </div>
            </div>
          </div>
        ) : isVideoReady ? (
          // Blocco 2: Video Completato e Pronto (NUOVA AGGIUNTA)
          <div className="relative w-full h-full p-6 group bg-gray-50">
            <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden border-8 border-white rounded-lg shadow-lg">
              <h4 className="p-4 text-xl text-friends-purple font-hand">
                Video Generato con Successo! 🎉
              </h4>

              {/* Player Video HTML5 */}
              <video
                controls
                width="80%"
                src={completedVideoUri || ""}
                className="max-h-[80%] rounded-lg shadow-md">
                Il tuo browser non supporta il tag video.
              </video>
            </div>

            {/* Link di Download */}
            <div className="absolute transition-opacity duration-300 opacity-0 top-10 right-10 group-hover:opacity-100">
              <a
                href={completedVideoUri || ""}
                download="video_generato_gemini.mp4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-white transition-colors border-2 border-white rounded-full shadow-lg bg-friends-purple hover:bg-purple-800">
                <Save size={18} />
                Scarica Video
              </a>
            </div>
          </div>
        ) : currentImage ? (
          // Blocco 3: Immagine Statica Generata
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
          // Blocco 4: Stato Iniziale/Vuoto
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
