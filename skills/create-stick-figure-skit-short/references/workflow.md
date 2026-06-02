# Workflow

## Folder Layout

Use a project folder such as `videos/Skits/<slug>/`:

```text
resources/
  sample-art.png
  script.txt
  narration.mp3
assets/
  audio/
    transcript-words.json
    sentence-timestamps.json
  storyboard/
    full/
      character-lineup.png
      scene-01-*.png
  thumbnail/
renders/
  <slug>-full-preview.mp4
  <slug>-full-contact-sheet.png
  <slug>-ending-check.png
storyboard/
  opening-10s.md
  full-scenes.json
  youtube-thumbnail-prompt.md
youtube-submission-metadata.md
```

## 1. Inspect Inputs

List the skit folder recursively. Read the script and probe narration duration:

```powershell
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 resources\narration.mp3
```

View the sample art before writing prompts. Define:

- flat 2D stick-figure style;
- line weight, face treatment, and background complexity;
- one locked wardrobe per recurring character;
- 9:16 composition rules;
- avoid list: photorealism, 3D, watermarks, social UI, captions, and unwanted
  text.

## 2. Transcribe Narration

Prefer the repo workflow:

```powershell
npx.cmd hyperframes transcribe resources\narration.mp3 --model base.en --language en
```

Use an `.en` model only when the narration is known to be English. If
`whisper-cpp` is unavailable, run:

```powershell
python -m pip install --user faster-whisper
python skills\create-stick-figure-skit-short\scripts\transcribe_with_faster_whisper.py `
  resources\narration.mp3 `
  --output-dir assets\audio `
  --model base.en `
  --language en
```

For important or noisy narration, use a larger model after testing the
checkpoint clip.

## 3. Build Scene Manifest

Create `storyboard/full-scenes.json` as a JSON array:

```json
[
  {
    "id": "scene-01",
    "start": 0.0,
    "end": 2.4,
    "file": "scene-01-intro.png",
    "beat": "Establish the narrator."
  }
]
```

Make scenes continuous from `0` to the narration duration. Keep most cuts
around `2-4` seconds. Change images every one or two sentences. Tighten cuts
during rapid dialogue and punchlines. Hold longer only when a complex image
needs reading time.

## 4. Generate Art

Create a lineup image before scene art. Include every recurring character with
locked clothing and role cues. Then use a shared prompt prefix:

```text
Use the sample art and generated character lineup as strict references.
Create a 9:16 vertical flat 2D stick-figure cartoon with crisp black outlines,
rounded white faces, dot eyes, flat clothing colors, and an uncluttered pastel
environment. Preserve the locked character designs. No captions, watermark,
social-media UI, logos, photorealism, or 3D rendering.
```

Add one clear visual joke per scene. Keep mobile readability high: large poses,
large props, simple backgrounds.

### Checkpoint Rule

Built-in image generation saves under
`$CODEX_HOME/generated_images/<session-id>/`. After each batch, copy selected
outputs into `assets/storyboard/full/`. Leave the original generated copy in
place. Use `scripts/checkpoint_generated_images.py` only when generation order,
source directory, and source offset are known.

## 5. Render

Run from the repo root:

```powershell
python skills\create-stick-figure-skit-short\scripts\render_storyboard.py `
  --project-dir videos\Skits\<slug> `
  --manifest storyboard\full-scenes.json `
  --images-dir assets\storyboard\full `
  --audio resources\narration.mp3 `
  --output renders\<slug>-full-preview.mp4
```

The script validates scene files, writes an FFmpeg concat file, repeats the last
image so its duration is respected, and renders H.264 plus AAC at `1080x1920`.

## 6. Verify

Decode the complete render:

```powershell
ffmpeg -hide_banner -loglevel error -i renders\<slug>-full-preview.mp4 -f null NUL
```

Probe it:

```powershell
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of json renders\<slug>-full-preview.mp4
```

Create a sampled contact sheet and an ending frame:

```powershell
ffmpeg -hide_banner -loglevel error -y -i renders\<slug>-full-preview.mp4 `
  -vf "fps=1/10,scale=216:384,tile=5x4:padding=4:margin=4:color=white" `
  -frames:v 1 renders\<slug>-full-contact-sheet.png

ffmpeg -hide_banner -loglevel error -y -ss 170 `
  -i renders\<slug>-full-preview.mp4 -frames:v 1 renders\<slug>-ending-check.png
```

Choose the ending timestamp relative to the actual video duration.

## 7. Package YouTube Submission

Follow `youtube-packaging.md`. Create the metadata file and a `9:16` thumbnail
before delivery.
