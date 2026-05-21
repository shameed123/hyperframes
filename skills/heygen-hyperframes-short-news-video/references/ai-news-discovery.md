# AI News Discovery

Before scripting any short news/update video, gather and rank current AI news.
Do not rely on memory for "latest" items. Browse current sources and cite the
sources used in the final research summary.

## Source Priority

Start with primary sources because they are the best source for exact
announcements, release names, pricing, availability, model names, and demos.

Primary/company sources:

- OpenAI News: `https://openai.com/news/`
- Google AI Blog: `https://blog.google/technology/ai/`
- Google Developers Blog: `https://developers.googleblog.com/`
- Google DeepMind Blog: `https://deepmind.google/discover/blog/`
- Anthropic News: `https://www.anthropic.com/news`
- Meta AI Blog: `https://ai.meta.com/blog/`
- Microsoft AI Blog: `https://blogs.microsoft.com/ai/`
- Microsoft Research Blog: `https://www.microsoft.com/en-us/research/blog/`
- NVIDIA Blog AI category: `https://blogs.nvidia.com/blog/category/deep-learning/`
- Hugging Face Blog: `https://huggingface.co/blog`
- Mistral AI News: `https://mistral.ai/news/`
- xAI News or official posts when relevant.
- Product docs/changelogs for developer tools and APIs.

Use reputable reporting to discover and cross-check what is hot:

- The Verge AI
- TechCrunch AI
- Axios AI/tech
- Bloomberg Technology
- Reuters Technology
- The Information
- Wired AI
- MIT Technology Review AI
- VentureBeat AI
- Ars Technica AI
- The Decoder
- Ben's Bites or The Rundown AI for discovery only; verify with stronger
  sources before scripting.

Use research and benchmark sources when the story is technical:

- arXiv papers
- Papers with Code
- Model cards and system cards
- GitHub release notes
- Official benchmark repos
- Stanford HAI, Epoch AI, METR, AI Index, or similar research organizations

Use social platforms only as leads:

- Official X/Twitter, LinkedIn, YouTube demos, Discord/forum posts, and GitHub
  issues can reveal breaking details.
- Treat social posts as unverified until confirmed by primary docs or reputable
  reporting.

## Search Queries

Run several focused queries:

```text
AI news today latest model release
site:openai.com/news OpenAI latest AI
site:blog.google/technology/ai Google AI latest
site:anthropic.com/news Anthropic latest Claude
site:ai.meta.com/blog Meta AI latest
AI coding agent release today
AI video generation model release
AI search update today
```

For a weekly video, search the last 7 days. For breaking news, search the last
24-48 hours.

## Ranking Criteria

Score candidate stories:

- **Freshness**: published today or this week.
- **Authority**: primary source or multiple reputable reports.
- **Audience interest**: creators, developers, entrepreneurs, and general AI
  users would care.
- **Practical impact**: changes what people can do, build, automate, or buy.
- **Visual potential**: can be shown with motion graphics, UI panels, demos,
  icons, charts, or before/after visuals.
- **Clarity**: can be explained in 30-90 seconds without heavy caveats.
- **Novelty**: not just a minor patch or routine partnership.

Prefer stories with a clear "why it matters" angle:

```text
AI can now do X.
This changes Y workflow.
Developers/creators/businesses get Z new capability.
This company is moving toward agents, multimodal AI, robotics, search, coding,
video generation, enterprise AI, or on-device AI.
```

## Verification Rules

- Confirm the exact product/model/event name from a primary source.
- Check the publication date and use absolute dates in the script when helpful.
- Distinguish announced, available today, rolling out, waitlist, preview, and
  rumored.
- For rumors/leaks, label them clearly or skip them for evergreen authority.
- Do not present speculation as fact.
- If sources disagree, say so or choose a different story.

## Output Before Scripting

Produce a compact research brief:

```markdown
**Top Story Recommendation**
<story and why it wins>

**Why It Matters**
<viewer-facing angle>

**Verified Facts**
- <fact> — <source>
- <fact> — <source>

**Visual Hooks**
- <motion graphic idea>
- <thumbnail idea>

**Backup Stories**
- <story> — <why it ranked lower>
```

Then write the short-form script from the selected story.
