import React, { useState } from "react";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { AUDIO_MAP, AudioType, phrases } from "../../types";
import { useEffect } from "react";
const InputHeader: React.FC = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const dynamicPhrases = phrases.filter((phrase) => phrase.dynamic);
  const currentPhrase = dynamicPhrases[currentPhraseIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex(
        (prevIndex) => (prevIndex + 1) % dynamicPhrases.length
      );
    }, 10000); // Change phrase every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [dynamicPhrases.length]);

  return (
    <div className="mb-2">
      <div className="flex items-start gap-2">
        <h2 className="mb-3 text-4xl text-gray-800 cursor-pointer md:text-6xl font-hand drop-shadow-sm">
          {currentPhrase.text}
        </h2>
        <AudioPlayer audioSrc={currentPhrase.audioSrc} volume={0.3} />
      </div>
      <div className="flex items-start gap-2">
        <div className="flex flex-col">
          <p className="font-medium text-gray-600">
            Describe what you want to generate.
          </p>
          <div className="flex items-start gap-2 mt-1">
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
