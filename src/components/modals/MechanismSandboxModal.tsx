"use client";

import React, { useState, useEffect } from "react";
import { X, Zap, Gauge, ShieldCheck, Play, RotateCcw, Activity } from "lucide-react";

interface MechanismSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCommission: () => void;
}

export default function MechanismSandboxModal({
  isOpen,
  onClose,
  onOpenCommission,
}: MechanismSandboxModalProps) {
  const [frequency] = useState("28,800 VPH");
  const [isChronoActive, setIsChronoActive] = useState(false);
  const [chronoSeconds, setChronoSeconds] = useState(0);
  const [isTestingPressure, setIsTestingPressure] = useState(false);
  const [pressureAtm, setPressureAtm] = useState(30);
  const [rateDeviation, setRateDeviation] = useState("+0.8");

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const dev = (0.6 + Math.random() * 0.4).toFixed(1);
      setRateDeviation(`+${dev}`);
    }, 1200);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isChronoActive) {
      timer = setInterval(() => {
        setChronoSeconds((c) => +(c + 0.1).toFixed(1));
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isChronoActive]);

  if (!isOpen) return null;

  const handleTestChrono = () => {
    setIsChronoActive(!isChronoActive);
  };

  const handleResetChrono = () => {
    setIsChronoActive(false);
    setChronoSeconds(0);
  };

  const handlePressureTest = () => {
    setIsTestingPressure(true);
    setPressureAtm(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      if (p >= 30) {
        setPressureAtm(30);
        setIsTestingPressure(false);
        clearInterval(interval);
      } else {
        setPressureAtm(p);
      }
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[var(--midnight-black)]/90 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[var(--midnight-black)] border border-[var(--champagne-gold)]/40 shadow-[0_0_80px_rgba(0,0,0,0.95)] p-6 sm:p-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--titanium-silver)]/15 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[var(--champagne-gold)] flex items-center justify-center bg-[var(--midnight-black)]">
              <Gauge className="w-4 h-4 text-[var(--champagne-gold)]" />
            </div>
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[var(--champagne-gold)] uppercase block">
                Atelier Chronometric Diagnostic Bench
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-[var(--headline-white)]">
                CALIBRE TLX-01 // TELEMETRY
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[var(--titanium-silver)]/20 flex items-center justify-center text-[var(--titanium-silver)] hover:text-[var(--headline-white)] hover:border-[var(--champagne-gold)]/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chronometer Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-lg bg-[var(--midnight-black)] border border-[var(--titanium-silver)]/15">
            <span className="text-[9px] font-mono uppercase text-[var(--titanium-silver)] block">
              Balance Frequency
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-mono font-bold text-[var(--champagne-gold)]">
                {frequency}
              </span>
            </div>
            <span className="text-[9px] font-mono text-[var(--titanium-silver)]/60">4.0 Hz Oscillation</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--midnight-black)] border border-[var(--titanium-silver)]/15">
            <span className="text-[9px] font-mono uppercase text-[var(--titanium-silver)] block">
              Daily Rate Deviation
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-mono font-bold text-[var(--headline-white)]">
                {rateDeviation}
              </span>
              <span className="text-xs font-mono text-[var(--titanium-silver)]">s/d</span>
            </div>
            <span className="text-[9px] font-mono text-[var(--champagne-gold)]">COSC Chronometer</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--midnight-black)] border border-[var(--titanium-silver)]/15">
            <span className="text-[9px] font-mono uppercase text-[var(--titanium-silver)] block">
              Mainspring Reserve
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-mono font-bold text-[var(--headline-white)]">
                72.0
              </span>
              <span className="text-xs font-mono text-[var(--titanium-silver)]">Hours</span>
            </div>
            <span className="text-[9px] font-mono text-[var(--titanium-silver)]/60">Dual Barrel Drive</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--midnight-black)] border border-[var(--titanium-silver)]/15">
            <span className="text-[9px] font-mono uppercase text-[var(--titanium-silver)] block">
              Pressure Chamber
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-mono font-bold text-[var(--champagne-gold)]">
                {pressureAtm}
              </span>
              <span className="text-xs font-mono text-[var(--titanium-silver)]">ATM</span>
            </div>
            <span className="text-[9px] font-mono text-[var(--titanium-silver)]/60">300m Depth Certified</span>
          </div>
        </div>

        {/* Interactive Horology Tests */}
        <div className="space-y-4 mb-6">
          {/* Column-Wheel Chronograph Test */}
          <div className="p-4 rounded-xl border border-[var(--titanium-silver)]/15 bg-[var(--midnight-black)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-[var(--champagne-gold)]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--headline-white)] font-bold">
                  Column-Wheel Chronograph Engagement
                </span>
              </div>
              <p className="text-xs text-[var(--titanium-silver)] font-light max-w-sm">
                Vertical friction clutch eliminates stutter on launch. Live elapsed chronograph:{" "}
                <span className="font-mono text-[var(--champagne-gold)] font-bold">{chronoSeconds.toFixed(1)}s</span>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleTestChrono}
                className="btn-gold-luxury py-2 px-4 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isChronoActive ? "Stop" : "Engage"}</span>
              </button>
              <button
                onClick={handleResetChrono}
                className="btn-gold-outline py-2 px-3 rounded-full text-xs font-mono uppercase cursor-pointer"
                title="Reset Chrono to Zero"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Hyperbaric Depth Chamber Test */}
          <div className="p-4 rounded-xl border border-[var(--titanium-silver)]/15 bg-[var(--midnight-black)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-[var(--champagne-gold)]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--headline-white)] font-bold">
                  Hyperbaric 30-Bar Pressure Test
                </span>
              </div>
              <p className="text-xs text-[var(--titanium-silver)] font-light max-w-sm">
                Simulates deep immersion stress to verify triple crown gaskets and sapphire crystal flexure.
              </p>
            </div>

            <button
              disabled={isTestingPressure}
              onClick={handlePressureTest}
              className="btn-gold-outline py-2 px-4 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3 h-3" />
              <span>{isTestingPressure ? "Pressurizing..." : "Test 30 ATM"}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="pt-4 border-t border-[var(--titanium-silver)]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] font-mono text-[var(--titanium-silver)]">
            MANUFACTURE CALIBRE TLX-01 · SWISS MADE
          </span>

          <button
            onClick={() => {
              onClose();
              onOpenCommission();
            }}
            className="btn-gold-luxury py-2.5 px-6 rounded-full text-xs font-mono uppercase tracking-widest font-semibold cursor-pointer"
          >
            Acquire Calibre TLX-01
          </button>
        </div>
      </div>
    </div>
  );
}
