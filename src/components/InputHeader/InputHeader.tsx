import React from "react";
import AudioPlayer, { AudioType } from "../AudioPlayer/AudioPlayer";

const InputHeader: React.FC = () => {
  return (
    <div className="mb-2">
      <div className="flex items-start gap-2">
        <h2 className="mb-3 text-4xl text-gray-800 md:text-6xl font-hand drop-shadow-sm">
          How you doin'?
        </h2>
        <AudioPlayer type={AudioType.HOW_YOU_DOIN} volume={0.3} />
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
            <AudioPlayer type={AudioType.FRIENDS_THEME} volume={0.3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputHeader;
