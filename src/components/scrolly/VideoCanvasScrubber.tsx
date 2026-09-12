"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HERO_BEATS } from "@/lib/heroAssets";
import {
  canRequestVideoFrame,
  getVideoLoadStatus,
  getVideoPrimeTime,
} from "@/lib/videoScrubbing";

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
  onHeroMediaSettled?: (beatIndex: number) => void;
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
  onHeroMediaSettled,
}: VideoCanvasScrubberProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [readyStates, setReadyStates] = useState<boolean[]>(
    new Array(PINNED_BEATS.length).fill(false)
  );
  const isSeekingRefs = useRef<boolean[]>(new Array(PINNED_BEATS.length).fill(false));
  const pendingTargetsRef = useRef<(number | null)[]>(new Array(PINNED_BEATS.length).fill(null));
  const notifiedReadyBeats = useRef<boolean[]>(new Array(PINNED_BEATS.length).fill(false));
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

  const markFrameReady = useCallback(
    (index: number) => {
      setReadyStates((previous) => {
        if (previous[index]) return previous;
        const next = [...previous];
        next[index] = true;
        return next;
      });

      if (notifiedReadyBeats.current[index]) return;
      notifiedReadyBeats.current[index] = true;
      onHeroMediaSettled?.(index);
    },
    [onHeroMediaSettled]
  );

  const markMediaSettled = useCallback(
    (index: number) => {
      if (notifiedReadyBeats.current[index]) return;
      notifiedReadyBeats.current[index] = true;
      onHeroMediaSettled?.(index);
    },
    [onHeroMediaSettled]
  );

  const handleMediaError = useCallback(
    (index: number) => {
      setReadyStates((previous) => {
        if (!previous[index]) return previous;
        const next = [...previous];
        next[index] = false;
        return next;
      });
      isSeekingRefs.current[index] = false;
      pendingTargetsRef.current[index] = null;
      markMediaSettled(index);
    },
    [markMediaSettled]
  );

  const syncFrameReadiness = useCallback(
    (index: number) => {
      const video = videoRefs.current[index];
      if (!video) return;
      const status = getVideoLoadStatus(video.readyState, Boolean(video.error));
      if (status === "error") {
        handleMediaError(index);
      } else if (status === "ready") {
        markFrameReady(index);
      }
    },
    [handleMediaError, markFrameReady]
  );

  const primeVideo = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    const primeTime = getVideoPrimeTime(
      video.readyState,
      video.currentTime,
      video.duration,
      PINNED_BEATS[index].fps,
      Boolean(video.error)
    );
    if (primeTime === null) return;

    try {
      video.currentTime = primeTime;
    } catch {
      // A later media event will retry if the browser cannot seek yet.
    }
  }, []);

  // Cached media can reach HAVE_CURRENT_DATA before React attaches its event
  // handlers during hydration. Inspect the elements directly so that a missed
  // loadeddata/canplay event cannot leave the poster covering the video.
  useEffect(() => {
    videoRefs.current.forEach((_, index) => {
      syncFrameReadiness(index);
      primeVideo(index);
    });
  }, [primeVideo, syncFrameReadiness]);

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
    if (
      !video ||
      !canRequestVideoFrame(
        video.readyState,
        video.duration,
        Boolean(video.error)
      )
    ) {
      return;
    }

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

    try {
      isSeekingRefs.current[index] = true;
      video.currentTime = target;
    } catch {
      isSeekingRefs.current[index] = false;
    }
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
        return (
          <div
            key={beat.id}
            className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-out pointer-events-none"
            style={{ opacity: isActive ? 1 : 0, zIndex: isActive ? 10 : 1 }}
          >
            {/* Native image remains visible only until a video frame can decode. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
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

            <video
              ref={(element) => {
                videoRefs.current[index] = element;
              }}
              src={beat.src}
              poster={beat.poster}
              preload="auto"
              muted
              playsInline
              onLoadedMetadata={() => {
                syncFrameReadiness(index);
                primeVideo(index);
              }}
              onLoadedData={() => syncFrameReadiness(index)}
              onCanPlay={() => syncFrameReadiness(index)}
              onProgress={() => syncFrameReadiness(index)}
              onError={() => handleMediaError(index)}
              onSeeked={() => {
                syncFrameReadiness(index);
                handleSeeked(index);
              }}
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
