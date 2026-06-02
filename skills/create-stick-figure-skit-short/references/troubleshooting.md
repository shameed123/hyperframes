# Troubleshooting

## PowerShell Blocks `npx.ps1`

Symptom:

```text
npx.ps1 cannot be loaded because running scripts is disabled
```

Use the Windows command shim:

```powershell
npx.cmd hyperframes ...
```

## HyperFrames Cannot Find `whisper-cpp`

Symptom:

```text
Transcription failed: whisper-cpp not found
```

Use `scripts/transcribe_with_faster_whisper.py`. Install its dependency first:

```powershell
python -m pip install --user faster-whisper
```

## Hugging Face Cache Symlink Privilege Error

Symptom:

```text
OSError: [WinError 1314] A required privilege is not held by the client
```

Windows may not permit Hugging Face cache symlinks without Developer Mode or
administrator privileges. The fallback transcription script avoids this by
downloading the model into a plain `local_dir` under:

```text
~/.cache/hyperframes/faster-whisper/<model>/
```

Do not require Developer Mode or elevation.

## Generated Images Are Outside the Project

Built-in image generation writes to:

```text
$CODEX_HOME/generated_images/<session-id>/
```

Project-bound assets must be copied into the skit folder immediately after each
batch. Never reference the generated-images folder from the final project.
Leave the original generated copy in place unless the user explicitly asks to
delete it.

## Checkpoint Copier Safety

`checkpoint_generated_images.py` maps files in modification-time order. Use it
only when the source directory and source offset are known. Inspect counts
before copying. If unrelated images exist in the same source folder, copy
explicit files manually or set a deliberate offset.

## FFmpeg Concat Final Scene Duration

The concat demuxer needs the final file repeated after its `duration` line.
`render_storyboard.py` handles this. Without the repeated file, the final still
image can be shortened or omitted.

## Audio and Video Durations Differ Slightly

MP3 decoding and frame quantization can create small differences between the
requested render duration and probed MP4 duration. Decode the output end to end,
inspect the ending frame, and confirm the narration is complete.

## Thumbnail Ratio Mismatch

Generic YouTube thumbnail workflows often default to `16:9`. This workflow is
for a vertical short and requires a `9:16` thumbnail. State `9:16 vertical
YouTube Shorts thumbnail` explicitly in the image-generation prompt and verify
the saved dimensions. A generated portrait such as `941x1672` is effectively
9:16.

## Thumbnail Headline Is Too Generic

The headline must identify the content topic immediately. Prefer a compact,
topic-forward hook such as:

```text
VIBE CODING FAIL
```

Avoid relying only on a punchline such as `ONLY BILLING WORKED`; it can be
funny but does not tell a cold viewer what the video is about.
