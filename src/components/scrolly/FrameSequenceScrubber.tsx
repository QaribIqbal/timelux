"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_SEQUENCES } from "@/lib/heroAssets";
import {
  FRAME_CACHE_LIMIT,
  FRAME_PREFETCH_RADIUS,
  BACKGROUND_SEQUENCE_PRELOAD_CONCURRENCY,
  HERO_ENTRY_PRELOAD_CONCURRENCY,
  MAX_BACKGROUND_FRAME_LOADS,
  getBackgroundSequenceFrameUrls,
  getHeroEntryFrameUrls,
  getFrameIndex,
  getPrefetchFrameIndices,
  getScrollDirection,
  type FrameSequence,
} from "@/lib/frameSequence";

interface FrameSequenceScrubberProps {
  progress: number;
  className?: string;
  onActiveBeatChange?: (beatIndex: number) => void;
  onHeroFrameSettled?: () => void;
  onHeroPreloadComplete?: () => void;
}

function getActiveBeatIndex(progress: number) {
  const normalized = Math.max(0, Math.min(1, progress));
  const index = HERO_SEQUENCES.findIndex(
    (sequence) => normalized >= sequence.startProgress && normalized < sequence.endProgress
  );
  return index === -1 ? HERO_SEQUENCES.length - 1 : index;
}

