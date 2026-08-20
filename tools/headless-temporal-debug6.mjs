/** compare 페이지에서 재투영 실패 원인 분리: (1) 정지 상태 강제 재투영(항등) (2) 수동 1° 회전 후 1 프레임 뒤 hist 확인 + 셰이더 검사 항목별 JS 재계산 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1200,800'], defaultViewport: { width: 1200, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11') });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { const t = m.text(); if (/Shader Error|INVALID|error/i.test(t) && !/WebSocket|X4122|X4000|ERR_CONNECTION/.test(t)) console.log('[console]', m.type(), t.slice(0, 500)); });
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
const res = await page.evaluate(async () => {
  const v = window.A; const T = v.temporal; const r = v.renderer; const out = {};
  const statA = (rt) => { const w = rt.width, h = rt.height; const buf = new Float32Array(w * h * 4); r.readRenderTargetPixels(rt, 0, 0, w, h, buf); let s = 0, n = 0, mx = 0; for (let i = 3; i < buf.length; i += 4) { s += buf[i]; n++; if (buf[i] > mx) mx = buf[i]; } return { mean: +(s / n).toFixed(2), max: +mx.toFixed(2) }; };
  out.before = { cur: T.cur, gslot: T.gslot, blend0: statA(T.blend[0]), blend1: statA(T.blend[1]), hist: statA(T.hist), gbufW: [T.gbuf[0].width, T.gbuf[1].width], gbufH: [T.gbuf[0].height, T.gbuf[1].height], size: [T.size.x, T.size.y] };
  // (1) 정지 상태 강제 재투영(항등)
  const w = v.pathTracer._pathTracer.target.width, h = v.pathTracer._pathTracer.target.height;
  T.renderGbuf(v.scene, v.camera, w, h, [], [v.floor]);
  T.reproject(v.camera);
  out.identity = { hist: statA(T.hist), gslot: T.gslot, prevBlendUsed: 1 - T.cur };
  // (2) 행렬 상태
  out.mats = { prevView: Array.from(T.prevView.elements).map((x) => +x.toFixed(3)), camInv: Array.from(v.camera.matrixWorldInverse.elements).map((x) => +x.toFixed(3)) };
  return out;
});
console.log(JSON.stringify(res, null, 1));
await browser.close();
