"use client";

import React from "react";

/**
 * SmoothScroll — intentionally a transparent pass-through.
 *
 * Lenis (and any other virtual-scroll library) works by intercepting native
 * scroll events and re-driving them on its own rAF loop.  This virtualises the
 * scroll container on the <html> element, which has two fatal side-effects for
 * our pinned video scrubber:
 *
 *  1. `position: sticky` stops working — the browser's sticky algorithm reads
 *     the *native* scroll offset; when Lenis virtualises it the pinned inner
 *     div never pins.
 *  2. `getBoundingClientRect().top` returns wrong values for the sticky element
 *     because the browser sees a different scroll position than Lenis reports,
 *     so `computeProgress` in MasterScrollySection always calculates ~0.
 *
 * Smooth-scroll feel is preserved by `scroll-behavior: smooth` on <html>
 * (already set in globals.css) and by the rAF-throttled progress reads inside
 * MasterScrollySection + the CSS transition easing on the copy overlays.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
