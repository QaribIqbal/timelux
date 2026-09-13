import test from "node:test";
import assert from "node:assert/strict";
import {
  FRAME_CACHE_LIMIT,
  FRAME_PREFETCH_RADIUS,
  MAX_BACKGROUND_FRAME_LOADS,
  getFrameIndex,
  getOpeningFrameUrls,
  getEntrySequenceFrameUrls,
  getBackgroundSequenceFrameUrls,
  getBackgroundSequenceFrameGroups,
  getPrefetchFrameIndices,
  getScrollDirection,
  type FrameSequence,
} from "../src/lib/frameSequence.ts";
import { HERO_SEQUENCES } from "../src/lib/heroAssets.ts";
import { HERO_BEAT_LABELS } from "../src/lib/heroAssets.ts";
import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

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
  assert.deepEqual(getPrefetchFrameIndices(4, 10, 2, 1), [4, 5, 6, 3, 2]);
  assert.deepEqual(getPrefetchFrameIndices(4, 10, 2, -1), [4, 3, 2, 5, 6]);
  assert.deepEqual(getOpeningFrameUrls([sequence]), ["/frames/a/0001.webp"]);
});

test("preloads every scroll frame in the first two entry sequences", () => {
  const alternateSequence = {
    ...sequence,
    id: "b",
    frameCount: 2,
    framePath: (index: number) => `/frames/b/${String(index + 1).padStart(4, "0")}.webp`,
  };
  assert.deepEqual(getEntrySequenceFrameUrls([{ ...sequence, frameCount: 3 }, alternateSequence]), [
    "/frames/a/0001.webp",
    "/frames/a/0002.webp",
    "/frames/a/0003.webp",
    "/frames/b/0001.webp",
    "/frames/b/0002.webp",
  ]);
});

test("queues every non-hero sequence for background transfer", () => {
  const alternateSequence = {
    ...sequence,
    id: "b",
    frameCount: 2,
    framePath: (index: number) => `/frames/b/${String(index + 1).padStart(4, "0")}.webp`,
  };
  assert.deepEqual(getBackgroundSequenceFrameUrls([
    { ...sequence, frameCount: 3 },
    alternateSequence,
    { ...sequence, id: "c", frameCount: 1, framePath: () => "/frames/c/0001.webp" },
  ]), [
    "/frames/c/0001.webp",
  ]);
});

test("starts later sections in parallel background groups", () => {
  const sequenceB = {
    ...sequence,
    id: "b",
    frameCount: 1,
    framePath: () => "/frames/b/0001.webp",
  };
  const sequenceC = {
    ...sequence,
    id: "c",
    frameCount: 1,
    framePath: () => "/frames/c/0001.webp",
  };
  assert.deepEqual(getBackgroundSequenceFrameGroups([
    { ...sequence, frameCount: 1 },
    { ...sequence, id: "entry-two", frameCount: 1, framePath: () => "/frames/entry-two/0001.webp" },
    sequenceB,
    sequenceC,
  ]), [["/frames/b/0001.webp"], ["/frames/c/0001.webp"]]);
});

test("bounds decoded frame memory and background request pressure", () => {
  assert.equal(FRAME_CACHE_LIMIT, 8);
  assert.equal(FRAME_PREFETCH_RADIUS, 4);
  assert.equal(MAX_BACKGROUND_FRAME_LOADS, 3);
});

test("keeps prefetch direction tied to page scroll across sequence boundaries", () => {
  assert.equal(getScrollDirection(0.21, 0.19), 1);
  assert.equal(getScrollDirection(0.19, 0.21), -1);
  assert.equal(getScrollDirection(0.21, 0.21), 1);
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

test("delivers runtime hero frames at a viewport-appropriate width", async () => {
  const frameUrl = HERO_SEQUENCES[0].framePath(0);
  const framePath = fileURLToPath(new URL(`../public${frameUrl}`, import.meta.url));
  const metadata = await sharp(framePath).metadata();

  assert.match(frameUrl, /\/hero-sequences\/20260913\//);
  assert.equal(metadata.width, 1920);
  assert.equal(metadata.height, 1080);
});

test("sets explicit Netlify edge caching for versioned frame sequences", () => {
  const netlifyConfig = readFileSync(
    fileURLToPath(new URL("../netlify.toml", import.meta.url)),
    "utf8"
  );

  assert.match(netlifyConfig, /for = "\/hero-sequences\/\*"/);
  assert.match(
    netlifyConfig,
    /Netlify-CDN-Cache-Control = "public, max-age=31536000, immutable"/
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
