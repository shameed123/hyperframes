# Light Studio Server

This local fork contains the customized light-theme HyperFrames Studio.

The light Studio project is now standalone. You do not need to open a
composition project first or run commands from `C:\Users\sohai\AICoding\Hyperframes`.
Start the Studio from this repo and pass the HyperFrames project you want to
preview with `-ProjectPath`.

## Start AI Terms

If the AI Terms project is copied into this repo under `videos`, run:

```powershell
cd C:\Users\sohai\AICoding\hyperframes-studio-light
bun run studio:project -- -ProjectPath "videos\ai-terms-explained-without-jargon" -Relink
```

Then open:

```text
http://127.0.0.1:5192/#project/ai-terms-explained-without-jargon
```

Use `-Relink` when this Studio has already seen a project with the same folder
name from another location. It updates the saved Studio project link to point at
the copied local folder.

Trailing slashes are fine. These point at the same project:

```powershell
bun run studio:project -- -ProjectPath "videos\ai-terms-explained-without-jargon"
bun run studio:project -- -ProjectPath "videos\ai-terms-explained-without-jargon\"
```

If you want to preview the original AI Terms folder instead, use its full path:

```powershell
bun run studio:project -- -ProjectPath "C:\Users\sohai\AICoding\Hyperframes\videos\ai-terms-explained-without-jargon" -Relink
```

## Start Any HyperFrames Project

```powershell
cd C:\Users\sohai\AICoding\hyperframes-studio-light
bun run studio:project -- -ProjectPath "C:\path\to\hyperframes-project"
```

The command:

- verifies that the project path contains an `index.html`
- creates a project link under `packages\studio\data\projects`
- updates that link when `-Relink` is provided
- starts the light-theme Studio server
- prints the preview URL to open

By default, the Studio project name is the folder name from `-ProjectPath`.

## Custom Project Name

Use `-ProjectName` if you want the Studio URL name to differ from the folder
name:

```powershell
bun run studio:project -- -ProjectPath "C:\path\to\hyperframes-project" -ProjectName "my-project"
```

Then open:

```text
http://127.0.0.1:5192/#project/my-project
```

## Alternate Port

If port `5192` is busy, use another port:

```powershell
bun run studio:project -- -ProjectPath "C:\path\to\hyperframes-project" -Port 5193
```

Then open the same project name on that port:

```text
http://127.0.0.1:5193/#project/hyperframes-project
```

## Render A Video

Render commands use the HyperFrames CLI from this repo root. Validate before
rendering, then pass the video project folder to `hyperframes render`.

For the Google I/O 2026 video:

```powershell
cd C:\Users\sohai\AICoding\hyperframes-studio-light
node scripts\run-hyperframes.mjs lint videos\google-io-2026-update
node scripts\run-hyperframes.mjs validate videos\google-io-2026-update --no-contrast
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --output videos\google-io-2026-update\renders\google-io-2026-update.mp4
```

Use `node scripts\run-hyperframes.mjs` so commands run this checkout's built
CLI without relying on a root `node_modules\.bin\hyperframes.CMD` shim.

### Standard Review Render

Use this for a normal review copy. It balances quality and render time:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality standard --fps 30 --output videos\google-io-2026-update\renders\google-io-2026-update-standard.mp4
```

### Fast Draft Render

Use this while iterating on timing, layout, or animation:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality draft --fps 30 --output videos\google-io-2026-update\renders\google-io-2026-update-draft.mp4
```

### High Quality Final Render

Use this for the final upload file:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --fps 30 --output videos\google-io-2026-update\renders\google-io-2026-update-final.mp4
```

For a 4K portrait master, keep the same 9:16 aspect ratio and use
`portrait-4k`:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --fps 30 --resolution portrait-4k --output videos\google-io-2026-update\renders\google-io-2026-update-final-4k.mp4
```

For extra-smooth motion, render at 60fps. This takes longer and creates a
larger file:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --fps 60 --output videos\google-io-2026-update\renders\google-io-2026-update-final-60fps.mp4
```

For a larger but cleaner upload master, set a high video bitrate:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --fps 30 --video-bitrate 20M --output videos\google-io-2026-update\renders\google-io-2026-update-final-20mbps.mp4
```

Use either `--video-bitrate` or `--crf`, not both. Lower CRF usually means a
higher-quality, larger file:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --fps 30 --crf 16 --output videos\google-io-2026-update\renders\google-io-2026-update-final-crf16.mp4
```

### Worker Count

The renderer can use multiple workers. More workers can speed up rendering, but
each worker launches browser work and uses more CPU and memory.

Auto workers:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --workers auto --output videos\google-io-2026-update\renders\google-io-2026-update-auto-workers.mp4
```

