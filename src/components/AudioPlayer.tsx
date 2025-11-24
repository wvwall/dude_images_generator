import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export enum AudioType {
  HOW_YOU_DOIN = "HOW_YOU_DOIN",
  OH_MY_GOD = "OH_MY_GOD",
  FRIENDS_THEME = "FRIENDS_THEME",
}

const AUDIO_MAP: Record<AudioType, string> = {
  [AudioType.HOW_YOU_DOIN]: "audio/how_you_doin.mp3",
  [AudioType.OH_MY_GOD]: "audio/oh_my_god.mp3",
  [AudioType.FRIENDS_THEME]: "audio/friends_theme.mp3",
};

type AudioPlayerProps = {
  type: AudioType;
  volume?: number;
};

export default function AudioPlayer({ type, volume = 1 }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const src = AUDIO_MAP[type];

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.volume = volume;
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={togglePlay}>
        {playing ? <Pause size={14} /> : <Play size={14} />}
      </button>

      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
    </div>
  );
}
