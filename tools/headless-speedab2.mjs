/**
 * texelFetch 속도 A/B — 드리프트 보정 교차 측정.
 * 모델 하나를 로드한 뒤 같은 페이지에서 patched(A1) → original(B) → patched(A2) 순으로 재고,
 * A1 vs A2 차이로 드리프트를 확인한 뒤 (A1+A2)/2 대 B 로 판정한다.
 *   node tools/headless-speedab2.mjs <model> [angle] [repeats]
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const model = process.argv[2] ?? 'proc:solitaire-gold';
const angle = process.argv[3] ?? 'vulkan';
const REP = Number(process.argv[4] ?? 5);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', `--use-angle=${angle}`, '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1280,800'], defaultViewport: { width: 1280, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, `vringon-pt-${angle}-profile`), protocolTimeout: 900000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));
await page.goto(`http://127.0.0.1:5230/?model=${encodeURIComponent(model)}`, { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer?.getStats().samples >= 1, { timeout: 900000, polling: 1000 });
await page.evaluate(() => { const v = window.viewer; v.setPost({ denoise: 'off' }); v.setRender({ temporal: false, hybridFill: false, maxSamples: 128 }); });

const measure = () => page.evaluate(async (REP) => {
  const v = window.viewer; const runs = [];
  for (let i = 0; i < REP; i++) {
    v.resetAccumulation();
    await new Promise((res) => setTimeout(res, 600));
    const s0 = v.pathTracer.samples, t0 = performance.now();
    await new Promise((res) => { const c = () => (v.pathTracer.samples >= 128 ? res() : setTimeout(c, 80)); c(); });
    runs.push((v.pathTracer.samples - s0) / ((performance.now() - t0) / 1000));
  }
  runs.sort((a, b) => a - b);
  return { median: +runs[Math.floor(runs.length / 2)].toFixed(2), min: +runs[0].toFixed(2), max: +runs[runs.length - 1].toFixed(2) };
}, REP);

const ORIG = 'uint width = uint( textureSize( tex, 0 ).x );\n\tuvec2 uv;\n\tuv.x = index % width;\n\tuv.y = index / width;\n\n\treturn texelFetch( tex, ivec2( uv ), 0 );';
const swap = (toOriginal) => page.evaluate(async ({ toOriginal, ORIG }) => {
  const mat = window.viewer.pathTracer._pathTracer.material;
  const FAST_RE = /int w = textureSize\( tex, 0 \)\.x;[\s\S]*?return texelFetch\( tex, ivec2\( x, y \), 0 \);/g;
  const ORIG_RE = /uint width = uint\( textureSize\( tex, 0 \)\.x \);\s*uvec2 uv;\s*uv\.x = index % width;\s*uv\.y = index \/ width;\s*return texelFetch\( tex, ivec2\( uv \), 0 \);/g;
  const FAST = 'int w = textureSize( tex, 0 ).x;\n\tfloat invW = 1.0 / float( w );\n\tint idx = int( index );\n\tint y = int( float( idx ) * invW );\n\tint x = idx - y * w;\n\tif ( x < 0 ) { x += w; y -= 1; }\n\telse if ( x >= w ) { x -= w; y += 1; }\n\n\treturn texelFetch( tex, ivec2( x, y ), 0 );';
  const src = mat.fragmentShader;
  const n = toOriginal ? (src.match(FAST_RE) || []).length : (src.match(ORIG_RE) || []).length;
  mat.fragmentShader = toOriginal ? src.replace(FAST_RE, ORIG) : src.replace(ORIG_RE, FAST);
  mat.needsUpdate = true;
  await new Promise((res) => setTimeout(res, 1200));
  await new Promise((res) => { const c = () => (window.viewer.pathTracer.isCompiling ? setTimeout(c, 400) : res()); c(); });
  return n;
}, { toOriginal, ORIG });

const A1 = await measure();
console.log('A1 patched  ', JSON.stringify(A1));
console.log('→ original 로 교체:', await swap(true), '/3');
const B = await measure();
console.log('B  original ', JSON.stringify(B));
console.log('→ patched 로 복귀:', await swap(false), '/3');
const A2 = await measure();
console.log('A2 patched  ', JSON.stringify(A2));
const a = (A1.median + A2.median) / 2;
console.log('SPEEDAB2 ' + JSON.stringify({ model, angle, patchedAvg: +a.toFixed(2), original: B.median, gainPct: +(((a - B.median) / B.median) * 100).toFixed(1), driftPct: +(((A2.median - A1.median) / A1.median) * 100).toFixed(1) }));
await browser.close();
