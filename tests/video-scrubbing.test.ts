import test from "node:test";
import assert from "node:assert/strict";
import {
  canRequestVideoFrame,
  getVideoLoadStatus,
  getVideoPrimeTime,
  isVideoReadyForScrubbing,
} from "../src/lib/videoScrubbing.ts";

test("a video becomes scrub-ready as soon as its current frame can be decoded", () => {
  assert.equal(isVideoReadyForScrubbing(0), false);
  assert.equal(isVideoReadyForScrubbing(1), false);
  assert.equal(isVideoReadyForScrubbing(2), true);
  assert.equal(isVideoReadyForScrubbing(3), true);
  assert.equal(isVideoReadyForScrubbing(4), true);
});

test("a media error never counts as scrub-ready", () => {
  assert.equal(isVideoReadyForScrubbing(4, true), false);
});

test("a metadata-only CDN response can seek to request the first frame", () => {
  assert.equal(canRequestVideoFrame(0, Number.NaN), false);
  assert.equal(canRequestVideoFrame(1, 7.97), true);
  assert.equal(canRequestVideoFrame(4, 7.97), true);
  assert.equal(canRequestVideoFrame(1, 7.97, true), false);
});

test("a metadata-only video is primed away from zero to trigger a CDN range request", () => {
  assert.equal(getVideoPrimeTime(0, 0, Number.NaN, 30), null);
  assert.equal(getVideoPrimeTime(1, 0, 7.97, 30), 1 / 30);
  assert.equal(getVideoPrimeTime(1, 2, 7.97, 30), null);
  assert.equal(getVideoPrimeTime(1, 0, 7.97, 30, true), null);
});

test("media errors take precedence over cached decoded readiness", () => {
  assert.equal(getVideoLoadStatus(0, false), "pending");
  assert.equal(getVideoLoadStatus(2, false), "ready");
  assert.equal(getVideoLoadStatus(4, true), "error");
});