export default function FrameSequenceScrubber({
  progress,
  className = "",
  onActiveBeatChange,
  onHeroFrameSettled,
  onHeroPreloadComplete,
}: FrameSequenceScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef(new Map<string, HTMLImageElement>());
  const loadingRef = useRef(new Map<string, Promise<HTMLImageElement | null>>());
  const latestProgressRef = useRef(progress);
  const drawRafRef = useRef<number | null>(null);
  const criticalRequestRef = useRef<Promise<void> | null>(null);
  const pendingTargetRef = useRef<{ sequence: FrameSequence; frameIndex: number } | null>(null);
  const previousProgressRef = useRef(progress);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeBeatIndex = getActiveBeatIndex(progress);

  const loadFrame = useCallback((url: string) => {
    const cached = cacheRef.current.get(url);
    if (cached) {
      cacheRef.current.delete(url);
      cacheRef.current.set(url, cached);
      return Promise.resolve(cached);
    }

    const pending = loadingRef.current.get(url);
    if (pending) return pending;

    const request = new Promise<HTMLImageElement | null>((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        const decode = typeof image.decode === "function" ? image.decode() : Promise.resolve();
        void decode.catch(() => undefined).then(() => {
          cacheRef.current.set(url, image);
          while (cacheRef.current.size > FRAME_CACHE_LIMIT) {
            const oldest = cacheRef.current.keys().next().value;
            if (!oldest) break;
            cacheRef.current.delete(oldest);
          }
          resolve(image);
        });
      };
      image.onerror = () => resolve(null);
      image.src = url;
    }).finally(() => loadingRef.current.delete(url));

    loadingRef.current.set(url, request);
    return request;
  }, []);

  const drawImage = useCallback((image: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !image.naturalWidth || !image.naturalHeight) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const width = canvas.width;
    const height = canvas.height;
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  }, []);

  const requestCurrentFrame = useCallback((sequence: FrameSequence, frameIndex: number) => {
    pendingTargetRef.current = { sequence, frameIndex };
    if (criticalRequestRef.current) return;

    const processLatestTarget = async () => {
      while (pendingTargetRef.current) {
        const target = pendingTargetRef.current;
        pendingTargetRef.current = null;
        const image = await loadFrame(target.sequence.framePath(target.frameIndex));
        if (image) drawImage(image);
      }
    };

    criticalRequestRef.current = processLatestTarget().finally(() => {
      criticalRequestRef.current = null;
    });
  }, [drawImage, loadFrame]);

  const renderProgress = useCallback(() => {
    const index = getActiveBeatIndex(latestProgressRef.current);
    const sequence = HERO_SEQUENCES[index];
    const frameIndex = prefersReducedMotion ? 0 : getFrameIndex(sequence, latestProgressRef.current);
    const direction = getScrollDirection(latestProgressRef.current, previousProgressRef.current);
    previousProgressRef.current = latestProgressRef.current;
    requestCurrentFrame(sequence, frameIndex);

    if (!prefersReducedMotion) {
      let backgroundRequests = 0;
      const nearby = getPrefetchFrameIndices(
        frameIndex,
        sequence.frameCount,
        FRAME_PREFETCH_RADIUS,
        direction
      );
      for (const nearbyIndex of nearby.slice(1)) {
        if (backgroundRequests >= MAX_BACKGROUND_FRAME_LOADS) break;
        if (loadingRef.current.size >= MAX_BACKGROUND_FRAME_LOADS + 1) break;
        void loadFrame(sequence.framePath(nearbyIndex));
        backgroundRequests += 1;
      }
    }
  }, [loadFrame, prefersReducedMotion, requestCurrentFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const heroFrameUrls = getHeroEntryFrameUrls(HERO_SEQUENCES[0]);
    let nextFrame = 0;

    const preloadWorker = async () => {
      while (!cancelled) {
        const frameIndex = nextFrame;
        nextFrame += 1;
        if (frameIndex >= heroFrameUrls.length) return;
        await loadFrame(heroFrameUrls[frameIndex]);
        if (!cancelled) onHeroFrameSettled?.();
      }
    };

    const preloadHero = async () => {
      await Promise.all(
        Array.from({ length: HERO_ENTRY_PRELOAD_CONCURRENCY }, preloadWorker)
      );
      if (cancelled) return;

      // Keep the opening frames decoded for the first interaction after entry.
      await Promise.all(
        heroFrameUrls.slice(0, FRAME_CACHE_LIMIT).map((url) => loadFrame(url))
      );
      if (!cancelled) onHeroPreloadComplete?.();

      // Transfer the later sections without decoding them into the small in-memory
      // frame cache. Their immutable URLs are then available from HTTP cache when
      // their scroll sequence becomes active.
      const backgroundUrls = getBackgroundSequenceFrameUrls(HERO_SEQUENCES);
      let nextBackgroundFrame = 0;
      const backgroundWorker = async () => {
        while (!cancelled) {
          const frameIndex = nextBackgroundFrame;
          nextBackgroundFrame += 1;
          if (frameIndex >= backgroundUrls.length) return;
          try {
            await fetch(backgroundUrls[frameIndex], { cache: "force-cache" });
          } catch {
            // A later scroll request retries a frame that could not be transferred.
          }
        }
      };
      void Promise.all(
        Array.from(
          { length: BACKGROUND_SEQUENCE_PRELOAD_CONCURRENCY },
          backgroundWorker
        )
      );
    };

    void preloadHero();
    return () => {
      cancelled = true;
    };
  }, [loadFrame, onHeroFrameSettled, onHeroPreloadComplete]);

  useEffect(() => {
    latestProgressRef.current = progress;
    if (drawRafRef.current !== null) return;
    drawRafRef.current = requestAnimationFrame(() => {
      drawRafRef.current = null;
      renderProgress();
    });
  }, [progress, renderProgress]);

  useEffect(() => {
    onActiveBeatChange?.(activeBeatIndex);
  }, [activeBeatIndex, onActiveBeatChange]);

  useEffect(() => () => {
    if (drawRafRef.current !== null) {
      cancelAnimationFrame(drawRafRef.current);
      drawRafRef.current = null;
    }
  }, []);

  const activeSequence = HERO_SEQUENCES[activeBeatIndex];
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[var(--midnight-black)] ${className}`}>
      {/* The poster remains available until the canvas has a decoded frame; failures never clear the last canvas draw. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={activeSequence.poster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: activeSequence.filter }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ filter: activeSequence.filter }}
      />
    </div>
  );
}
