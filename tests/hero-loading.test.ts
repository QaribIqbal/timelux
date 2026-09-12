import test from "node:test";
import assert from "node:assert/strict";
import {
  HERO_MEDIA_COUNT,
  HERO_READY_THRESHOLD,
  isHeroReadyForEntry,
} from "../src/lib/heroLoading.ts";

test("releases the preloader at 90% while requiring the first hero video", () => {
  assert.equal(HERO_MEDIA_COUNT, 10);
  assert.equal(HERO_READY_THRESHOLD, 9);
  assert.equal(isHeroReadyForEntry(9, true), true);
  assert.equal(isHeroReadyForEntry(10, true), true);
  assert.equal(isHeroReadyForEntry(9, false), false);
});

test("does not release before the 90% threshold", () => {
  assert.equal(isHeroReadyForEntry(8, true), false);
});
