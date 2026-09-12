"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { HERO_BEATS } from "@/lib/heroAssets";

export interface VideoBeatConfig {
  id: string;
  src: string;
  poster: string;
  fps: number;
  duration: number; // in seconds
  startProgress: number; // 0.0 to 1.0
  endProgress: number;   // 0.0 to 1.0
  filter?: string;
}

interface VideoCanvasScrubberProps {
  progress: number; // 0.0 to 1.0
  className?: string;
  onActiveBeatChange?: (beatIndex: number) => void;
  onHeroReady?: () => void;
  onHeroMediaReady?: (beatIndex: number) => void;
}

export const PINNED_BEATS: VideoBeatConfig[] = HERO_BEATS.map(([id, src, poster, fps, duration, startProgress, endProgress, filter]) => ({
  id,
  src,
  poster,
  fps,
  duration,
  startProgress,
  endProgress,
  filter,
}));

export default function VideoCanvasScrubber({
  progress,
  className = "",
  onActiveBeatChange,
  onHeroReady,
  onHeroMediaReady,
}: VideoCanvasScrubberProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [readyStates, setReadyStates] = useState<boolean[]>(
    new Array(PINNED_BEATS.length).fill(false)
  );
  const notifiedReadyRef = useRef<boolean[]>(new Array(PINNED_BEATS.length).fill(false));

  const isSeekingRefs = useRef<boolean[]>(new Array(PINNED_BEATS.length).fill(false));
  const pendingTargetsRef = useRef<(number | null)[]>(new Array(PINNED_BEATS.length).fill(null));

  const rafIdRef = useRef<number | null>(null);
  const latestProgressRef = useRef<number>(progress);
  useEffect(() => {
    latestProgressRef.current = progress;
  }, [progress]);

  const activeBeatIndex = useMemo(() => {
    const p = Math.max(0, Math.min(1, progress));
    for (let i = 0; i < PINNED_BEATS.length; i++) {
      const beat = PINNED_BEATS[i];
      if (p >= beat.startProgress && p <= beat.endProgress) {
        return i;
      }
    }
    return p >= 1 ? PINNED_BEATS.length - 1 : 0;
  }, [progress]);

  useEffect(() => {
    onActiveBeatChange?.(activeBeatIndex);
  }, [activeBeatIndex, onActiveBeatChange]);

  const handleReady = useCallback((index: number) => {
    setReadyStates((prev) => {
      if (prev[index]) return prev;
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
    if (!notifiedReadyRef.current[index]) {
      notifiedReadyRef.current[index] = true;
      onHeroMediaReady?.(index);
      if (index === 0) onHeroReady?.();
    }
  }, [onHeroMediaReady, onHeroReady]);

  // Actively poll hero video on mount to signal readiness as soon as data arrives
  useEffect(() => {
    const checkHero = () => {
      const v0 = videoRefs.current[0];
      if (v0 && v0.readyState >= 2) {
        handleReady(0);
      }
    };
    checkHero();
    const timer = setInterval(checkHero, 80);
    return () => clearInterval(timer);
  }, [handleReady]);

  const handleSeeked = useCallback((index: number) => {
    isSeekingRefs.current[index] = false;
    const pendingTarget = pendingTargetsRef.current[index];
    if (pendingTarget !== null) {
      pendingTargetsRef.current[index] = null;
      const video = videoRefs.current[index];
      if (video && video.readyState >= 2) {
        const frameDuration = 1 / PINNED_BEATS[index].fps;
        if (Math.abs(pendingTarget - video.currentTime) >= frameDuration) {
          isSeekingRefs.current[index] = true;
          video.currentTime = pendingTarget;
        }
      }
    }
  }, []);

  const scrubBeat = useCallback((index: number, p: number) => {
    const beat = PINNED_BEATS[index];
    const video = videoRefs.current[index];
    if (!video) return;

    const beatSpan = beat.endProgress - beat.startProgress;
    const localP = Math.max(0, Math.min(1, (p - beat.startProgress) / beatSpan));

    const rawTargetTime = localP * (video.duration || beat.duration);
    const frameDuration = 1 / beat.fps;
    const roundedTarget = Math.round(rawTargetTime * beat.fps) / beat.fps;
    const clampedTarget = Math.max(0, Math.min(video.duration || beat.duration, roundedTarget));

    // readyState >= 2 (HAVE_CURRENT_DATA) is sufficient to seek; threshold 3
    // caused a deadlock — videos never reach HAVE_FUTURE_DATA until after the
    // first seek, so every initial seek was silently dropped.
    if (video.readyState < 2) return;

    const timeDelta = Math.abs(clampedTarget - video.currentTime);
    if (timeDelta < frameDuration) return;

    if (isSeekingRefs.current[index]) {
      pendingTargetsRef.current[index] = clampedTarget;
      return;
    }

    try {
      isSeekingRefs.current[index] = true;
      video.currentTime = clampedTarget;
    } catch {
      isSeekingRefs.current[index] = false;
    }
  }, []);

  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;
      const p = latestProgressRef.current;

      scrubBeat(activeBeatIndex, p);

      const currentBeat = PINNED_BEATS[activeBeatIndex];
      if (p - currentBeat.startProgress < 0.04 && activeBeatIndex > 0) {
        scrubBeat(activeBeatIndex - 1, p);
      } else if (currentBeat.endProgress - p < 0.04 && activeBeatIndex < PINNED_BEATS.length - 1) {
        scrubBeat(activeBeatIndex + 1, p);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [activeBeatIndex, scrubBeat]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[var(--midnight-black)] ${className}`}
    >
      {PINNED_BEATS.map((beat, index) => {
        const isActive = activeBeatIndex === index;
        const isReady = readyStates[index];

        return (
          <div
            key={beat.id}
            className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-out pointer-events-none"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 10 : 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beat.poster}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isReady ? 0 : 1,
                filter: beat.filter || "contrast(1.08) brightness(1.02)",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
              }}
            />

            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={beat.src}
              poster={beat.poster}
              preload="auto"
              muted
              playsInline
              onLoadedData={() => handleReady(index)}
              onCanPlay={() => handleReady(index)}
              onCanPlayThrough={() => handleReady(index)}
              onSeeked={() => {
                handleReady(index);  // poster can fade once we've seeked at least once
                handleSeeked(index);
              }}
              className="w-full h-full object-cover pointer-events-none"
              style={{
                backgroundColor: "var(--midnight-black)",
                filter: beat.filter || "contrast(1.08) brightness(1.02)",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
