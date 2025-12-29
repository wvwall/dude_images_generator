import { useRef, useState } from "react";
import { Play, Pause, CirclePlay, CirclePause } from "lucide-react";

type AudioPlayerProps = {
  audioSrc: string;
  volume?: number;
};

export default function AudioPlayer({
  audioSrc,
  volume = 1,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

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
    <div className="flex items-center gap-2 transition-colors hover:text-friends-yellow">
      <button onClick={togglePlay}>
        {playing ? <CirclePause size={18} /> : <CirclePlay size={18} />}
      </button>

      <audio ref={audioRef} src={audioSrc} onEnded={() => setPlaying(false)} />
    </div>
  );
}
