# Troubleshooting and Lessons Learned

## Renderer Does Not Mix an SFX Clip

Every timed media element needs an `id`. A clip such as:

```html
<audio class="clip" data-start="4.6" ...></audio>
```

may lint with `media_missing_id` and render silently.

Fix:

```html
<audio id="sfx-training-settle" class="clip" data-start="4.6" ...></audio>
```

After rendering, confirm the compiler's `audioCount` equals narration plus all
SFX clips.

## Avatar Frame Seeking Looks Unstable

Do not depend on the original downloaded MP4 for frame-accurate capture.
Re-encode a seekable local copy with `-g 30 -keyint_min 30 -sc_threshold 0`.
Use the seekable file for the muted `<video>`.

## Wide Avatar Crop Cuts into the Head

Resizing the frame to a rectangle can leave the head too close to the top edge.
Animate the inner video to `y: 20-28` only in wide overview states. This shifts
the instructor down within the crop, sacrifices a little chest, and restores
headroom. Return inner video `y` to `0` in compact states.

## Caption Background Feels Heavy

Remove the caption-stage background, border, shadow, and blur. Preserve
readability with white inactive text, a dark outline, a small text shadow,
medium solid blue active text (`#3B82F6`), and a translucent blue active-word
sweep.

## Zoomed-Out Overview Still Chops the Slide Edges

An overview must show the entire source slide width. For a `1920x1080` slide in
a `1080x1920` composition, use scale `0.5625` or lower. Prefer `scale: 0.55`
with `x: 12` so both side edges remain visible with a small margin. Keep larger
scales only for deliberate teaching close-ups and the opening full-height scan.

## Highlight Covers the Slide Title

The title marker should be an underline, not a title-covering block. Lower its
`y` position and keep it thin enough that the title remains visible.

## Underline Drifts after Overview Resizing

Changing a slide overview scale or `y` offset invalidates earlier marker
coordinates. Snapshot every underline hero frame. Tune `x`, `y`, and `width`
per underline state instead of reusing one transform for the first overview,
recap overview, and second-slide overview.

## Zoomed-Out Slide Leaves Empty Lower Space

Use that space intentionally:

- enlarge the avatar from portrait to `540-560x330`;
- keep the avatar rectangular rather than merely scaling a portrait crop;
- add subtle AI-tech SVG decor behind it;
- keep captions above the presenter and clear of slide annotations.

## Background Looks Plain or Decorative Rather than Technical

Avoid floating pastel circles as the final design. Replace them with a quiet
SVG schematic: circuit traces, nodes, a chip motif, and soft pulse rings. Keep
the palette light and the motion slow.

## Generated Thumbnail Looks Like an HTML Card

Write `thumbnail-prompt.md` and use an image generation model to create a raster
image. Copy the original generated PNG into project-local
`assets/thumbnails/`. Do not reference a global generated-image cache from the
composition.

## Captions Do Not Track Spoken Words

Download HeyGen's official SRT and preserve it. Generate local caption groups
from that timing source. If only line-level SRT timing is present, derive
word-level timing inside each line and manually inspect hook, transition, and
CTA frames.

## Highlighted Caption Word Looks Too Heavy

Keep inactive caption words outlined for readability. Use medium solid blue
`#3B82F6` for the active word, a translucent blue sweep behind it, and override
the active word with `-webkit-text-stroke: 0 transparent`.

## SFX Are Barely Audible

Increase SFX volumes into a narration-safe `0.24-0.38` range. Use louder values
for whooshes and the CTA chime, slightly lower values for clicks and pops.
Confirm render metadata still reports narration plus every SFX clip.

## CTA Avatar Feels Too Small

Use the lower-canvas space during the CTA. Expand the avatar wrapper close to
full width, such as `960x450` on a `1080x1920` canvas. Scale and lower the inner
video to preserve headroom, move the instructor label above the panel, and move
CTA captions upward into the clear gap.

## Headless Validation Reports AudioContext Warning

Headless Chrome can report:

```text
The AudioContext was not allowed to start.
```

Treat this as non-blocking when runtime validation has zero errors and the
rendered MP4 contains AAC audio.

## Contrast Audit Reports Hidden Elements

`hyperframes validate` can report contrast warnings for elements hidden by
ancestor state or for inactive descendants. Inspect actual rendered frames. Do
not ignore genuine readability issues, but treat hidden-state false positives
as non-blocking when runtime errors are zero.

## Composition File Too Large Warning

Inlining a detailed SVG AI-tech background can trigger:

```text
composition_file_too_large
```

This is an advisory, not a render failure. Split coherent layers into
sub-compositions if the file becomes difficult to maintain. A one-off slide
video may proceed when lint errors remain zero.

## PowerShell Command Resolution

Use:

```powershell
npx.cmd hyperframes lint
npx.cmd hyperframes validate
npx.cmd hyperframes inspect --samples 24
npx.cmd hyperframes render --output renders\<slug>-final.mp4 --quality high --workers auto
```

Use `npx.cmd`, not bare `npx`, when PowerShell command resolution is unreliable.

## Final QA Checklist

Inspect extracted frames for:

- generated thumbnail visible only at the start;
- complete first-slide horizontal scan;
- slide overview readability with both left and right edges visible;
- every title underline below lettering with a width that matches its title;
- focus box and cursor aligned with narration;
- compact avatar framing;
- wide rectangular avatar framing with headroom;
- AI-tech background balance;
- outlined inactive captions with unoutlined medium blue active text and a
  translucent active sweep;
- slide transition;
- course CTA terms;
- route pills;
- expanded CTA avatar with captions clear above it;
- `Subscribe`, `Follow`, `Like` order.
