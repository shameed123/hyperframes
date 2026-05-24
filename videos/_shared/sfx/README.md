# Shared Short-Form SFX Pack

Reusable, subtle WAV sound effects for HyperFrames shorts.

## Files

- `whoosh-soft.wav`: scene transitions, fast card moves, large wipes.
- `ping-soft.wav`: positive reveal, matched term, selected item.
- `pong-soft.wav`: lower confirm tone, comparison beat, secondary reveal.
- `pop-soft.wav`: small card, badge, token, or stamp reveal.
- `chime-soft.wav`: opening hook, CTA, final payoff.
- `click-soft.wav`: typed UI, button, cursor, small interface action.

## Usage

Copy the pack into the project before rendering:

```powershell
New-Item -ItemType Directory -Force videos\<slug>\assets\sfx | Out-Null
Copy-Item -Force videos\_shared\sfx\*.wav videos\<slug>\assets\sfx\
```

Reference the local copy from `index.html`:

```html
<audio
  id="sfx-scene-whoosh"
  class="clip"
  data-start="12.3"
  data-duration="0.55"
  data-track-index="40"
  data-volume="0.4"
  src="assets/sfx/whoosh-soft.wav"
></audio>
```

Keep SFX quiet under narration. Start around `data-volume="0.35"` to `0.6`,
then adjust after a review render.
