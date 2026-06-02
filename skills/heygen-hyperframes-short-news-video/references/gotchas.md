# Gotchas And Fixes

## PowerShell Blocks `npx.ps1`

Use the built checkout CLI wrapper for HyperFrames commands:

```powershell
node scripts\run-hyperframes.mjs lint videos\google-io-2026-update
```

Do not use `npx.cmd --no-install hyperframes ...` in this monorepo. A built
checkout can still lack a root `node_modules\.bin\hyperframes.CMD` shim, causing
`npx` to search for an external package instead of using
`packages\cli\dist\cli.js`.

## Format With `oxfmt.CMD`

Use the repo-local formatter for changed HTML:

```powershell
node_modules\.bin\oxfmt.CMD videos\google-io-2026-update\index.html
```

## Root `.env`, Not Per-Video `.env`

The project root `.env` applies to future videos. Do not place `.env` or
`.env.example` inside individual video folders unless explicitly asked.

Keep per-video choices like aspect ratio, dimensions, and slug in code or
metadata, not `.env`.

## Avatar III HeyGen Endpoint

Avatar III generation used HeyGen v2:

```text
POST https://api.heygen.com/v2/video/generate
```

Status polling used:

```text
GET https://api.heygen.com/v1/video_status.get
```

## White Side Stripes On Avatar Video

Cause: full 16:9 HeyGen video is being displayed uncropped.

Fix:

- Use `object-fit: cover`.
- Use a display box that is not exactly 16:9.
- Keep `object-position: center center`.
- Verify with snapshots where the avatar is large, especially the intro and
  Chrome/smart-glasses section.

## Avatar Overlaps Text

Fix the layout, not just the animation:

- Move the static avatar CSS position lower or smaller.
- Move its `stage-label` with it.
- Snapshot the exact affected timestamp.

Example from the intro fix:

```css
.avatar-feature-top {
  left: 230px;
  top: 1234px;
  width: 620px;
  height: 430px;
}
```

## Render Missing Avatar Shadow

Cause: `box-shadow` directly on `<video>` can be visible in Studio preview but
lost or weakened in rendered capture because the video layer is composited
differently.

Fix:

- Keep `box-shadow` for Studio parity.
- Add `filter: drop-shadow(...)` to the same avatar element.
- If render still looks lighter than Studio, darken the `drop-shadow` alpha
  first.

## Rounded Corners Not Visible

Requirements:

- The visible video element must have `border-radius`.
- The same element or wrapper must have `overflow: hidden`.
- Per-placement classes should set radius because PIP, feature, and CTA sizes
  need different values.

## Thumbnail Overlay Too Long

The first implementation used a 25-second overlay. The requested behavior was
only a `0.5s` opening flash. Set `data-duration="0.5"` and fade/zoom out from
time `0`.

## Duplicate Media Discovery Warning

Cause: using two `<img>` nodes with the same source/start/duration for a
thumbnail foreground and blurred background.

Fix: Use one real `<img>` and a CSS pseudo-element with `background-image` for
the blurred fill.

## Overlapping GSAP Tween Warning

Cause: animating the same property on the same selector during overlapping
time windows.

Fix:

- Move the second tween after the first ends.
- Or remove the unnecessary entrance tween.
- Or add `overwrite: "auto"` only if overlap is intentional.

## `--strict-all` Can Fail On Maintainability Warnings

The Google I/O composition has acceptable warnings:

- `composition_file_too_large`
- `timeline_track_too_dense`

Use `--strict` for final renders unless the composition is split into smaller
sub-compositions.

## Contrast Validation

Use:

```powershell
node scripts\run-hyperframes.mjs validate videos\<slug> --no-contrast
```

Full contrast validation can report sampler quirks on transformed glass layers.
For this workflow, prioritize no console errors plus visual snapshots.

## Generated Images Must Be Project-Bound

The built-in image generator saves under the Codex generated images directory.
Copy the chosen image into the video project, for example:

```text
videos/<slug>/assets/thumbnail/<slug>-thumbnail.png
```

Do not reference generated images from the global Codex cache in project HTML.

## Bland Graph-Paper B-Roll

Cause: using abstract grids or floating graph-paper panels as the primary visual
for a story that is really about a website, map, place, or product page.

Fix:

- Capture the real source website, product UI, article, map, or landmark.
- For mobile-first videos, show the source in a large phone frame and scroll it
  quickly enough to feel active.
- For map/place stories, use a real map or satellite capture. If live 3D map
  capture is unavailable, build a project-bound map-card asset from the capture
  with stylized 3D buildings, pins, labels, and route lines.
- Keep graph/grid textures as background support only.

## Website B-Roll Too Small Or Too Slow

Cause: treating source footage like decoration instead of evidence.

Fix:

- Make the phone/source card large enough to dominate the scene.
- Use 8-12 second scrolls for long mobile pages and 3-6 second pans for short
  pages.
- Snapshot the exact B-roll beats and check them at phone-viewing size.
- If the user says the scroll is boring, increase speed and enlarge the source
  window before adding more overlays.

## Live Website Artifacts In Captures

Watch for cookie banners, sign-in dialogs, newsletter modals, loading spinners,
blank maps, and browser UI that distracts from the story.

Fix:

- Dismiss overlays before capture.
- Wait for fonts/images/canvas tiles to load.
- Crop or recapture if browser chrome, side panels, or modals dominate.
- If a live capture is brittle, create a local HTML card that uses the captured
  source image plus controlled overlays, then screenshot that card into
  `assets/motion/`.
