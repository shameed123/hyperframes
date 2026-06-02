# YouTube Packaging

## Metadata File

Create `youtube-submission-metadata.md` in the video project. Include:

1. Upload filename, duration, orientation, and format.
2. One recommended scroll-stopping title.
3. Three to five alternate titles.
4. A public SEO description with the strongest searchable phrases in the
   first two lines.
5. A short keyword target list.
6. A comma-separated YouTube Studio tag string for the separate Tags field.
7. Three to five hashtags.
8. Suggested upload settings.
9. Current official YouTube references and any upload caveats.

Keep tags relevant and below the YouTube Studio field limit. Tags are secondary
to the title and description. Do not paste the tag string into the public
description.

YouTube rules and product behavior change. Verify current official guidance
before finalizing metadata, especially Shorts duration, hashtag behavior, and
Content ID restrictions.

## Vertical Thumbnail

Create `storyboard/youtube-thumbnail-prompt.md` before generating the image.
Save the selected project-bound thumbnail under `assets/thumbnail/`.

Requirements:

- ratio: `9:16`, verified after saving;
- art style: same sample-art and character-lineup references as the video;
- headline: short, bold, mobile-readable, and topic-forward;
- composition: large faces, one dominant conflict, and one curiosity-driving
  prop;
- text: exact, correctly spelled, and fully visible;
- no watermark, social UI chrome, logos, or extra characters.

For a vibe coding skit, a proven prompt direction is:

```text
Headline: VIBE CODING FAIL
Conflict: shocked investor holds a phone with a red $4,000 charge alert.
Center: hoodie coder proudly presents a broken app with a working payment mark.
Reaction: engineer facepalms.
Backdrop: bright yellow-orange burst for scroll-stopping contrast.
```

Verify the final thumbnail by opening the copied project asset, not only the
tool preview.
