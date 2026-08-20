/**
 * GPU 타이머 쿼리로 texelFetch 패치 A/B — 벽시계 대신 GPU 실행 시간만 잰다(다른 프로세스 경합 영향 축소).
 * EXT_disjoint_timer_query_webgl2 가 있어야 한다. 샘플 1개를 그리는 데 걸린 GPU 시간을 다수 모아 중앙값.
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const model = process.argv[2] ?? 'proc:solitaire-gold';
const angle = process.argv[3] ?? 'vulkan';
const PAIRS = Number(process.argv[4] ?? 5);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', `--use-angle=${angle}`, '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1280,800'], defaultViewport: { width: 1280, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, `vringon-pt-${angle}-profile`), protocolTimeout: 900000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));
await page.goto(`http://127.0.0.1:5230/?model=${encodeURIComponent(model)}`, { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer?.getStats().samples >= 1, { timeout: 900000, polling: 1000 });
const has = await page.evaluate(() => !!window.viewer.renderer.getContext().getExtension('EXT_disjoint_timer_query_webgl2'));
console.log('timer query 지원:', has);
if (!has) { console.log('GPUTIME unsupported'); await browser.close(); process.exit(0); }

await page.evaluate(() => { const v = window.viewer; v.setPost({ denoise: 'off' }); v.setRender({ temporal: false, hybridFill: false, maxSamples: 0 }); });

// 샘플 1개당 GPU 시간(ms) 를 N회 재서 중앙값
const gpuMs = () => page.evaluate(async () => {
  const v = window.viewer;
  const gl = v.renderer.getContext();
  const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  const times = [];
  for (let i = 0; i < 24; i++) {
    const q = gl.createQuery();
    gl.beginQuery(ext.TIME_ELAPSED_EXT, q);
    v.pathTracer.renderSample();
    gl.endQuery(ext.TIME_ELAPSED_EXT);
    // 결과 대기 (몇 프레임 지연)
    let ns = null;
    for (let t = 0; t < 200 && ns === null; t++) {
      await new Promise((r) => requestAnimationFrame(r));
      if (gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE) && !gl.getParameter(ext.GPU_DISJOINT_EXT)) ns = gl.getQueryParameter(q, gl.QUERY_RESULT);
    }
    gl.deleteQuery(q);
    if (ns !== null && i >= 4) times.push(ns / 1e6); // 앞 4회는 워밍업
  }
  times.sort((a, b) => a - b);
  return { median: +times[Math.floor(times.length / 2)].toFixed(3), n: times.length, min: +times[0].toFixed(3) };
});

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

const gains = [];
for (let i = 0; i < PAIRS; i++) {
  const a = await gpuMs();
  if (await swap(true) !== 3) break;
  const b = await gpuMs();
  if (await swap(false) !== 3) break;
  const g = ((b.median - a.median) / b.median) * 100; // 시간 감소율 = 속도 이득
  gains.push(+g.toFixed(1));
  console.log(`pair ${i + 1}: patched ${a.median}ms / original ${b.median}ms → ${g.toFixed(1)}% 단축`);
}
const s = [...gains].sort((x, y) => x - y);
console.log('GPUTIME ' + JSON.stringify({ model, angle, gains, medianGainPct: s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2 }));
await browser.close();
