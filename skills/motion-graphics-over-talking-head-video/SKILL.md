---
name: motion-graphics-over-talking-head-video
description: Use when a user supplies their OWN recorded talking-head video (a full-frame self-recording, screen-fill portrait, "my video", "this clip") plus a transcript (.srt/.txt) and wants animated motion-graphics overlays added on top of it with HyperFrames. Covers full-frame background video + audio, semi-transparent come-and-go glass overlays that fly in and out in 3D and reveal the face between beats, top-anchored placement that clips only the top of the head, respecting burned-in captions and user-excluded ranges, an optional full-frame intro image card, the exact render/verify loop, and the publishing deliverables (a YouTube metadata file with viral title + SEO/hashtag description + 400–500 char tags, and a transcript-derived thumbnail image prompt at the video's aspect ratio). Captures hard-won gotchas: the filename-space / %20 render bug (preview works, render shows a frozen first frame with no audio), the layout inspector occlusion override, and inspect needing data-duration.
---

# Motion Graphics Over a Talking-Head Video

Use this skill when the user already has a **recorded talking-head video** (their
own footage, usually portrait 1080x1920 that fills the whole screen) and a
**transcript** (`.srt` + `.txt`), and wants you to **add motion-graphics
overlays on top** with HyperFrames. This is different from generating an avatar
video or building a from-scratch composition: the user's video is the
full-frame background and your graphics are translucent overlays that come and
go over their face.

This skill is the distilled record of building `videos/glm-5.2/`. Read the
core HyperFrames skill (`skills/hyperframes/SKILL.md`) for the framework rules;
this skill adds the overlay-on-user-video specifics and the gotchas that cost
real iterations.

Read the references as needed:

- `references/composition-template.md` — the full `index.html` pattern: background
  video + audio, semi-transparent glass cards, top-anchored scenes, the
  3D come-and-go GSAP helper, the timing map, and the intro image card.
- `references/gotchas.md` — every lesson learned, with symptoms and fixes. Read
  this BEFORE rendering. The filename-space bug alone will eat an hour if you
  don't know it.
- `references/youtube-metadata.md` — how to write `youtube-metadata.md` for the
  video: a viral-leaning title, an SEO/hashtag-rich description, and a 400–500
  character tag string. A deliverable for every finished video.
- `references/thumbnail-prompt.md` — how to write `thumbnail-prompt.md`: a
  transcript-derived image prompt for a high-CTR thumbnail at the video's aspect
  ratio, with the edge-safety and text-placement rules baked in.

## Mental Model

- **Background:** the user's video fills the frame (`object-fit: cover`,
  `z-index: 1`). A muted `<video>` carries the picture; a separate `<audio>`
  (same file) carries the sound. Both are timed clips.
- **Overlays:** plain `<div class="scene">` blocks at a higher `z-index`,
  controlled ENTIRELY by the GSAP timeline (opacity/visibility gates). They are
  NOT timed clips — they have no `data-*` attributes.
- **Rhythm:** each overlay animates **IN → holds → OUT**, so the user's face is
  visible in the gaps between beats. Graphics partly cover the face on purpose;
  semi-transparent glass keeps the face readable underneath.
- **Motion:** every component flies in and out through **3D space** (depth +
  rotation, not flat fades) — this is required, see the 3D helper in
  `references/composition-template.md`. It's what makes the piece feel premium
  and engaging.

## Workflow

1. **Read the core skill.** `skills/hyperframes/SKILL.md` for framework rules
   (deterministic, GSAP-only visual props, timeline contract, no `repeat: -1`).

2. **Read the transcript.** The `.srt` gives you per-line timestamps (your
   timing map); the `.txt` gives you the full prose to understand the narrative
   arc. Both usually live in `videos/<slug>/resources/`.

3. **Probe the video** with `ffprobe`: width, height, fps, duration. Confirm
   orientation (almost always 1080x1920 portrait) and exact duration for
   `data-duration`.

   ```bash
   ffprobe -v error -select_streams v:0 \
     -show_entries stream=width,height,r_frame_rate -of default=noprint_wrappers=1 \
     "videos/<slug>/resources/<video>.mp4"
   ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 \
     "videos/<slug>/resources/<video>.mp4"
   ```

4. **Extract sample frames** (a few timestamps) and LOOK at them. You are
   checking two things: where the speaker sits in frame, and whether the video
   **already has burned-in captions or title text** (user self-recordings
   frequently do — captions near the bottom, sometimes a title at the top).
   Your overlays must not collide with those.

   ```bash
   ffmpeg -v error -ss 50 -i "<video>.mp4" -frames:v 1 frame.jpg -y
   ```

5. **Study an existing overlay video** in the repo for conventions (e.g.
   `videos/ai-world-news-june-2026/index.html`): full-frame media + scene divs
   gated by `tl.set(sel, {opacity, visibility}, t)`.

6. **Map timing and excluded ranges.** Turn SRT lines into scene windows.
   **Honor any range the user says to leave bare** (e.g. "no graphics while I
   talk about price/subscription"). Map those ranges from the SRT and leave
   real face-only gaps there. State your interpretation of fuzzy boundaries
   back to the user.

7. **Design** (see `references/composition-template.md`): semi-transparent dark
   glass cards, top-anchored, come-and-go. Pick an accent palette that
   complements the footage. Big readable type (60px+ headlines, 26px+ labels).

8. **Write `index.html`.** Standalone composition (no `<template>` wrapper).
   Background video + audio clips, scene divs, GSAP timeline with scene gates +
   the come-and-go helper.

9. **Fix media filenames FIRST** — no spaces, no `%20` in any `src`. See
   `references/gotchas.md` §1. This is the single most important step.

10. **Verify loop:** `lint` → `validate` → `inspect --at <hero frames>` →
    `snapshot --at <hero frames>` → read the PNGs. Iterate on placement/size.

11. **Render and verify the output**, not just the exit code:

    ```bash
    node scripts/run-hyperframes.mjs render ./videos/<slug>/ \
      --quality high --fps 30 --output videos/<slug>/renders/<slug>.mp4
    ```

    Then `ffprobe` the render: it MUST have both a video AND an `aac` audio
    stream, and frames sampled at different timestamps must differ (proves the
    background video is moving, not frozen). See `references/gotchas.md` §1.

12. **Write the publishing deliverables** into `videos/<slug>/`:
    - `youtube-metadata.md` — viral-leaning title, SEO/hashtag-rich description,
      and a 400–500 character tag string. Follow `references/youtube-metadata.md`.
    - `thumbnail-prompt.md` — a transcript-derived, high-CTR image prompt at the
      video's aspect ratio. Follow `references/thumbnail-prompt.md`.

## Non-negotiables for this overlay pattern

- Background video is `muted playsinline`; audio is a **separate** `<audio>`
  element pointing at the same file.
- Overlay scenes are GSAP-gated divs, never timed clips.
- Every overlay uses an **exit** animation (this intentionally overrides the
  core skill's "no exit animations except the final scene" rule, which is for
  continuous scene-to-scene videos — not overlays on a talking head).
- Every component flies in and out in **3D** (depth + rotation via the root's
  `perspective` and per-element `z`/`rotateX`/`rotateY`), never a flat fade.
- Semi-transparent overlays (dark glass + `backdrop-filter: blur`) so the face
  reads through.
- Top-anchored placement (~60px below the top edge) so overlays clip the top of
  the head, not the face.
- Keep clear of any burned-in captions in the source.
- All media `src` values are space-free and un-encoded.
- `data-layout-allow-occlusion` on the root (overlays over video are intentional).
- `data-duration` on the root composition (so `inspect` works).
