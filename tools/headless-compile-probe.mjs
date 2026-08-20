/**
 * 셰이더 컴파일이 몇 번 일어나는지·무엇이 유발하는지 계측한다.
 *   node tools/headless-compile-probe.mjs [url] [maxWaitSec]
 * 각 recompilation 이벤트마다 시각 + defines 스냅샷 + 프로그램 수를 기록한다.
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const url = process.argv[2] ?? 'http://127.0.0.1:5230/?model=proc:solitaire-gold';
const maxWait = Number(process.argv[3] ?? 900);
// 매번 새 프로필: 셰이더 캐시 없는 "첫 방문" 을 재현
const profile = path.join(process.env.TEMP ?? '.', `ptprobe-${Date.now()}`);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1200,800'], defaultViewport: { width: 1200, height: 800 }, userDataDir: profile });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
// 뷰어 생성 직후 훅을 걸기 위해 문서 시작 시 주입
await page.evaluateOnNewDocument(() => {
  window.__ev = [];
  window.__t0 = performance.now();
  const iv = setInterval(() => {
    const v = window.viewer || window.A;
    if (!v || !v.pathTracer) return;
    clearInterval(iv);
    const mat = v.pathTracer._pathTracer.material;
    const low = v.pathTracer._lowResPathTracer?.material;
    window.__mat = mat;
    const snap = (tag) => window.__ev.push({ t: Math.round(performance.now() - window.__t0), tag, defines: JSON.stringify(mat.defines), progs: (v.renderer.properties.get(mat).programs?.size) ?? 0, sameLow: low === mat });
    snap('hooked');
    mat.addEventListener('recompilation', () => snap('recompilation'));
    // needsUpdate 세터를 감싸 호출 스택도 남긴다
    const proto = Object.getPrototypeOf(mat);
    let d = null, p = proto;
    while (p && !d) { d = Object.getOwnPropertyDescriptor(p, 'needsUpdate'); if (!d) p = Object.getPrototypeOf(p); }
    if (d && d.set) {
      Object.defineProperty(mat, 'needsUpdate', { configurable: true, get: d.get ? d.get.bind(mat) : () => false, set(val) { const st = new Error().stack.split('\n').slice(2, 5).map((s) => s.trim().replace(/^at\s+/, '').slice(0, 90)); window.__ev.push({ t: Math.round(performance.now() - window.__t0), tag: 'needsUpdate', defines: JSON.stringify(mat.defines), stack: st }); d.set.call(mat, val); } });
    }
    window.__snap = snap;
  }, 20);
});
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer && window.viewer.getStats().modelName, { timeout: 120000 });
const t0 = Date.now();
let prev = -1;
while (Date.now() - t0 < maxWait * 1000) {
  await new Promise((r) => setTimeout(r, 1000));
  const s = await page.evaluate(() => { const v = window.viewer; const mat = window.__mat; const st = v.getStats(); return { phase: st.phase, samples: Math.floor(st.samples), compiling: st.compiling, evs: window.__ev.length, progs: mat ? (v.renderer.properties.get(mat).programs?.size ?? 0) : -1 }; });
  if (s.evs !== prev) { prev = s.evs; console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(s)); }
  else if ((Date.now() - t0) % 30000 < 1000) console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(s));
  if (s.phase === 'tracing' && s.samples >= 4) break;
}
const ev = await page.evaluate(() => window.__ev);
console.log('=== EVENTS ===');
for (const e of ev) console.log(JSON.stringify(e));
console.log('total elapsed to first samples:', Math.round((Date.now() - t0) / 1000), 's');
await browser.close();
