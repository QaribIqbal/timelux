"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Compass, Shield, Clock } from "lucide-react";

interface CollectionSectionProps {
  onSelectModel: (modelName: string) => void;
}

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease",
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default function CollectionSection({ onSelectModel }: CollectionSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const watches = [
    {
      id: 1,
      refNumber: "REF. TLX-01",
      name: "Monolith Chronograph",
      limitation: "50 Pieces Worldwide",
      material: "Grade 5 Titanium · Skeleton Dial",
      image: "/watches/model-1-monolith.webp",
      description:
        "Engineered for uncompromising resilience. Features an openworked dial displaying the column-wheel chronograph mechanism with hand-beveled anglage.",
      calibre: "Calibre TLX-01 Automatic",
      specs: [
        { label: "Diameter", val: "42 mm" },
        { label: "Power Reserve", val: "72 Hours" },
        { label: "Water Resist", val: "300 M / 30 ATM" },
        { label: "Jewels", val: "35 Rubies" },
      ],
      icon: Compass,
    },
    {
      id: 2,
      refNumber: "REF. TLX-02",
      name: "Steel-Blue Tourbillon",
      limitation: "25 Pieces Worldwide",
      material: "Ceramic Bezel · DLC Titanium",
      image: "/watches/model-2-steel-blue.webp",
      description:
        "A pinnacle of chronometric mastery. The one-minute flying tourbillon at 6 o'clock defies gravitational forces, encased in maritime steel-blue DLC.",
      calibre: "Calibre TLX-02 Tourbillon",
      specs: [
        { label: "Diameter", val: "41 mm" },
        { label: "Power Reserve", val: "60 Hours" },
        { label: "Water Resist", val: "200 M / 20 ATM" },
        { label: "Escapement", val: "21,600 VPH" },
      ],
      icon: Clock,
    },
    {
      id: 3,
      refNumber: "REF. TLX-03",
      name: "Grand Champagne Atelier",
      limitation: "10 Pieces Worldwide",
      material: "18K Champagne Gold · Exhibition Back",
      image: "/watches/model-3-gold-atelier.webp",
      description:
        "The ultimate expression of bespoke Swiss horology. Individually numbered, hand-polished bridges, and a pure Grand Feu dial crafted in our Geneva atelier.",
      calibre: "Calibre TLX-03 Chronometer",
      specs: [
        { label: "Diameter", val: "40 mm" },
        { label: "Power Reserve", val: "80 Hours" },
        { label: "Certification", val: "Geneva Seal" },
        { label: "Finishing", val: "Black Polish" },
      ],
      icon: Shield,
    },
  ];

  return (
    <section
      id="collection"
      className="relative min-h-screen py-32 px-6 lg:px-12 bg-[var(--midnight-black)] z-20 border-t border-[var(--titanium-silver)]/15"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="eyebrow-luxury mb-4">Limited Edition Release · 2026</div>

          <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-[var(--headline-white)]">
            Three Masterpieces.{" "}
            <span className="heading-editorial">
              Strictly Limited.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[var(--titanium-silver)] font-light leading-relaxed">
            Crafted in strictly numbered editions for discerning collectors. Once the allocation is exhausted, these references will never be reproduced.
          </p>
        </div>

        {/* Static, high-quality collection poster: no autoplay or playback affordance. */}
        <div className="relative w-full max-w-4xl mx-auto h-[320px] sm:h-[440px] rounded-2xl overflow-hidden mb-16 border border-[var(--champagne-gold)]/30 bg-[var(--midnight-black)]">
          <Image
            src="/videos/posters/06-three-watch-collection.c0ee4e9f.webp"
            alt="Three TIMELUX limited-edition watches"
            fill
            priority={false}
            sizes="(max-width: 768px) calc(100vw - 3rem), 896px"
            quality={100}
            className="object-contain"
            style={{
              backgroundColor: "var(--midnight-black)",
              filter: "contrast(1.08) brightness(1.02)",
            }}
          />

          {/* Minimal hairline telemetry bar */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none text-[10px] font-mono text-[var(--titanium-silver)] uppercase tracking-widest bg-[var(--midnight-black)]/80 px-4 py-2 rounded-full border border-[var(--titanium-silver)]/15">
            <span>TRIO COLLECTION // REF. 01 · REF. 02 · REF. 03</span>
            <span className="text-[var(--champagne-gold)] font-bold">
              {hoveredIndex !== null ? watches[hoveredIndex].refNumber : "SELECT A REFERENCE"}
            </span>
          </div>
        </div>

        {/* 3-Column Luxury Watch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {watches.map((watch, idx) => {
            const isHovered = hoveredIndex === idx;

            return (
              <TiltCard
                key={watch.id}
                className={`group relative panel-luxury rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isHovered
                    ? "border-[var(--champagne-gold)] shadow-[0_0_35px_rgba(194,164,114,0.18)]"
                    : "border-[var(--titanium-silver)]/20 hover:border-[var(--champagne-gold)]/50"
                }`}
              >
                <div
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Top Bar: Reference & Limitation */}
                  <div className="flex items-center justify-between border-b border-[var(--titanium-silver)]/15 pb-4 mb-6">
                    <span className="font-mono text-xs tracking-[0.2em] text-[var(--champagne-gold)] font-bold">
                      {watch.refNumber}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--champagne-gold)] px-2.5 py-1 rounded bg-[var(--midnight-black)] border border-[var(--champagne-gold)]/40 font-semibold">
                      {watch.limitation}
                    </span>
                  </div>

                  {/* Crystal-Sharp Watch Showcase Image */}
                  <div className="relative w-full h-56 mb-6 rounded-xl overflow-hidden bg-[var(--midnight-black)] border border-[var(--titanium-silver)]/10 flex items-center justify-center group-hover:border-[var(--champagne-gold)]/30 transition-colors">
                    <Image
                      src={watch.image}
                      alt={watch.name}
                      fill
                      quality={85}
                      sizes="(max-width: 768px) calc(100vw - 3rem), (max-width: 1280px) 30vw, 384px"
                      className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{
                        filter: "contrast(1.08) brightness(1.03)",
                      }}
                    />
                  </div>

                  {/* Model Title & Material */}
                  <h3 className="font-serif text-2xl font-bold uppercase tracking-tight text-[var(--headline-white)] group-hover:text-[var(--champagne-gold)] transition-colors">
                    {watch.name}
                  </h3>

                  <p className="font-mono text-xs text-[var(--champagne-gold)] mt-1 tracking-wider uppercase">
                    {watch.material}
                  </p>

                  <p className="mt-3 text-sm text-[var(--titanium-silver)] leading-relaxed font-light">
                    {watch.description}
                  </p>

                  {/* Technical Specs Grid */}
                  <div className="mt-6 pt-5 border-t border-[var(--titanium-silver)]/15 grid grid-cols-2 gap-3 font-mono text-xs">
                    {watch.specs.map((spec, i) => (
                      <div key={i} className="p-2 rounded bg-[var(--midnight-black)] border border-[var(--titanium-silver)]/10">
                        <span className="text-[9px] uppercase tracking-wider text-[var(--titanium-silver)]/70 block">
                          {spec.label}
                        </span>
                        <span className="text-[11px] font-bold text-[var(--headline-white)] block mt-0.5">
                          {spec.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reservation Action Button */}
                <div className="mt-8 pt-4 border-t border-[var(--titanium-silver)]/15">
                  <button
                    onClick={() => onSelectModel(`${watch.refNumber} — ${watch.name}`)}
                    className="w-full btn-gold-outline group/btn py-3.5 px-4 rounded-full text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Request Allocation</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1 text-[var(--champagne-gold)]" />
                  </button>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
