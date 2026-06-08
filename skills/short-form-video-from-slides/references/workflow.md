# End-to-End Workflow

## 1. Select the Teaching Story

Use one or two source slides from the user's slides folder. Prefer slides that
form a simple narrative such as contrast, before/after, input/output, or
process/result. Copy selected images into:

```text
videos/<slug>/assets/slides/
```

Treat source slides as immutable visual assets. Do not redesign them. Write a
short script that points at their actual regions and remains understandable
without jargon. Target `60-120` seconds.

## 2. Write the Script

Structure the spoken script:

1. Hook: explain why the distinction matters.
2. First-slide overview: name the first idea while the camera scans the slide.
3. First-slide walkthrough: explain each meaningful region in sequence.
4. Transition: contrast or connect the second slide.
5. Second-slide overview and walkthrough.
6. Simple mental model recap.
7. Course CTA and engagement CTA.

End with a spoken CTA similar to:

```text
Want the full AI vocabulary without the jargon? Check the description, bio, or
pinned comment for the complete AI terminology course. Subscribe, follow, and
like for more clear AI lessons.
```

Keep `Subscribe`, `Follow`, `Like` in that order.

Save the narration and a timing storyboard in `script.md`.

## 3. Create the Project

Create:

```text
videos/<slug>/
  assets/
    avatar/
    captions/
    sfx/
    slides/
    thumbnails/
  renders/
  snapshots/
  index.html
  script.md
  thumbnail-prompt.md
  youtube-metadata.md
  visual-style.md
```

Use root `.env` credentials. Do not add a per-video `.env`.

Expected root keys:

```text
HEYGEN_API_KEY
HEYGEN_AVATAR_ID
HEYGEN_VOICE_ID
HEYGEN_VOICE_SPEED
```

## 4. Generate HeyGen Avatar III

Use HeyGen v2:

```text
POST https://api.heygen.com/v2/video/generate
```

Request a `1280x720` Avatar III video with the root avatar and voice settings.
Poll:

```text
GET https://api.heygen.com/v1/video_status.get
```

When complete, download:

```text
data.video_url   -> assets/avatar/heygen-avatar-16x9.mp4
data.caption_url -> assets/captions/heygen-captions.srt
```

Preserve the official SRT. Use it as the timing authority.

## 5. Create a Seekable Avatar Source

Re-encode the downloaded avatar MP4 with regular keyframes before using it in a
frame-by-frame renderer:

```powershell
ffmpeg -y -i 'assets\avatar\heygen-avatar-16x9.mp4' `
  -c:v libx264 -preset medium -crf 18 -r 30 `
  -g 30 -keyint_min 30 -sc_threshold 0 -movflags +faststart `
  -c:a copy 'assets\avatar\heygen-avatar-16x9-seekable.mp4'
```

Use the seekable MP4 for the muted avatar `<video>`. Use a separate `<audio>`
clip for narration, typically from the same avatar source.

## 6. Derive Caption Timing

Convert the official SRT into local caption data:

```text
assets/captions/captions.js
assets/captions/captions.json
```

Group short phrases for mobile readability. Emit each word with `start` and
`end` timing so the active word can receive a translucent highlight. If the SRT
contains only segment timings, distribute timing through words in the segment
and manually spot-check hooks, transitions, and CTA timing.

Do not load caption data from the network during render.

## 7. Write the Visual Style

Save `visual-style.md` before composition edits. Default style:

- warm off-white canvas;
- source slides remain dominant;
- training or first-concept accent: pink;
- inference or second-concept accent: blue;
- teaching highlight: orange;
- restrained AI-tech circuit backdrop in lower open space;
- smooth editorial pans and holds;
- no unrelated motion-graphics scenes.

## 8. Define the Thumbnail Brand, Then Generate

Write `thumbnail-brand.md` first. This is the compact art-direction contract for
all thumbnails in the video series. Include:

- emotional promise and click trigger;
- 2-3 recurring visual motifs;
- color and lighting rules;
- text hierarchy rules for phone-size readability;
- banned elements such as clutter, logos, watermarks, tiny UI, and avatar use
  unless explicitly requested.

Then write `thumbnail-prompt.md` from that brand and use a GPT/image generation
model to produce a real raster asset. Do not approximate the thumbnail with an
HTML card.

Prompt for:

- vertical `9:16` social cover;
- dramatic mobile-readable headline;
- one clear visual idea;
- strong contrast;
- no avatar unless explicitly requested;
- no logos or watermark;
- exact spelling for baked-in text.

Copy the generated original into:

```text
assets/thumbnails/<slug>-generated.png
```

Show it from `0.0s` to about `0.5s`, then fade it out while narration continues.
Do not place the avatar over the thumbnail.

## 9. Build the HyperFrames Composition

Use a standalone `1080x1920` composition. Copy any reusable SFX from
`videos/_shared/sfx/` into project-local `assets/sfx/`.

Add:

- separate narration `<audio>`;
- muted seekable avatar `<video>`;
- one slide canvas per slide;
- first-slide full-height scan;
- true full-slide overview states with visible left and right edges, plus
  deliberate close-up camera states;
- cursor, focus box, and low underline;
- no black pointer arrows unless the user explicitly asks for a cursor;
- compact and wide avatar states;
- AI-tech background;
- caption groups;
- thumbnail overlay;
- CTA course card with route pills and engagement prompts;
- unique-ID SFX `<audio>` clips.

Use local files only during render.

## 10. Add Sound Design

Use audible, present, but narration-safe SFX. Default toward the high end of
these ranges unless the narration becomes hard to understand:

| Event | Suggested SFX | Typical volume |
| --- | --- | --- |
| Thumbnail reveal exit | soft whoosh | `0.42-0.52` |
| Camera settle or slide movement | soft whoosh | `0.46-0.56` |
| First concept focus | ping | `0.46-0.56` |
| Callout or marker | pop | `0.42-0.52` |
| Course CTA entrance | chime | `0.54-0.64` |

Each timed `<audio>` needs:

```html
id
class="clip"
data-start
data-duration
data-track-index
data-volume
src
```

Assign a unique track index to every overlapping audio clip.

## 11. Validate and Render

From `videos/<slug>/`:

```powershell
npx.cmd hyperframes lint
npx.cmd hyperframes validate
npx.cmd hyperframes inspect --samples 24
npx.cmd hyperframes render --output renders\<slug>-final.mp4 --quality high --workers auto
```

Use `ffprobe` to verify:

- H.264 video;
- AAC audio;
- `1080x1920`;
- `30fps`;
- stereo audio;
- expected duration.

Use `ffmpeg` to extract representative PNGs for visual QA. Inspect:

- thumbnail at `0.0-0.5s`;
- scan around `1-4s`;
- every focus rectangle, underline, and slide-highlight hero frame; the target
  slide region must be fully inside the highlight, and the camera must not crop
  off the beginning or end of highlighted text;
- wide avatar state;
- compact avatar state;
- both slide walkthroughs;
- motion-graphics cards for excess empty space, odd card height, and chip rows
  escaping the card they belong to;
- medium solid blue active caption text with a translucent highlight sweep;
- CTA card, expanded CTA avatar, caption clearance, and engagement order.

## 12. Deliver

Create `youtube-metadata.md` using `references/youtube-metadata.md`. Include a
click-worthy title, SEO description, course-outline URL placeholder, hashtags,
and a YouTube Studio tag string of no more than `500` characters. Verify every
selected SEO keyword is used naturally in the public description.

Return the final MP4 path, metadata path, and a concise summary. Mention
validation status and any known non-blocking warnings. Do not stop at a
proposal if the render can be completed locally.
