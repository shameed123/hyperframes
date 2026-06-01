# YouTube Metadata Package

Create `videos/<slug>/youtube-metadata.md` for every completed slide-based
educational short.

## Required Fields

- **Title**: Write one catchy, click-worthy title. Put the topic early and add
  a curiosity or utility hook. Aim for `45-70` characters when practical.
- **Description**: Write readable SEO copy with a strong first sentence,
  `2-4` short paragraphs, and a clear CTA.
- **Course outline reference**: Add a fill-in placeholder:

```text
Complete AI Terminology Course Outline: [ADD COURSE OUTLINE URL HERE]
```

- **SEO keywords**: List the selected keywords after the description and verify
  that every listed keyword appears naturally in the description as an exact
  searchable phrase. Keep multi-word keywords contiguous in the Markdown
  source; do not split them across manual line wraps.
- **Hashtags**: Add `5-8` relevant visible hashtags.
- **Tags**: Add a comma-separated YouTube Studio tag string and verify it is no
  more than `500` characters.

## Educational AI Keyword Pool

Select the terms relevant to the actual video. Use every selected keyword in
the public description:

```text
AI training
AI inference
training vs inference
artificial intelligence
AI for beginners
AI explained
machine learning
machine learning model
large language model
LLM
training data
model weights
tokens
prompts
context window
generative AI
ChatGPT
AI agents
coding agents
AI tutorial
AI glossary
AI terms explained
```

Add topic-specific terms when useful. Keep the prose readable; do not paste a
raw keyword dump into the public description.

## Tag Verification

Use PowerShell to verify the YouTube Studio tag string:

```powershell
$tags = 'comma-separated tags'
$tags.Length
```

The result must be `500` or lower. Mix exact topic phrases, variants, beginner
queries, and relevant entities. Do not paste upload tags into the public
description.

## Ready-to-Paste Shape

```markdown
# YouTube Upload Package

## Title

...

## Description

...

## SEO Keywords Used in the Description

...

## Hashtags

...

## YouTube Studio Tags

...

## Tag Character Count

... characters
```
