import test from "node:test";
import assert from "node:assert/strict";
import { isHeroReadyForEntry } from "../src/lib/heroLoading.ts";

test("keeps the preloader visible until every hero poster and video has settled", () => {
  assert.equal(isHeroReadyForEntry(5, 5, 5), true);
  assert.equal(isHeroReadyForEntry(4, 5, 5), false);
  assert.equal(isHeroReadyForEntry(5, 4, 5), false);
  assert.equal(isHeroReadyForEntry(5, 5, 6), false);
});
