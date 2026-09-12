"use client";

import React, { useState } from "react";
import { HERO_BEATS } from "@/lib/heroAssets";
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
  const [readyHeroVideos, setReadyHeroVideos] = useState(0);

  const handleSelectModel = (modelName: string) => {
    setPreselectedModel(modelName);
    setIsCommissionOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-[var(--midnight-black)] text-[var(--headline-white)]">
      <AmbientAudio />

      {/* Luxury Horology Preloader linked directly to real hero media readiness */}
      <LuxuryPreloader readyHeroVideos={readyHeroVideos} />

      {/* Apple-Style Minimal Fixed Glassmorphic Navbar */}
      <Navbar
        onOpenCommission={() => setIsCommissionOpen(true)}
        onOpenMechanism={() => setIsMechanismOpen(true)}
      />

      {/* CORE INTERACTION: SCROLL-LINKED HERO VIDEO SEQUENCE */}
      <MasterScrollySection
        onOpenMechanism={() => setIsMechanismOpen(true)}
        onOpenCommission={() => setIsCommissionOpen(true)}
        onHeroMediaReady={() =>
          setReadyHeroVideos((previous) => Math.min(HERO_BEATS.length, previous + 1))
        }
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
