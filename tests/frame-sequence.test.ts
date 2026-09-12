import test from "node:test";
import assert from "node:assert/strict";
import {
  getFrameIndex,
  getOpeningFrameUrls,
  getPrefetchFrameIndices,
  type FrameSequence,
} from "../src/lib/frameSequence.ts";
import { HERO_SEQUENCES } from "../src/lib/heroAssets.ts";
import { HERO_BEAT_LABELS } from "../src/lib/heroAssets.ts";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

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

test("publishes complete WebP hero sequences", () => {
  assert.equal(HERO_SEQUENCES[0].frameCount, 239);
  assert.equal(HERO_SEQUENCES[3].frameCount, 299);
  assert.match(HERO_SEQUENCES[0].framePath(0), /\.webp$/);
  assert.equal(
    existsSync(fileURLToPath(new URL(`../public${HERO_SEQUENCES[0].framePath(0)}`, import.meta.url))),
    true
  );
});

test("uses reader-facing names for the hero navigation", () => {
  assert.deepEqual(HERO_BEAT_LABELS, [
    "The Watch",
    "Case Design",
    "Inside the Movement",
    "Precision in Motion",
    "Complete Timepiece",
  ]);
});
