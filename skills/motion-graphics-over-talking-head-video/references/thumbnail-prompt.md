# Thumbnail Image Prompt Deliverable

Produce `videos/<slug>/thumbnail-prompt.md` for every finished video: a ready-to-
paste image-generation prompt that yields a **stunning, high-CTR thumbnail**.
Derive the concept from the **transcript** — the thumbnail must visualize the
video's single strongest hook (the one claim/number/comparison most likely to
make someone stop scrolling).

## Hard requirements to bake into every prompt

- **Aspect ratio must match the video.** State it explicitly. For a 1080x1920
  source that's **9:16 vertical (1080x1920)**. (Match whatever `ffprobe` reported
  for the actual video — don't assume.)
- **Keep all text away from the edges, especially the top edge.** Image
  generators frequently crop or cut off content near borders. Instruct: keep
  every word and key subject within a safe central area, with generous margins
  on all sides and extra clearance at the top.
- **Big, bold, legible text** — very few words (2–4), huge, high-contrast, readable
  as a tiny mobile thumbnail. The text echoes the title's hook.
- **Strong focal subject + emotion/energy** — a punchy visual metaphor for the
  hook, vivid saturated colors, dramatic lighting, depth, glow/contrast that pops
  against the YouTube UI.
- **High CTR intent** — the prompt should explicitly aim to make viewers want to
  click and watch.

## How to build the prompt

1. From the transcript, pick the ONE hook with the most stopping power (biggest
   number, boldest claim, sharpest comparison).
2. Translate it into a concrete visual scene + 2–4 words of overlay text.
3. Specify style (e.g. hyper-real 3D, glossy tech, dramatic studio lighting),
   palette, mood, and composition (subject placement, focal point).
4. Append the hard requirements above (aspect ratio, edge-safety, legibility).

## File template

```markdown
# Thumbnail Prompt — <Video Title Topic>

## Concept
<one line: the hook this thumbnail sells, from the transcript>

## Image prompt
<Vivid, detailed scene describing the focal subject, style, lighting, palette,
mood, and composition for maximum click-through.>

Overlay text (2–4 words, huge, bold, high-contrast): "<HOOK TEXT>"

Aspect ratio: 9:16 vertical, 1080x1920 (match the video exactly).

Composition & safety: keep ALL text and key subjects within a safe central
area with generous margins on every side; leave extra empty clearance at the
TOP edge so nothing is cropped (image generators tend to cut off top content).
Text must be large and legible even at small mobile thumbnail size. Bold,
saturated, dramatic, scroll-stopping — designed to maximize clicks.

## Negative / avoid
tiny text, text touching or near any edge (especially the top), cluttered
layout, low contrast, watermarks, distorted faces or hands.
```

Adjust the stated aspect ratio to the real video dimensions if they differ.
