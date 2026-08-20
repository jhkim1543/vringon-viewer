/**
 * texelFetch 패치 속도 A/B (한 세션, 같은 GPU 상태):
 * 패치 상태로 여러 모델의 spp/s 를 재고 → 셰이더 되돌린 뒤 재컴파일 대기 → 같은 측정을 반복.
 *   node tools/headless-speedab.mjs [angle] [repeats]
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const angle = process.argv[2] ?? 'vulkan';
const REP = Number(process.argv[3] ?? 3);
const MODELS = [['proc:solitaire-gold', '링'], ['samples/MaterialsVariantsShoe.glb', '신발'], ['samples/SheenChair.glb', '체어'], ['samples/DamagedHelmet.glb', '헬멧']];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', `--use-angle=${angle}`, '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1280,800'], defaultViewport: { width: 1280, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, `vringon-pt-${angle}-profile`), protocolTimeout: 900000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));

const measure = async (model) => {
  const runs = [];
  for (let i = 0; i < REP; i++) {
    const r = await page.evaluate(async () => {
      const v = window.viewer;
      v.setPost({ denoise: 'off' });
      v.setRender({ temporal: false, hybridFill: false, maxSamples: 128 });
      v.resetAccumulation();
      await new Promise((res) => setTimeout(res, 700)); // 워밍업
      const s0 = v.pathTracer.samples, t0 = performance.now();
      await new Promise((res) => { const c = () => (v.pathTracer.samples >= 128 ? res() : setTimeout(c, 100)); c(); });
      return +(((v.pathTracer.samples - s0) / ((performance.now() - t0) / 1000))).toFixed(2);
    });
    runs.push(r);
  }
  runs.sort((a, b) => a - b);
  return runs[Math.floor(runs.length / 2)]; // 중앙값
};

const sweep = async (label) => {
  const out = {};
  for (const [model, name] of MODELS) {
    await page.goto(`http://127.0.0.1:5230/?model=${encodeURIComponent(model)}`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.viewer?.getStats().samples >= 1, { timeout: 900000, polling: 1000 });
    out[name] = await measure(model);
    console.log(`  ${label} ${name}: ${out[name]} spp/s`);
  }
  return out;
};

console.log(`[${angle}] 패치 상태 측정...`);
const patched = await sweep('patched');
// 셰이더 되돌리기 (현재 페이지에서)
const rev = await page.evaluate(async () => {
  const mat = window.viewer.pathTracer._pathTracer.material;
  const ORIG = 'uint width = uint( textureSize( tex, 0 ).x );\n\tuvec2 uv;\n\tuv.x = index % width;\n\tuv.y = index / width;\n\n\treturn texelFetch( tex, ivec2( uv ), 0 );';
  const FAST = /int w = textureSize\( tex, 0 \)\.x;[\s\S]*?return texelFetch\( tex, ivec2\( x, y \), 0 \);/g;
  const n = (mat.fragmentShader.match(FAST) || []).length;
  mat.fragmentShader = mat.fragmentShader.replace(FAST, ORIG);
  mat.needsUpdate = true;
  window.__reverted = mat.fragmentShader; // 이후 페이지 이동 시 유실되므로 sessionStorage 로
  sessionStorage.setItem('revertShader', '1');
  return n;
});
console.log(`되돌림 ${rev}/3, 재컴파일 대기...`);
await page.evaluate(async () => { await new Promise((res) => { const c = () => (window.viewer.pathTracer.isCompiling ? setTimeout(c, 500) : res()); setTimeout(c, 1000); }); });
// 페이지 이동 없이 같은 모델들만 다시 로드하면 셰이더가 원복되므로, 모델 전환은 viewer API 로
const sweepSame = async (label) => {
  const out = {};
  for (const [model, name] of MODELS) {
    await page.evaluate(async (m) => {
      const v = window.viewer;
      if (m.startsWith('proc:')) { const mod = await import('/src/viewer/procedural/jewelry.ts'); await v.loadObject(mod.buildSolitaireRing({ metal: 'gold' }), 'ring'); }
      else await v.loadModel(new URL(m, location.href).href);
    }, model);
    await page.waitForFunction(() => window.viewer.getStats().samples >= 1 || window.viewer.getStats().phase === 'tracing', { timeout: 900000, polling: 1000 });
    out[name] = await measure(model);
    console.log(`  ${label} ${name}: ${out[name]} spp/s`);
  }
  return out;
};
console.log(`[${angle}] 원본 상태 측정...`);
const original = await sweepSame('original');
const rows = MODELS.map(([, n]) => ({ model: n, patched: patched[n], original: original[n], gainPct: +(((patched[n] - original[n]) / original[n]) * 100).toFixed(1) }));
console.log('SPEEDAB ' + JSON.stringify({ angle, rows, medianGainPct: rows.map((r) => r.gainPct).sort((a, b) => a - b)[Math.floor(rows.length / 2)] }));
await browser.close();
