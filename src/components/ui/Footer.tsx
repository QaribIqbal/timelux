"use client";

import React from "react";
import { ArrowUp } from "lucide-react";

interface FooterProps {
  onOpenCommission: () => void;
  onOpenMechanism?: () => void;
}

export default function Footer({ onOpenCommission }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const timezones = [
    { city: "GENEVA", tz: "CET (UTC+1)" },
    { city: "LONDON", tz: "GMT (UTC+0)" },
    { city: "NEW YORK", tz: "EST (UTC-5)" },
    { city: "TOKYO", tz: "JST (UTC+9)" },
    { city: "DUBAI", tz: "GST (UTC+4)" },
  ];

  return (
    <footer className="relative bg-[var(--midnight-black)] border-t border-[var(--titanium-silver)]/15 pt-16 pb-12 px-6 lg:px-12 z-20">
      <div className="max-w-7xl mx-auto w-full">
        {/* World Time Zone Array */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pb-12 border-b border-[var(--titanium-silver)]/15 text-center">
          {timezones.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-md bg-[var(--steel-blue)]/20 border border-[var(--titanium-silver)]/15"
            >
              <span className="text-[10px] font-mono tracking-widest text-[var(--champagne-gold)] block font-semibold">
                {item.city}
              </span>
              <span className="text-xs font-mono text-[var(--titanium-silver)] mt-0.5 block">
                {item.tz}
              </span>
            </div>
          ))}
        </div>

        {/* Main Footer Row */}
        <div className="py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 rounded-full border border-[var(--champagne-gold)]/60 flex items-center justify-center bg-[var(--steel-blue)]/30">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--champagne-gold)]" />
              </div>
              <span className="font-serif tracking-[0.25em] text-lg font-bold text-[var(--headline-white)]">
                TIMELUX
              </span>
            </div>
            <p className="text-xs text-[var(--titanium-silver)] max-w-sm font-light leading-relaxed">
              Haute Horlogerie manufacture based in Vallée de Joux, Switzerland.
              Independent mechanical watchmaking dedicated to extreme precision and limited numbered allocations.
            </p>
          </div>

          {/* Footer nav: Limited Editions | Heritage | Servicing | Contact */}
          <div className="flex flex-wrap gap-8 text-xs font-mono tracking-widest uppercase text-[var(--titanium-silver)]">
            <a
              href="#collection"
              className="hover:text-[var(--champagne-gold)] transition-colors"
            >
              Limited Editions
            </a>
            <a
              href="#mechanics"
              className="hover:text-[var(--champagne-gold)] transition-colors"
            >
              Heritage
            </a>
            <a
              href="#craftsmanship"
              className="hover:text-[var(--champagne-gold)] transition-colors"
            >
              Servicing
            </a>
            <button
              onClick={onOpenCommission}
              className="text-[var(--champagne-gold)] hover:underline cursor-pointer"
            >
              Contact
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--titanium-silver)] hover:text-[var(--headline-white)] px-4 py-2 rounded-full border border-[var(--titanium-silver)]/20 hover:border-[var(--champagne-gold)]/40 transition-all bg-[var(--steel-blue)]/20 cursor-pointer"
          >
            <span>Top of Caliber</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 text-[var(--champagne-gold)]" />
          </button>
        </div>

        {/* Bottom Bar + Copyright */}
        <div className="pt-8 border-t border-[var(--titanium-silver)]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[var(--titanium-silver)]">
          <div>
            © {new Date().getFullYear()} MAISON TIMELUX SA · ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>CALIBER TLX-01 SPEC 41MM</span>
            <span>•</span>
            <span>GRADE 5 TITANIUM CHASSIS</span>
            <span>•</span>
            <span>SAPPHIRE CRYSTAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
