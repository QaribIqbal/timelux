export interface FrameSequence {
  id: string;
  startProgress: number;
  endProgress: number;
  frameCount: number;
  framePath: (index: number) => string;
  poster: string;
  filter?: string;
}

export const FRAME_CACHE_LIMIT = 8;
export const FRAME_PREFETCH_RADIUS = 4;
export const MAX_BACKGROUND_FRAME_LOADS = 3;
export const ENTRY_SEQUENCE_COUNT = 4;
export const ENTRY_FINAL_SEQUENCE_RATIO = 0.5;
export const HERO_ENTRY_PRELOAD_CONCURRENCY = 6;
export const BACKGROUND_SEQUENCE_PRELOAD_CONCURRENCY = 6;

export function getScrollDirection(currentProgress: number, previousProgress: number): -1 | 1 {
  return currentProgress < previousProgress ? -1 : 1;
}

export function getFrameIndex(sequence: FrameSequence, progress: number) {
  const range = sequence.endProgress - sequence.startProgress;
  const localProgress = range > 0
    ? Math.max(0, Math.min(1, (progress - sequence.startProgress) / range))
    : 0;

  return Math.min(
    sequence.frameCount - 1,
    Math.max(0, Math.round(localProgress * (sequence.frameCount - 1)))
  );
}

export function getPrefetchFrameIndices(
  currentIndex: number,
  frameCount: number,
  radius: number,
  direction: -1 | 1 = 1
) {
  const indices = [currentIndex];
  for (let distance = 1; distance <= radius; distance += 1) {
    const ahead = currentIndex + distance * direction;
    if (ahead >= 0 && ahead < frameCount) indices.push(ahead);
  }
  for (let distance = 1; distance <= radius; distance += 1) {
    const behind = currentIndex - distance * direction;
    if (behind >= 0 && behind < frameCount) indices.push(behind);
  }
  return indices;
}

export function getOpeningFrameUrls(sequences: readonly FrameSequence[]) {
  return sequences.map((sequence) => sequence.framePath(0));
}

export function getHeroEntryFrameUrls(sequence: FrameSequence) {
  return Array.from(
    { length: sequence.frameCount },
    (_, index) => sequence.framePath(index)
  );
}

export function getEntrySequenceFrameUrls(sequences: readonly FrameSequence[]) {
  const completeSequences = sequences
    .slice(0, ENTRY_SEQUENCE_COUNT)
    .flatMap(getHeroEntryFrameUrls);
  const partialSequence = sequences[ENTRY_SEQUENCE_COUNT];
  if (!partialSequence) return completeSequences;

  const partialFrameCount = Math.ceil(
    partialSequence.frameCount * ENTRY_FINAL_SEQUENCE_RATIO
  );
  return [
    ...completeSequences,
    ...getHeroEntryFrameUrls(partialSequence).slice(0, partialFrameCount),
  ];
}

export function getBackgroundSequenceFrameUrls(sequences: readonly FrameSequence[]) {
  return getBackgroundSequenceFrameGroups(sequences).flat();
}

export function getBackgroundSequenceFrameGroups(sequences: readonly FrameSequence[]) {
  const partialSequence = sequences[ENTRY_SEQUENCE_COUNT];
  const partialFrameCount = partialSequence
    ? Math.ceil(partialSequence.frameCount * ENTRY_FINAL_SEQUENCE_RATIO)
    : 0;
  const partialRemainder = partialSequence
    ? getHeroEntryFrameUrls(partialSequence).slice(partialFrameCount)
    : [];

  return [
    partialRemainder,
    ...sequences.slice(ENTRY_SEQUENCE_COUNT + 1).map(getHeroEntryFrameUrls),
  ].filter((urls) => urls.length > 0);
}
