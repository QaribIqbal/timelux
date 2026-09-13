import type { FrameSequence } from "@/lib/frameSequence";

const HERO_SEQUENCE_VERSION = "20260913";

function createFrameSequence(
  id: string,
  frameCount: number,
  startProgress: number,
  endProgress: number,
  poster: string,
  filter?: string
): FrameSequence {
  return {
    id,
    frameCount,
    startProgress,
    endProgress,
    poster,
    filter,
    framePath: (index) =>
      `/hero-sequences/${HERO_SEQUENCE_VERSION}/${id}/frame-${String(index + 1).padStart(4, "0")}.webp`,
  };
}

// Keep this metadata compact: frame URLs are derived at runtime instead of
// serializing 1,375 filenames into the client bundle.
export const HERO_SEQUENCES: readonly FrameSequence[] = [
  createFrameSequence("hero", 239, 0, 0.2, "/videos/posters/01-hero-4k-rotation.f8e98210.webp", "contrast(1.06) brightness(1.02)"),
  createFrameSequence("geometry", 239, 0.2, 0.4, "/videos/posters/02-case-geometry-rotation.19ddcccd.webp", "contrast(1.10) brightness(1.04) saturate(1.15)"),
  createFrameSequence("deconstruction", 299, 0.4, 0.65, "/videos/posters/03-exploded-deconstruction.e4dc2afd.webp", "contrast(1.08) brightness(1.04) saturate(1.12)"),
  createFrameSequence("movement", 299, 0.65, 0.85, "/videos/posters/04-movement-gears-4k.6c9dd670.webp", "contrast(1.06) brightness(1.02)"),
  createFrameSequence("reassembly", 299, 0.85, 1, "/videos/posters/05-timepiece-reassembly.3b39ce15.webp", "contrast(1.08) brightness(1.04) saturate(1.12)"),
];

export const HERO_BEAT_LABELS = [
  "The Watch",
  "Case Design",
  "Inside the Movement",
  "Precision in Motion",
  "Complete Timepiece",
] as const;
