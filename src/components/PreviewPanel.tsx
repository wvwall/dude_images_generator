import { Armchair, Download, Loader2, Video } from "lucide-react";
import React from "react";
import { GeneratedImage, AUDIO_MAP, AudioType } from "../types";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import { getImageUrl } from "../utils/imageUtils";

interface PreviewPanelProps {
  currentImage: GeneratedImage | null;
  videoStatus: string;
  videoProgress: number;
  completedVideoUri: string | null;
  onDownload: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  currentImage,
  videoStatus,
  videoProgress,
  completedVideoUri,
  onDownload,
}) => {
  const isGeneratingVideo = videoStatus && videoStatus !== "Video ready!";
  const isVideoReady = !!completedVideoUri;

  return (
    <div
      className="w-full lg:w-7/12 md:min-h-[500px] relative "
      data-tour="preview-panel">
      <div
        className={`
           w-full md:min-h-[510px] bg-white dark:bg-dark-surface border-4 border-friends-purple rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-xl
          ${
            !currentImage && !isGeneratingVideo && !isVideoReady
              ? 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] dark:bg-none'
              : ""
          }
        `}>
        {isGeneratingVideo ? (
          // Block 1: Video Generating
          <div className="p-12 mx-auto space-y-6 max-w-md text-center">
            <div className="relative w-24 h-24 bg-friends-yellow rounded-full flex items-center justify-center mx-auto border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Video size={40} className="text-black" />
            </div>

            <div>
              <h3 className="mb-3 text-2xl text-friends-purple dark:text-friends-yellow font-hand">
                {videoStatus}
              </h3>

              {videoProgress !== undefined && videoProgress > 0 && (
                <div className="w-full bg-gray-200 dark:bg-dark-card rounded-full h-3 mb-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div
                    className="h-full rounded-full transition-all duration-1000 bg-friends-yellow"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              )}

              <p className="text-base font-medium text-gray-500 dark:text-gray-400">
                This might take a few minutes. Grab a coffee! ☕
              </p>

              <div className="flex gap-2 justify-center items-center mt-4 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking status every 10 seconds...</span>
              </div>
            </div>
          </div>
        ) : isVideoReady ? (
          // Block 2: Video Completed and Ready
          <div className="relative w-full h-full group">
            <div className="flex overflow-hidden relative flex-col justify-center items-center w-full h-full">
              {/* HTML5 Video Player */}
              <video
                controls
                width="100%"
                src={completedVideoUri || ""}
                className="">
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Download Link */}
            <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <a
                href={completedVideoUri || ""}
                download="video_generato_gemini.mp4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center px-2 py-2 text-sm font-bold text-black rounded-full border-2 border-black shadow-lg transition-colors bg-friends-yellow hover:bg-yellow-400 hover:scale-105">
                <Download size={18} />
              </a>
            </div>
          </div>
        ) : currentImage ? (
          // Block 3: Generated Static Image
          <div className="relative w-full h-full bg-gray-50 dark:bg-dark-card group">
            <div className="overflow-hidden relative w-full h-full rounded-lg border-8 border-white dark:border-dark-surface shadow-lg">
              <img
                loading="lazy"
                src={getImageUrl(currentImage)}
                alt="Generated result"
                className="object-contain w-full h-full bg-gray-200 dark:bg-dark-card"
              />
            </div>

            <div className="absolute top-6 right-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button
                aria-label="Download current image"
                onClick={onDownload}
                className="hover:cursor-pointer flex gap-2 items-center px-2 py-2 text-sm font-bold text-black rounded-full border-2 border-black shadow-lg transition-colors bg-friends-yellow hover:bg-yellow-400 hover:scale-105">
                <Download size={18} />
              </button>
            </div>
          </div>
        ) : (
          // Block 4: Initial/Empty State
          <div className="p-12 mx-auto space-y-6 max-w-sm text-center">
            <div className="w-24 h-24 bg-friends-yellow rounded-full flex items-center justify-center mx-auto border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Armchair size={40} className="text-black" />
            </div>
            <div>
              <div className="flex gap-2 justify-center items-start">
                <h3 className="mb-2 text-2xl text-friends-purple dark:text-friends-yellow font-hand">
                  Oh. My. God.
                </h3>
                <AudioPlayer
                  audioSrc={AUDIO_MAP[AudioType.OH_MY_GOD]}
                  volume={0.3}
                />
              </div>

              <p className="text-base font-medium text-gray-500 dark:text-gray-400">
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
