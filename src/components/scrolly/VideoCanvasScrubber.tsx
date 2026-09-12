"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HERO_BEATS } from "@/lib/heroAssets";

export interface VideoBeatConfig {
  id: string;
  src: string;
  poster: string;
  fps: number;
  duration: number;
  startProgress: number;
  endProgress: number;
  filter?: string;
}

interface VideoCanvasScrubberProps {
  progress: number;
  className?: string;
  onActiveBeatChange?: (beatIndex: number) => void;
  onHeroMediaReady?: (beatIndex: number) => void;
}

export const PINNED_BEATS: VideoBeatConfig[] = HERO_BEATS.map(
  ([id, src, poster, fps, duration, startProgress, endProgress, filter]) => ({
    id,
    src,
    poster,
    fps,
    duration,
    startProgress,
    endProgress,
    filter,
  })
);

export default function VideoCanvasScrubber({
  progress,
  className = "",
  onActiveBeatChange,
  onHeroMediaReady,
}: VideoCanvasScrubberProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [readyStates, setReadyStates] = useState<boolean[]>(
    new Array(PINNED_BEATS.length).fill(false)
  );
  const isSeekingRefs = useRef<boolean[]>(new Array(PINNED_BEATS.length).fill(false));
  const pendingTargetsRef = useRef<(number | null)[]>(new Array(PINNED_BEATS.length).fill(null));
  const fullyBufferedBeats = useRef<boolean[]>(new Array(PINNED_BEATS.length).fill(false));
  const rafIdRef = useRef<number | null>(null);
  const latestProgressRef = useRef(progress);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    latestProgressRef.current = progress;
  }, [progress]);

  const activeBeatIndex = useMemo(() => {
    const normalizedProgress = Math.max(0, Math.min(1, progress));
    const index = PINNED_BEATS.findIndex(
      (beat) =>
        normalizedProgress >= beat.startProgress &&
        normalizedProgress < beat.endProgress
    );
    return index === -1 ? PINNED_BEATS.length - 1 : index;
  }, [progress]);

  useEffect(() => {
    onActiveBeatChange?.(activeBeatIndex);
  }, [activeBeatIndex, onActiveBeatChange]);

  const handleFrameReady = useCallback(
    (index: number) => {
      setReadyStates((previous) => {
        if (previous[index]) return previous;
        const next = [...previous];
        next[index] = true;
        return next;
      });
    },
    []
  );

  const handleBufferProgress = useCallback(
    (index: number) => {
      const video = videoRefs.current[index];
      if (!video || fullyBufferedBeats.current[index] || !Number.isFinite(video.duration)) {
        return;
      }

      const finalRange = video.buffered.length - 1;
      if (
        finalRange < 0 ||
        video.buffered.start(finalRange) > 0.1 ||
        video.buffered.end(finalRange) < video.duration - 0.1
      ) {
        return;
      }

      fullyBufferedBeats.current[index] = true;
      onHeroMediaReady?.(index);
    },
    [onHeroMediaReady]
  );

  const handleSeeked = useCallback((index: number) => {
    isSeekingRefs.current[index] = false;
    const pendingTarget = pendingTargetsRef.current[index];
    if (pendingTarget === null) return;

    pendingTargetsRef.current[index] = null;
    const video = videoRefs.current[index];
    if (!video || video.readyState < 2) return;

    const frameDuration = 1 / PINNED_BEATS[index].fps;
    if (Math.abs(pendingTarget - video.currentTime) < frameDuration) return;

    isSeekingRefs.current[index] = true;
    video.currentTime = pendingTarget;
  }, []);

  const scrubBeat = useCallback((index: number, scrollProgress: number) => {
    const beat = PINNED_BEATS[index];
    const video = videoRefs.current[index];
    if (!video || video.readyState < 2) return;

    const localProgress = Math.max(
      0,
      Math.min(
        1,
        (scrollProgress - beat.startProgress) /
          (beat.endProgress - beat.startProgress)
      )
    );
    const frameDuration = 1 / beat.fps;
    const rawTarget = localProgress * (video.duration || beat.duration);
    const target = Math.max(
      0,
      Math.min(
        video.duration || beat.duration,
        Math.round(rawTarget * beat.fps) / beat.fps
      )
    );

    if (Math.abs(target - video.currentTime) < frameDuration) return;
    if (isSeekingRefs.current[index]) {
      pendingTargetsRef.current[index] = target;
      return;
    }

    isSeekingRefs.current[index] = true;
    video.currentTime = target;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let active = true;
    const tick = () => {
      if (!active) return;
      const currentProgress = latestProgressRef.current;
      scrubBeat(activeBeatIndex, currentProgress);
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [activeBeatIndex, prefersReducedMotion, scrubBeat]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[var(--midnight-black)] ${className}`}>
      {PINNED_BEATS.map((beat, index) => {
        const isActive = activeBeatIndex === index;
        const shouldRenderPoster = true;

        return (
          <div
            key={beat.id}
            className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-out pointer-events-none"
            style={{ opacity: isActive ? 1 : 0, zIndex: isActive ? 10 : 1 }}
          >
            {shouldRenderPoster && (
              // Native image keeps the video poster and fallback on the same decoded asset.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={beat.poster}
                alt=""
                aria-hidden="true"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: prefersReducedMotion || !readyStates[index] ? 1 : 0,
                  filter: beat.filter || "contrast(1.08) brightness(1.02)",
                }}
              />
            )}

            <video
              ref={(element) => {
                videoRefs.current[index] = element;
              }}
              src={beat.src}
              poster={beat.poster}
              preload="auto"
              muted
              playsInline
              onLoadedData={() => handleFrameReady(index)}
              onCanPlay={() => handleFrameReady(index)}
              onProgress={() => handleBufferProgress(index)}
              onCanPlayThrough={() => handleBufferProgress(index)}
              onSeeked={() => handleSeeked(index)}
              className="w-full h-full object-cover pointer-events-none"
              style={{
                backgroundColor: "var(--midnight-black)",
                filter: beat.filter || "contrast(1.08) brightness(1.02)",
                opacity: prefersReducedMotion ? 0 : 1,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
