---
name: create-stick-figure-skit-short
description: Create complete narrated 9:16 stick-figure cartoon skit videos from a script, synthesized narration audio, and sample-art reference. Use when Codex needs to transcribe audio into word and sentence timestamps, design recurring cartoon characters, generate fast-changing scene images every one or two sentences, checkpoint generated images into the project, render the full vertical MP4, verify the output, package YouTube metadata, and generate a topic-forward 9:16 YouTube Shorts thumbnail.
---

# Create Stick-Figure Skit Short

Build the complete short-form video package. Continue through rendering,
verification, YouTube metadata, and a vertical thumbnail unless the user asks
for an intermediate checkpoint only.

Read these references as needed:

- `references/workflow.md`: end-to-end production sequence, folder layout,
  scene pacing, character consistency, checkpointing, rendering, and QA.
- `references/troubleshooting.md`: Windows, Whisper, Hugging Face cache,
  image-generation save paths, and FFmpeg fixes encountered in practice.
- `references/youtube-packaging.md`: metadata file requirements and 9:16
  thumbnail rules.

Use these helpers:

- `scripts/transcribe_with_faster_whisper.py`: word and sentence timestamps
  when the HyperFrames `whisper-cpp` path is unavailable.
- `scripts/checkpoint_generated_images.py`: copy generated PNGs into the
  project using the scene manifest and a deliberate source offset.
- `scripts/render_storyboard.py`: validate a scene manifest and render the
  final 1080x1920 MP4 with FFmpeg.

## Default Workflow

1. Inspect the skit folder recursively. Locate narration audio, script text,
   and the sample-art reference. Confirm the actual folder name instead of
   trusting a spoken approximation.
2. Inspect the reference image. Define a visual identity and a locked
   character bible before generating any scene images.
3. Transcribe the full narration into word-level and sentence-level timestamp
   JSON. Prefer `npx.cmd hyperframes transcribe`; use the bundled fallback
   script when `whisper-cpp` is unavailable.
4. Convert sentence timestamps into a continuous `storyboard/full-scenes.json`
   manifest. Use rapid visual changes, normally one image every one or two
   sentences and about `2-4` seconds per image. Split long sentences when the
   joke benefits from a second visual beat.
5. Generate a 9:16 character lineup first. Keep wardrobe, hair, face, and role
   cues locked in every scene prompt.
6. If the user requests a proof of direction, generate and render the first
   `10` seconds before expanding the full manifest.
7. Generate scene images with built-in image generation. Copy project-bound
   images into `assets/storyboard/full/` immediately after each batch. Do not
   leave the only copy under `$CODEX_HOME/generated_images/`.
8. Render the full vertical video from the manifest and original narration.
   Verify all manifest scenes exist, decode the MP4 end to end, create a
   contact sheet, and inspect the final frame.
9. Create `youtube-submission-metadata.md` with a click-worthy title, SEO
   description, hashtags, keyword targets, a paste-ready YouTube Studio tag
   string, upload settings, and current official-reference notes.
10. Write a thumbnail prompt before generation. Generate a project-bound
    `9:16` Shorts thumbnail with a short topic-forward headline. For a vibe
    coding skit, prefer a hook such as `VIBE CODING FAIL`; do not use a generic
    punchline that fails to identify the topic.

## Mandatory Rules

- Target video and thumbnail orientation: `9:16`.
- Target render size: `1080x1920`.
- Use the original narration audio in the final render.
- Generate a new image every one or two spoken sentences unless a deliberate
  hold improves the joke.
- Keep images free of baked-in captions and long text. Allow short readable
  text only when the visual joke requires it, such as `$4,000`, or when
  generating the thumbnail headline.
- Preserve recurring character designs exactly across the full storyboard.
- Copy generated image outputs into the project before continuing large
  generation runs.
- Use `npx.cmd`, not `npx`, in PowerShell when script execution policy blocks
  `npx.ps1`.
- Keep YouTube Studio tags in the separate Tags field, not in the public
  description.

## Completion Gate

Do not stop at prompts or generated images. Deliver:

- sentence and word timestamp JSON files;
- character bible and scene manifest;
- project-bound scene PNGs;
- complete vertical MP4;
- representative contact sheet and ending-frame check;
- `youtube-submission-metadata.md`;
- saved thumbnail prompt and project-bound 9:16 thumbnail.

Run the scripts and validation commands described in `references/workflow.md`
before reporting completion.
