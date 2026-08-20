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
const res = await page.evaluate(() => {
  const v = window.A; const T = v.temporal; const out = [];
  const rot = (deg) => { const pose = v.getCameraPose(); const target = pose.target.clone(); const p = pose.position.clone().sub(target).applyAxisAngle(pose.position.clone().set(0, 1, 0), (deg * Math.PI) / 180).add(target); v.syncCamera(p, target); };
  // (a) 1° 회전 + 수동 gbuf/reproject (raster 없이)
  rot(1);
  const w = v.pathTracer._pathTracer.target.width, h = v.pathTracer._pathTracer.target.height;
  T.renderGbuf(v.scene, v.camera, w, h, [], [v.floor]); T.reproject(v.camera);
  out.push({ step: 'a: rot1 + manual gbuf/reproject', hist: T.measureHist(), key: v.temporalCamKey.slice(0, 30) });
  // (b) 1° 더 회전 + compositeTemporal (실제 경로, interacting=false)
  rot(1);
  v.temporalTraceOn = true; v.temporalTrace.length = 0;
  v.compositeTemporal();
  out.push({ step: 'b: rot1 + compositeTemporal', trace: v.temporalTrace.slice(), hist: T.measureHist() });
  // (c) interacting=true 로 1° 더 회전 + compositeTemporal
  v.beginInteraction(); rot(1); v.temporalTrace.length = 0;
  v.compositeTemporal();
  out.push({ step: 'c: interacting + rot1 + compositeTemporal', trace: v.temporalTrace.slice(), hist: T.measureHist(), lowSamples: v.pathTracer._lowResPathTracer.samples, ptSamples: v.pathTracer.samples });
  // (d) 한 번 더 (저장 체인 확인)
  rot(1); v.temporalTrace.length = 0; v.compositeTemporal();
  out.push({ step: 'd: again', trace: v.temporalTrace.slice(), hist: T.measureHist() });
  v.endInteraction();
  return out;
});
console.log(JSON.stringify(res, null, 0));
await browser.close();
