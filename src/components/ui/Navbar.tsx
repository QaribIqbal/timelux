"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onOpenCommission: () => void;
  onOpenMechanism?: () => void;
}

export default function Navbar({ onOpenCommission }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-nav py-3.5"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2 group cursor-pointer"
          aria-label="TIMELUX"
        >
          <span className="font-serif tracking-[0.24em] text-sm sm:text-base font-bold text-[var(--headline-white)] group-hover:text-[var(--champagne-gold)] transition-colors">
            TIMELUX
          </span>
        </a>

        {/* Nav links — watch brand vocabulary */}
        <nav className="hidden md:flex items-center gap-10 text-xs tracking-widest uppercase font-sans text-[var(--titanium-silver)]">
          <button
            onClick={() => scrollTo("mechanics")}
            className="hover:text-[var(--headline-white)] hover:opacity-100 opacity-70 transition-all duration-200 cursor-pointer"
          >
            The Watch
          </button>
          <button
            onClick={() => scrollTo("collection")}
            className="hover:text-[var(--headline-white)] hover:opacity-100 opacity-70 transition-all duration-200 cursor-pointer"
          >
            Collection
          </button>
          <button
            onClick={() => scrollTo("craftsmanship")}
            className="hover:text-[var(--headline-white)] hover:opacity-100 opacity-70 transition-all duration-200 cursor-pointer"
          >
            Atelier
          </button>
          <button
            onClick={() => scrollTo("craftsmanship")}
            className="hover:text-[var(--headline-white)] hover:opacity-100 opacity-70 transition-all duration-200 cursor-pointer"
          >
            Reserve
          </button>
        </nav>

        {/* Primary CTA */}
        <div className="flex items-center">
          <button
            onClick={onOpenCommission}
            className="btn-gold-luxury group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-sans font-semibold tracking-wider uppercase cursor-pointer"
          >
            <span>Reserve Yours</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
