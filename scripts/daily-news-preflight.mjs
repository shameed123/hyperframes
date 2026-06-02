import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { constants, existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const envPath = path.join(root, ".env");
const checks = [];

function addCheck(name, ok, details, remediation) {
  checks.push({ name, ok, details, remediation: ok ? undefined : remediation });
}

function parseEnv(text) {
  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        const value = line
          .slice(index + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "");
        return [line.slice(0, index), value];
      }),
  );
}

async function getJson(url, headers = {}) {
  const response = await fetch(url, { headers });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text.slice(0, 300) };
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) || null;
}

let env = {};
try {
  env = parseEnv(await readFile(envPath, "utf8"));
  const required = ["HEYGEN_API_KEY", "HEYGEN_AVATAR_ID", "HEYGEN_VOICE_ID", "HEYGEN_VOICE_SPEED"];
  const missing = required.filter((name) => !env[name]);
  addCheck(
    "root .env values",
    missing.length === 0,
    missing.length === 0 ? "required HeyGen values are set" : `missing: ${missing.join(", ")}`,
    "Set the missing values in the repo root .env file.",
  );
} catch (error) {
  addCheck("root .env values", false, error.message, "Create the repo root .env file.");
}

if (env.HEYGEN_API_KEY) {
  try {
    const headers = { "X-Api-Key": env.HEYGEN_API_KEY };
    const [quotaResponse, avatarResponse, voiceResponse] = await Promise.all([
      getJson("https://api.heygen.com/v2/user/remaining_quota", headers),
      getJson("https://api.heygen.com/v2/avatars", headers),
      getJson("https://api.heygen.com/v2/voices", headers),
    ]);
    const quota = quotaResponse?.data?.remaining_quota;
    const avatars = avatarResponse?.data?.avatars || [];
    const voices = voiceResponse?.data?.voices || [];
    const legacyAvatarCatalogFound = avatars.some(
      (avatar) => avatar.avatar_id === env.HEYGEN_AVATAR_ID || avatar.id === env.HEYGEN_AVATAR_ID,
    );
    let avatarLook;
    try {
      const avatarLookResponse = await getJson(
        `https://api.heygen.com/v3/avatars/looks/${encodeURIComponent(env.HEYGEN_AVATAR_ID)}`,
        headers,
      );
      avatarLook = avatarLookResponse?.data;
    } catch {
      avatarLook = undefined;
    }
    const avatarLookFound = avatarLook?.id === env.HEYGEN_AVATAR_ID;
    const avatarFound = legacyAvatarCatalogFound || avatarLookFound;
    const voiceFound = voices.some(
      (voice) => voice.voice_id === env.HEYGEN_VOICE_ID || voice.id === env.HEYGEN_VOICE_ID,
    );
    addCheck(
      "HeyGen direct API quota",
      typeof quota === "number" && quota > 0,
      `remaining direct API quota: ${quota ?? "unknown"}`,
      "Add API balance in the HeyGen API dashboard. Website-plan credits are a separate balance.",
    );
    addCheck(
      "HeyGen configured avatar",
      avatarFound,
      legacyAvatarCatalogFound
        ? "configured avatar is returned by legacy GET /v2/avatars"
        : avatarLookFound
          ? `configured avatar resolves through GET /v3/avatars/looks/{id}: ${avatarLook.name || avatarLook.id} (${avatarLook.avatar_type || "unknown type"}); it is not listed by legacy GET /v2/avatars`
          : "configured avatar is not returned by GET /v2/avatars",
      "Use an API token from the Space that owns the avatar, or update HEYGEN_AVATAR_ID to an avatar ID returned by GET /v2/avatars or GET /v3/avatars/looks/{id}.",
    );
    addCheck(
      "HeyGen configured voice",
      voiceFound,
      voiceFound
        ? "configured voice is API-visible"
        : "configured voice is not returned by GET /v2/voices",
      "Update HEYGEN_VOICE_ID to an API-visible voice ID.",
    );
  } catch (error) {
    addCheck(
      "HeyGen API connectivity",
      false,
      error.message,
      "Run the automation in an environment with outbound HTTPS access to api.heygen.com.",
    );
  }
}

