---
name: short-form-video-from-slides
description: Create polished 9:16 short-form educational videos from one or two selected horizontal slide images using a HeyGen Avatar III instructor, downloaded MP4 and SRT timing, slide-native HyperFrames camera choreography, cursor and underline emphasis, an AI-tech background, outlined word-highlight captions, subtle synced sound effects, a generated 0.5-second thumbnail intro, and a course plus subscribe-follow-like CTA. Use when the user asks to turn presentation slides, training slides, diagrams, or 16:9 educational slide images into a complete social short, Reel, TikTok, or YouTube Short without stopping at intermediate approvals.
---

# Short Form Video from Slides

Build the complete video in one pass after the user identifies the topic and
slide files. Use `videos/ai-training-vs-inference/` as the working reference for
the proven layout, but create a new `videos/<slug>/` project for a new topic.

Read these references before implementation:

- `references/workflow.md`: end-to-end production sequence, folders, script,
  HeyGen generation, thumbnail, SFX, QA, and delivery.
- `references/composition-patterns.md`: slide camera, avatar resizing, crop,
  captions, AI-tech background, CTA, and GSAP patterns.
- `references/troubleshooting.md`: renderer issues encountered and their fixes.
- `references/youtube-metadata.md`: click-worthy title, SEO description, course
  outline placeholder, hashtags, and YouTube Studio tags.

## Default Outcome

Create a vertical `1080x1920` MP4, normally `60-120` seconds, from one or two
horizontal slide images. Keep the slides as the visual authority. Use
HyperFrames for presentation and timing, not for unrelated infographic scenes.

Produce:

- `videos/<slug>/index.html`
- `videos/<slug>/visual-style.md`
- `videos/<slug>/script.md`
- `videos/<slug>/thumbnail-prompt.md`
- `videos/<slug>/youtube-metadata.md`
- `videos/<slug>/assets/slides/`
- `videos/<slug>/assets/avatar/`
- `videos/<slug>/assets/captions/`
- `videos/<slug>/assets/sfx/`
- `videos/<slug>/assets/thumbnails/`
- `videos/<slug>/renders/<slug>-final.mp4`
- `videos/<slug>/snapshots/`

## Non-Negotiable Experience

1. Start narration immediately under a generated raster thumbnail overlay.
   Show the thumbnail for about `0.5s`; do not overlay the avatar on it.
2. Reveal the first slide as a full-height vertical crop and scan horizontally
   across the complete 16:9 slide so viewers understand its structure.
3. Settle into readable full-slide overviews and teaching close-ups timed to
   the narration. In every overview, fit the complete slide width so both left
   and right edges remain visible. Pan to the exact diagram section being
   discussed only during deliberate teaching close-ups.
4. Use a cursor, translucent focus region, or underline to guide attention.
   Place title underlines below the title baseline so the title remains visible.
   Snapshot every underline hero frame after changing any overview scale; tune
   each underline's position and width independently.
5. Resize the instructor panel dynamically:
   - compact portrait near detail views;
   - wider rectangular panel when a zoomed-out slide leaves lower-canvas space;
   - return to compact portrait when close-ups need room.
6. In wide instructor states, shift the inner avatar video down slightly so the
   crop cuts more chest and preserves breathing room above the instructor's
   head. Keep a subtle vertical float and gentle `rotationY` twist.
7. Use a restrained AI-tech background: off-white canvas, circuit traces,
   nodes, chip shapes, and soft pulses. Avoid plain circles, dark neon grids,
   or anything that competes with the slide.
8. Use SRT-synced captions with no background capsule. Keep outlined letters
   readable and use medium solid blue text (`#3B82F6`) with a translucent blue
   sweep on the active word. Remove the outline from the active word itself.
9. Add audible but narration-safe synced SFX: whooshes for camera movement,
   pings or clicks for focused concepts, pops for callouts, and a chime for the
   CTA.
10. End with a compelling AI-course CTA and an engagement CTA in this exact
    order: `Subscribe`, `Follow`, `Like`.
11. During the CTA, enlarge the instructor panel close to full canvas width and
    move CTA captions upward into the clear band above the panel.
12. Package the upload with a catchy YouTube title, an SEO description that
    naturally uses every selected keyword, a fill-in course-outline reference,
    hashtags, and a YouTube Studio tag string no longer than `500` characters.

## CTA Requirements

Use a spoken close similar to:

> Want the full AI vocabulary without the jargon? Check the description, bio,
> or pinned comment for the complete AI terminology course. Subscribe, follow,
> and like for more clear AI lessons.

Show the course card with:

- `Free AI terminology course`
- `Understand AI without the jargon.`
- `Training, inference, tokens, prompts, AI agents, APIs, ChatGPT, coding agents, and more`
- route pills: `Description`, `Bio`, `Pinned comment`
- engagement prompts in this order: `Subscribe`, `Follow`, `Like`

Adapt the term list to the course topic when useful, but retain the listed AI
terms unless the user requests a narrower CTA.

## Completion Gate

Do not stop after scripting, HeyGen generation, HTML authoring, or a draft
render. Continue through validation, high-quality render, metadata verification,
and representative frame QA unless blocked by missing credentials or missing
source slides.

Run:

```powershell
npx.cmd hyperframes lint
npx.cmd hyperframes validate
npx.cmd hyperframes inspect --samples 24
npx.cmd hyperframes render --output renders\<slug>-final.mp4 --quality high --workers auto
```

Verify the final MP4 with `ffprobe`, extract QA PNGs with `ffmpeg`, inspect the
initial scan, every underline state, wide avatar crop, compact avatar crop,
active caption styling, slide transition, AI-tech background, and expanded CTA
avatar.

Create `youtube-metadata.md` and verify that every listed SEO keyword appears
in the public description and the YouTube Studio tags remain within the
`500`-character limit.
