---
name: heygen-hyperframes-short-news-video
description: Use when creating or packaging future short-form news/update videos in this repo with HeyGen Avatar III, root .env credentials, SRT-based timing, source-website B-roll capture, mobile website scroll footage, HyperFrames motion graphics, avatar picture-in-picture overlays, thumbnail image prompts, generated thumbnails, YouTube titles/descriptions/hashtags/tags, Studio preview, and final renders. Includes the gotchas from the Google I/O 2026 and Google Genie/Street View videos such as white side stripes, video shadow loss in renders, rounded avatar corners, thumbnail intro overlays, bland graph-paper B-roll, PowerShell npx.cmd usage, and light Studio launch.
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
- `references/website-broll.md`: capture source websites, mobile scroll
  footage, maps/landmark visuals, and project-bound B-roll assets before
  building motion graphics.
- `references/hyperframes-patterns.md`: composition structure, timing, scene gates, thumbnail overlay, avatar layouts, and CSS snippets.
- `references/frosted-glass-motion.md`: reusable glossy frosted-glass card
  style, high-tech light AI background, and 3D GSAP entrance/float snippets.
- `references/gotchas.md`: fixes for the exact issues encountered, including side stripes, missing render shadows, rounded corners, duplicate media warnings, and PowerShell quirks.
- `references/studio-render.md`: light Studio commands, validation, snapshots, and render variants.
- `references/youtube-metadata.md`: thumbnail prompt, title, description,
  hashtags, tags, SEO keywords, and upload-time packaging for every finished
  video.

## Default Workflow

1. Run `node scripts/daily-news-preflight.mjs` before research or paid API
   submission. Stop immediately when it reports a blocker. The preflight
   verifies outbound network access, direct HeyGen API quota, configured avatar
   and voice visibility, Chrome launch, dependency readability, formatting,
   and the local HyperFrames CLI.
2. Discover the latest AI news first. Use primary sources when possible,
   cross-check with reputable reporting, and choose the strongest story before
   writing the script.
3. Create `videos/<slug>/` with `assets/avatar`, `assets/captions`,
   `assets/motion`, `assets/motion/broll`, `assets/motion/mobile`,
   `assets/motion/maps`, `assets/sfx`, `assets/thumbnail`, `renders`, and
   `snapshots`.
4. Use root `.env` only. Do not create a per-video `.env` or `.env.example`.
5. Generate the HeyGen Avatar III video via HeyGen v2, using root values:
   `HEYGEN_API_KEY`, `HEYGEN_AVATAR_ID`, `HEYGEN_VOICE_ID`,
   `HEYGEN_VOICE_SPEED`.
6. Download the avatar MP4 to `assets/avatar/` and SRT to `assets/captions/`.
7. Capture B-roll from the relevant source website(s) before building the
   video. Prefer mobile source-page scroll footage for news articles and
   product/blog pages. Save all captures locally; never depend on network
   loading during render. For deterministic source-page captures, create a
   JSON array of `{ "id": "...", "url": "..." }` entries and run
   `node scripts/capture-mobile-broll.mjs <slug> <sources-json>`.
8. Build `index.html` as a 1080x1920 HyperFrames composition.
   Use the frosted-glass motion style by default for AI/news overlays:
   translucent layered cards, white rim highlights, inner shine, blue/pink/orange
   glows, light high-tech background layers, large readable labels, and 3D
   glass-card entrances. Read `references/frosted-glass-motion.md` before
   designing reusable cards, graph callouts, or source-B-roll overlays.
9. Use the avatar MP4 as a separate `<audio>` track plus muted `<video>` clips.
10. Time scenes from the SRT. Gate each scene with timeline `set()` calls so
    only the active scene is visible.
11. Put the avatar in PIP or feature layouts, using cropped frames to remove
    white side stripes.
12. Add render-stable avatar shadows with `filter: drop-shadow(...)`, not only
    `box-shadow`.
13. Round avatar corners with per-placement `border-radius` values.
14. Copy reusable SFX from `videos/_shared/sfx` into `videos/<slug>/assets/sfx`
    and add subtle timed audio clips for whooshes, pings, pongs, pops, clicks,
    and CTA chimes. Keep SFX quiet under the avatar narration.
15. Write `videos/<slug>/thumbnail-prompt.md` before generating thumbnail art,
    and provide the prompt in the handoff when the user asks for packaging.
    Include the exact baked-in headline text, secondary text, visual subject,
    palette, constraints, and avoid list. Then generate or render a
    project-bound 9:16 thumbnail asset under `assets/thumbnail/`. If the
    thumbnail should appear in the video, add it as a first-frame overlay clip
    for `0.5s` with a fade/zoom-out.
16. Run `oxfmt`, `hyperframes lint`, `hyperframes validate --no-contrast`, and
    targeted `hyperframes snapshot` checks before handing back. Always inspect
    frames where website B-roll appears for size, scroll speed, load/cookie
    artifacts, and overlap with avatar/captions.
17. Provide a complete YouTube upload package: 9:16 thumbnail image prompt,
    catchy title, SEO description, visible hashtags, comma-separated upload
    tags within YouTube Studio's 500-character tag limit, and a recommended
    upload time in the target audience timezone.

## Mandatory Local Conventions

- Use the built checkout CLI through
  `node scripts\run-hyperframes.mjs ...`. Do not use
  `npx.cmd --no-install hyperframes ...` in this monorepo: the root shim may be
  absent even when `packages/cli/dist/cli.js` is built, causing `npx` to search
  for an external package instead of using this checkout.
- Use `node_modules\.bin\oxfmt.CMD` for formatting changed HTML files.
- Launch the light Studio according to `LIGHT_STUDIO_SERVER.md`.
- If port `5192` is busy, use `5193` or another free port.
- Render from the repo root, passing the project folder to `hyperframes render`.
- Existing lint warnings for a large/dense composition are acceptable if there
  are zero lint errors and zero console errors in validation.
