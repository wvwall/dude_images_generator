import React, { useState, useEffect } from "react";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { AUDIO_MAP, AudioType } from "../../types";
import { phrases } from "../AudioPlayer/phrases";

const DURATION_MS = 30000; // Duration per phrase (30s)

const InputHeader: React.FC = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const dynamicPhrases = phrases.filter((phrase) => phrase.dynamic);
  const currentPhrase = dynamicPhrases.length
    ? dynamicPhrases[currentPhraseIndex]
    : undefined;

  // advance phrase every DURATION_MS
  useEffect(() => {
    if (dynamicPhrases.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPhraseIndex(
        (prevIndex) => (prevIndex + 1) % dynamicPhrases.length
      );
    }, DURATION_MS);

    return () => clearInterval(interval);
  }, [dynamicPhrases.length]);

  // countdown timer that resets on phrase change
  useEffect(() => {
    if (dynamicPhrases.length === 0) return;
    setElapsed(0);
    const start = Date.now();
    const tick = setInterval(() => {
      const e = Date.now() - start;
      setElapsed(e >= DURATION_MS ? DURATION_MS : e);
    }, 100);

    return () => clearInterval(tick);
  }, [currentPhraseIndex, dynamicPhrases.length]);

  const percent = Math.min(1, elapsed / DURATION_MS);
  const remainingSec = Math.max(0, Math.ceil((DURATION_MS - elapsed) / 1000));

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent);

  return (
    <div className="mb-2">
      <div className="flex items-start gap-2">
        <h2 className="mb-3 text-4xl text-gray-800 cursor-pointer md:text-7xl font-hand drop-shadow-sm">
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
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
              {currentPhrase && (
                <AudioPlayer audioSrc={currentPhrase.audioSrc} volume={0.3} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="flex flex-col md:flex-row md:items-center md:gap-1">
          <p className="font-medium text-gray-600">
            Describe what you want to generate.
          </p>
          <div className="flex items-start gap-2 mt-1 md:mt-0">
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
