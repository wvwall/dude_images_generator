import React, { useState, useEffect } from "react";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { AUDIO_MAP, AudioType } from "../../types";
import { phrases } from "../AudioPlayer/phrases";

const DURATION_MS = 10000; // Duration per phrase (10s)

const InputHeader: React.FC = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const dynamicPhrases = phrases.filter((phrase) => phrase.dynamic);
  const currentPhrase = dynamicPhrases.length
    ? dynamicPhrases[currentPhraseIndex]
    : undefined;

  // advance phrase every DURATION_MS
  useEffect(() => {
    if (dynamicPhrases.length === 0 || isPlaying) return;
    const interval = setInterval(() => {
      setCurrentPhraseIndex(
        (prevIndex) => (prevIndex + 1) % dynamicPhrases.length
      );
    }, DURATION_MS - elapsed);

    return () => clearInterval(interval);
  }, [dynamicPhrases.length, isPlaying, elapsed]);

  // countdown timer that resets on phrase change
  useEffect(() => {
    if (dynamicPhrases.length === 0) return;

    let tick: NodeJS.Timeout;
    if (!isPlaying) {
      const start = Date.now() - elapsed;
      tick = setInterval(() => {
        const e = Date.now() - start;
        setElapsed(e >= DURATION_MS ? DURATION_MS : e);
      }, 100);
    }

    return () => {
      if (tick) clearInterval(tick);
    };
  }, [currentPhraseIndex, isPlaying, dynamicPhrases.length]);

  // Reset elapsed when phrase changes
  useEffect(() => {
    setElapsed(0);
  }, [currentPhraseIndex]);

  const percent = Math.min(1, elapsed / DURATION_MS);
  const remainingSec = Math.max(0, Math.ceil((DURATION_MS - elapsed) / 1000));

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent);

  return (
    <div className="mb-2">
      <div className="flex gap-2 items-start">
        <h2 className="mb-3 text-4xl text-gray-800 drop-shadow-sm cursor-pointer md:text-7xl font-hand">
          {currentPhrase ? currentPhrase.text : "..."}
        </h2>

        <div className="flex gap-2 items-center">
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
            <div className="flex absolute inset-0 justify-center items-center text-xs font-medium text-gray-700">
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

      <div className="flex gap-2 items-start">
        <div className="flex flex-col md:flex-row md:items-center md:gap-1">
          <p className="font-medium text-gray-600">
            Describe what you want to generate.
          </p>
          <div className="flex gap-2 items-start mt-1 md:mt-0">
            <p className="font-medium text-gray-600">
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
