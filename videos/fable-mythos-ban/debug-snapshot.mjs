import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\Program Files\Google\Chrome\Application\chrome.exe',
  headless: true
});
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1920 });
page.on('console', msg => console.log('[browser]', msg.text()));
page.on('pageerror', err => console.log('[pageerror]', err.message));
await page.goto('file:///C:/Users/sohai/AICoding/hyperframes-studio-light/videos/fable-mythos-ban/index.html', { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 2000));
const result = await page.evaluate(() => ({
  keys: Object.keys(window.__timelines || {}),
  tlType: typeof window.__timelines?.['fable-mythos-ban'],
  dur: window.__timelines?.['fable-mythos-ban']?.totalDuration?.(),
  gsap: typeof window.gsap
}));
console.log(JSON.stringify(result, null, 2));
await browser.close();
