# Luxury UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the landing page into a restrained, premium luxury experience while retaining its pinned watch scrollytelling and interactions.

**Architecture:** Preserve the existing component hierarchy and all callback interfaces. Centralize the visual language in global utility classes, then simplify presentation in the navbar and three visible landing-page sections without changing image-sequence or scroll-progress data flow.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide React.

**Spec:** `docs/superpowers/specs/2026-09-11-luxury-ui-polish-design.md`

## Global Constraints

- Preserve the native-scroll sticky canvas and the `MasterScrollySection` progress calculation.
- Use champagne gold only for primary actions and key mechanical details.
- Preserve the existing component prop interfaces and modal entry points.
- Do not add dependencies.
- Verify with `node --test tests/sticky-scroll-layout.test.mjs`, `npm run lint`, and `npm run build`.

---

### Task 1: Establish restrained shared visual utilities

**Files:**
- Modify: `src/app/globals.css`
- Test: `tests/luxury-ui-style.test.mjs`

**Interfaces:**
- Produces: `.panel-luxury`, `.eyebrow-luxury`, `.btn-gold-luxury`, and revised heading/navigation styles for use by page sections.

- [ ] **Step 1: Write the failing test**

```js
test("luxury utility styles avoid decorative glow and preserve a neutral panel", async () => {
  const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.panel-luxury/);
  assert.match(css, /border: 1px solid rgba\(255, 255, 255, 0\.1\)/);
  assert.doesNotMatch(css, /\.glass-card-active[\s\S]*0 0 30px/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/luxury-ui-style.test.mjs`

Expected: FAIL because `.panel-luxury` does not yet exist.

- [ ] **Step 3: Write minimal implementation**

```css
.panel-luxury {
  background: rgba(18, 18, 18, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}
```

Reduce the heading glow, make the primary button solid gold with a small hover lift, and add a quiet uppercase eyebrow utility.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/luxury-ui-style.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css tests/luxury-ui-style.test.mjs
git commit -m "style: refine luxury visual system"
```

### Task 2: Simplify the navigation chrome

**Files:**
- Modify: `src/components/ui/Navbar.tsx`
- Test: `tests/luxury-ui-style.test.mjs`

**Interfaces:**
- Consumes: `onOpenCommission(): void`, `onOpenMechanism(): void`.
- Produces: The existing fixed header with unchanged navigation and CTA behaviors.

- [ ] **Step 1: Write the failing test**

```js
test("navigation uses a single primary call to action and no animated wordmark ornament", async () => {
  const source = await readFile(new URL("../src/components/ui/Navbar.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /animate-pulse/);
  assert.match(source, /bg-\[\#d4af37\]/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/luxury-ui-style.test.mjs`

Expected: FAIL because the current wordmark dot pulses and the CTA is an outlined gradient.

- [ ] **Step 3: Write minimal implementation**

Remove the pulsing gold dot and the secondary Sandbox button. Use a simple TIMELUX wordmark, quiet sentence-case navigation labels, and a single compact gold Commission CTA.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/luxury-ui-style.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Navbar.tsx tests/luxury-ui-style.test.mjs
git commit -m "style: simplify navigation chrome"
```

### Task 3: Reduce scrollytelling overlay density

**Files:**
- Modify: `src/components/sections/MasterScrollySection.tsx`
- Test: `tests/luxury-ui-style.test.mjs`

**Interfaces:**
- Consumes: `onOpenMechanism(): void`, `onOpenCommission(): void`, and `scrollProgress: number` internal state.
- Produces: The same four scroll beats and CTA interactions with simplified overlay presentation.

- [ ] **Step 1: Write the failing test**

```js
test("scrollytelling avoids decorative animated controls", async () => {
  const source = await readFile(new URL("../src/components/sections/MasterScrollySection.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /animate-spin|animate-ping|animate-bounce/);
  assert.match(source, /panel-luxury/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/luxury-ui-style.test.mjs`

Expected: FAIL because the current overlays use decorative animated icon and indicator classes.

- [ ] **Step 3: Write minimal implementation**

Replace dense stage pills, metric grids, icon-driven labels, gold-glow panels, and the bottom telemetry chip with text-first editorial overlays. Keep the same copy hierarchy, frame progress mapping, and two existing CTA callbacks.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/luxury-ui-style.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/MasterScrollySection.tsx tests/luxury-ui-style.test.mjs
git commit -m "style: simplify scrollytelling overlays"
```

### Task 4: Recompose normal-scroll content sections

**Files:**
- Modify: `src/components/sections/CollectionSection.tsx`
- Modify: `src/components/sections/CraftsmanshipSection.tsx`
- Test: `tests/luxury-ui-style.test.mjs`

**Interfaces:**
- Consumes: `onSelectModel(modelName: string): void` and `onOpenCommission(): void`.
- Produces: Existing model selection and commission modal triggers with calmer card and CTA presentation.

- [ ] **Step 1: Write the failing test**

```js
test("normal-scroll sections use the shared quiet panel treatment", async () => {
  const collection = await readFile(new URL("../src/components/sections/CollectionSection.tsx", import.meta.url), "utf8");
  const craftsmanship = await readFile(new URL("../src/components/sections/CraftsmanshipSection.tsx", import.meta.url), "utf8");
  assert.match(collection, /panel-luxury/);
  assert.match(craftsmanship, /panel-luxury/);
  assert.doesNotMatch(collection, /-translate-y-2/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/luxury-ui-style.test.mjs`

Expected: FAIL because the current collection cards use conspicuous lift and custom glass treatments.

- [ ] **Step 3: Write minimal implementation**

Use the shared panel utility, remove decorative reference pills and redundant icons, reduce card elevation on hover, and retain the existing model-hover canvas target plus model-selection action. Make the final section a concise editorial statement with neutral comparison panels and one gold CTA.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/luxury-ui-style.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/CollectionSection.tsx src/components/sections/CraftsmanshipSection.tsx tests/luxury-ui-style.test.mjs
git commit -m "style: refine collection and craftsmanship"
```

### Task 5: Verify the premium visual pass

**Files:**
- Test: `tests/sticky-scroll-layout.test.mjs`
- Test: `tests/luxury-ui-style.test.mjs`

**Interfaces:**
- Consumes: completed visual changes and existing local Next.js server.
- Produces: verified home route with an intact sticky canvas and working CTA entry points.

- [ ] **Step 1: Run focused regression tests**

Run: `node --test tests/sticky-scroll-layout.test.mjs tests/luxury-ui-style.test.mjs`

Expected: PASS with no failures.

- [ ] **Step 2: Run quality checks**

Run: `npm run lint && npm run build`

Expected: build succeeds; report any existing lint findings separately.

- [ ] **Step 3: Verify the local home page**

Run: `curl -I http://127.0.0.1:3000/`

Expected: `HTTP/1.1 200 OK`.

- [ ] **Step 4: Inspect the final diff**

Run: `git diff --check && git diff -- src/app/globals.css src/components/ui/Navbar.tsx src/components/sections/MasterScrollySection.tsx src/components/sections/CollectionSection.tsx src/components/sections/CraftsmanshipSection.tsx`

Expected: no whitespace errors; changes limited to the approved visual system.
