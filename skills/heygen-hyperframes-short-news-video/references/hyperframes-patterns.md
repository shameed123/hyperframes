# HyperFrames Patterns

## Avatar Audio And Video

Use the HeyGen MP4 once as narration audio, then use muted video clips for the
visible avatar. This keeps audio continuous while avatar placement can switch
between PIP and feature layouts.

```html
<audio
  id="narration"
  class="clip"
  data-start="0"
  data-duration="93.66"
  data-track-index="1"
  data-volume="1"
  src="assets/avatar/heygen-avatar-16x9.mp4"
></audio>

<video
  id="avatar-pip-a"
  class="clip avatar-shot avatar-pip"
  data-start="8.1"
  data-duration="27"
  data-media-start="8.1"
  data-track-index="2"
  src="assets/avatar/heygen-avatar-16x9.mp4"
  muted
  playsinline
></video>
```

## Scene Gates

Default scenes hidden in CSS:

```css
.scene {
  inset: 0;
  z-index: 4;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform-style: preserve-3d;
}
```

Register visibility windows in the timeline:

```js
const sceneWindows = [
  ["#scene-intro", 0, 8.1],
  ["#scene-model", 8.1, 18],
];

for (const [selector, start, end] of sceneWindows) {
  tl.set(selector, { opacity: 1, visibility: "visible" }, start);
  tl.set(selector, { opacity: 0, visibility: "hidden" }, end);
}

window.__timelines = window.__timelines || {};
window.__timelines["<composition-id>"] = tl;
```

This avoids all scenes appearing in snapshots or render frames.

## Transition Gotcha

For `fromTo()` transition bands near future timestamps, use
`immediateRender: false` to prevent transition elements from appearing too
early.

```js
tl.fromTo(
  "#tr-web .wipe-band",
  { x: -1200, rotateZ: -10 },
  { x: 1200, rotateZ: 10, duration: 0.56, ease: "power3.inOut", immediateRender: false },
  68.37,
);
```

## Avatar Cropping To Remove White Stripes

HeyGen Avatar III outputs can contain white side stripes when the full 16:9
source is shown. Use `object-fit: cover` and make the display frame a little
narrower/taller than 16:9 so the sides crop away.

```css
.avatar-shot,
video.avatar-shot {
  object-fit: cover;
  object-position: center center;
}

.avatar-feature-web {
  left: 210px;
  bottom: 204px;
  width: 660px;
  height: 460px;
}
```

If the frame is exactly 16:9, the full source is visible and the side stripes
may come back.

## Render-Stable Avatar Shadow

Do not rely only on `box-shadow` directly on a `<video>` element. Preview may
show it, but render capture can composite video layers differently. Use both
`box-shadow` and `filter: drop-shadow(...)`.

```css
.avatar-shot {
  z-index: 18;
  overflow: hidden;
  background: #ffffff;
  box-shadow:
    0 52px 128px rgba(21, 22, 31, 0.46),
    0 0 62px rgba(36, 88, 255, 0.24);
  filter: drop-shadow(0 44px 54px rgba(21, 22, 31, 0.44))
    drop-shadow(0 0 38px rgba(36, 88, 255, 0.22));
  transform-style: preserve-3d;
  will-change: transform, opacity;
}

.avatar-pip {
  border-radius: 22px;
  box-shadow:
    0 38px 92px rgba(21, 22, 31, 0.58),
    0 0 52px rgba(255, 58, 168, 0.22);
  filter: drop-shadow(0 32px 42px rgba(21, 22, 31, 0.52))
    drop-shadow(0 0 34px rgba(255, 58, 168, 0.2));
}
```

If the render shadow still looks weak, increase the alpha in the
`drop-shadow()` values first.

## Rounded Avatar Corners

Round every avatar placement individually:

```css
.avatar-pip {
  border-radius: 22px;
}

.avatar-feature-top,
.avatar-feature-side,
.avatar-feature-web {
  border-radius: 24px;
}

.avatar-cta {
  border-radius: 28px;
}
```

Keep `overflow: hidden` on `.avatar-shot` so the video itself clips to the
rounded corners.

## Opening Thumbnail Overlay

Write `videos/<slug>/thumbnail-prompt.md` first, using the exact headline and
secondary text that should be baked into the image. Then generate a
project-bound 9:16 image and save it under `assets/thumbnail/`.
Use only one `<img>` element to avoid duplicate media discovery warnings. If
you need a blurred fill, prefer CSS `background-image` on a pseudo-element.
When the user asks to put the thumbnail at the front of the video, use this
half-second overlay pattern and keep the existing SRT-based timestamps in place.

