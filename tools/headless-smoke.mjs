/** 정적 빌드 스모크: 상대 base 로 에셋·워커·모델이 다 붙는지 + 누적 진입 확인 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const url = process.argv[2] ?? 'http://127.0.0.1:5233/';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1280,800'], defaultViewport: { width: 1280, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11'), protocolTimeout: 600000 });
const page = await browser.newPage();
const fails = [];
page.on('pageerror', (e) => fails.push('pageerror: ' + e.message.slice(0, 150)));
page.on('requestfailed', (r) => { if (!/favicon/.test(r.url())) fails.push('reqfail: ' + r.url().slice(-60)); });
page.on('response', (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) fails.push(`http ${r.status()}: ` + r.url().slice(-60)); });
await page.goto(url, { waitUntil: 'load' });
const t0 = Date.now();
let st = null;
while (Date.now() - t0 < 300000) {
  await new Promise((r) => setTimeout(r, 1000));
  try { st = await page.evaluate(() => { const s = window.viewer?.getStats(); return s ? [s.phase, Math.floor(s.samples), s.modelName] : null; }); } catch { continue; }
  if (st && st[0] === 'tracing' && st[1] >= 3) break;
}
console.log(JSON.stringify({ url, state: st, fails: fails.slice(0, 10), failCount: fails.length }));
await page.screenshot({ path: '.captures/smoke_static.png' });
await browser.close();
process.exit(fails.length ? 1 : 0);
