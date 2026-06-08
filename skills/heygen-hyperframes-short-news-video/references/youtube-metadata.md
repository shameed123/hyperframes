# YouTube Thumbnail And Metadata Package

For every finished short news/update video, include a thumbnail prompt and
YouTube upload package in the final handoff. If the user asks only for
packaging or metadata, produce this package from the script/transcript without
rendering the video.

## Required Fields

- **Thumbnail Prompt**: a 9:16 image-generation prompt that names the central
  visual metaphor, emotional stakes, palette, style, text-safe space, and avoid
  list. Make it dramatic and clickable, but keep it faithful to the report or
  news source. Save the prompt as `videos/<slug>/thumbnail-prompt.md` when
  working inside a project folder.
- **Title**: catchy, clear, click-worthy, and SEO-readable, 45-70 characters
  when possible. Put the core topic and hook early, and prefer a curiosity or
  controversy hook that makes the target viewer want to click.
- **Description**: 2-4 short paragraphs. Use primary SEO keywords naturally in
  sentences; do not dump tags into the prose.
- **Hashtags**: 3-8 visible hashtags. Put the three most important first.
- **Tags**: comma-separated upload tags for YouTube Studio, mixing broad topic
  terms, exact title phrases, entity names, and misspelling/variant coverage.
  Keep the full tags string under 500 characters.
- **Upload time**: recommend a date/time and timezone. For news, prefer posting
  as soon as the video is ready; if scheduling, choose a strong audience window.

## Thumbnail Prompt Pattern

Use this shape when the user asks for an image prompt:

```text
Create a dramatic vertical 9:16 YouTube Shorts thumbnail about <story>.
Scene: <central subject/action/metaphor>. Include <1-3 concrete visual
details from transcript/source>. Mood: <stakes>. Visual style: <palette,
lighting, finish, realism/3D/editorial direction>. Composition: <where text
can go, what should dominate the frame>. Constraints: no clutter, no tiny
unreadable text, no distorted hands/faces, no irrelevant logos, no misleading
claims.
```

When title text should be baked into the image, specify exact words and keep
them short, usually 2-5 words.

## SEO Pattern

For tech news Shorts, weave these naturally into the title and description when
relevant:

```text
<event name>, <company>, <product/model>, AI update, AI news, tech news,
shorts, creator tools, developers, coding agents, search, workspace,
video generation
```

Do not overstuff the description. Use one primary phrase in the first sentence,
then related phrases later.

For educational AI explainer Shorts, weave these naturally when relevant:

```text
AI terms explained, AI glossary, artificial intelligence, AI for beginners,
plain English AI, no jargon, LLM, large language model, prompt, tokens,
context window, training data, inference, hallucination, embeddings, RAG,
retrieval augmented generation, AI agent, AI tutorial, AI explained,
YouTube Shorts
```

For description copy, include the terms actually discussed in the video at
least once, but keep the prose readable. Do not paste a raw keyword list into
the public description.

## Hashtags

Use relevant hashtags only. YouTube supports hashtags in titles/descriptions
and links them to hashtag pages. Avoid excessive hashtags; keep the visible set
tight and useful.

Good shape:

```text
#GoogleIO #GeminiAI #AINews #GoogleAI #TechNews #YouTubeShorts
```

## Tags

Tags are entered in YouTube Studio's tag field, not pasted as a block into the
description. They help with context and typo/variant matching, but title,
thumbnail, and description do most of the viewer-facing work.

Before returning tags, check character count if possible. Prefer fewer,
high-intent tags over a long list that risks exceeding the 500-character limit.

Good shape:

```text
Google I/O 2026, Google IO 2026, Gemini AI, Gemini update, Google AI,
AI agent, Gemini Omni, AI video generation, Google Search AI Mode,
Google Workspace AI, coding agents, Antigravity 2.0, Chrome AI,
smart glasses, AI news, tech news, YouTube Shorts
```

## Upload Time Guidance

There is no universal perfect upload time. Prefer the channel's YouTube
Analytics audience activity when available.

For US tech/news Shorts without channel-specific data:

- Breaking/current news: upload as soon as the video is ready.
- Scheduled weekday option: 9-11 AM in the target audience timezone.
- Alternate weekday option: 12-4 PM in the target audience timezone.
- Friday afternoon can work well for Shorts, but news relevance usually matters
  more than waiting.

Always state the timezone explicitly, for example:

```text
Recommended upload time: Thursday, May 21, 2026 at 11:00 AM CT
(9:00 AM PT / 12:00 PM ET).
```

## Final Answer Shape

Use this structure:

```markdown
**Thumbnail Prompt**
...

**Title**
...

**Description**
...

**Hashtags**
...

**Tags**
...

**Upload Time**
...
```

Keep it ready to paste into YouTube Studio.
