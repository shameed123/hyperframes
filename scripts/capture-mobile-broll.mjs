import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import puppeteer from "../packages/engine/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";

const root = process.cwd();
const slug = process.argv[2];
const manifestArg = process.argv[3];

if (!slug || !manifestArg) {
  throw new Error("Usage: node scripts/capture-mobile-broll.mjs <video-slug> <sources-json>");
}

const manifestPath = path.resolve(root, manifestArg);
const manifestSources = JSON.parse(await readFile(manifestPath, "utf8"));
if (!Array.isArray(manifestSources)) throw new Error("Sources manifest must be a JSON array.");
const requestedIds = new Set(process.argv.slice(4));
const sources =
  requestedIds.size === 0
    ? manifestSources
    : manifestSources.filter((source) => requestedIds.has(source.id));
if (sources.length === 0) throw new Error("No matching source IDs were found in the manifest.");

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);
const executablePath = chromeCandidates.find((candidate) => existsSync(candidate));
if (!executablePath) throw new Error("Chrome or Edge was not found. Set CHROME_PATH.");

const videoDir = path.join(root, "videos", slug);
const mobileDir = path.join(videoDir, "assets", "motion", "mobile");
const brollDir = path.join(videoDir, "assets", "motion", "broll");
const profileDir = path.join(videoDir, ".chrome-mobile-capture");

await mkdir(mobileDir, { recursive: true });
await mkdir(brollDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath,
  userDataDir: profileDir,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-crash-reporter",
    "--disable-breakpad",
  ],
});
const results = [];

try {
  for (const source of sources) {
    const page = await browser.newPage();
    await page.setViewport({
      width: 412,
      height: 915,
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
    });
    await page.setUserAgent(
      "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36",
    );

    try {
      const response = await page.goto(source.url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2800));
      await page.evaluate(() => {
        const labels = [/^accept( all)?$/i, /^agree$/i, /^continue$/i, /^dismiss$/i, /^not now$/i];
        for (const element of document.querySelectorAll("button, [role='button']")) {
          const text = element.textContent?.trim() || "";
          if (labels.some((label) => label.test(text))) element.click();
        }
        for (const element of document.body.querySelectorAll("*")) {
          if (element.tagName === "IFRAME") {
            element.remove();
            continue;
          }
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          const bottomOverlay =
            (style.position === "fixed" || style.position === "sticky") &&
            rect.bottom >= window.innerHeight - 8 &&
            rect.height >= 36 &&
            rect.height <= 320 &&
            rect.width >= window.innerWidth * 0.65;
          if (bottomOverlay) element.remove();
        }
        window.scrollTo(0, 0);
      });
      await new Promise((resolve) => setTimeout(resolve, 900));

      const pageInfo = await page.evaluate(() => ({
        textLength: document.body.innerText.trim().length,
        top: window.scrollY,
      }));
      const finalUrl = page.url();
      const title = await page.title();
      if (pageInfo.textLength < 250) {
        throw new Error(`Low-content page capture (${pageInfo.textLength} visible characters)`);
      }
      if (
        typeof source.expectedTitleIncludes === "string" &&
        !title.toLowerCase().includes(source.expectedTitleIncludes.toLowerCase())
      ) {
        throw new Error(`Unexpected page title: ${title}`);
      }

      await page.screenshot({
        path: path.join(mobileDir, `${source.id}-mobile-hero.png`),
        fullPage: false,
      });
      await page.screenshot({
        path: path.join(mobileDir, `${source.id}-mobile-full.png`),
        fullPage: true,
      });
      const metrics = await page.evaluate(() => ({
        height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        viewport: window.innerHeight,
      }));
      const maxScroll = Math.max(0, metrics.height - metrics.viewport);
      const scrollSeconds = Math.max(5.2, Math.min(9.5, maxScroll / 640));
      const steps = 10;
      const keyframes = [];
      for (let index = 0; index <= steps; index += 1) {
        const progress = index / steps;
        const y = Math.round(maxScroll * progress);
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
        await new Promise((resolve) =>
          setTimeout(resolve, Math.round((scrollSeconds * 1000) / steps)),
        );
        keyframes.push({ t: Number((scrollSeconds * progress).toFixed(2)), y });
      }
      await writeFile(
        path.join(brollDir, `${source.id}-scroll-plan.json`),
        JSON.stringify(
          {
            source: source.url,
            finalUrl,
            title,
            viewport: { width: 412, height: 915 },
            pageHeight: metrics.height,
            scrollSeconds,
            keyframes,
          },
          null,
          2,
        ),
      );
      results.push({
        id: source.id,
        status: "captured",
        httpStatus: response?.status(),
        finalUrl,
        title,
        initialScrollY: pageInfo.top,
        textLength: pageInfo.textLength,
        pageHeight: metrics.height,
        scrollSeconds,
      });
    } catch (error) {
      results.push({ id: source.id, status: "failed", error: `${error.name}: ${error.message}` });
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  await rm(profileDir, { recursive: true, force: true });
}

console.log(JSON.stringify(results, null, 2));
if (results.some((result) => result.status === "failed")) process.exitCode = 1;
