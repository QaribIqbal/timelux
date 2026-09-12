"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_SEQUENCES } from "@/lib/heroAssets";
import {
  getFrameIndex,
  getPrefetchFrameIndices,
  type FrameSequence,
} from "@/lib/frameSequence";

const CACHE_LIMIT = 42;
const PREFETCH_RADIUS = 12;

interface FrameSequenceScrubberProps {
  progress: number;
  className?: string;
  onActiveBeatChange?: (beatIndex: number) => void;
  onOpeningFrameSettled?: (beatIndex: number) => void;
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
  onOpeningFrameSettled,
}: FrameSequenceScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef(new Map<string, HTMLImageElement>());
  const loadingRef = useRef(new Map<string, Promise<HTMLImageElement | null>>());
  const latestProgressRef = useRef(progress);
  const drawRafRef = useRef<number | null>(null);
  const openingFrameNotifiedRef = useRef(new Set<number>());
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
          while (cacheRef.current.size > CACHE_LIMIT) {
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

  const drawImage = useCallback((image: HTMLImageElement, sequence: FrameSequence) => {
    const canvas = canvasRef.current;
    if (!canvas || !image.naturalWidth || !image.naturalHeight) return;

    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(bounds.width * dpr));
    const height = Math.max(1, Math.round(bounds.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const context = canvas.getContext("2d");
    if (!context) return;
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    context.clearRect(0, 0, width, height);
    context.filter = sequence.filter ?? "none";
    context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    context.filter = "none";
  }, []);

  const renderProgress = useCallback(() => {
    const index = getActiveBeatIndex(latestProgressRef.current);
    const sequence = HERO_SEQUENCES[index];
    const frameIndex = prefersReducedMotion ? 0 : getFrameIndex(sequence, latestProgressRef.current);
    const frameUrl = sequence.framePath(frameIndex);

    void loadFrame(frameUrl).then((image) => {
      if (image) drawImage(image, sequence);
    });

    if (!prefersReducedMotion) {
      for (const nearbyIndex of getPrefetchFrameIndices(frameIndex, sequence.frameCount, PREFETCH_RADIUS)) {
        void loadFrame(sequence.framePath(nearbyIndex));
      }
    }
  }, [drawImage, loadFrame, prefersReducedMotion]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    HERO_SEQUENCES.forEach((sequence, index) => {
      void loadFrame(sequence.framePath(0)).then(() => {
        if (openingFrameNotifiedRef.current.has(index)) return;
        openingFrameNotifiedRef.current.add(index);
        onOpeningFrameSettled?.(index);
      });
    });
  }, [loadFrame, onOpeningFrameSettled]);

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
    if (drawRafRef.current !== null) cancelAnimationFrame(drawRafRef.current);
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
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  );
}
