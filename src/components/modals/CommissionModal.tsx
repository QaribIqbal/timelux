"use client";

import React, { useState } from "react";
import { X, CheckCircle, Sparkles, Send, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedModel?: string;
}

export default function CommissionModal({
  isOpen,
  onClose,
  preselectedModel,
}: CommissionModalProps) {
  const [selectedReference, setSelectedReference] = useState<string>(
    preselectedModel || "REF. TLX-01 — Monolith Chronograph"
  );
  const [atelierLocation, setAtelierLocation] = useState("Geneva Atelier");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#C2A472", "#8B8D91", "#F5F4F2"],
      });
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[var(--midnight-black)]/90 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl bg-[var(--midnight-black)] border border-[var(--champagne-gold)]/50 shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[var(--titanium-silver)]/20 flex items-center justify-center text-[var(--titanium-silver)] hover:text-[var(--headline-white)] hover:border-[var(--champagne-gold)]/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--champagne-gold)]" />
              <span className="text-[10px] font-mono tracking-widest text-[var(--champagne-gold)] uppercase">
                Private Horological Allocation
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[var(--headline-white)] mb-2">
              RESERVE YOUR TIMEPIECE
            </h3>

            <p className="text-xs sm:text-sm text-[var(--titanium-silver)] leading-relaxed mb-6 font-light">
              Each reference is individually numbered and allocated strictly in order of
              application. Submit your details below to request your allocation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[var(--titanium-silver)] mb-1.5">
                  Select Reference
                </label>
                <select
                  value={selectedReference}
                  onChange={(e) => setSelectedReference(e.target.value)}
                  className="w-full bg-[var(--midnight-black)] border border-[var(--titanium-silver)]/30 text-[var(--headline-white)] rounded-md px-3.5 py-2.5 text-xs font-mono focus:border-[var(--champagne-gold)] focus:outline-none cursor-pointer"
                >
                  <option value="REF. TLX-01 — Monolith Chronograph">
                    REF. TLX-01 — Monolith Chronograph (50 Pieces Worldwide)
                  </option>
                  <option value="REF. TLX-02 — Steel-Blue Tourbillon">
                    REF. TLX-02 — Steel-Blue Tourbillon (25 Pieces Worldwide)
                  </option>
                  <option value="REF. TLX-03 — Grand Champagne Atelier">
                    REF. TLX-03 — Grand Champagne Atelier (10 Pieces Worldwide)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[var(--titanium-silver)] mb-1.5">
                  Preferred Handover Salon
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Geneva Atelier", "London Salon", "New York Vault", "Tokyo Lounge", "Dubai Concierge", "Armored Courier"].map((loc) => (
                    <button
                      type="button"
                      key={loc}
                      onClick={() => setAtelierLocation(loc)}
                      className={`py-2 px-1 text-center rounded text-[10px] font-mono uppercase transition-all cursor-pointer border ${
                        atelierLocation === loc
                          ? "border-[var(--champagne-gold)] bg-[var(--champagne-gold)]/10 text-[var(--champagne-gold)] font-bold"
                          : "border-[var(--titanium-silver)]/15 text-[var(--titanium-silver)] hover:border-[var(--titanium-silver)]/30"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[var(--titanium-silver)] mb-1.5">
                    Collector Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Harrison Vance"
                    className="w-full bg-[var(--midnight-black)] border border-[var(--titanium-silver)]/20 text-[var(--headline-white)] rounded-md px-3.5 py-2.5 text-xs font-sans placeholder:text-[var(--titanium-silver)]/40 focus:border-[var(--champagne-gold)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[var(--titanium-silver)] mb-1.5">
                    Private Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@private.com"
                    className="w-full bg-[var(--midnight-black)] border border-[var(--titanium-silver)]/20 text-[var(--headline-white)] rounded-md px-3.5 py-2.5 text-xs font-sans placeholder:text-[var(--titanium-silver)]/40 focus:border-[var(--champagne-gold)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[var(--titanium-silver)] mb-1.5">
                  Requested Serial Number / Bespoke Engraving Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify desired serial number (e.g. 07/50), caseback engraving initials, or wrist sizing requirements..."
                  className="w-full bg-[var(--midnight-black)] border border-[var(--titanium-silver)]/20 text-[var(--headline-white)] rounded-md px-3.5 py-2.5 text-xs font-sans placeholder:text-[var(--titanium-silver)]/40 focus:border-[var(--champagne-gold)] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-gold-luxury w-full py-3.5 px-4 rounded-full text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(194,164,114,0.25)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SUBMIT ALLOCATION APPLICATION</span>
                </button>
              </div>

              <p className="text-[10px] font-mono text-[var(--titanium-silver)]/60 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3 h-3 text-[var(--champagne-gold)]" />
                <span>Confidential Swiss Banking Standard · Strictly Encrypted Submission</span>
              </p>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full border border-[var(--champagne-gold)] flex items-center justify-center mx-auto text-[var(--champagne-gold)] bg-[var(--midnight-black)]">
              <CheckCircle className="w-7 h-7" />
            </div>

            <h3 className="font-serif text-2xl font-bold uppercase tracking-tight text-[var(--headline-white)]">
              ALLOCATION APPLICATION LODGED
            </h3>

            <div className="max-w-md mx-auto space-y-2 text-xs sm:text-sm text-[var(--titanium-silver)] font-light leading-relaxed">
              <p>
                Thank you, <strong className="text-[var(--headline-white)]">{name || "Collector"}</strong>. Your application for{" "}
                <span className="text-[var(--champagne-gold)] font-mono font-semibold">{selectedReference}</span> has been securely received by our Geneva Atelier.
              </p>
              <p>
                Our Master Horological Concierge will contact you at{" "}
                <span className="text-[var(--headline-white)]">{email}</span> within 24 hours to confirm your numbered caseback allocation.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={handleReset}
                className="btn-gold-outline py-2.5 px-8 rounded-full text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Return to Atelier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
