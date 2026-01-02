import React, { useState } from "react";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { AUDIO_MAP, AudioType } from "../../types";
import { useEffect } from "react";
import { phrases } from "../AudioPlayer/phrases";
const InputHeader: React.FC = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const dynamicPhrases = phrases.filter((phrase) => phrase.dynamic);
  const currentPhrase = dynamicPhrases[currentPhraseIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex(
        (prevIndex) => (prevIndex + 1) % dynamicPhrases.length
      );
    }, 30000); // Change phrase every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [dynamicPhrases.length]);

  return (
    <div className="mb-2">
      <div className="flex items-start gap-2">
        <h2 className="mb-3 text-4xl text-gray-800 cursor-pointer md:text-7xl font-hand drop-shadow-sm">
          {currentPhrase.text}
        </h2>
        <AudioPlayer audioSrc={currentPhrase.audioSrc} volume={0.3} />
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
