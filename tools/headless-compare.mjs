/**
 * A/B 비교 화면 검증: 양쪽 누적 시작 → 15° 회전 N회 → 이동 1 s 후 스크린샷 + 표 읽기.
 *   node tools/headless-compare.mjs [url] [maxWaitSec] [moves]
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
const url = process.argv[2] ?? 'http://127.0.0.1:5230/compare.html?model=proc:solitaire-gold';
const maxWait = Number(process.argv[3] ?? 700);
const moves = Number(process.argv[4] ?? 3);
const outDir = path.resolve('.captures');
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu', '--window-size=1600,900'], defaultViewport: { width: 1600, height: 900 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11') });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { const t = m.text(); if (/error|Error|temporal|OIDN/.test(t) && !/WebSocket|X4122|X4000|ERR_CONNECTION/.test(t)) console.log('[console]', m.type(), t.slice(0, 300)); });
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.A && window.B && window.A.getStats().modelName && window.B.getStats().modelName, { timeout: 120000 });
const stats = () => page.evaluate(() => { const a = window.A.getStats(), b = window.B.getStats(); return { a: [a.phase, Math.floor(a.samples), Math.round(a.effectiveSamples)], b: [b.phase, Math.floor(b.samples), Math.round(b.effectiveSamples)], stA: document.getElementById('st-a').innerText.replace(/\n/g, ' | '), stB: document.getElementById('st-b').innerText.replace(/\n/g, ' | ') }; });
const t0 = Date.now();
let st;
while (Date.now() - t0 < maxWait * 1000) {
  await new Promise((r) => setTimeout(r, 1000));
  st = await stats();
  if ((Date.now() - t0) % 20000 < 1000) console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(st));
  if (st.a[0] === 'tracing' && st.b[0] === 'tracing' && st.a[1] >= 40 && st.b[1] >= 40) break;
}
console.log('both accumulating after', Math.round((Date.now() - t0) / 1000), 's', JSON.stringify(st));
await page.screenshot({ path: path.join(outDir, 'cmp_0_settled.png') });
for (let i = 1; i <= moves; i++) {
  await page.click('#cmp-step');
  await new Promise((r) => setTimeout(r, 350 + 150));
  console.log(`move ${i} +0.15s`, JSON.stringify(await stats()));
  await page.screenshot({ path: path.join(outDir, `cmp_${i}_after0s.png`) });
  await new Promise((r) => setTimeout(r, 550));
  const s1 = await stats();
  console.log(`move ${i} +0.7s`, JSON.stringify(s1));
  await page.screenshot({ path: path.join(outDir, `cmp_${i}_after1s.png`) });
  await new Promise((r) => setTimeout(r, 2000));
  const s3 = await stats();
  console.log(`move ${i} +3.0s`, JSON.stringify(s3));
  await new Promise((r) => setTimeout(r, 6000));
}
await new Promise((r) => setTimeout(r, 3000));
const table = await page.evaluate(() => [...document.querySelectorAll('#cmp-table tbody tr')].map((tr) => tr.innerText.replace(/\t/g, ' | ')));
console.log('table', JSON.stringify(table, null, 1));
await page.screenshot({ path: path.join(outDir, 'cmp_final.png') });
await browser.close();
