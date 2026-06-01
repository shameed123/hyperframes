# Composition Patterns

## Horizontal Slide inside a Vertical Canvas

Use horizontal slide assets at their native logical size:

```css
.slide-canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  transform-origin: 0 0;
  will-change: transform;
}

.slide-canvas img {
  display: block;
  width: 1920px;
  height: 1080px;
}
```

Animate the `.slide-canvas` wrapper, not the `<img>`.

## Initial Full-Height Scan

Start by covering the entire vertical height:

```js
tl.set("#slide-1-canvas", { x: 0, y: 0, scale: 1.78 }, 0);
tl.to("#slide-1-canvas", {
  x: -2338,
  duration: 4.16,
  ease: "power1.inOut",
}, 0.18);
```

For arbitrary dimensions:

```text
coverScale = verticalCanvasHeight / slideHeight
endX = verticalCanvasWidth - slideWidth * coverScale
```

Use a slow, readable horizontal scan, then settle into an overview state. The
direction may reverse if the slide narrative begins on the right.

## True Full-Slide Overview

After the opening scan and after each detail walkthrough, show the complete
horizontal slide. Do not crop the left or right edges in an overview state.

For arbitrary dimensions:

```text
fitScale = min(verticalCanvasWidth / slideWidth, availableOverviewHeight / slideHeight)
fitX = (verticalCanvasWidth - slideWidth * fitScale) / 2
```

For a `1920x1080` slide inside a `1080x1920` composition, keep overview scale at
or below `0.5625`. A slightly inset default is:

```js
tl.to("#slide-canvas", {
  x: 12,
  y: 248,
  scale: 0.55,
  duration: 1.25,
  ease: "power2.inOut",
}, 4.6);
```

This produces a `1056px`-wide slide with `12px` margins on both sides. Use
larger scales only for intentional teaching close-ups.

## Teaching Camera

Use SRT timing to move between:

- full-slide overview;
- first important region;
- second region;
- third region;
- recap overview;
- second slide;
- second-slide detail regions;
- recap overview;
- CTA.

Let viewers read each region. Avoid continuous camera motion.

## Underline and Focus Guidance

Keep highlights translucent. Place a title underline below the visible title
baseline rather than across the letters.

Do not assume one underline transform works for every overview. The same slide
can have different `y` positions during an early overview and a recap overview,
and the second slide can need a different `x`, `y`, and `width`. Snapshot each
underline hero frame after any camera change and tune each state independently:

```js
tl.fromTo("#marker-line", {
  opacity: 0,
  scaleX: 0,
  x: 0,
  y: -1128,
  width: 750,
}, {
  opacity: 1,
  scaleX: 1,
  x: 0,
  y: -1128,
  width: 750,
  duration: 0.62,
  ease: "power2.out",
}, 5.4);
```

Use:

- orange underline for key title moments;
- translucent focus rectangle around a diagram region;
- cursor entrance with a short `back.out(...)` ease;
- cursor moves only when the narration names the target.

## Avatar Frame

Use one wrapper around a continuously available muted avatar video:

```css
.avatar-frame {
  position: absolute;
  right: 44px;
  bottom: 70px;
  width: 330px;
  height: 388px;
  overflow: hidden;
  border-radius: 28px;
  transform-origin: right bottom;
  transform-style: preserve-3d;
  will-change: transform;
}

.avatar-frame video {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 580px;
  height: 388px;
  object-fit: cover;
  transform: translate(-50%, -50%) scale(1.14);
  will-change: transform;
}
```

Default states:

| State | Wrapper width | Wrapper height | Inner video `y` |
| --- | ---: | ---: | ---: |
| Compact portrait | `330` | `388` | `0` |
| Wide overview | `540-560` | `330` | `20-28` |

Shift the inner video down in wide states. This removes a little chest and
creates breathing room above the head without changing compact framing:

```js
tl.to(".avatar-frame", {
  width: 560,
  height: 330,
  duration: 0.76,
  ease: "power2.inOut",
}, 4.92);
tl.to("#avatar-video", {
  y: 24,
  duration: 0.76,
  ease: "power2.inOut",
}, 4.92);
```

