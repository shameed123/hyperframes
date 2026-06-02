# Source Website B-Roll

Use source-site B-roll for short news videos whenever the story is about a
company announcement, research page, product page, demo page, docs page, map, or
blog post. The viewer should see the real source, not only abstract graphics.

## Principles

- Capture source pages before writing final scene direction when the website is
  central to the story.
- Save every visual asset inside `videos/<slug>/assets/motion/`; do not load
  remote websites at render time.
- Prefer a mobile viewport for Shorts/Reels/TikTok. It makes the source page
  feel like someone is scrolling on a phone.
- Make website footage large on screen. If a page is important, it should fill
  roughly 65-85% of the width, not sit as a small decorative card.
- Keep scrolls fast enough to feel alive. Long source pages usually need an
  8-12 second animated scroll, not a slow full-page crawl.
- Use real source visuals first, then add HyperFrames overlays. Avoid generic
  graph-paper cards, bland grids, giant ring/O motifs, or placeholders when a
  real page/map/product screenshot can carry the beat.

## Folder Layout

```text
videos/<slug>/assets/motion/
  mobile/
    <source>-mobile-full.png
    <source>-mobile-hero.png
  broll/
    <source>-scroll.mp4
    <source>-desktop.png
  maps/
    <map-or-landmark>-raw.png
    <map-or-landmark>-card.html
    <map-or-landmark>-card.png
```

Track source URLs in `sources.md`, `source-notes.md`, or the script file with:

- URL
- page title
- capture date
- why it is visually relevant
- which local asset(s) came from it

## Capture Modes

### Mobile Source Page Scroll

Use this for news articles, launch blogs, docs, and research pages.

For the deterministic project helper, create a JSON array:

```json
[
  {
    "id": "announcement",
    "url": "https://example.com/news/announcement",
    "expectedTitleIncludes": "Announcement title"
  }
]
```

Then run:

```powershell
node scripts\capture-mobile-broll.mjs <slug> <sources-json>
```

The helper uses `puppeteer-core`, an installed system Chrome or Edge browser,
a project-local temporary profile, a `412x915` mobile viewport, a mobile user
agent, hero and full-page PNG captures, and a normal-speed scroll plan. It
resets the page to the hero position before capture, records the final URL and
title, and rejects low-content pages. Add `expectedTitleIncludes` whenever a
redirect to the wrong article would be easy to miss.

To recapture only selected sources after visual QA:

```powershell
node scripts\capture-mobile-broll.mjs <slug> <sources-json> <source-id> [<source-id>...]
```

1. Open the page in Chromium/Edge with a mobile viewport around `390x844`,
   `412x915`, or `430x932`, and a mobile user agent.
2. Accept or dismiss cookie banners, sign-in nags, newsletter modals, and other
   blocking overlays.
3. Wait for fonts and images to finish loading.
4. Save a hero screenshot and a full-page screenshot:
   - hero: `assets/motion/mobile/<source>-mobile-hero.png`
   - full page: `assets/motion/mobile/<source>-mobile-full.png`
5. In HyperFrames, place the full-page PNG inside a phone frame and animate the
   `y` position to simulate a fast finger scroll.

Use static full-page screenshots as the default because they are deterministic
and render reliably. Use recorded website video only when real interactions,
hover states, embedded demos, animated canvases, maps, or page transitions are
important.

### Recorded Website Video

Use this when the page itself has meaningful motion or when the user explicitly
asks for footage captured while scrolling.

1. Use Playwright or Puppeteer with a mobile viewport.
2. Start browser video recording or screencast capture.
3. Scroll with scripted motion for 5-10 seconds. Prefer a quick scroll with
   brief pauses at visually important sections.
4. Save to `assets/motion/broll/<source>-scroll.webm` or `.mp4`.
5. Re-encode if needed so the file seeks cleanly:

```powershell
ffmpeg -y -i assets\motion\broll\raw.webm -vf "fps=30,scale=1080:-2" -c:v libx264 -pix_fmt yuv420p assets\motion\broll\<source>-scroll.mp4
```

In the composition, use it as a muted video clip:

