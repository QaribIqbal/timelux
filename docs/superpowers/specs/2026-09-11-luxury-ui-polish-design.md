# Luxury UI Polish Design

## Goal

Present TIMELUX as a premium luxury digital studio. The watch sequence remains
the expressive focal point; every interface layer supports it with clarity,
space, and restraint.

## Visual system

- **Color:** graphite-black surfaces, warm white typography, and champagne
  gold only for primary actions and key mechanical details.
- **Typography:** editorial serif display type for a small number of headlines;
  Space Grotesk for navigation, body copy, labels, and actions. Avoid pervasive
  uppercase, excessive letter spacing, and technical-looking labels.
- **Surfaces:** replace thick glass panels, visible gradient borders, and glow
  effects with low-opacity graphite panels, 1px neutral borders, and restrained
  elevation.
- **Motion:** preserve scroll-driven watch playback. Content transitions use
  short, low-distance fades and slides; decorative spinning and bouncing motion
  is removed.

## Component changes

### Global styles

Refine shared tokens and utility styles for panels, primary buttons, editorial
headings, and navigation. Reduce radial glows, blur strength, shadow opacity,
and gold treatment.

### Navigation

Use a compact translucent bar with quiet links and one solid, softly rounded
gold call-to-action. The navigation gains contrast only after scroll.

### Scrollytelling

Retain the pinned image sequence and four story beats. Simplify overlays to
small eyebrow labels, single-column copy, neutral dividers, and one clear CTA.
Remove status pills, animated icons, and dense metric grids. The progress UI
becomes a minimal numeric indicator or is hidden where it distracts.

### Collection and craftsmanship

Give both normal-scroll sections more whitespace, calm neutral cards, and
limited hover movement. Gold is reserved for selection and CTA moments rather
than borders and glow throughout.

## Files in scope

- `src/app/globals.css`
- `src/components/ui/Navbar.tsx`
- `src/components/sections/MasterScrollySection.tsx`
- `src/components/sections/CollectionSection.tsx`
- `src/components/sections/CraftsmanshipSection.tsx`

## Verification

Run the sticky-scroll regression test, lint, and production build. Verify the
home route locally after the visual changes, including the sticky canvas and
both CTA entry points.
