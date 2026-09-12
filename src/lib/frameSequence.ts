export interface FrameSequence {
  id: string;
  startProgress: number;
  endProgress: number;
  frameCount: number;
  framePath: (index: number) => string;
  poster: string;
  filter?: string;
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
  radius: number
) {
  const start = Math.max(0, currentIndex - radius);
  const end = Math.min(frameCount - 1, currentIndex + radius);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function getOpeningFrameUrls(sequences: readonly FrameSequence[]) {
  return sequences.map((sequence) => sequence.framePath(0));
}
