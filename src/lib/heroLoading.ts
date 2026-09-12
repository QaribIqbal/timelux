export function isHeroReadyForEntry(
  readyPosterCount: number,
  readyVideoCount: number,
  heroBeatCount: number
) {
  return (
    heroBeatCount > 0 &&
    readyPosterCount >= heroBeatCount &&
    readyVideoCount >= heroBeatCount
  );
}
