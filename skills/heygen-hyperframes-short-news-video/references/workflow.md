# End-To-End Workflow

## Inputs

- Topic, script, aspect ratio, and desired visual style.
- Root `.env` contains shared HeyGen credentials and voice settings:
  - `HEYGEN_API_KEY`
  - `HEYGEN_AVATAR_ID`
  - `HEYGEN_VOICE_ID`
  - `HEYGEN_VOICE_SPEED`
- Do not store video-specific aspect ratio or dimensions in `.env`; derive
  those per video.
- Do not create `.env.example` in the video folder when root `.env` is shared.

## Folder Layout

For each video:

```text
videos/<slug>/
  index.html
  meta.json
  script.md
  visual-style.md
  thumbnail-prompt.md
  heygen-input.txt
  heygen-request-summary.json
  heygen-metadata.json
  heygen-status.json
  assets/
    avatar/
      heygen-avatar-16x9.mp4
    captions/
      heygen-captions.srt
    motion/
      broll/
      maps/
      mobile/
    sfx/
      whoosh-soft.wav
      ping-soft.wav
      pong-soft.wav
      pop-soft.wav
      chime-soft.wav
      click-soft.wav
    thumbnail/
      <thumbnail>.png
  renders/
  snapshots/
```

## HeyGen Avatar III

Use the HeyGen v2 generation endpoint for Avatar III style digital twin videos.
The successful Avatar III request shape is:

```json
{
  "method": "POST",
  "endpoint": "https://api.heygen.com/v2/video/generate",
  "headers": {
    "Content-Type": "application/json",
    "X-Api-Key": "<HEYGEN_API_KEY>"
  },
  "body": {
    "title": "AI Terms Explained Without Jargon",
    "caption": true,
    "dimension": { "width": 1280, "height": 720 },
    "video_inputs": [
      {
        "character": {
          "type": "avatar",
          "avatar_id": "<HEYGEN_AVATAR_ID>",
          "avatar_style": "normal"
        },
        "voice": {
          "type": "text",
          "voice_id": "<HEYGEN_VOICE_ID>",
          "input_text": "<contents of videos/<slug>/heygen-input.txt>",
          "speed": "<HEYGEN_VOICE_SPEED as number>"
        }
      }
    ]
  }
}
```

Example Node fetch shape:

```js
const payload = {
  title: videoTitle,
  caption: true,
  dimension: { width: 1280, height: 720 },
  video_inputs: [
    {
      character: {
        type: "avatar",
        avatar_id: env.HEYGEN_AVATAR_ID,
        avatar_style: "normal",
      },
      voice: {
        type: "text",
        voice_id: env.HEYGEN_VOICE_ID,
        input_text: heygenInputText,
        speed: Number(env.HEYGEN_VOICE_SPEED),
      },
    },
  ],
};

await fetch("https://api.heygen.com/v2/video/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": env.HEYGEN_API_KEY,
  },
  body: JSON.stringify(payload),
});
```

What changes video to video:

- `title`: match the current video's title.
- `input_text`: read from that video's `heygen-input.txt`.
- `speed`: use root `HEYGEN_VOICE_SPEED`, unless a specific pacing adjustment is
  requested.
- `avatar_id` and `voice_id`: usually root `.env` values, but change if the user
  requests a different avatar or voice.
- `dimension`: keep `{ "width": 1280, "height": 720 }` for the current Avatar
  III overlay workflow; change only if the avatar source aspect ratio changes.
- Output paths: always write metadata, status, MP4, and SRT under the current
  `videos/<slug>/` folder.

Store:

- Input script in `heygen-input.txt`.
- Request summary in `heygen-request-summary.json`.
- HeyGen metadata in `heygen-metadata.json`.
- Status response in `heygen-status.json`.
- MP4 in `assets/avatar/`.
- SRT in `assets/captions/`.

Use the status endpoint:

```text
GET https://api.heygen.com/v1/video_status.get
```

Download `data.video_url` to `assets/avatar/heygen-avatar-16x9.mp4` and
`data.caption_url` to `assets/captions/heygen-captions.srt` when present. If
the HeyGen MP4 has sparse keyframes, keep the original as
`assets/avatar/heygen-avatar-16x9-original.mp4` and re-encode the stable current
file before rendering:

```powershell
ffmpeg -y -i assets\avatar\heygen-avatar-16x9-original.mp4 -c:v libx264 -r 30 -g 30 -keyint_min 30 -pix_fmt yuv420p -movflags +faststart -c:a copy assets\avatar\heygen-avatar-16x9.mp4
```

