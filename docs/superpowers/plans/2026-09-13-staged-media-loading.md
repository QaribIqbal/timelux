# Staged Media Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the loader visible through the first four complete frame sequences and half of the fifth, then transfer the remainder before downloading optimized optional videos.

**Architecture:** Frame URLs are divided into a critical entry set and deferred groups. The critical set is decoded for readiness; deferred frame groups are fetched concurrently into the HTTP cache; only after they settle are optimized video files fetched. The existing 30% audio-start request remains connected to loader progress.

**Tech Stack:** Next.js 16, React, WebP frame sequences, Netlify immutable caching, Node tests, FFmpeg.

**Spec:** User request in this thread.

## Global Constraints

- Keep scroll sections frame-driven; do not replace them with video playback.
- Retain the existing no-controls/no-video-autoplay presentation.
- Preserve source media masters outside `public/`.
- Cache versioned assets client-side and at the Netlify edge.

---

### Task 1: Divide the frame pipeline

**Files:**
- Modify: `src/lib/frameSequence.ts`
- Test: `tests/frame-sequence.test.ts`

- [x] Write a failing test that expects all frames from the first four sequences and half of the fifth in the entry set, with the remainder deferred.
- [x] Implement pure URL grouping helpers and constants.
- [x] Run `npm test`.

### Task 2: Stage deferred frames and videos

**Files:**
- Modify: `src/components/scrolly/FrameSequenceScrubber.tsx`
- Modify: `src/lib/videoAssets.ts`
- Test: `tests/frame-sequence.test.ts`

- [x] Write a failing test for optimized video preload URLs.
- [x] Complete all deferred frame fetches before beginning the optimized-video fetch queue.
- [x] Run `npm test`.

### Task 3: Produce optimized delivery videos

**Files:**
- Create: `scripts/optimize-runtime-videos.mjs`
- Create: `public/videos/optimized/*.mp4`
- Test: `tests/luxury-ui-style.test.mjs`

- [x] Write a failing test that checks the optimized videos are the only public MP4s.
- [x] Encode the two optional Collection and Atelier source videos as H.264 MP4s suitable for web delivery.
- [x] Run tests, lint, type-check, and production build.
