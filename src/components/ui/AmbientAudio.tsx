"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const userMutedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (userMutedRef.current) return;

    audio.volume = 0.38;
    audio.muted = false;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {
          // Autoplay restricted until explicit user activation gesture
        });
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.38;

    // 1. Immediate play attempt (succeeds if browser allows it)
    attemptPlay();

    // 2. Global gesture listeners — stay active until audio successfully begins playing
    const handleUserInteraction = () => {
      if (userMutedRef.current) return;
      const el = audioRef.current;
      if (!el) return;

      el.muted = false;
      el.play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
          // Remove global listeners once playing
          removeListeners();
        })
        .catch(() => {
          // If still blocked, keep listeners active for next gesture
        });
    };

    const events: (keyof WindowEventMap)[] = [
      "click",
      "pointerdown",
      "touchstart",
      "keydown",
      "wheel",
    ];

    const removeListeners = () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserInteraction);
        document.removeEventListener(evt, handleUserInteraction);
      });
    };

    events.forEach((evt) => {
      window.addEventListener(evt, handleUserInteraction, { passive: true });
      document.addEventListener(evt, handleUserInteraction, { passive: true });
    });

    // Handle tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (!audio.paused) {
          audio.pause();
        }
      } else {
        if (!userMutedRef.current && !audio.ended) {
          void audio.play().catch(() => undefined);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      removeListeners();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      audio.pause();
    };
  }, [attemptPlay]);

  // Single-click toggle: If paused or muted, starts immediately. If playing, mutes.
  const handleToggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused || isMuted || userMutedRef.current) {
      userMutedRef.current = false;
      setIsMuted(false);
      audio.muted = false;
      audio.volume = 0.38;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
        });
    } else {
      userMutedRef.current = true;
      setIsMuted(true);
      setIsPlaying(false);
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        autoPlay
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlay={() => {
          setIsPlaying(true);
          setIsMuted(false);
        }}
        onPause={() => {
          if (userMutedRef.current) setIsPlaying(false);
        }}
        onEnded={() => {
          // Seamless loop fallback for older WebKit / mobile browsers
          if (audioRef.current && !userMutedRef.current) {
            audioRef.current.currentTime = 0;
            void audioRef.current.play().catch(() => undefined);
          }
        }}
      >
        <source src="/audio/watch-background-audio-loop.mp3" type="audio/mpeg" />
        <source src="/audio/watch-background-audio-loop.wav" type="audio/wav" />
      </audio>

      <button
        type="button"
        onClick={handleToggleSound}
        aria-label={isMuted ? "Unmute background sound" : "Mute background sound"}
        aria-pressed={isMuted}
        title={
          isMuted
            ? "Soundtrack · Click to Play"
            : "Soundtrack · Playing"
        }
        className="fixed bottom-6 right-6 z-[60] group flex h-11 w-11 items-center justify-center rounded-full border border-[var(--champagne-gold)]/40 bg-[var(--midnight-black)]/90 text-[var(--champagne-gold)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[var(--champagne-gold)] hover:bg-[var(--steel-blue)]"
      >
        {/* Subtle pulsing acoustic aura when playing */}
        {isPlaying && !isMuted && (
          <span className="absolute inset-0 rounded-full border border-[var(--champagne-gold)]/30 animate-ping pointer-events-none" />
        )}

        {!isPlaying || isMuted ? (
          <VolumeX className="h-4 w-4 text-[var(--titanium-silver)] transition-colors group-hover:text-[var(--champagne-gold)]" />
        ) : (
          <Volume2 className="h-4 w-4 text-[var(--champagne-gold)]" />
        )}
      </button>
    </>
  );
}
