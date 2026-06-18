import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srt = fs.readFileSync(path.join(__dirname, "assets/captions/heygen-captions.srt"), "utf8");

function srtTimeToSec(t) {
  const [h, m, s] = t.replace(",", ".").split(":");
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

const blocks = srt.trim().split(/\n\n+/);
const groups = blocks.map((block) => {
  const lines = block.trim().split("\n");
  const [startStr, endStr] = lines[1].split(" --> ");
  const start = srtTimeToSec(startStr.trim());
  const end = srtTimeToSec(endStr.trim());
  const text = lines.slice(2).join(" ").trim();
  const wordTexts = text.split(/\s+/).filter(Boolean);
  const span = end - start;
  const perWord = span / wordTexts.length;
  const words = wordTexts.map((w, i) => ({
    text: w,
    start: +(start + i * perWord).toFixed(3),
    end: +(start + (i + 1) * perWord).toFixed(3),
  }));
  return { start, end, text, words };
});

const out = `window.CAPTION_GROUPS = ${JSON.stringify(groups, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, "assets/captions/heygen-captions.js"), out);
console.log(`Generated ${groups.length} caption groups.`);
groups.forEach((g, i) => console.log(`  ${i + 1}: ${g.start.toFixed(2)}–${g.end.toFixed(2)}s "${g.text.slice(0, 40)}"`));
