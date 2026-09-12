export function isHeroReadyForEntry(
  settledOpeningFrameCount: number,
  heroBeatCount: number
) {
  return heroBeatCount > 0 && settledOpeningFrameCount >= heroBeatCount;
}
