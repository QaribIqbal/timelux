"use client";

import React, { useState } from "react";
import LuxuryPreloader from "@/components/ui/LuxuryPreloader";
import Navbar from "@/components/ui/Navbar";
import MasterScrollySection from "@/components/sections/MasterScrollySection";
import CollectionSection from "@/components/sections/CollectionSection";
import CraftsmanshipSection from "@/components/sections/CraftsmanshipSection";
import Footer from "@/components/ui/Footer";
import MechanismSandboxModal from "@/components/modals/MechanismSandboxModal";
import CommissionModal from "@/components/modals/CommissionModal";
import AmbientAudio from "@/components/ui/AmbientAudio";

export default function Home() {
  const [isMechanismOpen, setIsMechanismOpen] = useState(false);
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);
  const [preselectedModel, setPreselectedModel] = useState<string | undefined>(
    undefined
  );
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [readyHeroVideos, setReadyHeroVideos] = useState(0);

  const handleSelectModel = (modelName: string) => {
    setPreselectedModel(modelName);
    setIsCommissionOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-[var(--midnight-black)] text-[var(--headline-white)]">
      <AmbientAudio />

      {/* Luxury Horology Preloader linked directly to real hero media readiness */}
      <LuxuryPreloader
        isHeroReady={isHeroReady}
        readyHeroVideos={readyHeroVideos}
      />

      {/* Apple-Style Minimal Fixed Glassmorphic Navbar */}
      <Navbar
        onOpenCommission={() => setIsCommissionOpen(true)}
        onOpenMechanism={() => setIsMechanismOpen(true)}
      />

      {/* CORE INTERACTION: SCROLL-LINKED IMAGE SEQUENCE (400vh Pinned Canvas)
          - Beat 1 (0–15%): Hero Beauty Shot (Precision is the Ultimate Luxury)
          - Beat 2 (15–40%): The Exploded View (Beauty is Nothing Without Alignment)
          - Beat 3 (40–75%): Layer-by-Layer Inspection (Sapphire UI, Calibrated Movement, DevOps Shield)
          - Beat 4 (75–100%): Reassembly & Strong CTA (Systems Built to Endure / TEST THE MECHANISM)
      */}
      <MasterScrollySection
        onOpenMechanism={() => setIsMechanismOpen(true)}
        onOpenCommission={() => setIsCommissionOpen(true)}
        onHeroReady={() => setIsHeroReady(true)}
        onHeroMediaReady={() => setReadyHeroVideos((count) => count + 1)}
      />

      {/* SECTION 5: THE COLLECTION — CHOOSE YOUR EXPRESSION (Normal Scroll) */}
      <CollectionSection onSelectModel={handleSelectModel} />

      {/* SECTION 6: CRAFTSMANSHIP — FINAL DETAIL & CLOSE (Macro Footage Background) */}
      <CraftsmanshipSection
        onOpenCommission={() => setIsCommissionOpen(true)}
      />

      {/* LUXURY ATELIER FOOTER */}
      <Footer
        onOpenCommission={() => setIsCommissionOpen(true)}
        onOpenMechanism={() => setIsMechanismOpen(true)}
      />

      {/* INTERACTIVE MODALS */}
      <MechanismSandboxModal
        isOpen={isMechanismOpen}
        onClose={() => setIsMechanismOpen(false)}
        onOpenCommission={() => {
          setIsMechanismOpen(false);
          setIsCommissionOpen(true);
        }}
      />

      <CommissionModal
        isOpen={isCommissionOpen}
        onClose={() => setIsCommissionOpen(false)}
        preselectedModel={preselectedModel}
      />
    </main>
  );
}
