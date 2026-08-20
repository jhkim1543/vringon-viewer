/**
 * 콜드 스타트(캐시 없는 첫 방문) 측정: 컴파일 시작 → 첫 샘플까지, 프로그램 변형 수, 재컴파일 횟수.
 *   node tools/headless-coldstart.mjs [angle=d3d11|vulkan|gl] [maxWaitSec]
 * 매번 새 프로필을 쓰므로 셰이더 캐시가 없다.
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
const angle = process.argv[2] ?? 'd3d11';
const maxWait = Number(process.argv[3] ?? 900);
const profile = path.join(process.env.TEMP ?? '.', `ptcold-${angle}-${Date.now()}`);
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--use-gl=angle', `--use-angle=${angle}`, '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu', '--window-size=1200,800'],
  defaultViewport: { width: 1200, height: 800 },
  userDataDir: profile,
  protocolTimeout: 600000, // 컴파일 중 메인 스레드가 막혀도 evaluate 가 죽지 않게
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.evaluateOnNewDocument(() => {
  window.__rec = 0;
  const iv = setInterval(() => {
    const v = window.viewer;
    if (!v?.pathTracer) return;
    clearInterval(iv);
    const mat = v.pathTracer._pathTracer.material;
    window.__mat = mat;
    mat.addEventListener('recompilation', () => window.__rec++);
  }, 20);
});
const t0 = Date.now();
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
const probe = async () => {
  try {
    return await page.evaluate(() => {
      const v = window.viewer;
      if (!v) return null;
      const st = v.getStats();
      const mat = window.__mat;
      return { phase: st.phase, samples: Math.floor(st.samples), model: st.modelName, rec: window.__rec, progs: mat ? (v.renderer.properties.get(mat).programs?.size ?? 0) : -1, gpu: v.renderer.getContext().getParameter(v.renderer.getContext().getExtension('WEBGL_debug_renderer_info')?.UNMASKED_RENDERER_WEBGL ?? 0x1F01) };
    });
  } catch (e) {
    return { error: String(e).slice(0, 80) };
  }
};
let compileSeen = 0, first = 0, last = null;
while (Date.now() - t0 < maxWait * 1000) {
  await new Promise((r) => setTimeout(r, 1000));
  const s = await probe();
  if (!s || s.error) continue;
  last = s;
  if (!compileSeen && s.phase === 'compiling') compileSeen = Date.now();
  if (!first && s.samples >= 1) first = Date.now();
  if ((Date.now() - t0) % 30000 < 1000) console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(s));
  if (s.phase === 'tracing' && s.samples >= 4) break;
}
console.log(JSON.stringify({
  angle,
  gpu: last?.gpu,
  compileStartS: compileSeen ? +((compileSeen - t0) / 1000).toFixed(1) : null,
  firstSampleS: first ? +((first - t0) / 1000).toFixed(1) : null,
  compileDurationS: compileSeen && first ? +((first - compileSeen) / 1000).toFixed(1) : null,
  recompilations: last?.rec,
  programVariants: last?.progs,
}, null, 1));
await browser.close();
try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
