import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("luxury utility styles use strict palette custom properties and preserve neutral panel", async () => {
  const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(css, /--midnight-black: #0D0D0D;/);
  assert.match(css, /--titanium-silver: #8B8D91;/);
  assert.match(css, /--steel-blue: #2C3946;/);
  assert.match(css, /--champagne-gold: #C2A472;/);
  assert.match(css, /--headline-white: #F5F4F2;/);
  assert.match(css, /\.panel-luxury/);
  assert.match(css, /\.btn-gold-luxury/);
});

test("navigation uses a single primary call to action and no animated wordmark ornament", async () => {
  const source = await readFile(new URL("../src/components/ui/Navbar.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /animate-pulse/);
  assert.match(source, /btn-gold-luxury/);
});

test("scrollytelling avoids decorative animated controls and uses VideoCanvasScrubber", async () => {
  const source = await readFile(new URL("../src/components/sections/MasterScrollySection.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /animate-spin|animate-ping|animate-bounce/);
  assert.match(source, /panel-luxury/);
  assert.match(source, /VideoCanvasScrubber/);
});

test("normal-scroll sections use the shared quiet panel treatment and palette", async () => {
  const collection = await readFile(new URL("../src/components/sections/CollectionSection.tsx", import.meta.url), "utf8");
  const craftsmanship = await readFile(new URL("../src/components/sections/CraftsmanshipSection.tsx", import.meta.url), "utf8");
  assert.match(collection, /panel-luxury/);
  assert.match(craftsmanship, /panel-luxury/);
  assert.doesNotMatch(collection, /-translate-y-2/);
});

test("collection product imagery is delivered at full visual quality", async () => {
  const collection = await readFile(new URL("../src/components/sections/CollectionSection.tsx", import.meta.url), "utf8");
  assert.match(collection, /quality=\{100\}/);
  assert.match(collection, /sizes="\(max-width: 768px\) calc\(100vw - 3rem\), \(max-width: 1280px\) 30vw, 384px"/);
});

test("ambient watch audio is configured as a looping track", async () => {
  const page = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  const audio = await readFile(new URL("../src/components/ui/AmbientAudio.tsx", import.meta.url), "utf8");
  assert.match(page, /AmbientAudio/);
  assert.match(audio, /watch-background-audio-loop\.wav/);
  assert.match(audio, /loop/);
  assert.match(audio, /preload="auto"/);
  assert.match(audio, /aria-label=\{isMuted/);
  assert.match(audio, /setIsMuted/);
});

test("ambient audio asset starts without a loop-boundary silence", async () => {
  const audio = await readFile(new URL("../src/components/ui/AmbientAudio.tsx", import.meta.url), "utf8");
  assert.match(audio, /watch-background-audio-loop\.wav/);
});

test("collection showcase preloads and plays when it enters the viewport", async () => {
  const collection = await readFile(new URL("../src/components/sections/CollectionSection.tsx", import.meta.url), "utf8");
  assert.match(collection, /IntersectionObserver/);
  assert.match(collection, /preload="auto"/);
  assert.match(collection, /autoPlay/);
  assert.match(collection, /onCanPlay=\{\(\) =>/);
  assert.match(collection, /video\.play\(\)/);
});

test("collection showcase keeps the video play target clickable", async () => {
  const collection = await readFile(new URL("../src/components/sections/CollectionSection.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(collection, /className="w-full h-full object-contain pointer-events-none"/);
});
