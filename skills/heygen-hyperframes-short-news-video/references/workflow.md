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
    thumbnail/
      <thumbnail>.png
  renders/
  snapshots/
```

## HeyGen Avatar III

Use the HeyGen v2 generation endpoint for Avatar III style digital twin videos.
In the Google I/O video the successful shape was:

```json
{
  "endpoint": "POST https://api.heygen.com/v2/video/generate",
  "dimension": { "width": 1280, "height": 720 },
  "avatarStyle": "normal",
  "voiceType": "text",
  "caption": true
}
```

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
