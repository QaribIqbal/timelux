# Frame-Sequence Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hero MP4 scrubbing with WebP frame-sequence scrolling, improve legibility, simplify beat labels, and remove autoplaying section videos.

**Architecture:** Convert the five recovered hero source folders into versioned WebP frame directories. A canvas scrubber maps scroll progress to a decoded frame, keeps a bounded nearby-frame cache, and never clears the most recent visual while a requested frame loads. The preloader waits only for the five opening frames.

**Tech Stack:** Next.js 16, React 19, TypeScript, Canvas 2D, native image decoding, Sharp, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-12-frame-sequence-hero-design.md`

## Global Constraints

- Hero uses WebP frames and no MP4 playback.
- Preserve the source frame dimensions during WebP conversion.
- Collection and Craftsmanship use static WebP posters with no autoplay, controls, or play button.
- Keep a bounded decoded-frame cache and honor reduced motion.
- The loader releases only after opening frames resolve or fail to their poster fallback.

---

### Task 1: Frame metadata and pure loading logic

**Files:**
- Create: `src/lib/frameSequence.ts`
- Create: `tests/frame-sequence.test.ts`
- Modify: `src/lib/heroAssets.ts`

**Interfaces:**
- Produces `FrameSequence`, `getFrameIndex`, `getPrefetchFrameIndices`, `getOpeningFrameUrls`, and `HERO_SEQUENCES`.

- [ ] **Step 1: Write failing tests**

```ts
assert.equal(getFrameIndex(sequence, 0.3), 1);
assert.deepEqual(getPrefetchFrameIndices(4, 10, 2), [2, 3, 4, 5, 6]);
assert.deepEqual(getOpeningFrameUrls([sequenceA, sequenceB]), ["/frames/a/0001.webp", "/frames/b/0001.webp"]);
```

- [ ] **Step 2: Verify red**

Run: `npm test -- tests/frame-sequence.test.ts`

Expected: FAIL because the helper module is absent.

- [ ] **Step 3: Implement the helpers**

```ts
export interface FrameSequence { id: string; startProgress: number; endProgress: number; frames: readonly string[]; poster: string; filter?: string }
export function getFrameIndex(sequence: FrameSequence, progress: number) {
  const local = Math.max(0, Math.min(1, (progress - sequence.startProgress) / (sequence.endProgress - sequence.startProgress)));
  return Math.min(sequence.frames.length - 1, Math.round(local * (sequence.frames.length - 1)));
}
```

- [ ] **Step 4: Verify green and commit**

Run: `npm test -- tests/frame-sequence.test.ts`

Commit: `git add src/lib/frameSequence.ts src/lib/heroAssets.ts tests/frame-sequence.test.ts && git commit -m "feat: add hero frame sequence metadata"`

### Task 2: Generate the five WebP frame sequences

**Files:**
- Create: `scripts/convert-hero-frames.mjs`
- Create: `public/hero-sequences/{hero,geometry,deconstruction,movement,reassembly}/`
- Modify: `src/lib/heroAssets.ts`

**Interfaces:**
- Consumes the recovered directories in `/Users/qaribiqbal/.Trash/timelux-raw-frame-sources-20260912`.
- Produces numbered `frame-0001.webp` paths and exact frame counts: 239, 239, 299, 299, 299.

- [ ] **Step 1: Add a failing manifest assertion**

```ts
assert.equal(HERO_SEQUENCES[0].frames.length, 239);
assert.equal(HERO_SEQUENCES[3].frames.length, 299);
assert.match(HERO_SEQUENCES[0].frames[0], /\.webp$/);
```

- [ ] **Step 2: Verify red**

Run: `npm test -- tests/frame-sequence.test.ts`

Expected: FAIL until the manifest and generated assets exist.

- [ ] **Step 3: Implement and execute conversion**

```js
await sharp(inputPath).webp({ quality: 86, effort: 6, smartSubsample: true }).toFile(outputPath);
```

Sort source filenames numerically, preserve frame dimensions, emit zero-padded filenames, and update the manifest.

- [ ] **Step 4: Verify output, test, and commit**

Run: `node scripts/convert-hero-frames.mjs && find public/hero-sequences -name '*.webp' | wc -l && npm test -- tests/frame-sequence.test.ts`

Expected: 1,375 WebP files and passing tests.

Commit: `git add scripts/convert-hero-frames.mjs public/hero-sequences src/lib/heroAssets.ts tests/frame-sequence.test.ts && git commit -m "feat: add webp hero frame sequences"`

### Task 3: Canvas scrubber and five-frame entry gate

**Files:**
- Create: `src/components/scrolly/FrameSequenceScrubber.tsx`
- Modify: `src/components/sections/MasterScrollySection.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/ui/LuxuryPreloader.tsx`
- Modify: `src/lib/heroLoading.ts`
- Test: `tests/frame-sequence.test.ts`

**Interfaces:**
- `FrameSequenceScrubber` consumes `HERO_SEQUENCES` and exposes `onOpeningFramesSettled(count: number)`.

- [ ] **Step 1: Add the failing gate test**

```ts
assert.equal(isHeroReadyForEntry(5, 5), true);
assert.equal(isHeroReadyForEntry(4, 5), false);
assert.equal(isHeroReadyForEntry(5, 4), false);
```

- [ ] **Step 2: Verify red**

Run: `npm test -- tests/frame-sequence.test.ts`

Expected: FAIL because the existing gate accepts media video counts.

- [ ] **Step 3: Implement the scrubber**

```tsx
const frameIndex = getFrameIndex(activeSequence, progress);
const nearby = getPrefetchFrameIndices(frameIndex, activeSequence.frames.length, 12);
// Decode nearby with Image.decode(), evict old entries, and draw the latest active decoded frame in requestAnimationFrame.
```

Opening-frame decode or error increments the preloader gate. Frame errors retain the last decoded canvas frame. Reduced motion holds the opening frame.

- [ ] **Step 4: Integrate and verify**

Run: `npm test -- tests/frame-sequence.test.ts`

Expected: PASS.

Commit: `git add src/components/scrolly/FrameSequenceScrubber.tsx src/components/sections/MasterScrollySection.tsx src/app/page.tsx src/components/ui/LuxuryPreloader.tsx src/lib/heroLoading.ts tests/frame-sequence.test.ts && git commit -m "feat: restore scroll-driven hero frame sequences"`

### Task 4: Legibility and reader-facing beat navigation

**Files:**
- Modify: `src/components/sections/MasterScrollySection.tsx`
- Test: `tests/frame-sequence.test.ts`

- [ ] **Step 1: Add failing label test**

```ts
assert.deepEqual(HERO_BEAT_LABELS, ["The Watch", "Case Design", "Inside the Movement", "Precision in Motion", "Complete Timepiece"]);
```

- [ ] **Step 2: Verify red, implement, verify green**

Run: `npm test -- tests/frame-sequence.test.ts`

Define `HERO_BEAT_LABELS` with the approved labels. Add a left/bottom directional gradient, stronger shadows, and a translucent bounded copy panel; do not darken the entire image.

Commit: `git add src/components/sections/MasterScrollySection.tsx tests/frame-sequence.test.ts && git commit -m "fix: improve hero copy legibility"`

### Task 5: Replace section videos with static posters

**Files:**
- Modify: `src/components/sections/CollectionSection.tsx`
- Modify: `src/components/sections/CraftsmanshipSection.tsx`

- [ ] **Step 1: Add failing media-mode test**

```ts
assert.equal(getSectionMediaMode("collection"), "poster");
assert.equal(getSectionMediaMode("craftsmanship"), "poster");
```

- [ ] **Step 2: Verify red, implement, verify green**

Replace each `<video>` with `next/image` using its existing versioned WebP poster, `fill`, appropriate `sizes`, and the existing visual treatment. Remove autoplay, looping, click-to-play, playback observers, and controls.

Run: `npm test -- tests/frame-sequence.test.ts`

Commit: `git add src/components/sections/CollectionSection.tsx src/components/sections/CraftsmanshipSection.tsx tests/frame-sequence.test.ts && git commit -m "fix: use static section media"`

### Task 6: Full release verification

**Files:**
- Modify: `next.config.ts` and `netlify.toml` only if the frame paths need cache-header coverage.

- [ ] **Step 1: Scan retired media references**

Run: `rg -n 'VideoCanvasScrubber|/videos/0[1-5]-|public/(hero|watch gears moving|watch componenet seprating)' src tests scripts || true`

Expected: no retired hero video or raw-frame paths.

- [ ] **Step 2: Run release commands**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build && git diff --check`

Expected: all commands exit 0.

- [ ] **Step 3: Manually verify under Fast 3G**

Confirm each opening frame resolves before entry, forward/reverse hero scrolling never shows an empty canvas, hero text remains readable on the movement frame, and Collection/Craftsmanship remain static posters.
