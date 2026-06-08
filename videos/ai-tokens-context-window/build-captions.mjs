import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const videoDir = import.meta.dirname;
const srtPath = path.join(videoDir, "assets", "captions", "heygen-captions.srt");
const jsonPath = path.join(videoDir, "assets", "captions", "captions.json");
const jsPath = path.join(videoDir, "assets", "captions", "captions.js");

function parseTime(value) {
  const match = value.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
  if (!match) throw new Error(`Invalid SRT timestamp: ${value}`);
  const [, hours, minutes, seconds, ms] = match.map(Number);
  return hours * 3600 + minutes * 60 + seconds + ms / 1000;
}

function splitWords(text) {
  return text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
}

const srt = await readFile(srtPath, "utf8");
const cues = [];
for (const block of srt.replace(/\r/g, "").split(/\n\n+/)) {
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) continue;
  const timing = lines.find((line) => line.includes("-->"));
  if (!timing) continue;
  const [startRaw, endRaw] = timing.split("-->").map((part) => part.trim());
  const text = lines.slice(lines.indexOf(timing) + 1).join(" ");
  const words = splitWords(text);
  if (words.length === 0) continue;
  const start = parseTime(startRaw);
  const end = parseTime(endRaw);
  const cueDuration = Math.max(0.1, end - start);
  const wordDuration = cueDuration / words.length;
  cues.push({
    start: Number(start.toFixed(3)),
    end: Number(end.toFixed(3)),
    words: words.map((word, index) => ({
      text: word,
      start: Number((start + index * wordDuration).toFixed(3)),
      end: Number((start + (index + 1) * wordDuration).toFixed(3)),
    })),
  });
}

const groups = [];
let current = null;
for (const cue of cues) {
  for (const word of cue.words) {
    if (!current || current.words.length >= 4 || word.start - current.end > 0.42) {
      if (current) groups.push(current);
      current = { start: word.start, end: word.end, words: [] };
    }
    current.words.push(word);
    current.end = word.end;
  }
}
if (current) groups.push(current);

await writeFile(jsonPath, `${JSON.stringify(groups, null, 2)}\n`);
await writeFile(jsPath, `window.CAPTION_GROUPS = ${JSON.stringify(groups, null, 2)};\n`);
console.log(JSON.stringify({ groups: groups.length, end: groups.at(-1)?.end ?? 0 }, null, 2));
