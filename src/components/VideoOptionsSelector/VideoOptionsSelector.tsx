import React from "react";
import { Monitor, Clock } from "lucide-react";
import { VideoResolution, VideoDuration } from "@/types";

interface VideoOptionsSelectorProps {
  resolution: VideoResolution;
  onResolutionChange: (resolution: VideoResolution) => void;
  duration: VideoDuration;
  onDurationChange: (duration: VideoDuration) => void;
  disabled?: boolean;
}

const VideoOptionsSelector: React.FC<VideoOptionsSelectorProps> = ({
  resolution,
  onResolutionChange,
  duration,
  onDurationChange,
  disabled,
}) => {
  const resolutions: { value: VideoResolution; label: string }[] = [
    { value: "720p", label: "720p" },
    { value: "1080p", label: "1080p" },
  ];

  const durations: { value: VideoDuration; label: string }[] = [
    { value: 4, label: "4s" },
  ];

  return (
    <div className="flex flex-col gap-5 md:flex-row md:justify-between">
      {/* Resolution Selector */}
      <div className="space-y-3">
        <span className="flex items-center gap-2 text-sm font-bold tracking-wide text-gray-700 dark:text-gray-300 uppercase">
          <Monitor size={16} />
          Resolution
        </span>
        <div className="flex flex-wrap gap-3">
          {resolutions.map((res) => (
            <button
              key={res.value}
              type="button"
              onClick={() => onResolutionChange(res.value)}
              disabled={disabled}
              className={`
                flex hover:cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 border-2
                ${
                  resolution === res.value
                    ? "bg-friends-purple text-white border-friends-purple shadow-[3px_3px_0px_0px_rgba(244,196,48,1)]"
                    : "bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 border-gray-200 dark:border-dark-border hover:border-friends-purple dark:hover:border-friends-yellow hover:text-friends-purple dark:hover:text-friends-yellow"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <span>{res.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Duration Selector (disabled) */}
      <div className="space-y-3">
        <span className="flex items-center gap-2 text-sm font-bold tracking-wide text-gray-400 dark:text-gray-500 uppercase">
          <Clock size={16} />
          Duration
          <span className="text-xs font-normal normal-case">(coming soon)</span>
        </span>
        <div className="flex flex-wrap gap-3">
          {durations.map((dur) => (
            <button
              key={dur.value}
              type="button"
              onClick={() => onDurationChange(dur.value)}
              disabled={true}
              className={`
                flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 border-2
                ${
                  duration === dur.value
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                    : "bg-gray-100 dark:bg-dark-card text-gray-400 dark:text-gray-500 border-gray-200 dark:border-dark-border"
                }
                opacity-50 cursor-not-allowed
              `}
            >
              <span>{dur.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoOptionsSelector;