Conservative render for limited memory:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --workers 2 --output videos\google-io-2026-update\renders\google-io-2026-update-workers-2.mp4
```

Faster render on a stronger machine:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --workers 6 --output videos\google-io-2026-update\renders\google-io-2026-update-workers-6.mp4
```

### GPU Or Docker

Try GPU encoding if your local setup supports it:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --gpu --output videos\google-io-2026-update\renders\google-io-2026-update-gpu.mp4
```

If a composition uses heavy WebGL or 3D, browser-side GPU capture can also help:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --browser-gpu --output videos\google-io-2026-update\renders\google-io-2026-update-browser-gpu.mp4
```

Use Docker when you need the most reproducible render output across machines:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --docker --output videos\google-io-2026-update\renders\google-io-2026-update-docker.mp4
```

### Other Output Formats

MP4 is the default and is the best choice for YouTube, TikTok, Instagram, and
general review files.

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --format mp4 --output videos\google-io-2026-update\renders\google-io-2026-update.mp4
```

Use WebM or MOV when you need transparency support:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --format webm --output videos\google-io-2026-update\renders\google-io-2026-update.webm
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --format mov --output videos\google-io-2026-update\renders\google-io-2026-update.mov
```

Use a PNG sequence for handoff into After Effects, Nuke, Fusion, or another
compositor:

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --format png-sequence --output videos\google-io-2026-update\renders\google-io-2026-update-png-sequence
```

### Strict Rendering

`--strict` fails on lint errors before rendering. `--strict-all` fails on both
errors and warnings. This project currently has maintainability warnings for a
large/dense composition, so use `--strict`, not `--strict-all`, unless those
warnings have been cleaned up.

```powershell
node scripts\run-hyperframes.mjs render videos\google-io-2026-update --quality high --strict --output videos\google-io-2026-update\renders\google-io-2026-update-strict.mp4
```

### Generic Render Template

For any HyperFrames project:

```powershell
cd C:\Users\sohai\AICoding\hyperframes-studio-light
node scripts\run-hyperframes.mjs lint "C:\path\to\hyperframes-project"
node scripts\run-hyperframes.mjs validate "C:\path\to\hyperframes-project" --no-contrast
node scripts\run-hyperframes.mjs render "C:\path\to\hyperframes-project" --quality standard --fps 30 --workers auto --output "C:\path\to\output.mp4"
```

Common render flags:

| Flag              | Typical values                                   | Use                                                                                               |
| ----------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `--output`        | `path\file.mp4`                                  | Choose the render file path.                                                                      |
| `--quality`       | `draft`, `standard`, `high`                      | Draft for speed, standard for review, high for final.                                             |
| `--fps`           | `24`, `30`, `60`                                 | Use `30` for most shorts; `60` for smoother motion.                                               |
| `--resolution`    | `portrait`, `portrait-4k`, `landscape`, `square` | Render a matching-aspect output preset.                                                           |
| `--workers`       | `auto`, `1`-`8`                                  | Increase for speed if the machine has enough memory.                                              |
| `--video-bitrate` | `10M`, `20M`, `30M`                              | Target a specific upload bitrate. Mutually exclusive with `--crf`.                                |
| `--crf`           | `16`, `18`, `20`, `23`                           | Encoder quality override. Lower is cleaner and larger. Mutually exclusive with `--video-bitrate`. |
| `--gpu`           | flag                                             | Try hardware-accelerated encoding.                                                                |
| `--browser-gpu`   | flag                                             | Force Chrome/WebGL capture to use host GPU acceleration.                                          |
| `--docker`        | flag                                             | More reproducible output, slower setup.                                                           |
| `--strict`        | flag                                             | Fail render on lint errors.                                                                       |
| `--strict-all`    | flag                                             | Fail render on lint errors and warnings.                                                          |
| `--format`        | `mp4`, `webm`, `mov`, `png-sequence`             | Use `mp4` for uploads; use other formats for transparency or compositor handoff.                  |

## Notes

- The server is long-running. Keep the terminal open while using the preview.
- If the browser already shows the preview, the server may already be running.
- The launcher script lives at `scripts\start-light-studio.ps1`.
- The package script is `studio:project` in `package.json`.
- If a project link already exists with the same name but points somewhere
  else, use `-Relink` to point that Studio project name at the new folder.
  Use a different `-ProjectName` only when you want both folders to appear as
  separate Studio projects.

## If Dependencies Are Missing

If startup reports missing Studio dependencies, run:

```powershell
cd C:\Users\sohai\AICoding\hyperframes-studio-light
bun install
bun run build:hyperframes-runtime
```

Then start the server again:

```powershell
bun run studio:project -- -ProjectPath "C:\path\to\hyperframes-project"
```
