import React, { useEffect, useRef, useState } from "react";
import { AUDIO_MAP, AudioType } from "../../types";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { phrases } from "../AudioPlayer/phrases";

const DURATION_MS = 10000; // Duration per phrase (10s)

const InputHeader: React.FC = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  const dynamicPhrases = phrases.filter((phrase) => phrase.dynamic);
  const currentPhrase = dynamicPhrases.length
    ? dynamicPhrases[currentPhraseIndex]
    : undefined;

  // Single useEffect to handle both timer and countdown
  useEffect(() => {
    if (dynamicPhrases.length === 0 || isPlaying) return;

    // Set start time accounting for any elapsed time
    startTimeRef.current = Date.now() - elapsed;

    const tick = setInterval(() => {
      const now = Date.now();
      const newElapsed = now - startTimeRef.current;

      if (newElapsed >= DURATION_MS) {
        // Change phrase and reset timer
        setCurrentPhraseIndex((prev) => (prev + 1) % dynamicPhrases.length);
        setElapsed(0);
        startTimeRef.current = now;
      } else {
        setElapsed(newElapsed);
      }
    }, 100);

    return () => clearInterval(tick);
  }, [dynamicPhrases.length, isPlaying]);

  // Reset elapsed when phrase changes externally
  useEffect(() => {
    setElapsed(0);
    startTimeRef.current = Date.now();
  }, [currentPhraseIndex]);

  const percent = Math.min(1, elapsed / DURATION_MS);
  const remainingSec = Math.max(0, Math.ceil((DURATION_MS - elapsed) / 1000));

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent);

  return (
    <div className="mb-2">
      <div className="flex items-start gap-2">
        <h2 className="mb-3 text-4xl text-gray-800 dark:text-white cursor-pointer drop-shadow-xs md:text-7xl font-hand">
          {currentPhrase ? currentPhrase.text : "..."}
        </h2>

        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r={radius}
                strokeWidth="2.5"
                stroke="#F4C430"
                fill="none"
              />
              <circle
                cx="18"
                cy="18"
                r={radius}
                strokeWidth="2.5"
                stroke="#5D3F6A"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 100ms linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300">
              {currentPhrase && (
                <AudioPlayer
                  audioSrc={currentPhrase.audioSrc}
                  volume={0.3}
                  onToggle={setIsPlaying}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="flex flex-col md:flex-row md:items-center md:gap-1">
          <p className="font-medium text-gray-600 dark:text-gray-400">
            Describe what you want to generate.
          </p>
          <div className="flex items-start gap-2 mt-1 md:mt-0">
            <p className="font-medium text-gray-600 dark:text-gray-400">
              I'll be there for youuu…
            </p>
            <AudioPlayer
              audioSrc={AUDIO_MAP[AudioType.FRIENDS_THEME]}
              volume={0.3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputHeader;
