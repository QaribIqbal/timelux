import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the scrollytelling viewport is not inside an overflow scroll container", async () => {
  const page = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(
    page,
    /<main[^>]*\boverflow-x-hidden\b/,
    "overflow-x-hidden creates a scroll container that prevents the sticky scrollytelling viewport from pinning to the browser viewport"
  );
});
