import type { FrameSequence } from "@/lib/frameSequence";

const HERO_SEQUENCE_VERSION = "20260912";

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

export const HERO_BEATS = [
  ["hero", "/videos/01-hero-4k-rotation.81d8ff27.mp4", "/videos/posters/01-hero-4k-rotation.f8e98210.webp", 30, 7.97, 0, 0.2, "contrast(1.06) brightness(1.02)"],
  ["geometry", "/videos/02-case-geometry-rotation.bc4f34f6.mp4", "/videos/posters/02-case-geometry-rotation.19ddcccd.webp", 30, 7.97, 0.2, 0.4, "contrast(1.10) brightness(1.04) saturate(1.15)"],
  ["exploded", "/videos/03-exploded-deconstruction.1b3c9c36.mp4", "/videos/posters/03-exploded-deconstruction.e4dc2afd.webp", 30, 9.97, 0.4, 0.65, "contrast(1.08) brightness(1.04) saturate(1.12)"],
  ["movement", "/videos/04-movement-gears-4k.9923fa1b.mp4", "/videos/posters/04-movement-gears-4k.6c9dd670.webp", 30, 9.97, 0.65, 0.85, "contrast(1.06) brightness(1.02)"],
  ["reassembly", "/videos/05-timepiece-reassembly.f39ad719.mp4", "/videos/posters/05-timepiece-reassembly.3b39ce15.webp", 30, 9.97, 0.85, 1, "contrast(1.08) brightness(1.04) saturate(1.12)"],
] as const;