```html
<video
  id="source-scroll"
  class="clip broll-video"
  data-start="10.8"
  data-duration="8.5"
  data-track-index="6"
  src="assets/motion/broll/source-scroll.mp4"
  muted
  playsinline
></video>
```

### Maps, Street View, And Landmarks

Use this when the story involves places, maps, location data, robotics,
simulation, navigation, travel, real-world grounding, or Street View.

- First try to capture the real map, satellite, Street View, or landmark page.
- If live 3D buildings are unavailable in headless capture, combine a real map
  or satellite screenshot with a local stylized overlay: 3D building extrusions,
  landmark labels, map pins, source badges, route lines, and subtle glass
  highlights.
- The result should read as "real place becoming an AI world," not as abstract
  graph paper.
- Save the generated card as a project-bound PNG and use it anywhere a floating
  map/world visual is needed.

## HyperFrames Patterns

For a screenshot scroll inside a phone:

```html
<div class="phone">
  <div class="phone-screen">
    <img
      id="source-mobile-page"
      class="phone-page"
      src="assets/motion/mobile/source-mobile-full.png"
      alt="Source website mobile page"
    />
  </div>
  <div class="scroll-indicator"><div class="scroll-thumb"></div></div>
</div>
```

```css
.phone {
  position: absolute;
  left: 120px;
  top: 500px;
  width: 820px;
  height: 1376px;
  overflow: hidden;
  border: 20px solid #0c1832;
  border-radius: 74px;
  background: #fff;
  box-shadow: 0 54px 130px rgba(0, 49, 130, 0.28);
}

.phone-screen {
  position: absolute;
  inset: 36px 0 0;
  overflow: hidden;
  border-radius: 48px;
}

.phone-page {
  width: 100%;
  height: auto;
  display: block;
  will-change: transform;
}
```

```js
tl.to("#source-mobile-page", { y: -4700, duration: 8.4, ease: "power2.inOut" }, 22.7);
```

Tune the `y` distance by checking the full-page image height and the phone
viewport height. The scroll should reveal several meaningful sections and land
on a visually useful area, not only the footer.

For a floating map/landmark card, use a real captured/source-derived asset:

```css
.map-card {
  position: absolute;
  width: 760px;
  height: 532px;
  border: 3px solid rgba(255, 255, 255, 0.74);
  border-radius: 34px;
  background-image: url("assets/motion/maps/landmark-map-card.png");
  background-size: cover;
  background-position: center;
  box-shadow:
    0 38px 86px rgba(0, 50, 130, 0.22),
    0 0 52px rgba(0, 104, 255, 0.16);
  filter: drop-shadow(0 42px 82px rgba(0, 93, 255, 0.24));
  will-change: transform;
}
```

Use gentle, non-distracting drift:

```js
tl.fromTo(
  ".map-card",
  { y: 18, rotateZ: -5, scale: 0.94 },
  {
    y: -18,
    rotateZ: 5,
    scale: 1.02,
    duration: 3.2,
    repeat: 19,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.2,
  },
  0.6,
);
```

## Motion Graphics Layering

- Pair source footage with active overlays: source chips, labels, callout pins,
  progress bars, highlighted phrases, route lines, and compact data cards.
- Do not cover the article headline, map label, or product UI with captions,
  avatar windows, or oversized overlays.
- If the avatar is present, let it float subtly with separate `x` and `y`
  tweens so the page footage still remains the hero.
- Keep captions anchored in a predictable lower band unless the source footage
  needs that space; then move the B-roll or avatar rather than hiding captions.

## Thumbnail Rule

Before generating or rendering a thumbnail, write a thumbnail prompt that
explicitly names the source-driven visual: mobile page, map/landmark, product
UI, or demo screenshot. Avoid generic graph paper, abstract rings, and blank
tech-grid backgrounds unless the user asks for that style.

## Quality Gate

Before final render:

- Snapshot every beat where website footage appears.
- Verify no cookie banners, login walls, loading spinners, or blank panels are
  visible.
- Verify the B-roll is large enough to read as website footage on a phone.
- Verify the scroll speed feels energetic in a 1-2 minute short.
- Verify the avatar and captions do not cover the important page/map area.
- Verify the thumbnail uses the same improved source-driven visual language.
