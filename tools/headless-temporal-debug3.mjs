/** 드래그 끝난 뒤 히스토리가 사라지는 문제 추적: 회전 전후 0.2/0.7/2 s 시점의 내부 상태 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1200,800'], defaultViewport: { width: 1200, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11') });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto('http://127.0.0.1:5230/compare.html?model=samples/MaterialsVariantsShoe.glb', { waitUntil: 'load' });
await page.waitForFunction(() => window.A && window.B && window.A.getStats().modelName && window.B.getStats().modelName, { timeout: 120000 });
await page.evaluate(() => { window.viewer = window.A; });
const t0 = Date.now();
let st;
while (Date.now() - t0 < 700000) {
  await new Promise((r) => setTimeout(r, 1000));
  st = await page.evaluate(() => { const s = window.A.getStats(), b = window.B.getStats(); return [s.phase, Math.floor(s.samples), b.phase, Math.floor(b.samples)]; });
  if ((Date.now() - t0) % 30000 < 1000) console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(st));
  if (st[0] === 'tracing' && st[1] >= 30 && st[2] === 'tracing' && st[3] >= 30) break;
}
const snap = (label) => page.evaluate((label) => {
  const v = window.viewer; const T = v.temporal; const r = v.renderer;
  const stat = (rt, ch, pred) => { const w = rt.width, h = rt.height; const buf = new Float32Array(w * h * 4); r.readRenderTargetPixels(rt, 0, 0, w, h, buf); let s = 0, n = 0, mx = -1e9; for (let i = 0; i < buf.length; i += 4) { if (pred && !pred(buf, i)) continue; const a = buf[i + ch]; s += a; n++; if (a > mx) mx = a; } return { mean: n ? +(s / n).toFixed(2) : null, max: +mx.toFixed(2), n }; };
  const g = T.gbuf[T.gslot]; const gw = g.width, gh = g.height; const gb = new Float32Array(gw * gh * 4); r.readRenderTargetPixels(g, 0, 0, gw, gh, gb);
  const objPred = (buf, i) => gb[i + 2] > 0 && gb[i + 3] < 2.5; // 제품 픽셀(바닥 제외)
  const s = v.getStats();
  return { label, phase: s.phase, samples: +v.pathTracer.samples.toFixed(2), low: v.pathTracer._lowResPathTracer.samples, eff: +s.effectiveSamples.toFixed(2), meanHist: +T.meanHistWeight.toFixed(2), dbg: { ...v.temporalDebug, lastReprojectAgo: Math.round(performance.now() - v.temporalDebug.lastReprojectAt) }, gslot: T.gslot, cur: T.cur, hasHistory: T.hasHistory,
    histObj: stat(T.hist, 3, objPred), histAll: stat(T.hist, 3), blendPrevObj: stat(T.blend[1 - T.cur], 3, objPred), gbufCls: stat(g, 3, (b, i) => b[i + 2] > 0), interacting: v.interacting, camKey: v.temporalCamKey.slice(0, 40), inval: T.invalidations, sceneVer: v.sceneVersion, tSceneVer: v.temporalSceneVersion, render: { temporal: v.settings.render.temporal, hybrid: v.settings.render.hybridFill }, size: [T.size.x, T.size.y], blendSizes: [T.blend[0].width, T.blend[1].width], gbufSizes: [T.gbuf[0].width, T.gbuf[1].width] };
}, label);
console.log(JSON.stringify(await snap('static')));
await page.click('#cmp-step'); await new Promise((r) => setTimeout(r, 350));
for (const ms of [150, 400, 700, 1500, 3000]) { await new Promise((r) => setTimeout(r, ms === 150 ? 150 : ms - [150, 400, 700, 1500, 3000][[150, 400, 700, 1500, 3000].indexOf(ms) - 1])); console.log(JSON.stringify(await snap(`+${ms}ms`))); }
await page.screenshot({ path: '.captures/temporal_debug3.png' });
await browser.close();
