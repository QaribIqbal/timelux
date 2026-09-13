"use client";

import React, { useCallback, useState } from "react";
import { HERO_SEQUENCES } from "@/lib/heroAssets";
import { getEntrySequenceFrameUrls } from "@/lib/frameSequence";
import LuxuryPreloader from "@/components/ui/LuxuryPreloader";
import Navbar from "@/components/ui/Navbar";
import MasterScrollySection from "@/components/sections/MasterScrollySection";
import CollectionSection from "@/components/sections/CollectionSection";
import CraftsmanshipSection from "@/components/sections/CraftsmanshipSection";
import Footer from "@/components/ui/Footer";
import MechanismSandboxModal from "@/components/modals/MechanismSandboxModal";
import CommissionModal from "@/components/modals/CommissionModal";
import AmbientAudio from "@/components/ui/AmbientAudio";

const ENTRY_FRAME_COUNT = getEntrySequenceFrameUrls(HERO_SEQUENCES).length;

export default function Home() {
  const [isMechanismOpen, setIsMechanismOpen] = useState(false);
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);
  const [preselectedModel, setPreselectedModel] = useState<string | undefined>(
    undefined
  );
  const [settledHeroFrames, setSettledHeroFrames] = useState(0);
  const [isHeroPreloadComplete, setIsHeroPreloadComplete] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);

  const handleSelectModel = (modelName: string) => {
    setPreselectedModel(modelName);
    setIsCommissionOpen(true);
  };

  const handleHeroFrameSettled = useCallback(() => {
    setSettledHeroFrames((previous) =>
      Math.min(ENTRY_FRAME_COUNT, previous + 1)
    );
  }, []);

  const handleHeroPreloadComplete = useCallback(() => {
    setIsHeroPreloadComplete(true);
  }, []);

  return (
    <main className="relative min-h-screen bg-[var(--midnight-black)] text-[var(--headline-white)]">
      <AmbientAudio startRequested={loaderProgress >= 30} />

      <LuxuryPreloader
        settledHeroFrames={settledHeroFrames}
        heroFrameCount={ENTRY_FRAME_COUNT}
        isHeroPreloadComplete={isHeroPreloadComplete}
        onProgressChange={setLoaderProgress}
      />

      {/* Apple-Style Minimal Fixed Glassmorphic Navbar */}
      <Navbar
        onOpenCommission={() => setIsCommissionOpen(true)}
        onOpenMechanism={() => setIsMechanismOpen(true)}
      />

      {/* CORE INTERACTION: SCROLL-LINKED HERO FRAME SEQUENCE */}
      <MasterScrollySection
        onOpenMechanism={() => setIsMechanismOpen(true)}
        onOpenCommission={() => setIsCommissionOpen(true)}
        onHeroFrameSettled={handleHeroFrameSettled}
        onHeroPreloadComplete={handleHeroPreloadComplete}
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
