import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const slug = process.argv[2];

if (!slug) {
  throw new Error("Usage: node scripts/heygen-avatar-v2.mjs <video-slug>");
}

const videoDir = path.join(root, "videos", slug);
const scriptPath = path.join(videoDir, "heygen-input.txt");
const statusPath = path.join(videoDir, "heygen-status.json");
const metadataPath = path.join(videoDir, "heygen-metadata.json");
const requestPath = path.join(videoDir, "heygen-request-summary.json");
const mp4Path = path.join(videoDir, "assets", "avatar", "heygen-avatar-16x9.mp4");
const srtPath = path.join(videoDir, "assets", "captions", "heygen-captions.srt");

function parseEnv(text) {
  const env = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
  return env;
}

async function readRootEnv() {
  const envPath = path.join(root, ".env");
  if (!existsSync(envPath)) {
    throw new Error("Missing root .env");
  }
  return parseEnv(await readFile(envPath, "utf8"));
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!response.ok) {
    const message =
      typeof json?.message === "string"
        ? json.message
        : typeof json?.error === "string"
          ? json.error
          : JSON.stringify(json?.message || json?.error || json);
    throw new Error(`HeyGen request failed (${response.status}): ${message}`);
  }
  return json;
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status}) for ${outputPath}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buffer);
  return buffer.length;
}

function findVideoId(json) {
  return json?.data?.video_id || json?.video_id || json?.id || null;
}

function findStatus(data) {
  return data?.data?.status || data?.status || "unknown";
}

function findVideoUrl(data) {
  return data?.data?.video_url || data?.video_url || null;
}

function findSubtitleUrl(data) {
  return (
    data?.data?.caption_url ||
    data?.data?.subtitle_url ||
    data?.data?.srt_url ||
    data?.caption_url ||
    data?.subtitle_url ||
    data?.srt_url ||
    null
  );
}

const env = await readRootEnv();
const required = ["HEYGEN_API_KEY", "HEYGEN_AVATAR_ID", "HEYGEN_VOICE_ID"];
const missing = required.filter((name) => !env[name]);

if (missing.length > 0) {
  throw new Error(`Missing root .env values: ${missing.join(", ")}`);
}

const script = (await readFile(scriptPath, "utf8")).trim();
const speed = Number.parseFloat(env.HEYGEN_VOICE_SPEED || "0.8");
const apiKey = env.HEYGEN_API_KEY;
const headers = {
  "Content-Type": "application/json",
  "x-api-key": apiKey,
};

let videoId;
let created = false;

if (existsSync(metadataPath)) {
  const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
  videoId = metadata.videoId;
}

if (!videoId) {
  const payload = {
    title: "Google I/O 2026 Update",
    caption: true,
    test: false,
    dimension: {
      width: 1280,
      height: 720,
    },
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: env.HEYGEN_AVATAR_ID,
          avatar_style: "normal",
        },
        voice: {
          type: "text",
          input_text: script,
          voice_id: env.HEYGEN_VOICE_ID,
          speed,
        },
        background: {
          type: "color",
          value: "#FFFFFF",
        },
      },
    ],
  };

  const response = await fetchJson("https://api.heygen.com/v2/video/generate", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  videoId = findVideoId(response);
  if (!videoId) {
    await writeFile(statusPath, JSON.stringify(response, null, 2));
    throw new Error("HeyGen did not return a video_id");
  }

  created = true;
  await writeFile(
    requestPath,
    JSON.stringify(
      {
        endpoint: "POST https://api.heygen.com/v2/video/generate",
        title: payload.title,
        caption: payload.caption,
        dimension: payload.dimension,
        avatarStyle: payload.video_inputs[0].character.avatar_style,
        voiceType: payload.video_inputs[0].voice.type,
        voiceSpeed: speed,
        inputTextPath: path.relative(root, scriptPath).replaceAll("\\", "/"),
        submittedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
  await writeFile(
    metadataPath,
    JSON.stringify(
      {
        videoId,
        createdAt: new Date().toISOString(),
        apiVersion: "v2",
        statusEndpoint: "GET https://api.heygen.com/v1/video_status.get",
      },
      null,
      2,
    ),
  );
}

const statusResponse = await fetchJson(
  `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`,
  {
    method: "GET",
    headers,
  },
);
await writeFile(statusPath, JSON.stringify(statusResponse, null, 2));

const status = findStatus(statusResponse);
const videoUrl = findVideoUrl(statusResponse);
const subtitleUrl = findSubtitleUrl(statusResponse);

const result = {
  created,
  videoId,
  status,
  mp4Path: path.relative(root, mp4Path).replaceAll("\\", "/"),
  srtPath: path.relative(root, srtPath).replaceAll("\\", "/"),
  downloadedVideo: false,
  downloadedSrt: false,
};

if (status === "completed") {
  if (!videoUrl) {
    throw new Error("HeyGen completed but did not return a video_url");
  }
  result.mp4Bytes = await downloadFile(videoUrl, mp4Path);
  result.downloadedVideo = true;

  if (subtitleUrl) {
    result.srtBytes = await downloadFile(subtitleUrl, srtPath);
    result.downloadedSrt = true;
  }
}

process.stdout.write(JSON.stringify(result, null, 2));
