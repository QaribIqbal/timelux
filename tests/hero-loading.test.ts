import test from "node:test";
import assert from "node:assert/strict";
import { isHeroReadyForEntry } from "../src/lib/heroLoading.ts";

test("keeps the preloader visible until the first two frame sequences have settled", () => {
  assert.equal(isHeroReadyForEntry(478, 478, true), true);
  assert.equal(isHeroReadyForEntry(477, 478, true), false);
  assert.equal(isHeroReadyForEntry(478, 478, false), false);
  assert.equal(isHeroReadyForEntry(478, 0, true), false);
});
