# YouTube Metadata Deliverable

Produce `videos/<slug>/youtube-metadata.md` for every finished video. Derive
everything from the **transcript** (the actual content/claims of the video) so
the metadata is accurate, not generic. Write it for the platform the footage
targets (portrait 1080x1920 → YouTube **Shorts**, so lean into Shorts-friendly
phrasing and hashtags).

## What it must contain

1. **Title** — eye-catching, high-CTR, viral potential.
2. **Description** — SEO-keyword-rich, with hashtags.
3. **Tags** — a single comma-separated string, **400–500 characters** total
   (count them), ready to paste into the upload Tags box.

## Title rules

- Hook in the first ~40 characters (mobile truncates).
- Use curiosity, a bold claim, a number, or a stakes word — pulled from the
  transcript's strongest beat (e.g. "5× cheaper", "beats GPT-5.5", "1M context").
- Prefer concrete specifics over vague hype. Honest > clickbait that the video
  doesn't deliver.
- Offer 2–3 title options and mark a recommended one.
- ALL-CAPS sparingly (one or two power words max).

## Description rules

- First 2 lines carry the SEO weight and show above the fold — front-load the
  primary keywords and restate the hook.
- 3–6 short paragraphs / lines covering what the video shows, naturally working
  in secondary keywords and entities named in the transcript (model names,
  companies, benchmarks, prices, features).
- Optionally a short bulleted "what you'll learn / timestamps" block.
- End with a block of **hashtags** (8–15), most-specific first, mixing
  broad-reach (#AI, #Shorts) with niche (#GLM52, #OpenWeights). Hashtags may
  also appear inline where natural.

## Tags rules

- Comma-separated, **400–500 characters total** — state the exact count in the
  file so the user can trust it at upload time.
- Mix head terms, long-tail phrases, entity names, and common
  misspellings/variants drawn from the transcript and topic.
- No `#` in tags; no duplicates; keep each tag a real search phrase.

## File template

```markdown
# YouTube Metadata — <Video Title Topic>

## Title (pick one)
1. <recommended title> ✅
2. <alt title>
3. <alt title>

## Description
<2-line hook with primary keywords>

<body paragraphs with secondary keywords and named entities from the transcript>

<optional: • bullets / timestamps>

#Hashtag1 #Hashtag2 #Hashtag3 ... (8–15)

## Tags (paste into YouTube Tags box — NNN characters)
tag one, tag two, long tail phrase, entity name, variant spelling, ...
```

Always re-count the tag string and write the real character count in place of
`NNN`. If it's under 400 or over 500, adjust before finishing.
