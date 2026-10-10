/** biome-ignore-all lint/a11y/useMediaCaption: background music, nothing to caption */
import { useCallback, useEffect, useRef, useState } from "react";

const TRACKS = [
  { name: "Hip Shop (Luke Pikeman)", path: "/audio/hipshop.mp3" },
  { name: "Hotel (Luke Pikeman)", path: "/audio/hotel.mp3" },
];

const MEDIA_ACTIONS = ["play", "pause", "previoustrack", "nexttrack"] as const;

const buttonClass =
  "px-2 py-1 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

export default function AudioPlayer() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1

  const audioRef = useRef<HTMLAudioElement>(null);

  // What the user wants (playing or paused). Kept separate from the element's own
  // state because browsers fire "pause" when a track ends or the source changes,
  // and the next track should still start in those cases.
  const wantsPlayRef = useRef(false);

  const track = TRACKS[index];

  const resume = useCallback(() => {
    wantsPlayRef.current = true;
    audioRef.current
      ?.play()
      .catch((error) => console.log("Playback blocked:", error));
  }, []);

  const pause = useCallback(() => {
    wantsPlayRef.current = false;
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (audioRef.current?.paused) {
      resume();
    } else {
      pause();
    }
  }, [resume, pause]);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % TRACKS.length),
    []
  );

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length),
    []
  );

  // Load the new track when it changes. Only this effect touches `src`, so
  // pausing and resuming never restarts the song.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = track.path;
    setProgress(0);

    if (wantsPlayRef.current) {
      audio.play().catch((error) => console.log("Playback blocked:", error));
    }
  }, [track.path]);

  // Browsers block autoplay, so start on the first click anywhere on the page.
  useEffect(() => {
    window.addEventListener("click", resume, { once: true });
    return () => window.removeEventListener("click", resume);
  }, [resume]);

  // Hardware media keys, headphone buttons, and the OS "now playing" widget.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const session = navigator.mediaSession;
    session.metadata = new MediaMetadata({ title: track.name });
    session.setActionHandler("play", resume);
    session.setActionHandler("pause", pause);
    session.setActionHandler("previoustrack", prev);
    session.setActionHandler("nexttrack", next);

    return () => {
      for (const action of MEDIA_ACTIONS) {
        session.setActionHandler(action, null);
      }
    };
  }, [track.name, resume, pause, prev, next]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio?.duration) {
      setProgress(audio.currentTime / audio.duration);
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-center bg-base-100 text-sm">
        <div className="flex items-center divide-x divide-gray-600">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous track"
            className={buttonClass}
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            className={buttonClass}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next track"
            className={buttonClass}
          >
            &gt;&gt;
          </button>
        </div>

        <p className="mx-2 w-44 truncate" title={track.name} aria-live="polite">
          {track.name}
        </p>

        {/* Progress line along the bottom edge */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-700"
        >
          <div
            className="h-full bg-current transition-[width] duration-300 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* No `loop` with multiple tracks, otherwise onEnded never fires */}
      <audio
        ref={audioRef}
        loop={TRACKS.length === 1}
        onEnded={next}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          // The browser fires "pause" right before "ended"; ignore that one
          if (!audioRef.current?.ended) setIsPlaying(false);
        }}
        onTimeUpdate={handleTimeUpdate}
      />
    </>
  );
}