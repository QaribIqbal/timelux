import test from "node:test";
import assert from "node:assert/strict";
import { isHeroReadyForEntry } from "../src/lib/heroLoading.ts";

test("keeps the preloader visible through four sequences and half of the fifth", () => {
  assert.equal(isHeroReadyForEntry(1226, 1226, true), true);
  assert.equal(isHeroReadyForEntry(1225, 1226, true), false);
  assert.equal(isHeroReadyForEntry(1226, 1226, false), false);
  assert.equal(isHeroReadyForEntry(1226, 0, true), false);
});
