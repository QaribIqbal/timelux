const HAVE_CURRENT_DATA = 2;
const HAVE_METADATA = 1;

export type VideoLoadStatus = "pending" | "ready" | "error";

export function getVideoLoadStatus(
  readyState: number,
  hasMediaError = false
): VideoLoadStatus {
  if (hasMediaError) return "error";
  return readyState >= HAVE_CURRENT_DATA ? "ready" : "pending";
}

/**
 * A scroll-controlled video can seek once the browser has decoded its current
 * frame. Waiting for the entire file to buffer is unreliable on CDNs, where
 * browsers intentionally fetch MP4s in byte ranges.
 */
export function isVideoReadyForScrubbing(
  readyState: number,
  hasMediaError = false
) {
  return getVideoLoadStatus(readyState, hasMediaError) === "ready";
}

/** Metadata is enough to request a timestamp, which prompts a range-based CDN
 * to deliver the frame data needed for scrubbing. */
export function canRequestVideoFrame(
  readyState: number,
  duration: number,
  hasMediaError = false
) {
  return (
    !hasMediaError &&
    readyState >= HAVE_METADATA &&
    Number.isFinite(duration) &&
    duration > 0
  );
}

/**
 * Seeking off timestamp zero makes metadata-only browsers request actual media
 * bytes from a CDN. A one-frame nudge is visually indistinguishable from the
 * opening frame.
 */
export function getVideoPrimeTime(
  readyState: number,
  currentTime: number,
  duration: number,
  fps: number,
  hasMediaError = false
) {
  if (
    readyState !== HAVE_METADATA ||
    currentTime > 0 ||
    !canRequestVideoFrame(readyState, duration, hasMediaError)
  ) {
    return null;
  }

  return Math.min(1 / fps, duration);
}
