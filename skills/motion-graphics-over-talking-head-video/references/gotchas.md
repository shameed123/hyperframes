# Gotchas & Lessons Learned

Every item here cost real iterations on `videos/glm-5.2/`. Read before rendering.

## 1. Filename spaces / `%20` break the RENDER (but not the preview) ⚠️ BIGGEST

**Symptom:** Preview/Studio plays perfectly. But the rendered MP4 shows only the
**frozen first frame** of the background video (your head doesn't move), there is
**no audio**, and the file is **tiny** (e.g. 6 MB instead of ~300 MB). Motion
graphics still animate at the right times.

**Cause:** The source file was named with a space (`GLM 5.2.mp4`) and referenced
URL-encoded (`src="resources/GLM%205.2.mp4"`). The browser's dev server decodes
`%20` over HTTP, so preview works. But the render pipeline's path resolver
(`resolveProjectRelativeSrc` in
`packages/engine/src/services/videoFrameExtractor.ts`) strips query strings but
does **NOT** `decodeURIComponent`. It looks for a file literally named
`GLM%205.2.mp4`, finds nothing, and **silently** skips:
- video-frame extraction → background freezes on the first (poster) frame
- audio auto-detection from the video → no sound

**Fix:** Rename every media file to a **space-free** name and reference it plain
(no `%20`):

```bash
mv "resources/GLM 5.2.mp4" "resources/glm-5.2.mp4"
# then in index.html: src="resources/glm-5.2.mp4"
```

This applies to videos, audio, AND images (intro cards).

**Always verify the render, not the exit code:**

```bash
# Must show BOTH a video stream and an aac audio stream:
ffprobe -v error -show_entries stream=codec_type,codec_name,channels \
  -of default=noprint_wrappers=1 renders/<slug>.mp4

# Frames at different timestamps must DIFFER (proves the video is moving):
ffmpeg -v error -ss 50 -i renders/<slug>.mp4 -frames:v 1 a.png -y
ffmpeg -v error -ss 95 -i renders/<slug>.mp4 -frames:v 1 b.png -y
# different file sizes / pixels = moving; identical = frozen (path bug)
```

## 2. The default "no exit animations" rule is INVERTED for this pattern

The core HyperFrames skill says: never use exit animations except on the final
scene. That rule is for **continuous scene-to-scene** videos where a transition
covers the cut. For **overlays on a talking head**, the whole point is that each
overlay animates IN, holds, and animates OUT so the face is revealed between
beats. So you DO put an exit (`gsap.to(..., {opacity:0})`) on **every** scene.
Don't fight the lint/skill on this — it's the correct choice for the format.

## 3. Position overlays near the TOP, not centered

First instinct (flex `justify-content: center`) parks every card squarely over
the face — bad. Anchor to the top instead: `justify-content: flex-start` +
`padding-top: ~60px`. Cards then clip the top of the head while leaving the
eyes/mouth visible below. Tuning history on glm-5.2: center → 40px → 60px.
Make overlays semi-transparent (dark glass + `backdrop-filter: blur`) so even
where they overlap the face, the face still reads through.

## 4. User self-recordings often already have burned-in text

Extract sample frames and look BEFORE designing. The glm-5.2 source already had
burned-in captions near the bottom AND a title at the very start. Two
consequences:
- Keep your overlays in the **upper band**, clear of the bottom caption strip.
- Don't duplicate what the source already shows. (We removed our title card
  because the source already had a "GLM 5.2" intro heading.)

## 5. `inspect` needs `data-duration` on the root composition

Without it, `hyperframes inspect` fails with `Cannot read properties of
undefined (reading 'totalDuration')`. Add `data-duration="<seconds>"` to the
root `data-composition-id` element. (The composition still renders fine without
it; only `inspect` breaks.)

## 6. The layout inspector flags ALL text-over-video as "occluded"

`inspect` reports every overlay text element as `text_occluded ... inside
#bg-video` because the video is opaque underneath. For this pattern that
layering is the entire intent. Suppress it by adding
`data-layout-allow-occlusion` to the root element. After that, the only real
warnings left are genuine `content_overlap` between two text blocks — usually a
giant stat number whose line-box bleeds into its label; fix with more
margin/line-height (`.stat-huge { line-height: 1.06; margin: 18px 0 10px; }`).

## 7. `overlapping_gsap_tweens` lint warning on entrance+exit

Because the entrance (`from`) and exit (`to`) target the same `#scene > *`
selector and both animate y/opacity/scale, lint warns about overlap. They don't
actually overlap in time, but add `overwrite: "auto"` to both tweens to clear
the warning cleanly.

## 8. Verification toolchain

Run in order, reading the visual output each time:
- `npx hyperframes lint`
- `npx hyperframes validate` (headless Chrome: console errors + WCAG contrast)
- `npx hyperframes inspect --at <comma,separated,hero,frames>` (layout)
- `npx hyperframes snapshot --at <...>` then **Read the PNGs** in `snapshots/`

If `npx` hits a flaky registry (`npm error notarget`), pin the version that's
already cached: `npx hyperframes@<version> <command>`.
