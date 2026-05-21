# Google I/O 2026 Update

## Format

- Platform: YouTube Shorts / TikTok / Reels
- Aspect ratio: 9:16 vertical
- Avatar source: HeyGen Avatar III, generated dynamically from the shared root `.env`; use a 16:9 avatar source for the bottom-right picture-in-picture crop
- Motion graphics style: continuous light-theme AI briefing, glass panels, connected UI diagrams, animated search/code/video cards
- Target length: final duration follows HeyGen narration timestamps; first estimate is 2:05-2:25 including CTA
- Status: script ready for user approval before HeyGen generation

## Exact HeyGen Voiceover

The exact text to send to HeyGen is in `heygen-input.txt`.

## Estimated Scene Map

Actual scene timings must be replaced with HeyGen caption timestamps after generation.

| Est. Time | Voiceover Beat                                                                                                                                   | Motion Graphics Direction                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 0-8s      | Google I/O 2026 just happened, and the message was clear: Gemini is not just another chatbot.                                                    | Fast keynote-style opener. Google I/O 2026 title, Gemini orb/interface, chatbot bubble collapses into "AI AGENT".                     |
| 8-22s     | Gemini 3.5 is the model upgrade for coding, planning, multi-step tasks, and work.                                                                | Model card expands into four connected task modules: Code, Plan, Research, Execute. Lines animate between them.                       |
| 22-44s    | Gemini Omni for creators: video generation and editing from text, images, audio, and video.                                                      | Multimodal input rail flows into a video canvas. Editing commands appear as chips: "change background", "cinematic", "YouTube Short". |
| 44-60s    | The bigger direction: Gemini app daily brief and personal AI agent for Gmail, Calendar, and Workspace.                                           | Phone UI with daily brief, calendar blocks, inbox summaries, and background task queue.                                               |
| 60-76s    | Search becomes conversational with AI Mode and richer context from images, files, videos, and Chrome tabs.                                       | Search box stretches into a conversation panel. Files, image thumbnails, video card, and Chrome tabs attach as context.               |
| 76-96s    | Developers get Google Antigravity 2.0, where parallel coding agents can fix bugs, write tests, and build features.                               | Three agent lanes run in parallel over code windows. Bug fix, test, and feature cards merge into a completed pull request.            |
| 96-108s   | Chrome moves toward the agentic web, and smart glasses return with Gemini built in.                                                              | Browser DOM-like nodes become agent-readable. Glasses HUD appears with a subtle Gemini assistant overlay.                             |
| 108-124s  | The meaning: Google is building an ecosystem where Gemini can see, listen, search, code, create videos, manage work, and interact with websites. | Ecosystem map with Gemini in the center and seven capability nodes orbiting in a connected graph.                                     |
| 124-136s  | The future is not just AI chat. It is AI that actually does things.                                                                              | Chat panel transforms into an action dashboard. Final lockup: "AI THAT DOES THINGS".                                                  |
| 136-144s  | CTA: like, subscribe, and follow for more.                                                                                                       | Reused visual CTA scene only; no separate CTA audio, because the avatar speaks the CTA.                                               |

## Avatar Overlay Notes

- Place the avatar as a square picture-in-picture in the bottom-right corner.
- Crop the center of the 16:9 HeyGen MP4 into the square.
- Use no visible border.
- Add a deep, soft, blurry shadow and a restrained cyan/blue glow so the avatar floats above the graphics.
- Keep captions above the lower graphics/avatar zone.
- End the avatar overlay when the CTA visual takes over, unless the actual final timing makes the spoken CTA feel better with the avatar still visible.

## Caption Notes

- Use the HeyGen SRT as the source of truth.
- Convert SRT line timings to word-level captions if no word-level timestamps are returned.
- Keep captions to 3-4 words per page.
- Uppercase caption text.
- Highlight the active word with a cyan pill at roughly 25% opacity.

## Source Check

This folder is based on the user-provided script. Before final publishing, verify announcement names and product details against official Google I/O 2026 sources or the latest Google blog posts.
