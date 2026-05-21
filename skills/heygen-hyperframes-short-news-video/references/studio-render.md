# Studio, Validation, Snapshots, And Render

## Light Studio

Start Studio from this repo root and pass the video folder:

```powershell
cd C:\Users\sohai\AICoding\hyperframes-studio-light
corepack pnpm run studio:project -- -ProjectPath "videos\google-io-2026-update" -Relink
```

If port `5192` is busy:

```powershell
corepack pnpm run studio:project -- -ProjectPath "videos\google-io-2026-update" -Relink -Port 5193
```

URL pattern:

```text
http://127.0.0.1:<port>/#project/<project-folder-name>
```

For Google I/O:

```text
http://127.0.0.1:5193/#project/google-io-2026-update
```

## Validate

Run these after editing `index.html`:

```powershell
node_modules\.bin\oxfmt.CMD videos\google-io-2026-update\index.html
npx.cmd --no-install hyperframes lint videos\google-io-2026-update
npx.cmd --no-install hyperframes validate videos\google-io-2026-update --no-contrast
```

Zero lint errors and zero console errors are required. Existing large/dense
composition warnings can be acceptable.

## Snapshot

Use snapshots to verify exact problem frames:

```powershell
npx.cmd --no-install hyperframes snapshot videos\google-io-2026-update --at 0,0.75,2,62,72 --timeout 20000
```

Useful timestamps from Google I/O:

```text
0.0   thumbnail first frame
0.75  after thumbnail fade
2.0   intro avatar layout
62.0  PIP avatar shadow and corners
72.0  Chrome/smart-glasses wide avatar crop, shadow, corners
92.0  CTA avatar
```

## Render Commands

Standard review:

```powershell
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality standard --fps 30 --output videos\google-io-2026-update\renders\google-io-2026-update-standard.mp4
```

Fast draft:

```powershell
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality draft --fps 30 --output videos\google-io-2026-update\renders\google-io-2026-update-draft.mp4
```

Final:

```powershell
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality high --fps 30 --output videos\google-io-2026-update\renders\google-io-2026-update-final.mp4
```

Final 60fps:

```powershell
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality high --fps 60 --output videos\google-io-2026-update\renders\google-io-2026-update-final-60fps.mp4
```

4K portrait master:

```powershell
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality high --fps 30 --resolution portrait-4k --output videos\google-io-2026-update\renders\google-io-2026-update-final-4k.mp4
```

High bitrate:

```powershell
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality high --fps 30 --video-bitrate 20M --output videos\google-io-2026-update\renders\google-io-2026-update-final-20mbps.mp4
```

CRF master:

```powershell
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality high --fps 30 --crf 16 --output videos\google-io-2026-update\renders\google-io-2026-update-final-crf16.mp4
```

Workers:

```powershell
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality high --workers auto --output videos\google-io-2026-update\renders\google-io-2026-update-auto-workers.mp4
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality high --workers 2 --output videos\google-io-2026-update\renders\google-io-2026-update-workers-2.mp4
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality high --workers 6 --output videos\google-io-2026-update\renders\google-io-2026-update-workers-6.mp4
```

GPU and Docker:

```powershell
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality high --gpu --output videos\google-io-2026-update\renders\google-io-2026-update-gpu.mp4
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality high --browser-gpu --output videos\google-io-2026-update\renders\google-io-2026-update-browser-gpu.mp4
npx.cmd --no-install hyperframes render videos\google-io-2026-update --quality high --docker --output videos\google-io-2026-update\renders\google-io-2026-update-docker.mp4
```

Other formats:

```powershell
npx.cmd --no-install hyperframes render videos\google-io-2026-update --format webm --output videos\google-io-2026-update\renders\google-io-2026-update.webm
npx.cmd --no-install hyperframes render videos\google-io-2026-update --format mov --output videos\google-io-2026-update\renders\google-io-2026-update.mov
npx.cmd --no-install hyperframes render videos\google-io-2026-update --format png-sequence --output videos\google-io-2026-update\renders\google-io-2026-update-png-sequence
```

## Render Flag Notes

- `--quality draft`: fastest iteration.
- `--quality standard`: review copy.
- `--quality high`: final upload.
- `--fps 30`: normal Shorts/Reels/TikTok.
- `--fps 60`: smoother motion, longer render, larger file.
- `--workers auto`: default; may use more CPU and RAM.
- `--workers 2`: safer for limited memory.
- `--workers 6`: faster on stronger machines.
- `--video-bitrate` and `--crf` are mutually exclusive.
- `--strict` fails on lint errors.
- `--strict-all` also fails on warnings; avoid while large/dense warnings remain.

