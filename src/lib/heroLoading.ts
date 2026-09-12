export const HERO_MEDIA_COUNT = 10;
export const HERO_READY_THRESHOLD = Math.ceil(HERO_MEDIA_COUNT * 0.9);

export function isHeroReadyForEntry(
  readyMediaCount: number,
  isHeroVideoReady: boolean
) {
  return readyMediaCount >= HERO_READY_THRESHOLD && isHeroVideoReady;
}
