---
name: heygen-hyperframes-short-news-video
description: Use when creating future short-form news or update videos in this repo with HeyGen Avatar III, root .env credentials, SRT-based timing, HyperFrames motion graphics, avatar picture-in-picture overlays, generated thumbnails, Studio preview, and final renders. Includes the gotchas from the Google I/O 2026 video such as white side stripes, video shadow loss in renders, rounded avatar corners, thumbnail intro overlays, PowerShell npx.cmd usage, and light Studio launch.
---

# HeyGen HyperFrames Short News Video

Use this skill for the repeatable workflow we built while producing
`videos/google-io-2026-update`: generate an Avatar III talking-head video with
HeyGen, download MP4 plus SRT, build a 9:16 HyperFrames motion-graphics short,
preview it in the light Studio, then render.

Read these references as needed:

- `references/workflow.md`: end-to-end production sequence and folder layout.
- `references/ai-news-discovery.md`: first-step research workflow for finding,
  verifying, and selecting the latest AI news before writing the script.
- `references/hyperframes-patterns.md`: composition structure, timing, scene gates, thumbnail overlay, avatar layouts, and CSS snippets.
- `references/gotchas.md`: fixes for the exact issues encountered, including side stripes, missing render shadows, rounded corners, duplicate media warnings, and PowerShell quirks.
- `references/studio-render.md`: light Studio commands, validation, snapshots, and render variants.
- `references/youtube-metadata.md`: title, description, hashtags, tags, SEO
  keywords, and upload-time packaging for every finished video.

## Default Workflow

1. Discover the latest AI news first. Use primary sources when possible,
   cross-check with reputable reporting, and choose the strongest story before
   writing the script.
2. Create `videos/<slug>/` with `assets/avatar`, `assets/captions`,
   `assets/motion`, `assets/thumbnail`, `renders`, and `snapshots`.
3. Use root `.env` only. Do not create a per-video `.env` or `.env.example`.
4. Generate the HeyGen Avatar III video via HeyGen v2, using root values:
   `HEYGEN_API_KEY`, `HEYGEN_AVATAR_ID`, `HEYGEN_VOICE_ID`,
   `HEYGEN_VOICE_SPEED`.
5. Download the avatar MP4 to `assets/avatar/` and SRT to `assets/captions/`.
6. Build `index.html` as a 1080x1920 HyperFrames composition.
7. Use the avatar MP4 as a separate `<audio>` track plus muted `<video>` clips.
8. Time scenes from the SRT. Gate each scene with timeline `set()` calls so
   only the active scene is visible.
9. Put the avatar in PIP or feature layouts, using cropped frames to remove
   white side stripes.
10. Add render-stable avatar shadows with `filter: drop-shadow(...)`, not only
   `box-shadow`.
11. Round avatar corners with per-placement `border-radius` values.
12. Generate and save a 9:16 thumbnail asset, then optionally overlay it at the
    beginning for `0.5s` with a fade/zoom-out.
13. Run `oxfmt`, `hyperframes lint`, `hyperframes validate --no-contrast`, and
    targeted `hyperframes snapshot` checks before handing back.
14. Provide YouTube upload metadata: catchy title, SEO description, hashtags,
    upload tags, and a recommended upload time in the target audience timezone.

## Mandatory Local Conventions

- Use PowerShell-safe commands: `npx.cmd --no-install hyperframes ...`.
- Use `node_modules\.bin\oxfmt.CMD` for formatting changed HTML files.
- Launch the light Studio according to `LIGHT_STUDIO_SERVER.md`.
- If port `5192` is busy, use `5193` or another free port.
- Render from the repo root, passing the project folder to `hyperframes render`.
- Existing lint warnings for a large/dense composition are acceptable if there
  are zero lint errors and zero console errors in validation.
