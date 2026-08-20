/**
 * texelFetch 속도 A/B — 교대 반복 + 인접 쌍 비교(느린 드리프트 상쇄).
 * A B A B A B ... 순으로 번갈아 재고, 인접한 (A,B) 쌍마다 이득을 구해 중앙값을 취한다.
 *   node tools/headless-speedab3.mjs <model> [angle] [pairs] [spp]
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const model = process.argv[2] ?? 'proc:solitaire-gold';
const angle = process.argv[3] ?? 'vulkan';
const PAIRS = Number(process.argv[4] ?? 4);
const SPP = Number(process.argv[5] ?? 64);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', `--use-angle=${angle}`, '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1280,800'], defaultViewport: { width: 1280, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, `vringon-pt-${angle}-profile`), protocolTimeout: 900000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));
await page.goto(`http://127.0.0.1:5230/?model=${encodeURIComponent(model)}`, { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer?.getStats().samples >= 1, { timeout: 900000, polling: 1000 });
await page.evaluate((SPP) => { const v = window.viewer; v.setPost({ denoise: 'off' }); v.setRender({ temporal: false, hybridFill: false, maxSamples: SPP }); }, SPP);

const measure = () => page.evaluate(async (SPP) => {
  const v = window.viewer;
  v.resetAccumulation();
  await new Promise((res) => setTimeout(res, 400));
  const s0 = v.pathTracer.samples, t0 = performance.now();
  await new Promise((res) => { const c = () => (v.pathTracer.samples >= SPP ? res() : setTimeout(c, 60)); c(); });
  return +((v.pathTracer.samples - s0) / ((performance.now() - t0) / 1000)).toFixed(2);
}, SPP);

const swap = (toOriginal) => page.evaluate(async (toOriginal) => {
  const mat = window.viewer.pathTracer._pathTracer.material;
  const FAST_RE = /int w = textureSize\( tex, 0 \)\.x;[\s\S]*?return texelFetch\( tex, ivec2\( x, y \), 0 \);/g;
  const ORIG_RE = /uint width = uint\( textureSize\( tex, 0 \)\.x \);\s*uvec2 uv;\s*uv\.x = index % width;\s*uv\.y = index \/ width;\s*return texelFetch\( tex, ivec2\( uv \), 0 \);/g;
  const ORIG = 'uint width = uint( textureSize( tex, 0 ).x );\n\tuvec2 uv;\n\tuv.x = index % width;\n\tuv.y = index / width;\n\n\treturn texelFetch( tex, ivec2( uv ), 0 );';
  const FAST = 'int w = textureSize( tex, 0 ).x;\n\tfloat invW = 1.0 / float( w );\n\tint idx = int( index );\n\tint y = int( float( idx ) * invW );\n\tint x = idx - y * w;\n\tif ( x < 0 ) { x += w; y -= 1; }\n\telse if ( x >= w ) { x -= w; y += 1; }\n\n\treturn texelFetch( tex, ivec2( x, y ), 0 );';
  const src = mat.fragmentShader;
  const n = toOriginal ? (src.match(FAST_RE) || []).length : (src.match(ORIG_RE) || []).length;
  if (n !== 3) return -1;
  mat.fragmentShader = toOriginal ? src.replace(FAST_RE, ORIG) : src.replace(ORIG_RE, FAST);
  mat.needsUpdate = true;
  await new Promise((res) => setTimeout(res, 900));
  await new Promise((res) => { const c = () => (window.viewer.pathTracer.isCompiling ? setTimeout(c, 300) : res()); c(); });
  return n;
}, toOriginal);

const A = [], B = [], gains = [];
for (let i = 0; i < PAIRS; i++) {
  const a = await measure();
  if (await swap(true) !== 3) { console.log('swap→orig 실패'); break; }
  const b = await measure();
  if (await swap(false) !== 3) { console.log('swap→patched 실패'); break; }
  A.push(a); B.push(b);
  const g = ((a - b) / b) * 100;
  gains.push(+g.toFixed(1));
  console.log(`pair ${i + 1}: patched ${a} / original ${b} → ${g.toFixed(1)}%`);
}
const med = (arr) => { const s = [...arr].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
console.log('SPEEDAB3 ' + JSON.stringify({ model, angle, spp: SPP, A, B, gains, medianGainPct: med(gains) }));
await browser.close();
