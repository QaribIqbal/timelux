"use client";

import React, { useEffect, useRef, useState } from "react";
import { HERO_BEATS } from "@/lib/heroAssets";
import { HERO_MEDIA_COUNT, HERO_READY_THRESHOLD, isHeroReadyForEntry } from "@/lib/heroLoading";

interface LuxuryPreloaderProps {
  isHeroReady?: boolean;
  readyHeroVideos?: number;
}

export default function LuxuryPreloader({
  isHeroReady = false,
  readyHeroVideos = 0,
}: LuxuryPreloaderProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [loadedPosterCount, setLoadedPosterCount] = useState(0);
  const [safetyTimedOut, setSafetyTimedOut] = useState(false);
  const completedMediaRef = useRef(new Set<string>());

  useEffect(() => {
    let isCancelled = false;
    const markReady = (key: string) => {
      if (isCancelled || completedMediaRef.current.has(key)) return;
      completedMediaRef.current.add(key);
      setLoadedPosterCount((count) => count + 1);
    };

    HERO_BEATS.forEach(([, , poster]) => {
      const image = new Image();
      image.onload = () => markReady(`poster:${poster}`);
      image.onerror = () => markReady(`poster:${poster}`);
      image.src = poster;
      if (image.complete && typeof image.decode === "function") {
        void image.decode().then(
          () => markReady(`poster:${poster}`),
          () => markReady(`poster:${poster}`)
        );
      }

    });

    const fallbackTimer = setTimeout(() => {
      if (!isCancelled) setSafetyTimedOut(true);
    }, 35000);

    return () => {
      isCancelled = true;
      clearTimeout(fallbackTimer);
    };
  }, []);

  const loadedCount = loadedPosterCount + Math.min(HERO_BEATS.length, readyHeroVideos);
  const isFullyCalibrated =
    isHeroReadyForEntry(loadedCount, isHeroReady) || safetyTimedOut;
  const targetProgress = isFullyCalibrated
    ? 100
    : Math.min(90, Math.floor((loadedCount / HERO_MEDIA_COUNT) * 100));

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((previous) => {
        if (previous >= targetProgress) {
          clearInterval(interval);
          return previous;
        }
        return Math.min(
          targetProgress,
          previous + Math.max(1, Math.min(3, targetProgress - previous))
        );
      });
    }, 35);
    return () => clearInterval(interval);
  }, [targetProgress]);

  useEffect(() => {
    if (loadingProgress < 100) return;
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(() => setIsUnmounted(true), 800);
    }, 250);
    return () => clearTimeout(timer);
  }, [loadingProgress]);

  if (isUnmounted) return null;

  return (
    <div
      aria-hidden={isDone}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between p-8 sm:p-14 bg-[var(--midnight-black)] transition-all duration-700 ease-out select-none ${isDone ? "opacity-0 pointer-events-none scale-[1.02] filter blur-sm" : "opacity-100"}`}
    >
      <div className="w-full max-w-6xl flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--titanium-silver)]">
        <span>HAUTE HORLOGERIE SUISSE</span>
        <span className="text-[var(--champagne-gold)]">LIMITED RELEASE // 2026</span>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[var(--titanium-silver)]/15 animate-[spin_12s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-[var(--champagne-gold)]/40 border-dashed animate-[spin_8s_linear_infinite_reverse]" />
          <div className="absolute inset-4 rounded-full border border-[var(--champagne-gold)]/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--champagne-gold)] shadow-[0_0_12px_var(--champagne-gold)]" />
          <div className="absolute top-1/2 left-1/2 w-12 sm:w-14 h-[1.5px] bg-gradient-to-r from-[var(--champagne-gold)] to-transparent origin-left -translate-y-1/2 animate-[spin_2s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.35em] text-[var(--headline-white)]">TIMELUX</h1>
        <p className="mt-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[var(--champagne-gold)]">CALIBRATING ATELIER · 28,800 VPH</p>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-3">
        <div className="w-full h-[1.5px] bg-[var(--steel-blue)]/40 overflow-hidden relative">
          <div className="h-full bg-[var(--champagne-gold)] transition-all duration-150 ease-out" style={{ width: `${loadingProgress}%` }} />
        </div>
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-[var(--titanium-silver)]">
          <span className="uppercase tracking-widest">SYNCHRONIZING</span>
          <span className="tabular-nums font-bold text-[var(--champagne-gold)]">{loadingProgress.toString().padStart(2, "0")}%</span>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--titanium-silver)]/60">{loadedCount}/{HERO_READY_THRESHOLD} media calibrated</span>
      </div>
    </div>
  );
}
