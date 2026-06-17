import puppeteer from "../../packages/engine/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import path from "node:path";

const root = "C:/Users/sohai/AICoding/hyperframes-studio-light";
const slug = "fable-mythos-citizenship";
const times = (process.argv[2] || "2.5,8,14,24,30,41,47,54.5,61,72,79")
  .split(",")
  .map((s) => Number.parseFloat(s.trim()));

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1920 });
page.on("pageerror", (err) => console.log("[pageerror]", err.message));

await page.goto(`file:///${root}/videos/${slug}/index.html`, {
  waitUntil: "networkidle0",
  timeout: 30000,
});
await new Promise((r) => setTimeout(r, 1500));

for (const t of times) {
  await page.evaluate((time) => {
    const tl = window.__timelines && window.__timelines["fable-mythos-citizenship"];
    if (tl) {
      tl.pause();
      tl.time(time);
    }
    // seek each avatar/broll video clip to the right media frame
    document.querySelectorAll("video.clip").forEach((v) => {
      const start = Number.parseFloat(v.getAttribute("data-start") || "0");
      const dur = Number.parseFloat(v.getAttribute("data-duration") || "0");
      const mstart = Number.parseFloat(v.getAttribute("data-media-start") || String(start));
      if (time >= start && time <= start + dur) {
        try {
          v.pause();
          v.currentTime = mstart + (time - start);
        } catch {}
      }
    });
  }, t);
  await new Promise((r) => setTimeout(r, 700));
  const out = path.join(root, "videos", slug, "snapshots", `frame-${String(t).replace(".", "_")}.png`);
  await page.screenshot({ path: out });
  console.log("saved", out);
}

await browser.close();
