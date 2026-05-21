# Production Plan

## Step 1: Approve Narration

Review `heygen-input.txt`. This is the exact text that will be sent to HeyGen. The final line includes the spoken CTA so the motion graphics CTA can stay visual-only.

## Step 2: Add HeyGen Configuration

Use the shared repo root `.env` for HeyGen configuration. These values apply across future videos.

Required values:

- `HEYGEN_API_KEY`
- `HEYGEN_AVATAR_ID`
- `HEYGEN_VOICE_ID`

Optional:

- `HEYGEN_VOICE_SPEED`

## Step 3: Generate Avatar

Use HeyGen v2 Studio generation with:

- input: `videos/google-io-2026-update/heygen-input.txt`
- output: `videos/google-io-2026-update/assets/avatar/heygen-avatar-16x9.mp4`
- dimensions: 1280x720
- final composition format: 9:16 vertical short

Save status and metadata files:

- `videos/google-io-2026-update/heygen-status.json`
- `videos/google-io-2026-update/heygen-metadata.json`

## Step 4: Capture Timings

Prefer HeyGen captions if available. Save the accepted captions to:

- `videos/google-io-2026-update/assets/captions/heygen-captions.srt`

Then replace the estimated scene timings in `script.md` with actual timestamp-aligned beats.

## Step 5: Build Motion Graphics

Create the 9:16 Hyperframes composition with:

- continuous motion graphics
- bottom-right avatar picture-in-picture
- timestamp-synced graphics sections
- captions derived from the accepted SRT
- final CTA visual scene

## Step 6: Validate

After creating or editing the `.html` composition:

```bash
npx hyperframes lint
npx hyperframes validate
```