try {
  const response = await fetch("https://www.anthropic.com/news/", { redirect: "follow" });
  addCheck(
    "source website connectivity",
    response.ok,
    `Anthropic news returned HTTP ${response.status}`,
    "Allow outbound HTTPS for live mobile website capture.",
  );
} catch (error) {
  addCheck(
    "source website connectivity",
    false,
    error.message,
    "Allow outbound HTTPS for live mobile website capture.",
  );
}

const chromePath = findChrome();
addCheck(
  "system Chrome or Edge",
  Boolean(chromePath),
  chromePath || "Chrome or Edge was not found",
  "Install Chrome or set CHROME_PATH to a Chromium-compatible browser executable.",
);

const puppeteerPath = path.join(
  root,
  "packages",
  "engine",
  "node_modules",
  "puppeteer-core",
  "lib",
  "esm",
  "puppeteer",
  "puppeteer-core.js",
);
try {
  await access(puppeteerPath, constants.R_OK);
  addCheck("puppeteer-core package", true, "package is readable");
} catch (error) {
  addCheck(
    "puppeteer-core package",
    false,
    error.message,
    "Restore readable dependencies with bun install. Restricted sandboxes must be able to read the package store used by node_modules links.",
  );
}

if (chromePath && checks.find((check) => check.name === "puppeteer-core package")?.ok) {
  const profilePath = path.join(root, ".daily-news-preflight-chrome");
  try {
    const puppeteer = (await import(pathToFileURL(puppeteerPath).href)).default;
    await mkdir(profilePath, { recursive: true });
    await writeFile(path.join(profilePath, "write-check.txt"), "ok");
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
      userDataDir: profilePath,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-crash-reporter",
        "--disable-breakpad",
      ],
    });
    const page = await browser.newPage();
    await page.goto("about:blank");
    await browser.close();
    addCheck(
      "headless browser launch",
      true,
      "project-local Chrome profile is writable and launch succeeds",
    );
  } catch (error) {
    addCheck(
      "headless browser launch",
      false,
      error.message,
      "Allow child-process launch and project-local profile writes for Chrome, or run captures outside the restricted sandbox.",
    );
  } finally {
    await rm(profilePath, { recursive: true, force: true });
  }
}

const oxfmtPath = path.join(root, "node_modules", ".bin", "oxfmt.CMD");
addCheck(
  "oxfmt shim",
  existsSync(oxfmtPath),
  existsSync(oxfmtPath) ? "node_modules/.bin/oxfmt.CMD exists" : "oxfmt shim is missing",
  "Install dependencies with bun install.",
);

const hyperframesShim = path.join(root, "node_modules", ".bin", "hyperframes.CMD");
const hyperframesDist = path.join(root, "packages", "cli", "dist", "cli.js");
const hyperframesWrapper = path.join(root, "scripts", "run-hyperframes.mjs");
const hyperframesFilesReady = existsSync(hyperframesDist) && existsSync(hyperframesWrapper);
const hyperframesProbe = hyperframesFilesReady
  ? spawnSync(process.execPath, [hyperframesWrapper, "--help"], {
      cwd: root,
      encoding: "utf8",
    })
  : undefined;
const hyperframesReady = hyperframesFilesReady && hyperframesProbe?.status === 0;
addCheck(
  "HyperFrames CLI",
  hyperframesReady,
  hyperframesReady
    ? "local CLI launches through node scripts/run-hyperframes.mjs"
    : `local wrapper ready: ${existsSync(hyperframesWrapper)}; built CLI ready: ${existsSync(hyperframesDist)}; wrapper exit: ${hyperframesProbe?.status ?? "not run"}; optional root shim: ${existsSync(hyperframesShim)}`,
  "Install Bun, run bun install, then run bun run build before the automation schedule.",
);

const failed = checks.filter((check) => !check.ok);
console.log(JSON.stringify({ ok: failed.length === 0, checks }, null, 2));
if (failed.length > 0) process.exitCode = 1;
