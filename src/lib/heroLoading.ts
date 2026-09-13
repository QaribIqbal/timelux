export function isHeroReadyForEntry(
  settledHeroFrameCount: number,
  heroFrameCount: number,
  isHeroPreloadComplete: boolean
) {
  return (
    isHeroPreloadComplete &&
    heroFrameCount > 0 &&
    settledHeroFrameCount >= heroFrameCount
  );
}