Reverse both values when returning to compact portrait.

Add restrained presenter motion:

```js
tl.to(".avatar-frame", {
  y: -10,
  duration: 2.1,
  repeat: 42,
  yoyo: true,
  ease: "sine.inOut",
}, 1);

tl.fromTo(".avatar-frame", {
  rotationY: -2.4,
}, {
  rotationY: 2.4,
  duration: 3.8,
  repeat: 22,
  yoyo: true,
  ease: "sine.inOut",
}, 1);
```

Calculate finite repeat counts to cover the composition. Never use
`repeat: -1`. Keep the label above the panel and use `AI Instructor`.

## Captions without a Capsule

Use no background panel on the caption stage:

```css
.caption-stage {
  position: absolute;
  left: 82px;
  right: 82px;
  bottom: 520px;
  z-index: 45;
  min-height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.caption-group {
  position: absolute;
  inset: 10px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
  color: #ffffff;
  font-size: 34px;
  font-weight: 800;
  text-transform: uppercase;
  -webkit-text-stroke: 2px rgba(47, 55, 68, 0.92);
  paint-order: stroke fill;
  text-shadow: 0 3px 2px rgba(15, 23, 42, 0.4);
}

.caption-word.active {
  padding: 4px 7px;
  border-radius: 8px;
  background: rgba(37, 99, 235, 0.24);
  color: #3b82f6;
  -webkit-text-stroke: 0 transparent;
  text-shadow: none;
}
```

Use `tl.set()` to reveal phrase groups and toggle the active word class at
word-level timestamps.

## AI-Tech Background

Replace generic circles with a quiet lower-canvas SVG backdrop:

- pale circuit grid;
- blue, pink, and orange traces;
- rounded nodes;
- a small chip or neural-core motif;
- slow node pulses;
- slight cluster drift.

Keep it behind slides and the presenter. Use an off-white canvas and modest
opacity. Do not add dark neon, busy particle fields, glitching, or constant
motion.

Use deterministic finite GSAP tweens:

```js
tl.to(".tech-grid", {
  y: -44,
  duration: 7.8,
  repeat: 11,
  yoyo: true,
  ease: "sine.inOut",
}, 0);

tl.fromTo(".tech-pulse", {
  opacity: 0.16,
  scale: 0.8,
}, {
  opacity: 0.54,
  scale: 1.18,
  duration: 2.8,
  repeat: 31,
  yoyo: true,
  ease: "sine.inOut",
}, 0);
```

## Thumbnail Overlay

Use a generated raster image:

```html
<section id="thumbnail-card" class="thumbnail-card">
  <img src="assets/thumbnails/<slug>-generated.png" alt="<topic>" />
</section>
```

Fade around `0.46s`, then disable after the fade:

```js
tl.to("#thumbnail-card", {
  opacity: 0,
  duration: 0.12,
  ease: "power1.out",
}, 0.46);
tl.set("#thumbnail-card", { display: "none" }, 0.58);
```

## CTA Card

Use a light course card with:

```text
Free AI terminology course
Understand AI without the jargon.
Training, inference, tokens, prompts, AI agents, APIs, ChatGPT, coding agents, and more
Description
Bio
Pinned comment
Subscribe
Follow
Like
```

Keep `Subscribe`, `Follow`, `Like` in that exact order. Animate the card, list
items, route pills, then engagement prompts.

During the CTA, enlarge the presenter close to the maximum canvas width and
lift captions into the clear band between the course card and the avatar:

```js
tl.to(".avatar-frame", {
  width: 960,
  height: 450,
  duration: 0.72,
  ease: "power2.inOut",
}, 74.62);
tl.to("#avatar-video", {
  y: 34,
  scale: 1.68,
  duration: 0.72,
  ease: "power2.inOut",
}, 74.62);
tl.to("#caption-stage", {
  bottom: 554,
  duration: 0.72,
  ease: "power2.inOut",
}, 74.62);
```

Use margins appropriate to the canvas and verify that captions stay clear of
both the course card and the enlarged presenter.
