# Frame-Sequence Hero Design

## Goal

Restore the hero as a scroll-driven image-frame experience. Hero sequences must not use MP4 playback. Collection and macro footage remain the only video assets, presented without autoplay, controls, or a play button.

## Media model

The seven recovered source frame folders contain 1,853 PNG frames. They will be converted to WebP at their existing dimensions and placed in versioned sequence directories. The source PNG folders stay outside the repository after conversion.

The five hero beats use these WebP sequences:

1. Hero rotation
2. Case geometry
3. Deconstruction
4. Movement
5. Reassembly

Collection and macro source frames are not used by the hero. Their existing MP4 assets render as paused poster imagery with no controls.

## Loading and scroll behavior

`FrameSequenceScrubber` replaces `VideoCanvasScrubber` in the master scrolly section. It maps page scroll progress to a frame index and paints the most recently decoded frame to a canvas.

The preloader waits for every hero beat's opening frame to decode, so each beat has an immediate visual fallback. It then releases instead of waiting for all 1,375+ hero frames. The scrubber keeps a bounded decoded-frame cache and preloads frames ahead of and behind the active frame, prioritizing the current beat. This prevents a long startup block while keeping forward and reverse scrolling smooth.

If a requested frame is not yet decoded, the canvas retains the last decoded frame rather than showing an empty region. Reduced-motion visitors see the opening frame for the active beat without frame-by-frame animation.

## Legibility and navigation

Hero text receives a directional dark gradient, stronger text-shadow, and a translucent content panel only where text is placed. This preserves the watch imagery while maintaining readable contrast.

The bottom-right beat navigation changes from implementation labels to reader-facing labels:

- The Watch
- Case Design
- Inside the Movement
- Precision in Motion
- Complete Timepiece

## Error handling

Each opening frame records either decoded success or a failure. A failed asset does not permanently trap the loader; the beat keeps its poster fallback and reports the failure in development. Subsequent-frame failures retain the most recent decoded frame.

## Verification

Tests cover frame-index mapping, opening-frame gate behavior, prefetch-window selection, and error fallback. The release check runs tests, type check, lint, production build, WebP-only image scan, stale-media-reference scan, and a manual throttled-browser scroll test.
