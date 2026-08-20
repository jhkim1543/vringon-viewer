/** 시간적 재투영 디버그: 단일 뷰어(temporal on)에서 누적 → 15° 회전 → hist/gbuf/blend 통계 읽기 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const maxWait = Number(process.argv[2] ?? 700);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1200,800'], defaultViewport: { width: 1200, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11') });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { const t = m.text(); if (/error|Error|temporal/.test(t) && !/WebSocket|X4122|X4000|ERR_CONNECTION/.test(t)) console.log('[console]', m.type(), t.slice(0, 300)); });
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer && window.viewer.getStats().modelName, { timeout: 120000 });
await page.evaluate(() => { window.viewer.setRender({ temporal: true, hybridFill: true }); window.viewer.setPost({ denoise: 'atrous' }); });
const t0 = Date.now();
let st;
while (Date.now() - t0 < maxWait * 1000) {
  await new Promise((r) => setTimeout(r, 1000));
  st = await page.evaluate(() => { const s = window.viewer.getStats(); return [s.phase, Math.floor(s.samples), Math.round(s.effectiveSamples)]; });
  if ((Date.now() - t0) % 30000 < 1000) console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(st));
  if (st[0] === 'tracing' && st[1] >= 30) break;
}
console.log('accumulated', JSON.stringify(st));
const readStats = async (label) => {
  const r = await page.evaluate(() => {
    const v = window.viewer; const T = v.temporal; const r = v.renderer;
    const stat = (rt, ch) => { const w = rt.width, h = rt.height; const buf = new Float32Array(w * h * 4); r.readRenderTargetPixels(rt, 0, 0, w, h, buf); let s = 0, n = 0, mx = -1e9, nz = 0; for (let i = ch; i < buf.length; i += 4) { const a = buf[i]; s += a; n++; if (a > mx) mx = a; if (a > 0) nz++; } return { mean: +(s / n).toFixed(3), max: +mx.toFixed(3), nonzero: +(nz / n).toFixed(3), w, h }; };
    return {
      hasHistory: T.hasHistory, gslot: T.gslot, cur: T.cur, meanHistWeight: T.meanHistWeight,
      hist_a: stat(T.hist, 3), blendPrev_a: stat(T.blend[1 - T.cur], 3), blendCur_a: stat(T.blend[T.cur], 3),
      gbuf0_z: stat(T.gbuf[0], 2), gbuf1_z: stat(T.gbuf[1], 2), gbuf0_cls: stat(T.gbuf[0], 3),
      samples: v.pathTracer.samples, eff: v.getStats().effectiveSamples,
    };
  });
  console.log(label, JSON.stringify(r));
};
await readStats('static');
// 15° 회전 (compare.ts 의 rotateBoth 와 동일 경로)
await page.evaluate(async () => {
  const v = window.viewer; const THREE = await import('/node_modules/three/build/three.module.js').catch(() => null);
  const pose = v.getCameraPose(); const target = pose.target.clone(); const start = pose.position.clone();
  v.beginInteraction();
  const t0 = performance.now();
  await new Promise((res) => { const step = () => { const k = Math.min(1, (performance.now() - t0) / 350); const p = start.clone().sub(target).applyAxisAngle(pose.position.clone().set(0, 1, 0), (15 * Math.PI / 180) * k).add(target); v.syncCamera(p, target); if (k < 1) requestAnimationFrame(step); else res(); }; step(); });
  v.endInteraction();
});
await new Promise((r) => setTimeout(r, 600));
await readStats('after move +0.6s');
await new Promise((r) => setTimeout(r, 2000));
await readStats('after move +2.6s');
// 중심 픽셀 재투영 수학 검증 (JS)
const math = await page.evaluate(() => {
  const v = window.viewer; const T = v.temporal; const r = v.renderer; const cam = v.camera;
  const g = T.gbuf[T.gslot]; const w = g.width, h = g.height; const px = new Float32Array(4);
  r.readRenderTargetPixels(g, Math.floor(w / 2), Math.floor(h * 0.45), 1, 1, px);
  return { center_gbuf: Array.from(px).map((x) => +x.toFixed(4)), near: cam.near, far: cam.far, tolDepth: T.params.depthTol };
});
console.log('math', JSON.stringify(math));
await page.screenshot({ path: '.captures/temporal_debug.png' });
await browser.close();
