import puppeteer from 'puppeteer-core';
import path from 'node:path';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1200,800'], defaultViewport: { width: 1200, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11') });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto('http://127.0.0.1:5230/compare.html?model=samples/MaterialsVariantsShoe.glb', { waitUntil: 'load' });
await page.waitForFunction(() => window.A && window.B && window.A.getStats().modelName && window.B.getStats().modelName, { timeout: 120000 });
const t0 = Date.now();
let st;
while (Date.now() - t0 < 700000) {
  await new Promise((r) => setTimeout(r, 1000));
  st = await page.evaluate(() => { const s = window.A.getStats(), b = window.B.getStats(); return [s.phase, Math.floor(s.samples), b.phase, Math.floor(b.samples)]; });
  if ((Date.now() - t0) % 30000 < 1000) console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(st));
  if (st[0] === 'tracing' && st[1] >= 30 && st[2] === 'tracing' && st[3] >= 30) break;
}
await page.evaluate(() => { window.A.temporalTraceOn = true; window.A.temporalTrace.length = 0; });
await page.click('#cmp-step');
await new Promise((r) => setTimeout(r, 1500));
const trace = await page.evaluate(() => window.A.temporalTrace);
console.log(JSON.stringify(trace, null, 0));
await browser.close();
