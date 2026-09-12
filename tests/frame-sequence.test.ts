import test from "node:test";
import assert from "node:assert/strict";
import {
  getFrameIndex,
  getOpeningFrameUrls,
  getPrefetchFrameIndices,
  type FrameSequence,
} from "../src/lib/frameSequence.ts";

const sequence: FrameSequence = {
  id: "a",
  startProgress: 0.2,
  endProgress: 0.4,
  frameCount: 5,
  framePath: (index) => `/frames/a/${String(index + 1).padStart(4, "0")}.webp`,
  poster: "/posters/a.webp",
};

test("maps scroll progress and nearby requests to WebP frame URLs", () => {
  assert.equal(getFrameIndex(sequence, 0.3), 2);
  assert.deepEqual(getPrefetchFrameIndices(4, 10, 2), [2, 3, 4, 5, 6]);
  assert.deepEqual(getOpeningFrameUrls([sequence]), ["/frames/a/0001.webp"]);
});
