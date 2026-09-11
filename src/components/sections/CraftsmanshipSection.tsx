"use client";

import React from "react";
import { ArrowRight, Sparkles, Check, Gem, Award, ShieldCheck, Compass } from "lucide-react";

interface CraftsmanshipSectionProps {
  onOpenCommission: () => void;
}

export default function CraftsmanshipSection({ onOpenCommission }: CraftsmanshipSectionProps) {
  return (
    <section
      id="craftsmanship"
      className="relative py-36 px-6 lg:px-12 bg-[var(--midnight-black)] z-20 border-t border-[var(--titanium-silver)]/15 overflow-hidden"
    >
      {/* Macro Craftsmanship Video Background: Crisp and contrast-enhanced without fog */}
      <div className="absolute inset-0 opacity-25 pointer-events-none flex items-center justify-center">
        <video
          src="/videos/07-macro-craftsmanship.mp4"
          poster="/videos/posters/07-macro-craftsmanship.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none"
          style={{
            filter: "contrast(1.15) brightness(1.02)",
            backgroundColor: "var(--midnight-black)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="eyebrow-luxury mb-4">The Atelier · Vallée de Joux, Switzerland</div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--headline-white)] leading-[1.02]">
            TIME CANNOT BE BOUGHT.{" "}
            <span className="block mt-2 heading-editorial">
              ONLY MEASURED WITH REVERENCE.
            </span>
          </h2>

          <div className="mt-8 max-w-3xl mx-auto space-y-4 text-base sm:text-lg text-[var(--titanium-silver)] leading-relaxed font-light">
            <p>
              In an era of mass-produced obsolescence, TIMELUX represents the pinnacle
              of timeless mechanical permanence. Each calibre is born from raw titanium,
              gold, and sapphire — sculpted with surgical devotion.
            </p>
            <p className="text-[var(--headline-white)] font-medium">
              One master watchmaker oversees the assembly of each individual reference
              from raw componentry to the final chronometric certification.
            </p>
          </div>
        </div>

        {/* Haute Horlogerie Comparison: Industrial Production vs Timelux Atelier Standard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Column 1: Commercial Industrial Horology */}
          <div className="panel-luxury p-8 sm:p-10 rounded-2xl border-[var(--titanium-silver)]/20">
            <div className="flex items-center gap-3 text-[var(--titanium-silver)] mb-6">
              <Compass className="w-5 h-5 text-[var(--titanium-silver)]" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">
                Commercial Mass Production
              </span>
            </div>

            <ul className="space-y-4 text-sm text-[var(--titanium-silver)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--titanium-silver)]/50 mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--headline-white)]">Machine-Stamped Plates:</strong> Unfinished
                  component edges with visible machining burrs hidden beneath closed casebacks.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--titanium-silver)]/50 mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--headline-white)]">Batch Assembly Lines:</strong> Watches pass
                  through dozens of anonymous assembly stations with minimal human oversight.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--titanium-silver)]/50 mt-0.5">•</span>
                <span>
                  <strong className="text-[var(--headline-white)]">Synthetic Tolerances:</strong> Mass-market
                  escapements with wide chronometric deviation (+/- 15 seconds per day).
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: TIMELUX Atelier Standard */}
          <div className="panel-luxury p-8 sm:p-10 rounded-2xl border-[var(--champagne-gold)]/50 bg-[var(--midnight-black)]">
            <div className="flex items-center gap-3 text-[var(--champagne-gold)] mb-6">
              <Gem className="w-5 h-5 text-[var(--champagne-gold)]" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">
                TIMELUX Atelier Standard
              </span>
            </div>

            <ul className="space-y-4 text-sm text-[var(--titanium-silver)]">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[var(--champagne-gold)] flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--headline-white)]">Hand-Polished Anglage:</strong> 320
                  components painstakingly beveled and polished by hand using gentian wood pegs.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[var(--champagne-gold)] flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--headline-white)]">Single Master Watchmaker:</strong> One artisan
                  dedicates 14 consecutive days to assembling, regulating, and testing your specific calibre.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[var(--champagne-gold)] flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--headline-white)]">5-Position Chronometry:</strong> Regulated to
                  within -1/+2 seconds per day, surpassing standard COSC chronometer specifications.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3 Pillars of Authenticity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-xl panel-luxury text-center">
            <Award className="w-6 h-6 text-[var(--champagne-gold)] mx-auto mb-3" />
            <span className="font-serif text-lg font-bold text-[var(--headline-white)] block">
              Individually Numbered
            </span>
            <span className="text-xs text-[var(--titanium-silver)] font-light mt-1 block">
              Every caseback is deep-engraved with your unique limited edition serial allocation.
            </span>
          </div>

          <div className="p-6 rounded-xl panel-luxury text-center">
            <ShieldCheck className="w-6 h-6 text-[var(--champagne-gold)] mx-auto mb-3" />
            <span className="font-serif text-lg font-bold text-[var(--headline-white)] block">
              Atelier Warranty
            </span>
            <span className="text-xs text-[var(--titanium-silver)] font-light mt-1 block">
              Five-year international warranty with complimentary biennial chronometric overhaul.
            </span>
          </div>

          <div className="p-6 rounded-xl panel-luxury text-center">
            <Sparkles className="w-6 h-6 text-[var(--champagne-gold)] mx-auto mb-3" />
            <span className="font-serif text-lg font-bold text-[var(--headline-white)] block">
              Bespoke Presentation
            </span>
            <span className="text-xs text-[var(--titanium-silver)] font-light mt-1 block">
              Delivered in handcrafted Swiss walnut case with Loupe, certification, and secondary strap.
            </span>
          </div>
        </div>

        {/* Primary Call-to-Action */}
        <div className="text-center pt-8 border-t border-[var(--titanium-silver)]/15">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[var(--champagne-gold)] mb-5">
            PRIVATE ALLOCATION VAULT // 2026 RELEASE
          </p>

          <button
            onClick={onOpenCommission}
            className="btn-gold-luxury group relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-xs font-semibold uppercase tracking-widest cursor-pointer"
          >
            <span>RESERVE YOUR TIMEPIECE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
