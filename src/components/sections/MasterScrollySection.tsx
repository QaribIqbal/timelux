"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import VideoCanvasScrubber from "@/components/scrolly/VideoCanvasScrubber";
import { ArrowRight, Play } from "lucide-react";

interface MasterScrollySectionProps {
  onOpenMechanism: () => void;
  onOpenCommission: () => void;
  onHeroMediaReady?: (beatIndex: number) => void;
}

export default function MasterScrollySection({
  onOpenMechanism,
  onOpenCommission,
  onHeroMediaReady,
}: MasterScrollySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeBeat, setActiveBeat] = useState(0);

  const computeProgress = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollableDist = el.offsetHeight - window.innerHeight;
    if (scrollableDist <= 0) return;

    const scrolledIn = -rect.top;
    const p = Math.max(0, Math.min(1, scrolledIn / scrollableDist));
    setScrollProgress(p);

    rafRef.current = null;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(computeProgress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    computeProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [computeProgress]);

  const handleScrollToExploded = () => {
    const el = containerRef.current;
    if (!el) return;
    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    const scrollableDist = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: sectionTop + scrollableDist * 0.42, behavior: "smooth" });
  };

  // Beat active conditions based on PINNED_BEATS 5-beat ranges
  const isHero       = scrollProgress < 0.20;
  const isGeometry   = scrollProgress >= 0.20 && scrollProgress < 0.40;
  const isExploded   = scrollProgress >= 0.40 && scrollProgress < 0.65;
  const isMovement   = scrollProgress >= 0.65 && scrollProgress < 0.85;
  const isReassembly = scrollProgress >= 0.85;

  /** Shared transition style for every beat overlay */
  const beatStyle = (visible: boolean, translateY = "12px") => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${translateY})`,
    pointerEvents: (visible ? "auto" : "none") as React.CSSProperties["pointerEvents"],
    transition: "opacity 0.55s ease, transform 0.55s ease",
  });

  return (
    <div
      ref={containerRef}
      id="mechanics"
      className="relative w-full bg-[var(--midnight-black)]"
      style={{ height: "460vh" }}
    >
      {/* ── Pinned sticky viewport ─────────────────────────────────── */}
      <div
        className="sticky top-0 left-0 w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Full-bleed 60fps video scrubber using native 4K/2K intra-frame sequences */}
        <div className="absolute inset-0 z-0">
          <VideoCanvasScrubber
            progress={scrollProgress}
            onActiveBeatChange={setActiveBeat}
            onHeroMediaReady={onHeroMediaReady}
          />
        </div>

        {/* Minimal baseline edge vignette — strictly limited to 14% to ensure zero fog */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to top, var(--midnight-black) 0%, rgba(13,13,13,0.7) 6%, transparent 14%)",
          }}
        />

        {/* ── BEAT 1: HERO (0% – 20%) — 4K Hero Beauty Rotation ── */}
        <div
          className="absolute inset-0 z-20 flex flex-col justify-between pt-24 pb-10 px-6 sm:px-16 select-none"
          style={beatStyle(isHero, "-12px")}
        >
          {/* Atelier Eyebrow */}
          <div className="flex justify-center">
            <span
              className="text-[10px] font-mono tracking-[0.35em] uppercase px-4 py-1.5 rounded-full bg-[var(--midnight-black)]/75 border border-[var(--champagne-gold)]/30 text-[var(--champagne-gold)]"
            >
              Maison TIMELUX · 4K Master Beauty Showcase
            </span>
          </div>

          {/* Bottom Headline & Scroll Cue */}
          <div className="flex flex-col items-center gap-6">
            <h1
              className="font-serif text-center text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.94] drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] text-[var(--headline-white)]"
            >
              THREE WATCHES.
              <span
                className="block mt-1 text-[var(--champagne-gold)]"
              >
                MADE FOR THE FEW.
              </span>
            </h1>

            <button
              onClick={handleScrollToExploded}
              className="group flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <span
                className="text-[10px] tracking-[0.28em] font-light uppercase text-[var(--titanium-silver)] group-hover:text-[var(--champagne-gold)] transition-colors"
              >
                Scroll to explore architecture
              </span>
              <span
                className="text-base transition-transform group-hover:translate-y-1 text-[var(--champagne-gold)]"
              >
                ↓
              </span>
            </button>
          </div>
        </div>

        {/* ── BEAT 2: 360° CASE GEOMETRY (20% – 40%) ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-16 pb-10 select-none"
          style={beatStyle(isGeometry)}
        >
          <div className="max-w-md drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
            <div
              className="text-[10px] font-mono tracking-[0.3em] uppercase mb-2 text-[var(--champagne-gold)]"
            >
              II · 360° Case Geometry & Ergonomics
            </div>
            <h2
              className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight leading-tight text-[var(--headline-white)]"
            >
              SCULPTED TITANIUM.
              <span
                className="block text-[var(--champagne-gold)]"
              >
                42MM MONOLITH.
              </span>
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed font-light max-w-sm text-[var(--titanium-silver)]"
            >
              Aerospace Grade 5 titanium sculpted with faceted lugs and an
              integrated bracelet. 40% lighter than steel and impervious to
              corrosion.
            </p>
            <div className="mt-4 flex gap-6 text-xs font-mono">
              {[
                ["Total Weight", "68 g"],
                ["Vickers Hardness", "350 HV"],
                ["Finish", "Satin Bevel"],
              ].map(([label, val]) => (
                <div key={label} className="text-center">
                  <div className="text-[var(--titanium-silver)]/70 text-[9px] uppercase">{label}</div>
                  <div className="font-bold mt-0.5 text-[var(--champagne-gold)]">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BEAT 3: EXPLODED VIEW (40% – 65%) ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-16 pb-10 select-none flex justify-end"
          style={beatStyle(isExploded)}
        >
          <div className="max-w-md text-right drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
            <div
              className="text-[10px] font-mono tracking-[0.3em] uppercase mb-2 text-[var(--champagne-gold)]"
            >
              III · Structural Deconstruction
            </div>
            <h3
              className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[var(--headline-white)]"
            >
              320 COMPONENTS.
              <span
                className="block text-[var(--champagne-gold)]"
              >
                TOTAL HARMONY.
              </span>
            </h3>
            <p
              className="mt-3 text-sm leading-relaxed font-light max-w-sm ml-auto text-[var(--titanium-silver)]"
            >
              Every sapphire crystal, ceramic bezel, dial sub-plate, and ruby
              bearing separated in complete exploded suspension. All 320
              components placed with micron tolerance.
            </p>
            <div className="mt-4 flex justify-end gap-6 text-xs font-mono">
              {[
                ["Tolerances", "±0.001 mm"],
                ["Total Parts", "320"],
                ["Assembly Time", "14 Days"],
              ].map(([label, val]) => (
                <div key={label} className="text-center">
                  <div className="text-[var(--titanium-silver)]/70 text-[9px] uppercase">{label}</div>
                  <div className="font-bold mt-0.5 text-[var(--champagne-gold)]">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BEAT 4: CALIBRE TLX-01 4K CORE ENGINE (65% – 85%) ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-16 pb-10 select-none"
          style={beatStyle(isMovement)}
        >
          <div className="max-w-md drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
            <div
              className="text-[10px] font-mono tracking-[0.3em] uppercase mb-2 text-[var(--champagne-gold)]"
            >
              IV · Calibre TLX-01 Core Engine (4K)
            </div>
            <h3
              className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[var(--headline-white)]"
            >
              BEATS AT
              <span
                className="block text-[var(--champagne-gold)]"
              >
                28,800 VPH.
              </span>
            </h3>
            <p
              className="mt-3 text-sm leading-relaxed font-light max-w-sm text-[var(--titanium-silver)]"
            >
              In-house automatic movement operating at 4.0 Hz. Skeletonized
              balance wheel, vertical clutch chronograph, and twin mainspring
              barrels delivering 72 hours of uninterrupted torque.
            </p>
            <div className="mt-4 flex gap-6 text-xs font-mono">
              {[
                ["Oscillation", "4.0 Hz"],
                ["Power Reserve", "72 Hours"],
                ["Ruby Jewels", "35"],
              ].map(([label, val]) => (
                <div key={label} className="text-center">
                  <div className="text-[var(--titanium-silver)]/70 text-[9px] uppercase">{label}</div>
                  <div className="font-bold mt-0.5 text-[var(--champagne-gold)]">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BEAT 5: TIMEPIECE REASSEMBLY (85% – 100%) ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-16 pb-10 select-none"
          style={beatStyle(isReassembly)}
        >
          <div className="flex flex-col items-center text-center gap-5 drop-shadow-[0_2px_20px_rgba(0,0,0,0.95)]">
            <div
              className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--champagne-gold)]"
            >
              V · The Complete Timepiece
            </div>
            <h2
              className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--headline-white)]"
            >
              ONLY{" "}
              <span className="text-[var(--champagne-gold)]">50 PIECES.</span>
            </h2>
            <p
              className="text-sm max-w-sm text-[var(--titanium-silver)]"
            >
              The final timepiece recombines into an impervious 300m instrument.
              Individually numbered and certified under Geneva chronometric
              protocol.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onOpenCommission}
                className="btn-gold-luxury group inline-flex items-center gap-2 px-7 py-3 rounded-full text-[11px] uppercase tracking-widest font-semibold cursor-pointer"
              >
                <span>Reserve Your Piece</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenMechanism}
                className="btn-gold-outline inline-flex items-center gap-2 px-7 py-3 rounded-full text-[11px] uppercase tracking-widest font-semibold cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Explore the Movement</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Progress telemetry pill ──────────────────────────────── */}
        <div
          className="absolute bottom-6 right-8 z-30 hidden md:flex items-center gap-3 px-4 py-2 rounded-full panel-luxury text-[10px] font-mono uppercase"
          style={{
            color: "var(--titanium-silver)",
          }}
        >
          {[
            [0, "01 Hero 4K"],
            [1, "02 Geometry"],
            [2, "03 Deconstruct"],
            [3, "04 Movement 4K"],
            [4, "05 Reassembly"],
          ].map(([i, label]) => (
            <span
              key={label}
              className={activeBeat === i ? "text-[var(--champagne-gold)] font-bold" : ""}
            >
              {label}
            </span>
          ))}
          <span className="opacity-30">•</span>
          <span
            className="font-bold tabular-nums text-[var(--champagne-gold)]"
          >
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
