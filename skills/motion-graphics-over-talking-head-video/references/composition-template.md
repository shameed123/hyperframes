# Composition Template — Overlays Over a Talking-Head Video

This is the canonical `index.html` pattern, distilled from `videos/glm-5.2/`.
It is a **standalone** composition (no `<template>` wrapper). Adapt the scenes,
palette, and timing; keep the structure.

## 1. Root + background video + audio

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      /* ...styles below... */
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="my-slug"
      data-start="0"
      data-duration="130.8"            <!-- REQUIRED: inspect needs this -->
      data-width="1080"
      data-height="1920"
      data-layout-allow-occlusion       <!-- overlays over video are intentional -->
    >
      <!-- Background talking-head video: muted, full-frame -->
      <video
        id="bg-video"
        class="clip"
        data-start="0"
        data-duration="130.8"
        data-track-index="0"
        src="resources/my-video.mp4"     <!-- NO spaces, NO %20 -->
        muted
        playsinline
      ></video>

      <!-- Audio from the SAME file, separate element -->
      <audio
        id="narration"
        class="clip"
        data-start="0"
        data-duration="130.8"
        data-track-index="1"
        data-volume="1"
        src="resources/my-video.mp4"
      ></audio>

      <!-- Optional full-frame intro image card (see §5) -->

      <!-- Scene divs (see §3) -->
    </div>
    <script>/* timeline (see §4) */</script>
  </body>
</html>
```

## 2. Styles — semi-transparent glass, top-anchored scenes

The two load-bearing ideas: scenes anchor to the **top** so they clip the head,
not the face; cards are **semi-transparent + blurred** so the face reads through.

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1080px; height: 1920px; overflow: hidden; background: #05060c;
  font-family: "Segoe UI", Helvetica, Arial, sans-serif; }
/* perspective on the root makes the z/rotateX/rotateY fly-ins read as real 3D */
#root { position: relative; width: 1080px; height: 1920px; overflow: hidden;
  background: #05060c; perspective: 1800px; }

/* Full-frame background video */
#bg-video { position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: center center; z-index: 1; }

/* Overlay stage: anchored near the TOP edge so cards clip the top of the head.
   ~60px from the top reads well; tune 40–80px to taste. Graphics come and go,
   so the face is fully visible between beats. preserve-3d so children keep depth. */
.scene {
  position: absolute; inset: 0; z-index: 6;
  display: flex; flex-direction: column; align-items: center;
  justify-content: flex-start;          /* TOP-anchored, not center */
  gap: 24px; padding: 60px 56px 0;       /* 60px top inset */
  opacity: 0; visibility: hidden; pointer-events: none; text-align: center;
  transform-style: preserve-3d;
}

/* Semi-transparent glass card — face shows through the blur */
.card {
  position: relative; width: 100%; max-width: 960px;
  border-radius: 28px; padding: 40px 44px;
  background: rgba(9, 12, 26, 0.5);     /* ~0.5 alpha, not opaque */
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 28px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
  backdrop-filter: blur(16px) saturate(1.35);
  -webkit-backdrop-filter: blur(16px) saturate(1.35);
  transform-style: preserve-3d; will-change: transform, opacity;
}
/* Accent variants add a colored border + outer glow (cyan/magenta/violet/green/amber). */

/* Big stat numbers need breathing room or the inspector flags content_overlap
   (the large line-box bleeds into the label above/below). */
.stat-huge { font-size: 150px; font-weight: 900; line-height: 1.06;
  font-variant-numeric: tabular-nums; margin: 18px 0 10px; }
```

White text on dark glass clears WCAG easily. Keep accent hexes consistent
across all scenes.

## 3. Scene divs

Each scene is a plain div with an id; its direct children are the animated
units. Position content with the flex container + padding, not absolute offsets.

```html
<div id="sc-context" class="scene">
  <div class="card card-cyan">
    <div class="kicker">Context Window</div>
    <div class="stat-huge grad">1M</div>
    <div class="stat-label">tokens</div>
  </div>
</div>
```

