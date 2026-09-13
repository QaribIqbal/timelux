"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const AUDIO_SOURCE = "/audio/watch-background-audio-loop.wav";
const PLAYBACK_VOLUME = 0.38;

interface AmbientAudioProps {
  startRequested?: boolean;
}

export default function AmbientAudio({ startRequested = false }: AmbientAudioProps) {
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const setupPromiseRef = useRef<Promise<AudioContext | null> | null>(null);
  const userMutedRef = useRef(false);
  const unmountedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const ensureAudioGraph = useCallback(() => {
    if (contextRef.current && sourceRef.current) {
      return Promise.resolve(contextRef.current);
    }
    if (setupPromiseRef.current) return setupPromiseRef.current;

    setupPromiseRef.current = (async () => {
      const context = new AudioContext();
      contextRef.current = context;

      const response = await fetch(AUDIO_SOURCE, { cache: "force-cache" });
      if (!response.ok) throw new Error(`Unable to load soundtrack: ${response.status}`);
      const buffer = await context.decodeAudioData(await response.arrayBuffer());

      if (unmountedRef.current) {
        await context.close();
        return null;
      }

      const gain = context.createGain();
      gain.gain.value = userMutedRef.current ? 0 : PLAYBACK_VOLUME;

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = 0;
      source.loopEnd = buffer.duration;
      source.connect(gain).connect(context.destination);
      source.start();

      gainRef.current = gain;
      sourceRef.current = source;
      context.onstatechange = () => {
        setIsPlaying(context.state === "running" && !userMutedRef.current);
      };
      return context;
    })().catch(() => {
      setupPromiseRef.current = null;
      return null;
    });

    return setupPromiseRef.current;
  }, []);

  const attemptPlay = useCallback(async () => {
    if (userMutedRef.current) return false;
    const context = await ensureAudioGraph();
    if (!context) return false;

    try {
      await context.resume();
      if (gainRef.current) gainRef.current.gain.value = PLAYBACK_VOLUME;
      const playing = context.state === "running";
      setIsPlaying(playing);
      setIsMuted(false);
      return playing;
    } catch {
      return false;
    }
  }, [ensureAudioGraph]);

  useEffect(() => {
    if (!startRequested) return;
    const timer = window.setTimeout(() => {
      void attemptPlay();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [attemptPlay, startRequested]);

  useEffect(() => {
    unmountedRef.current = false;
    void ensureAudioGraph();

    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "touchstart",
      "keydown",
      "wheel",
    ];

    const removeGestureListeners = () => {
      events.forEach((event) => window.removeEventListener(event, handleUserInteraction));
    };

    const handleUserInteraction = () => {
      void attemptPlay().then((playing) => {
        if (playing) removeGestureListeners();
      });
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });

    const handleVisibilityChange = () => {
      const context = contextRef.current;
      if (!context) return;
      if (document.hidden) {
        void context.suspend();
      } else if (!userMutedRef.current) {
        void attemptPlay();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      unmountedRef.current = true;
      removeGestureListeners();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (contextRef.current) contextRef.current.onstatechange = null;
      contextRef.current?.close().catch(() => undefined);
      contextRef.current = null;
      sourceRef.current = null;
      gainRef.current = null;
      setupPromiseRef.current = null;
    };
  }, [attemptPlay, ensureAudioGraph]);

  const handleToggleSound = () => {
    const gain = gainRef.current;
    const context = contextRef.current;

    if (isMuted || userMutedRef.current || context?.state !== "running") {
      userMutedRef.current = false;
      setIsMuted(false);
      if (gain) gain.gain.value = PLAYBACK_VOLUME;
      void attemptPlay();
      return;
    }

    userMutedRef.current = true;
    setIsMuted(true);
    setIsPlaying(false);
    if (gain) gain.gain.value = 0;
  };

  return (
    <button
      type="button"
      onClick={handleToggleSound}
      aria-label={isMuted ? "Unmute background sound" : "Mute background sound"}
      aria-pressed={isMuted}
      title={isMuted ? "Soundtrack · Click to Play" : "Soundtrack · Playing"}
      className="fixed bottom-6 right-6 z-[60] group flex h-11 w-11 items-center justify-center rounded-full border border-[var(--champagne-gold)]/40 bg-[var(--midnight-black)]/90 text-[var(--champagne-gold)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[var(--champagne-gold)] hover:bg-[var(--steel-blue)]"
    >
      {isPlaying && !isMuted && (
        <span className="absolute inset-0 rounded-full border border-[var(--champagne-gold)]/30 animate-ping pointer-events-none" />
      )}

      {!isPlaying || isMuted ? (
        <VolumeX className="h-4 w-4 text-[var(--titanium-silver)] transition-colors group-hover:text-[var(--champagne-gold)]" />
      ) : (
        <Volume2 className="h-4 w-4 text-[var(--champagne-gold)]" />
      )}
    </button>
  );
}
