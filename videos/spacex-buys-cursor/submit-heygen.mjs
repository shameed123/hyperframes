import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load root .env
const envPath = path.resolve(__dirname, "../../.env");
const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const inputText = fs.readFileSync(path.join(__dirname, "heygen-input.txt"), "utf8").trim();

const payload = {
  title: "SpaceX Just Bought Your Coding Tool for 60 Billion",
  caption: true,
  dimension: { width: 1280, height: 720 },
  video_inputs: [
    {
      character: {
        type: "avatar",
        avatar_id: env.HEYGEN_AVATAR_ID,
        avatar_style: "normal",
      },
      voice: {
        type: "text",
        voice_id: env.HEYGEN_VOICE_ID,
        input_text: inputText,
        speed: Number(env.HEYGEN_VOICE_SPEED),
      },
    },
  ],
};

const res = await fetch("https://api.heygen.com/v2/video/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": env.HEYGEN_API_KEY,
  },
  body: JSON.stringify(payload),
});

const json = await res.json();
console.log(JSON.stringify(json, null, 2));

if (json.data?.video_id) {
  fs.writeFileSync(path.join(__dirname, "heygen-metadata.json"), JSON.stringify(json, null, 2));
  fs.writeFileSync(
    path.join(__dirname, "heygen-request-summary.json"),
    JSON.stringify({
      submitted_at: new Date().toISOString(),
      title: payload.title,
      avatar_id: env.HEYGEN_AVATAR_ID,
      voice_id: env.HEYGEN_VOICE_ID,
      voice_speed: Number(env.HEYGEN_VOICE_SPEED),
      dimension: payload.dimension,
      video_id: json.data.video_id,
    }, null, 2)
  );
  console.log("\n✅ Video ID:", json.data.video_id);
} else {
  console.error("\n❌ No video_id in response");
  process.exit(1);
}
