/** 변경 후 검증: 콜드 스타트 시간 + 누적 속도(spp/s) + 128 spp 도달 시간 + 스크린샷(지오메트리 손실 확인) */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
const model = process.argv[2] ?? 'proc:solitaire-gold';
const tag = process.argv[3] ?? 'verify';
// --warm: 영구 프로필(셰이더 캐시 유지)로 빠르게 반복 검증. 기본은 새 프로필(콜드 스타트 측정).
const warm = process.argv.includes('--warm');
const profile = warm ? path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11') : path.join(process.env.TEMP ?? '.', `ptver-${Date.now()}`);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 }, userDataDir: profile, protocolTimeout: 600000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { const t = m.text(); if (/Error|error/.test(t) && !/WebSocket|X4122|X4000|ERR_CONNECTION/.test(t)) console.log('[console]', t.slice(0, 200)); });
const t0 = Date.now();
await page.goto(`http://127.0.0.1:5230/?model=${encodeURIComponent(model)}`, { waitUntil: 'load' });
let firstSample = 0, done = 0, sppAt = [];
while (Date.now() - t0 < 900000) {
  await new Promise((r) => setTimeout(r, 1000));
  let s;
  try { s = await page.evaluate(() => { const st = window.viewer?.getStats(); return st ? { phase: st.phase, samples: Math.floor(st.samples), tri: st.triangles } : null; }); } catch { continue; }
  if (!s) continue;
  if (!firstSample && s.samples >= 1) { firstSample = Date.now(); }
  if (firstSample) sppAt.push({ t: (Date.now() - firstSample) / 1000, s: s.samples });
  if ((Date.now() - t0) % 30000 < 1000) console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(s));
  if (s.phase === 'done') { done = Date.now(); break; }
}
// 정지 누적 구간의 spp/s (첫 2초 제외)
const win = sppAt.filter((x) => x.t > 2);
const spps = win.length > 2 ? (win[win.length - 1].s - win[0].s) / (win[win.length - 1].t - win[0].t) : null;
await page.screenshot({ path: `.captures/${tag}.png` });
console.log(JSON.stringify({
  model, tag,
  coldStartS: firstSample ? +((firstSample - t0) / 1000).toFixed(1) : null,
  to128SppS: done && firstSample ? +((done - firstSample) / 1000).toFixed(1) : null,
  sppPerSec: spps ? +spps.toFixed(2) : null,
}, null, 1));
await browser.close();
if (!warm) { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }
