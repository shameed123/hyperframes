import { mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "../../packages/engine/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";

const root = path.resolve(import.meta.dirname, "../..");
const videoDir = import.meta.dirname;
const profileDir = path.join(videoDir, ".chrome-asset-capture");

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

const executablePath = chromeCandidates.find((candidate) => existsSync(candidate));
if (!executablePath) throw new Error("Chrome or Edge was not found. Set CHROME_PATH.");

await mkdir(path.join(videoDir, "assets", "slides"), { recursive: true });
await mkdir(path.join(videoDir, "assets", "thumbnails"), { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath,
  userDataDir: profileDir,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-crash-reporter"],
});

try {
  const slidePage = await browser.newPage();
  await slidePage.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await slidePage.goto(pathToFileURL(path.join(videoDir, "assets", "slides", "tokens-context.html")).href, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });
  await slidePage.screenshot({
    path: path.join(videoDir, "assets", "slides", "tokens-context.png"),
    type: "png",
    fullPage: false,
  });
  await slidePage.close();

  const thumbHtml = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      * { box-sizing: border-box; }
      html, body {
        width: 1080px;
        height: 1920px;
        margin: 0;
        overflow: hidden;
        font-family: "Arial Black", "Impact", sans-serif;
        color: #172033;
        background:
          radial-gradient(ellipse at 18% 8%, rgba(59, 130, 246, 0.28), transparent 34%),
          radial-gradient(ellipse at 84% 16%, rgba(236, 72, 153, 0.22), transparent 31%),
          radial-gradient(ellipse at 52% 95%, rgba(249, 115, 22, 0.18), transparent 38%),
          linear-gradient(145deg, #fbfdff 0%, #eaf5ff 48%, #fff8ef 100%);
      }
      body::before {
        content: "";
        position: absolute;
        inset: -180px;
        background:
          linear-gradient(90deg, rgba(59, 130, 246, 0.13) 2px, transparent 2px),
          linear-gradient(0deg, rgba(15, 23, 42, 0.06) 2px, transparent 2px),
          linear-gradient(55deg, transparent 0 47%, rgba(236, 72, 153, 0.14) 47% 48%, transparent 48% 100%);
        background-size: 84px 84px, 84px 84px, 420px 420px;
        transform: rotate(-8deg);
      }
      .wrap {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 156px 76px;
        perspective: 1500px;
      }
      .memory {
        position: absolute;
        left: 74px;
        right: 74px;
        top: 820px;
        height: 520px;
        border-radius: 36px;
        border: 2px solid rgba(255, 255, 255, 0.94);
        background:
          radial-gradient(circle at 16% 18%, rgba(59, 130, 246, 0.25), transparent 32%),
          radial-gradient(circle at 86% 12%, rgba(236, 72, 153, 0.2), transparent 30%),
          linear-gradient(145deg, rgba(255,255,255,0.68), rgba(255,255,255,0.28));
        box-shadow:
          0 56px 130px rgba(18, 92, 170, 0.24),
          inset 0 2px 0 rgba(255,255,255,0.84),
          inset 0 -30px 62px rgba(255,255,255,0.24);
        backdrop-filter: blur(32px) saturate(1.4);
        transform: rotateX(7deg) rotateY(-8deg);
      }
      h1 {
        position: relative;
        z-index: 3;
        margin: 0;
        max-width: 960px;
        font-size: 142px;
        line-height: 0.86;
        letter-spacing: 0;
        text-transform: uppercase;
        text-shadow: 0 18px 0 rgba(59, 130, 246, 0.1), 0 34px 70px rgba(15, 23, 42, 0.18);
      }
      .sub {
        position: relative;
        z-index: 3;
        margin-top: 34px;
        display: inline-flex;
        padding: 20px 30px;
        border-radius: 18px;
        background: #172033;
        color: #ffffff;
        font-size: 66px;
        line-height: 1;
        text-transform: lowercase;
        box-shadow: 0 28px 64px rgba(15, 23, 42, 0.22);
      }
      .sentence {
        position: absolute;
        z-index: 4;
        left: 112px;
        right: 112px;
        top: 712px;
        padding: 22px 28px;
        border-radius: 22px;
        background: rgba(255,255,255,0.78);
        color: #273449;
        font-family: Consolas, monospace;
        font-size: 34px;
        box-shadow: 0 24px 70px rgba(47, 55, 68, 0.14);
      }
      .tokens {
        position: absolute;
        z-index: 5;
        left: 104px;
        right: 104px;
        top: 992px;
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        transform: rotateX(10deg) rotateY(-10deg);
        transform-style: preserve-3d;
      }
      .token {
        padding: 22px 26px;
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.94);
        background:
          linear-gradient(145deg, rgba(255,255,255,0.76), rgba(255,255,255,0.28)),
          var(--tint);
        color: #172033;
        font-family: Consolas, monospace;
        font-size: 42px;
        font-weight: 800;
        box-shadow: 0 28px 52px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255,255,255,0.82);
      }
      .chip-label {
        position: absolute;
        z-index: 6;
        left: 104px;
        bottom: 150px;
        max-width: 820px;
        color: #1d4ed8;
        font-family: Consolas, monospace;
        font-size: 38px;
        font-weight: 800;
        line-height: 1.24;
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <div class="memory"></div>
      <h1>AI READS TOKENS</h1>
      <div class="sub">not words</div>
      <div class="sentence">"Artificial intelligence is wonderful."</div>
      <div class="tokens">
        <div class="token" style="--tint: rgba(59,130,246,0.22)">Artificial</div>
        <div class="token" style="--tint: rgba(236,72,153,0.2)"> intelligence</div>
        <div class="token" style="--tint: rgba(59,130,246,0.18)"> is</div>
        <div class="token" style="--tint: rgba(249,115,22,0.2)"> wonder</div>
        <div class="token" style="--tint: rgba(249,115,22,0.16)">ful</div>
        <div class="token" style="--tint: rgba(59,130,246,0.14)">.</div>
      </div>
      <div class="chip-label">Prompt text becomes model-readable chunks.</div>
    </main>
  </body>
</html>`;
  const thumbPath = path.join(videoDir, "assets", "thumbnails", "ai-tokens-context-window-generated.html");
  await writeFile(thumbPath, thumbHtml);
  const thumbPage = await browser.newPage();
  await thumbPage.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await thumbPage.goto(pathToFileURL(thumbPath).href, { waitUntil: "load", timeout: 30000 });
  await thumbPage.screenshot({
    path: path.join(videoDir, "assets", "thumbnails", "ai-tokens-context-window-generated.png"),
    type: "png",
    fullPage: false,
  });
  await thumbPage.close();
} finally {
  await browser.close();
  await rm(profileDir, { recursive: true, force: true });
}

console.log(
  JSON.stringify(
    {
      slide: path.relative(root, path.join(videoDir, "assets", "slides", "tokens-context.png")),
      thumbnail: path.relative(
        root,
        path.join(videoDir, "assets", "thumbnails", "ai-tokens-context-window-generated.png"),
      ),
    },
    null,
    2,
  ),
);
