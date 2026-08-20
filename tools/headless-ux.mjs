/**
 * 누적 타임라인 UX 검증: 누적 → 썸네일 hover(오버레이) → click(분할 고정) → 드래그(프리뷰·리셋) 를 헤드리스 Chrome 에서 재현하고 스크린샷을 남긴다.
 *   node tools/headless-ux.mjs [url] [maxWaitSec]
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] ?? 'http://127.0.0.1:5230/?model=proc:solitaire-gold';
const maxWait = Number(process.argv[3] ?? 300);
const outDir = path.resolve('.captures');
fs.mkdirSync(outDir, { recursive: true });
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1440,900'],
  defaultViewport: { width: 1440, height: 900 },
  userDataDir: path.join(process.env.LOCALAPPDATA ?? process.env.TEMP ?? '.', 'vringon-pathtracer-headless-profile-d3d11'),
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer && window.viewer.getStats().modelName, { timeout: 60000 });
const stats = () => page.evaluate(() => { const s = window.viewer.getStats(); return { phase: s.phase, samples: Math.floor(s.samples), el: Math.round(s.elapsedMs), shots: window.timeline.shots.map((x) => x.spp), chip: document.getElementById('progress-chip').innerText.replace(/\n/g, ' | ') }; });
const t0 = Date.now();
let st;
while (Date.now() - t0 < maxWait * 1000) {
  await new Promise((r) => setTimeout(r, 1000));
  st = await stats();
  if ((Date.now() - t0) % 10000 < 1000 || st.phase === 'tracing') console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(st));
  if (st.phase === 'tracing' && st.samples >= 40) break;
}
console.log('accumulated:', JSON.stringify(st));
await page.screenshot({ path: path.join(outDir, 'ux_1_timeline.png') });
// 썸네일 hover → 오버레이
const items = await page.$$('#timeline .tl-item');
console.log('thumbnails:', items.length);
if (items.length) {
  await items[0].hover();
  await new Promise((r) => setTimeout(r, 300));
  console.log('overlay(hover):', await page.evaluate(() => ({ on: document.getElementById('compare-overlay').className, label: document.querySelector('#compare-overlay .ov-label.l').textContent })));
  await page.screenshot({ path: path.join(outDir, 'ux_2_hover_1spp.png') });
  // click → 분할 고정, 마우스를 화면 중앙으로
  await items[0].click();
  await page.mouse.move(760, 450);
  await new Promise((r) => setTimeout(r, 300));
  console.log('overlay(split):', await page.evaluate(() => ({ cls: document.getElementById('compare-overlay').className, l: document.querySelector('#compare-overlay .ov-label.l').textContent, r: document.querySelector('#compare-overlay .ov-label.r').textContent, clip: document.querySelector('#compare-overlay .ov-img').style.clipPath })));
  await page.screenshot({ path: path.join(outDir, 'ux_3_split.png') });
  await page.keyboard.press('Escape');
  await page.mouse.move(300, 300);
  await new Promise((r) => setTimeout(r, 200));
}
// 드래그 → 프리뷰 단계 + 타임라인 리셋
await page.mouse.move(700, 450);
await page.mouse.down();
await page.mouse.move(760, 460, { steps: 6 });
await new Promise((r) => setTimeout(r, 250));
const mid = await stats();
console.log('during drag:', JSON.stringify(mid));
await page.screenshot({ path: path.join(outDir, 'ux_4_preview_drag.png') });
await page.mouse.up();
await new Promise((r) => setTimeout(r, 2500));
const after = await stats();
console.log('after drag:', JSON.stringify(after));
await page.screenshot({ path: path.join(outDir, 'ux_5_after_drag.png') });
await browser.close();
console.log('done');
