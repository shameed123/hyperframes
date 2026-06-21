# Frosted Glass Motion Style

Use this reference whenever a short news video needs polished light-theme AI
motion graphics. This is the house look captured from the `mcp-servers`
reference and refined in `videos/anthropic-report-ai-builds-itself`.

## Visual Recipe

- Use a light pastel tech canvas, not a dark dashboard: pale blue base,
  white haze, subtle orange/pink accent blooms.
- Background must read as **high-tech AI**: an SVG circuit-board layer with
  AI chips (square dies with pins), traces/routes branching across the frame,
  and junction nodes, drawn in the same blue/pink/orange palette. Keep it
  faint and low-contrast (layer `opacity` ~0.5, per-shape stroke/fill opacity
  ~0.4–0.55) so it stays a background and never competes with the glass cards
  or the avatar. Do NOT use a plain diagonal grid — use the circuit/chip layer.
  Tile the SVG (`background-size` ~620px) and underlay a very faint PCB dot
  grid for texture. See the `#root::before` CSS sample below.
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

/* circuit-board / AI-chip layer — kept faint so it stays in the background.
   The SVG tile carries traces, junction nodes, and two chips; the radial
   gradient underlays a faint PCB dot grid. Encode every `#` as `%23`. */
#root::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='620' height='620' viewBox='0 0 620 620'><g fill='none' stroke-width='2'><g stroke='%231e8bff' stroke-opacity='0.5'><path d='M0 80H120V210H280'/><path d='M310 0V92H430V44'/><path d='M620 150H470V310'/><path d='M80 620V480H210V370'/><path d='M560 620V520H620'/></g><g stroke='%23ff4fa3' stroke-opacity='0.42'><path d='M0 330H170V430'/><path d='M620 390H510V530H390'/><path d='M230 620V530H350V450'/><path d='M370 124H530'/></g><g stroke='%23ff9d2e' stroke-opacity='0.42'><path d='M0 535H104V620'/><path d='M452 0V62H620'/><path d='M268 310H368V206'/></g></g><g fill='%231e8bff' fill-opacity='0.5'><circle cx='120' cy='80' r='5'/><circle cx='280' cy='210' r='5'/><circle cx='470' cy='150' r='5'/></g><g fill='%23ff4fa3' fill-opacity='0.45'><circle cx='170' cy='430' r='5'/><circle cx='390' cy='530' r='5'/></g><g stroke='%231e8bff' stroke-opacity='0.48' fill='none' stroke-width='2'><rect x='112' y='252' width='66' height='66' rx='8'/><rect x='128' y='268' width='34' height='34' rx='3'/><path d='M112 268H100M112 285H100M112 302H100M178 268H190M178 285H190M178 302H190M128 252V240M145 252V240M162 252V240M128 318V330M145 318V330M162 318V330'/></g><g stroke='%23ff4fa3' stroke-opacity='0.4' fill='none' stroke-width='2'><rect x='446' y='402' width='66' height='66' rx='8'/><rect x='462' y='418' width='34' height='34' rx='3'/><path d='M446 418H434M446 435H434M446 452H434M512 418H524M512 435H524M512 452H524M462 402V390M479 402V390M496 402V390M462 468V480M479 468V480M496 468V480'/></g></svg>"),
    radial-gradient(rgba(30, 139, 255, 0.05) 1.4px, transparent 1.5px);
  background-size: 620px 620px, 48px 48px;
  background-repeat: repeat, repeat;
  opacity: 0.55;
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

## Card Positioning (take special care)

Sloppy card placement is the most common defect. Treat layout as deliberate,
not "drop a card wherever there's room." For a 1080×1920 frame:

- **Never let cards overlap each other.** Two cards touching or stacking on
  top of one another is always a bug. After placing absolutely-positioned
  cards, measure each card's real rendered height and confirm a clear gap
  (~16–24px) between consecutive cards. Card heights vary with their text, so
  do not eyeball it — measure. A quick way: load the composition in headless
  Chrome, force every `.scene` to `opacity:1; visibility:visible`, clear each
  card's transform, and read `getBoundingClientRect()` for each card id, then
  set `top` values from the measured `top`/`bottom`/`height`.
- **Do not cover anything important.** Cards must not sit over the PiP avatar,
  over a scene's headline/title card, or over the focal area of B-roll the
  viewer is meant to read. Keep the title card in its own band at the top and
  push secondary cards into the lower third, ending above the avatar. With the
  standard PiP (`bottom: 90px`, `height: 404px`) the avatar's top edge is at
  `y ≈ 1426`, so every secondary card must finish by ~1410.
- **Distribute cards to balance the frame.** Spread the stack so there are no
  large unbalanced empty gaps and no crowded clusters. Compute the total height
  of the card stack plus inter-card gaps, then position it so the group fills
  its band evenly (e.g. center it in the available zone or anchor the last card
  just above the avatar and step upward with equal gaps). A title pinned at top
  with all detail cards jammed at the very bottom leaving a dead middle is
  unbalanced — either let the B-roll/phone fill the middle intentionally, or
  space the cards to occupy the band.
- **Re-measure after any text or font change**, since card heights shift and a
  previously-clean gap can turn into an overlap.

## Review Checklist

- Cards read as glossy/frosted in snapshots, not flat white boxes.
- No two cards overlap; every adjacent pair has a visible gap (verified by
  measuring rendered heights, not by eye).
- No card covers the PiP avatar, the scene title, or the key B-roll content.
- Cards are distributed to balance the frame — no large dead empty zones and
  no crowded clusters.
- Background reads as a faint AI circuit/chip layer, not a plain grid, and
  stays subtle behind the cards and avatar.
- Captions are transparent text-only unless the user asks for caption boxes.
- Line height is generous enough for phone viewing.
- Source website B-roll fills the background when it is the evidence layer.
- PiP avoids captions and major callouts.
- Full talking-head moments are large rounded windows, not edge-to-edge video.
- Graphs and diagrams use big labels and arrows; never leave mostly empty boxes.