## 4. Timeline — scene gates + come-and-go helper

```js
const S = {
  context: [3.5, 11.6],
  frontier: [12.2, 20.2],
  // ...leave real gaps for excluded ranges (e.g. pricing) and for breathing room
};

const tl = gsap.timeline({ paused: true });

// Scene gates: show at start, hide at end
const scenes = [
  ["#sc-context", S.context],
  ["#sc-frontier", S.frontier],
];
for (const [sel, [start, end]] of scenes) {
  tl.set(sel, { opacity: 1, visibility: "visible" }, start);
  tl.set(sel, { opacity: 0, visibility: "hidden" }, end);
}

// EVERY component flies IN through 3D depth, holds, then flies OUT — this is
// required, not optional. The z + rotateY/rotateX + scale combo (with the
// root's perspective) makes cards swing in from off the canvas in 3D space,
// which reads far more premium than a flat fade/slide.
//
// `dir` alternates the entrance side per scene (+1 swings in from the right,
// -1 from the left) so consecutive beats don't feel repetitive.
// NOTE: using an exit on every scene is correct HERE and intentionally
// overrides the core skill's "no exits except final scene" rule.
function animateScene(sel, start, end, opts = {}) {
  const children = `${sel} > *`;
  const dir = opts.dir ?? 1;            // +1 from right, -1 from left
  // 3D fly-IN: from deep in z, rotated away, offset low — settles to flat.
  tl.from(children, {
    z: -650, y: 120, x: 90 * dir,
    rotateY: 32 * dir, rotateX: -16, scale: 0.82, opacity: 0,
    duration: 0.7, stagger: 0.14,
    ease: opts.inEase || "back.out(1.5)",
    overwrite: "auto", immediateRender: false,
  }, start);
  // 3D fly-OUT: punches toward the camera (+z) while tumbling off — reveals
  // the face again. Alternate the spin direction from the entrance.
  tl.to(children, {
    z: 420, y: -90, x: -70 * dir,
    rotateY: -26 * dir, rotateX: 14, scale: 1.06, opacity: 0,
    duration: 0.5, stagger: 0.1,
    ease: "power2.in", overwrite: "auto", immediateRender: false,
  }, end - 0.56);
}
animateScene("#sc-context", S.context[0], S.context[1], { inEase: "power3.out", dir: 1 });
animateScene("#sc-frontier", S.frontier[0], S.frontier[1], { inEase: "expo.out", dir: -1 });

// Vary eases AND the `dir` flag across scenes; add per-scene 3D flourishes
// (bar scaleX, SVG check strokeDashoffset, a slow rotateY idle float on the
// held card, etc.) as separate tweens with immediateRender:false. Use FINITE
// repeats only (never repeat:-1) for any idle float.

window.__timelines = window.__timelines || {};
window.__timelines["my-slug"] = tl;
```

Notes:
- `overwrite: "auto"` on the entrance/exit pair silences the
  `overlapping_gsap_tweens` lint warning (same selector, both touch y/opacity/scale).
- `immediateRender: false` on every `.from()`/`.to()` so start states don't
  apply at t=0.
- Animated bars: `tl.from(".fill", { scaleX: 0, transformOrigin: "left center", ... })`.

## 5. Optional full-frame intro image card

A static image flashed full-frame for a short window (e.g. a thumbnail/poster
for the first 0.5s). It IS a timed clip:

```html
<img
  id="intro-card"
  class="clip"
  data-start="0"
  data-duration="0.5"
  data-track-index="3"
  src="resources/intro-card.png"        <!-- NO spaces; match frame aspect ratio -->
  style="position:absolute; inset:0; width:100%; height:100%;
         object-fit:cover; z-index:20;"
/>
```

Match the image aspect ratio to the frame (941x1672 ≈ 1080x1920) so
`object-fit: cover` doesn't crop meaningfully. If the user pastes an image,
it often lands in `~/Downloads` or a temp dir — find the most recent
png/jpg, then copy it into `resources/` with a space-free name.
