import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
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

test("scrollytelling avoids decorative animated controls and uses frame sequences", async () => {
  const source = await readFile(new URL("../src/components/sections/MasterScrollySection.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /animate-spin|animate-ping|animate-bounce/);
  assert.match(source, /panel-luxury/);
  assert.match(source, /FrameSequenceScrubber/);
  assert.doesNotMatch(source, /VideoCanvasScrubber/);
});

test("frame rendering paints decoded frames while the next scroll target is pending", async () => {
  const source = await readFile(new URL("../src/components/scrolly/FrameSequenceScrubber.tsx", import.meta.url), "utf8");
  assert.match(source, /if \(image\) drawImage\(image\)/);
  assert.doesNotMatch(source, /image && !pendingTargetRef\.current/);
});

test("frame rendering releases the animation-frame gate after cleanup", async () => {
  const source = await readFile(new URL("../src/components/scrolly/FrameSequenceScrubber.tsx", import.meta.url), "utf8");
  assert.match(
    source,
    /cancelAnimationFrame\(drawRafRef\.current\);\s*drawRafRef\.current = null;/
  );
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
  const preloader = await readFile(new URL("../src/components/ui/LuxuryPreloader.tsx", import.meta.url), "utf8");
  assert.match(page, /AmbientAudio/);
  assert.match(audio, /watch-background-audio-loop\.wav/);
  assert.match(audio, /fetch\(AUDIO_SOURCE/);
  assert.match(audio, /loop/);
  assert.match(audio, /aria-label=\{isMuted/);
  assert.match(audio, /setIsMuted/);
  assert.match(page, /<AmbientAudio startRequested=\{loaderProgress >= 30\}/);
  assert.match(preloader, /onProgressChange/);
  assert.match(audio, /startRequested/);
});

test("ambient audio asset starts without a loop-boundary silence", async () => {
  const audio = await readFile(new URL("../src/components/ui/AmbientAudio.tsx", import.meta.url), "utf8");
  assert.match(audio, /watch-background-audio-loop\.wav/);
  assert.match(audio, /createBufferSource\(\)/);
  assert.match(audio, /source\.loop = true/);
  assert.doesNotMatch(audio, /<audio/);
});

test("collection and craftsmanship use static WebP posters without video controls", async () => {
  const collection = await readFile(new URL("../src/components/sections/CollectionSection.tsx", import.meta.url), "utf8");
  const craftsmanship = await readFile(new URL("../src/components/sections/CraftsmanshipSection.tsx", import.meta.url), "utf8");
  assert.match(collection, /06-three-watch-collection\.c0ee4e9f\.webp/);
  assert.match(craftsmanship, /07-macro-craftsmanship\.2d194427\.webp/);
  assert.doesNotMatch(collection, /<video|autoPlay|video\.play|IntersectionObserver/);
  assert.doesNotMatch(craftsmanship, /<video|autoPlay|video\.play|IntersectionObserver/);
});

test("does not deploy unused source MP4 files", async () => {
  const publicVideos = await readdir(new URL("../public/videos/", import.meta.url));
  assert.deepEqual(publicVideos.filter((file) => file.endsWith(".mp4")), []);
  const optimizedVideos = await readdir(new URL("../public/videos/optimized/", import.meta.url));
  assert.deepEqual(optimizedVideos.sort(), [
    "06-three-watch-collection.mp4",
    "07-macro-craftsmanship.mp4",
  ]);
});
