import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../.env");
const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const meta = JSON.parse(fs.readFileSync(path.join(__dirname, "heygen-metadata.json"), "utf8"));
const videoId = meta.videoId || meta.data?.video_id;

async function poll() {
  const res = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
    headers: { "X-Api-Key": env.HEYGEN_API_KEY },
  });
  const json = await res.json();
  fs.writeFileSync(path.join(__dirname, "heygen-status.json"), JSON.stringify(json, null, 2));
  console.log(JSON.stringify(json, null, 2));
  return json;
}

const status = await poll();
const s = status?.data?.status;
console.log("\nStatus:", s);
if (s === "completed") {
  console.log("video_url:", status.data.video_url);
  console.log("caption_url:", status.data.caption_url);
}
