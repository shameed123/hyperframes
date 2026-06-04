# Claude Video /watch Agent

## Format

- Platform: YouTube Shorts / TikTok / Reels
- Aspect ratio: 9:16 vertical
- Target length: about 80 seconds, using the longer approved HeyGen take
- Avatar source: HeyGen Avatar III, generated from the shared root `.env`
- B-roll source: GitHub repository page captured locally as mobile screenshots and animated as a fast phone scroll
- Motion graphics style: bright code-agent explainer, GitHub mobile b-roll, frame extraction diagrams, transcript plus frames flowing into an agent brain, avatar alternating between feature shot and PIP
- Status: production in progress

## Exact HeyGen Voiceover

The exact text sent to HeyGen is in `heygen-input.txt`.

## Research Brief

**Tool**
`bradautomates/claude-video`, an open-source `/watch` skill that lets Claude inspect videos by combining extracted frames and transcript data.

**Verified Repo Facts**

- The repo describes `/watch` as giving Claude the ability to watch any video.
- It supports Claude Code install commands and a Codex/generic skills install path.
- It uses `yt-dlp` for downloading, `ffmpeg` for frame extraction, native captions when available, and Whisper fallback when needed.
- It supports public URLs and local video files.
- It has frame-budget controls to avoid excessive image-token cost.

**Source**

- https://github.com/bradautomates/claude-video

## Scene Map

| Est. Time    | Voiceover Beat                                              | Motion Graphics Direction                                                                                      |
| ------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 0-9.43s      | "What if your coding agent could actually watch a video..." | Thumbnail-style opener. Huge "AI CAN WATCH VIDEO?" hook, avatar feature crop, video frames flying in.          |
| 9.43-19.52s  | Introduce `claude-video` and transcript limitations         | GitHub repo mobile scroll b-roll enters in a phone frame. Repo name and install snippets highlighted.          |
| 19.52-26.63s | Why transcript-only is not enough                           | Split screen: transcript-only card misses visual cues; frames show hook, UI bug, slide change.                 |
| 26.63-38.81s | How `/watch` works                                          | Pipeline: video URL -> yt-dlp -> ffmpeg frames -> captions/Whisper -> agent answer.                            |
| 38.81-47.74s | Claude Code use cases                                       | Viral-short analysis, lecture summary, bug repro diagnosis. Avatar sits PIP while diagrams animate.            |
| 47.74-58.91s | Codex support                                               | Codex skill install path and "works with Codex too" highlight. Avatar enlarges for emphasis, then returns PIP. |
| 58.91-78.19s | Why it matters                                              | Marketer/builder questions, second GitHub scroll, free/open-source emphasis.                                   |
| 78.19-82.56s | CTA                                                         | Like, subscribe, and follow scene.                                                                             |

## Visual Hooks

- GitHub mobile repository page scrolls inside a large smartphone frame.
- `/watch` command chip transforms into a frame grid and timestamped transcript.
- "Claude" and "Codex" appear as two agent surfaces receiving the same video understanding pipeline.
- Avatar starts large for the hook, shrinks to bottom-right PIP during explainers, then enlarges again when Codex support is mentioned.
- Captions stay above the lower third and avoid the avatar.