```css
.thumbnail-overlay {
  inset: 0;
  z-index: 80;
  overflow: hidden;
  background: #fbfaf7;
  transform-style: preserve-3d;
}

.thumbnail-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("assets/thumbnail/google-io-2026-thumbnail.png");
  background-position: center;
  background-size: cover;
  filter: blur(34px) saturate(1.18);
  transform: scale(1.16);
  opacity: 0.62;
}

.thumb-hero {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 34px 82px rgba(21, 22, 31, 0.22));
}
```

Half-second opening flash:

```html
<div
  id="opening-thumbnail"
  class="clip thumbnail-overlay"
  data-start="0"
  data-duration="0.5"
  data-track-index="40"
>
  <img
    class="thumb-hero"
    src="assets/thumbnail/google-io-2026-thumbnail.png"
    alt="Video thumbnail"
    draggable="false"
  />
</div>
```

```js
tl.to("#opening-thumbnail", { opacity: 0, scale: 0.94, duration: 0.5, ease: "power2.inOut" }, 0);
```

Start at full opacity. Do not animate in if the user wants the first frame to
be the full thumbnail.

## Reusable SFX Clips

Use deterministic `<audio>` clips for motion-graphics SFX. Do not trigger
sounds from JavaScript. Keep the shared source pack in `videos/_shared/sfx`,
copy it into each project as `assets/sfx`, and reference the project-local
files from HTML.

Copy command:

```powershell
New-Item -ItemType Directory -Force videos\<slug>\assets\sfx | Out-Null
Copy-Item -Force videos\_shared\sfx\*.wav videos\<slug>\assets\sfx\
```

Example timed clips:

```html
<audio
  id="sfx-scene-whoosh"
  class="clip"
  data-start="12.3"
  data-duration="0.55"
  data-track-index="40"
  data-volume="0.4"
  src="assets/sfx/whoosh-soft.wav"
></audio>

<audio
  id="sfx-reveal-ping"
  class="clip"
  data-start="12.72"
  data-duration="0.28"
  data-track-index="41"
  data-volume="0.5"
  src="assets/sfx/ping-soft.wav"
></audio>
```

Track convention:

- Track `40`: scene-transition whooshes.
- Track `41`: ping/chime reveals.
- Track `42`: pops/stamps/badges.
- Track `43`: lower pongs/secondary confirms.
- Track `44+`: clicks or special one-off sounds.

Timing convention:

- Put `whoosh-soft.wav` 30-80ms before a scene start or wipe.
- Put `ping-soft.wav` 200-600ms after a scene starts, where the key card or
  term becomes readable.
- Use `pop-soft.wav` for small objects like tokens, alert stamps, and badges.
- Use `chime-soft.wav` on the hook and CTA only.
- Keep all SFX below the avatar narration. Start with `data-volume="0.35"` to
  `0.6` and review the rendered MP4, not only Studio preview.

## Website B-Roll Placement

When a story has a source article, product page, map, or demo, use captured
website footage as a primary visual layer. Source B-roll should be large,
legible, and scene-specific.

For article/blog source footage, use a full-page mobile screenshot inside a
large phone frame and animate the page itself:

```html
<div
  class="phone"
  style="left: 126px; top: 512px; width: 820px; height: 1376px; transform: rotate(2.5deg)"
>
  <div class="phone-screen">
    <img
      id="source-mobile-page"
      class="phone-page"
      src="assets/motion/mobile/source-mobile-full.png"
      alt="Source website mobile page"
    />
  </div>
  <div class="scroll-indicator"><div class="scroll-thumb"></div></div>
</div>
```

```js
tl.to("#source-mobile-page", { y: -4700, duration: 8.4, ease: "power2.inOut" }, 22.7);
```

For recorded source footage, use a muted video clip and keep it project-bound:

```html
<video
  id="source-scroll-video"
  class="clip broll-video"
  data-start="22.7"
  data-duration="8.4"
  data-track-index="6"
  src="assets/motion/broll/source-scroll.mp4"
  muted
  playsinline
></video>
```

For map, Street View, or real-world grounding stories, use a real map/satellite
capture or a local map-card asset derived from that capture. Avoid generic grid
or graph-paper panels unless they are only a subtle background texture.

Use fast, readable source motion:

- Long mobile article page: 8-12 second scroll.
- Short page or hero-only source: 3-6 second pan/scale.
- Map/landmark card: slow `x`/`y` drift plus slight rotation, not a full spin.

Snapshot every source B-roll scene and check that captions/avatar windows do not
cover the page headline, landmark, or product UI.
