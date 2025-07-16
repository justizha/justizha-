/** biome-ignore-all lint/a11y/useButtonType: <> */
/** biome-ignore-all lint/a11y/useMediaCaption: <> */
import { useEffect, useRef, useState } from "react";

export default function Audio() {
  const Tracks = [
    { name: "Hip Shop (Luke Pikeman)", path: "/audio/hipshop.mp3" },
    { name: "Hotel (Luke Pikeman)", path: "/audio/hotel.mp3" },
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = Tracks[currentTrackIndex].path;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, isPlaying]);

  useEffect(() => {
    const handleInteraction = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          console.log("Audio started after user interaction.");
        } catch (error) {
          console.log("Playback failed:", error);
        }
      }
      window.removeEventListener("click", handleInteraction);
    };

    window.addEventListener("click", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
    };
  }, []);

  const handleTrackend = () => {
    const nextIndex = (currentTrackIndex + 1) % Tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  return (
    <>
      <div className="flex justify-center items-center  rounded-[2px] bg-base-100">
        <button
          onClick={() =>
            setCurrentTrackIndex(
              (prev) => (prev - 1 + Tracks.length) % Tracks.length
            )
          }
          className="px-2 py-1  bg-opacity-20   border-r mr-1 border-gray-600"
        >
          ⏮
        </button>
        <p className="text-sm mx-1 w-42 truncate">
          {Tracks[currentTrackIndex].name}
        </p>

        <button
          onClick={() =>
            setCurrentTrackIndex((prev) => (prev + 1) % Tracks.length)
          }
          className="px-2 py-1  bg-opacity-20 border-l ml-1 border-gray-600"
        >
          ⏭
        </button>
      </div>

      <audio
        ref={audioRef}
        onEnded={handleTrackend}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        loop
      />
    </>
  );
}
