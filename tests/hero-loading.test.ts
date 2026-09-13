import test from "node:test";
import assert from "node:assert/strict";
import { isHeroReadyForEntry } from "../src/lib/heroLoading.ts";

test("keeps the preloader visible until the complete hero frame queue has settled", () => {
  assert.equal(isHeroReadyForEntry(239, 239, true), true);
  assert.equal(isHeroReadyForEntry(238, 239, true), false);
  assert.equal(isHeroReadyForEntry(239, 239, false), false);
  assert.equal(isHeroReadyForEntry(239, 0, true), false);
});
