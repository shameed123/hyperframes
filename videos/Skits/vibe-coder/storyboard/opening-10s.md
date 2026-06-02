# Vibe Coder Skit: Opening 10-Second Storyboard

## Visual Identity

- Format: vertical 9:16 short-form video.
- Style reference: `../resources/sample-art.png`.
- Art direction: clean flat 2D stick-figure cartoon. Use black line limbs, rounded white faces, dot eyes, tiny expressive mouths, simple clothing blocks, bright uncluttered office interiors, and a restrained pastel palette. Keep the look crisp and intentionally simple.
- Avoid: photorealism, 3D rendering, detailed anatomy, complex gradients, watermarks, UI chrome, subtitles, captions, and text baked into the images.

## Character Bible

Keep these designs consistent in every image:

| Character | Role | Locked design |
| --- | --- | --- |
| Senior Engineer | Narrator and grounded observer | White rounded stick-figure face, black dot eyes, short dark-brown side-parted hair, small rectangular black glasses, muted teal crewneck sweater, charcoal trousers, black shoes. Calm, slightly tired expressions. |
| Vibe Coder | Overconfident builder | White rounded stick-figure face, black dot eyes, short messy black hair, white hoodie with the hood visible, dark jeans, white sneakers. Excited body language. |
| Investor | Demo audience | White rounded stick-figure face, black dot eyes, neat black hair, navy suit, white shirt, orange tie, black shoes. Reserved, skeptical posture. |

## Audio Timing Evidence

The opening was transcribed from `../assets/audio/opening-10s.wav` using local Whisper-compatible word timestamps.

| Spoken line | Start | End |
| --- | ---: | ---: |
| "I'm a senior software engineer." | 00:00.00 | 00:01.14 |
| "I've spent years learning databases, security, testing, deployment, and the ancient ritual of staring at an error message until it feels guilty." | 00:01.82 | 00:08.36 |
| "But last Tuesday, a..." | 00:09.12 | 00:10.00 |

The full 173-second narration has also been processed for the next storyboard pass:

- Word-level timestamps: `../assets/audio/transcript-words.json`
- Sentence-level timestamps: `../assets/audio/sentence-timestamps.json`

## Opening Shot List

The second spoken sentence is deliberately split into two visual beats to keep the pacing brisk.

| Image | Time | Narrative beat | Composition |
| --- | ---: | --- | --- |
| `scene-01-senior-engineer.png` | 00:00.00-00:01.82 | Establish the narrator as a credible senior engineer. | The Senior Engineer stands at a simple office workstation with an open laptop and one monitor, facing the viewer with a calm, slightly weary expression. Use a medium-wide vertical composition with generous headroom. |
| `scene-02-engineering-stack.png` | 00:01.82-00:05.36 | Visualize years of serious engineering work. | The Senior Engineer stands in the center of a bright office, juggling four simple symbolic objects: a database cylinder, a shield, a checklist clipboard, and a small cloud-upload arrow. Keep each symbol large and instantly readable. |
| `scene-03-error-ritual.png` | 00:05.36-00:09.12 | Land the joke about staring at an error until it feels guilty. | The Senior Engineer sits rigidly at a desk, leaning toward a monitor that shows a simple red error panel with an exclamation mark only. Add a coffee mug and subtle under-eye fatigue. Keep the expression deadpan. |
| `scene-04-last-tuesday.png` | 00:09.12-00:10.00 | Tease the arrival of the hoodie coder. | Use a simple office doorway composition. The Senior Engineer turns toward the doorway while the Vibe Coder strides in holding an open laptop, wearing the locked white hoodie and looking far too confident. |

## Image Generation Prompts

### Shared Prompt Prefix

Use case: illustration-story  
Asset type: vertical short-form skit storyboard image  
Primary request: Create one clean flat 2D stick-figure cartoon scene for a fast-paced skit.  
Input image: `../resources/sample-art.png` is the style reference.  
Style/medium: simple black-line stick figures, rounded white faces, dot eyes, tiny expressive mouths, flat clothing colors, bright pastel office environment.  
Composition/framing: 9:16 vertical frame, readable pose, uncluttered background, no important details near the edges.  
Constraints: Preserve the locked character designs exactly. Use only characters named in the scene.  
Avoid: photorealism, 3D, detailed anatomy, watermarks, social-media UI, subtitles, captions, and baked-in text.

### Scene 01

The Senior Engineer stands at a tidy office workstation with an open laptop and one monitor, facing the viewer with a calm, slightly weary expression. Medium-wide vertical framing. The Senior Engineer has a white rounded stick-figure face, black dot eyes, short dark-brown side-parted hair, small rectangular black glasses, a muted teal crewneck sweater, charcoal trousers, and black shoes.

### Scene 02

The Senior Engineer stands in the center of a bright office, juggling four clear oversized engineering symbols: a database cylinder, a shield, a checklist clipboard, and a small cloud-upload arrow. The pose is competent but slightly exhausted. The Senior Engineer has a white rounded stick-figure face, black dot eyes, short dark-brown side-parted hair, small rectangular black glasses, a muted teal crewneck sweater, charcoal trousers, and black shoes.

### Scene 03

The Senior Engineer sits rigidly at a desk and leans toward a desktop monitor with a simple red error panel containing one exclamation mark. Add a coffee mug and subtle under-eye fatigue. The deadpan joke is that the engineer is staring at the error until it feels guilty. The Senior Engineer has a white rounded stick-figure face, black dot eyes, short dark-brown side-parted hair, small rectangular black glasses, a muted teal crewneck sweater, charcoal trousers, and black shoes.

### Scene 04

In a simple bright office doorway composition, the Senior Engineer turns toward the door while the Vibe Coder strides in holding an open laptop and looking far too confident. The Vibe Coder has a white rounded stick-figure face, black dot eyes, short messy black hair, a white hoodie with the hood visible, dark jeans, and white sneakers. The Senior Engineer keeps the locked muted teal sweater and glasses design.