## SRT Timing To Sections

Use the SRT to derive scene boundaries. For the Google I/O video, sections were:

```text
0.00-8.10     Intro
8.10-18.00    Gemini model upgrade
18.00-35.10   Gemini Omni/video generation
35.10-47.70   Workspace/personal agent
47.70-56.70   Search/AI Mode
56.70-68.65   Antigravity/developer workflow
68.65-77.15   Chrome/agentic web/smart glasses
77.15-85.50   Ecosystem
85.50-90.36   Future/agent conclusion
90.36-93.66   CTA/end beat
```

For future videos, do not hard-code this map. Create section windows from the
script and transcript.

## Motion Graphics Direction

Use a 9:16 composition for Shorts/Reels/TikTok:

```html
<meta name="viewport" content="width=1080, height=1920" />
<div id="root" data-composition-id="<slug>" data-width="1080" data-height="1920">
```

The Google I/O visual direction was light-theme, high-energy tech editorial:
white/soft-silver base with vivid blue, pink, and orange accents, glassmorphism
cards, 3D depth, flying UI modules, and active camera-like motion.

## Thumbnail Prompt

Before generating thumbnail art, write `videos/<slug>/thumbnail-prompt.md`.
Keep it specific enough that another agent or image model can generate the
thumbnail without re-reading the video.

Use this structure:

- Use case.
- Asset type.
- Primary request.
- Scene/backdrop.
- Subject.
- Style/medium.
- Composition/framing.
- Lighting/mood.
- Color palette.
- Text (verbatim).
- Secondary text (verbatim), if needed.
- Constraints.
- Avoid.

The headline and secondary text should be baked into the generated image, phone
readable, spelled exactly, and not clipped. Supporting text can appear on
secondary visual elements, but should not compete with the headline.

What changes video to video:

- Headline and secondary text.
- Topic-specific visual subject and supporting labels.
- Palette/style details from `visual-style.md` and the finished composition.
- Whether the avatar/person appears, depending on available reference assets.
- Topic-specific avoid list for likely image-generation failure modes.

Save generated thumbnails under
`videos/<slug>/assets/thumbnail/<slug>-thumbnail.png`.

If exact headline typography is more important than model-native imagery, build
an editable HTML/CSS thumbnail source in `assets/thumbnail/`, render it to a
1080x1920 PNG with a headless browser, and reference the PNG in the video.

When the thumbnail should appear at the front of the short, add a clip at
`data-start="0"` and `data-duration="0.5"` using the PNG, with a short
fade/zoom-out on the main timeline. This is an overlay intro; do not shift SRT
or motion-graphics timestamps unless the user explicitly asks for a true
prepended silence/title-card segment.

## Reusable SFX

Use the shared pack in `videos/_shared/sfx` for all short-form avatar videos.
Copy it into the project so renders do not depend on paths outside the project:

```powershell
New-Item -ItemType Directory -Force videos\<slug>\assets\sfx | Out-Null
Copy-Item -Force videos\_shared\sfx\*.wav videos\<slug>\assets\sfx\
```

Default usage:

- `whoosh-soft.wav`: scene starts, wipes, large card moves.
- `ping-soft.wav`: positive reveal or selected item.
- `pong-soft.wav`: secondary reveal or comparison beat.
- `pop-soft.wav`: small badges, tokens, stamps.
- `click-soft.wav`: typed UI and small interface actions.
- `chime-soft.wav`: hook and CTA payoff.

Keep SFX subtle under narration. Start with `data-volume` between `0.35` and
`0.6`, then adjust after a review render.

## Source Website B-Roll

For news videos based on a specific announcement, product page, research page,
map, or demo, capture the relevant website as B-roll before finalizing the
composition.

Default approach:

- Use a mobile viewport for Shorts/Reels/TikTok.
- Save source-page hero and full-page screenshots under `assets/motion/mobile/`.
- Animate the full-page PNG inside a large phone frame for fast scroll footage.
- For maps, places, or Street View stories, use real map/satellite/landmark
  captures or a project-bound map card built from those captures. Do not use
  plain graph-paper panels as the main world/place visual.
- Use recorded website video only when real page motion or interactions matter.

See `website-broll.md` for capture recipes and quality gates.

## Final Handoff

Always report:

- MP4 and SRT paths.
- Thumbnail path, if generated.
- Studio URL.
- Validation results.
- Render command or rendered output path.
