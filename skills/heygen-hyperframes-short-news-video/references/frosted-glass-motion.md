# Frosted Glass Motion Style

Use this reference whenever a short news video needs polished light-theme AI
motion graphics. This is the house look captured from the `mcp-servers`
reference and refined in `videos/anthropic-report-ai-builds-itself`.

## Visual Recipe

- Use a light pastel tech canvas, not a dark dashboard: pale blue base,
  white haze, subtle orange/pink accent blooms, and thin blue/pink/orange
  circuit lines.
- Cards must look like real frosted glass: translucent layered fill,
  radial color blooms inside the card, visible white rim, inner highlight,
  backdrop blur/saturation, and a soft depth shadow.
- Keep text large and high contrast. Use `Archivo Black` or a similar heavy
  display face for titles, `IBM Plex Mono` or Consolas for technical labels.
- Use 8px radii for UI cards unless the scene is a video/avatar frame.
- Put content above gloss pseudo-elements with `isolation: isolate`,
  pseudo-element `z-index: 0`, and child content `z-index: 2`.
- Favor connected diagrams, graph callouts, source-page zooms, and clear
  comparative labels over empty decorative boxes.

## CSS Sample

```css
#root {
  background:
    radial-gradient(ellipse at 18% 8%, rgba(30, 139, 255, 0.22), transparent 34%),
    radial-gradient(ellipse at 86% 16%, rgba(255, 79, 163, 0.18), transparent 32%),
    radial-gradient(ellipse at 50% 95%, rgba(255, 157, 46, 0.14), transparent 36%),
    linear-gradient(145deg, #f8fcff 0%, #eaf5ff 44%, #fff7ef 100%);
  perspective: 1800px;
}

#root::before {
  content: "";
  position: absolute;
  inset: -220px;
  background:
    linear-gradient(90deg, rgba(30, 139, 255, 0.12) 1px, transparent 1px),
    linear-gradient(0deg, rgba(16, 24, 39, 0.07) 1px, transparent 1px),
    linear-gradient(60deg, transparent 0 48%, rgba(30, 139, 255, 0.12) 48% 49%, transparent 49% 100%),
    linear-gradient(120deg, transparent 0 58%, rgba(255, 79, 163, 0.1) 58% 59%, transparent 59% 100%);
  background-size: 74px 74px, 74px 74px, 460px 460px, 540px 540px;
  transform: rotate(-9deg);
  opacity: 0.78;
}

.glass {
  position: relative;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.92);
  background:
    radial-gradient(circle at 14% 18%, rgba(30, 139, 255, 0.25), transparent 34%),
    radial-gradient(circle at 88% 8%, rgba(255, 79, 163, 0.2), transparent 28%),
    radial-gradient(circle at 50% 110%, rgba(255, 157, 46, 0.16), transparent 34%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.24)),
    rgba(177, 220, 255, 0.34);
  box-shadow:
    0 42px 112px rgba(18, 92, 170, 0.2),
    0 0 74px rgba(30, 139, 255, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.74),
    inset 0 -24px 52px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(34px) saturate(1.48);
  -webkit-backdrop-filter: blur(34px) saturate(1.48);
  overflow: hidden;
  isolation: isolate;
  transform-style: preserve-3d;
}

.glass::before,
.glass::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
}

.glass::before {
  background:
    linear-gradient(130deg, rgba(255, 255, 255, 0.52), transparent 28%),
    linear-gradient(300deg, rgba(255, 255, 255, 0.18), transparent 42%);
  mix-blend-mode: screen;
}

.glass::after {
  inset: 9px;
  border: 1px solid rgba(255, 255, 255, 0.48);
  opacity: 0.64;
}

.glass > * {
  position: relative;
  z-index: 2;
}
```

## Motion Sample

```js
function exitGlass(selector, at, vars) {
  if (document.querySelector(selector)) {
    tl.to(
      selector,
      Object.assign(
        {
          y: -72,
          opacity: 0,
          scale: 0.94,
          rotateX: -14,
          duration: 0.46,
          stagger: 0.05,
          ease: "power3.in",
        },
        vars || {},
      ),
      at,
    );
  }
}

tl.from(
  ".glass-card",
  {
    x: -92,
    y: 86,
    z: -220,
    opacity: 0,
    scale: 0.86,
    rotateY: -28,
    duration: 0.64,
    stagger: 0.14,
    ease: "back.out(1.65)",
  },
  sceneStart + 0.5,
);

tl.to(
  ".glass-card",
  { y: -18, duration: 1.0, repeat: 9, yoyo: true, stagger: 0.15, ease: "sine.inOut" },
  sceneStart + 3.2,
);
```

## Review Checklist

- Cards read as glossy/frosted in snapshots, not flat white boxes.
- Captions are transparent text-only unless the user asks for caption boxes.
- Line height is generous enough for phone viewing.
- Source website B-roll fills the background when it is the evidence layer.
- PiP avoids captions and major callouts.
- Full talking-head moments are large rounded windows, not edge-to-edge video.
- Graphs and diagrams use big labels and arrows; never leave mostly empty boxes.
