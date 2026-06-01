# AI Training vs Inference

## Format

- Platform: YouTube Shorts / TikTok / Reels
- Aspect ratio: 9:16 vertical
- Actual length: 89.642 seconds
- Avatar source: HeyGen Avatar III, generated from the shared root `.env`
- Slide sources:
  - `videos/AI Slides Videos/AI 101 Slides_files/training.html`
  - `videos/AI Slides Videos/AI 101 Slides_files/inference.html`
- Visual style: treat each 16:9 slide as a large canvas inside the 9:16 video. Use smooth camera pans, zooms, a visible cursor, and soft highlighter strokes synchronized to the narration.
- Status: composition built from accepted HeyGen narration

## Exact HeyGen Voiceover

The exact text sent to HeyGen is in `heygen-input.txt`.

## Synchronized Scene Map

Timings below are synchronized to the accepted HeyGen SRT.

| Time | Voiceover Beat | Slide Region And Direction |
| --- | --- | --- |
| 0-4.60s | An AI model has two lives: training and inference. | Opening card over the training slide. |
| 4.60-10.97s | Training is like going to school. | Zoom into the training title and underline the key idea. |
| 10.97-22.98s | Cat example: show data, model guesses dog, measure loss, nudge weights. | Move clockwise through the four loop cards with cursor and focus box. |
| 22.98-30.48s | Weights are numbers inside the model. | Hold on the nudge-weights card while the explanation lands. |
| 30.48-41.08s | Repeat the loop billions of times. Training costs time and compute. | Pull back to reveal the full loop and underline the takeaway. |
| 41.08-49.47s | Inference happens after graduation, every time you press send. | Push transition to the inference slide and zoom into the inference card. |
| 49.47-60.23s | Inference takes seconds and uses prompt context without changing weights. | Focus on inference speed, then compare against the training card. |
| 60.23-74.69s | The base model is not retraining during your conversation. | Pull back to the full comparison and underline the takeaway. |
| 74.69-84.86s | Understand AI without jargon. Find the complete course through the description, bio, or pinned comment. | Show the course card and animate the three destination pills. |
| 84.86-89.64s | Subscribe, follow, and like for more. | Hold the end card and avatar through the spoken close. |

## Narration Draft

An AI model has two very different lives: training and inference.

Training is like going to school. Before the product ships, the model practices with enormous amounts of data.

Imagine showing it a photo labeled cat. The model guesses dog. Measure how wrong that guess was. That error is called the loss. Then nudge the model's internal weights so the next guess moves a little closer to cat.

Those weights are just numbers inside the model. As the numbers change, the model gets slightly better at recognizing patterns and making useful predictions.

Repeat that loop billions of times, across text, images, or other examples. That is training: expensive, compute-heavy, and done in advance. It can take weeks or months and cost millions of dollars in compute.

Inference happens after graduation. Every time you press send, the trained model uses what it learned to generate an answer, token by token.

This is a very different phase. Inference usually takes seconds and can cost a fraction of a cent. Instead of changing the model's weights, your prompt and conversation history give the model context for the answer it should produce right now.

That leads to one important detail: the base model is not retraining during your conversation. It can use earlier messages in the chat, but its learned weights are not rewritten every time you ask a question.

Training is learning. Inference is using what was learned.

Want to understand AI without the jargon? I created a complete course that explains the essential terms with simple examples. Check the description, bio, or pinned comment to start learning.

If you like AI explanation videos like this, subscribe, follow and like for more.

## Planned Build After Approval

1. Submit `heygen-input.txt` through `scripts/heygen-avatar-v2.mjs`.
2. Poll until HeyGen returns the completed Avatar III MP4 and official SRT.
3. Render clean PNG captures of both source slides.
4. Create a 1080x1920 vertical composition using the slides as animated canvases.
5. Sync slide camera moves, cursor travel, highlights, avatar picture-in-picture, and captions to the SRT.
6. Render verification stills and the final MP4.
