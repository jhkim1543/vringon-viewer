/**
 * 같은 PC·같은 모델에서 WebGL2 코어 vs WebGPU(Rayzee) 의 시작 시간·누적 속도를 헤드리스 Chrome 으로 측정한다.
 *   node tools/headless-engines.mjs [url] [secondsPerEngine]
 * 출력: .captures/engines_bench.json
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] ?? 'http://127.0.0.1:5230/?model=proc:solitaire-gold';
const secs = Number(process.argv[3] ?? 60);
const outDir = path.resolve('.captures');
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu', '--enable-features=Vulkan,WebGPU', '--window-size=1440,900'],
  defaultViewport: { width: 1440, height: 900 },
  userDataDir: path.join(process.env.LOCALAPPDATA ?? process.env.TEMP ?? '.', 'vringon-pathtracer-headless-profile-d3d11'),
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { const t = m.text(); if (/rayzee|WebGPU|error/i.test(t) && !/deprecated/.test(t)) console.log('[page]', t.slice(0, 160)); });
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer && window.viewer.getStats().modelName, { timeout: 90000 });
const gpu = await page.evaluate(async () => { const gl = window.viewer.renderer.getContext(); const ext = gl.getExtension('WEBGL_debug_renderer_info'); const webgl = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '?'; let webgpu = null; try { const a = await navigator.gpu?.requestAdapter(); const info = a?.info ?? (a?.requestAdapterInfo ? await a.requestAdapterInfo() : null); webgpu = info ? `${info.vendor} ${info.architecture} ${info.device} ${info.description}` : String(!!a); } catch (e) { webgpu = 'err ' + e.message; } return { webgl, webgpu }; });
console.log('GPU', JSON.stringify(gpu));
const result = { gpu, engines: {} };

async function measure(engine) {
  const t0 = Date.now();
  if (engine === 'webgpu') await page.evaluate(() => window.viewer.setEngine('webgpu'));
  const series = [];
  let firstSampleAt = null;
  let firstAccumAt = null;
  while (Date.now() - t0 < secs * 1000) {
    await new Promise((r) => setTimeout(r, 500));
    const st = await page.evaluate(() => { const s = window.viewer.getStats(); return { engine: s.engine, phase: s.phase, samples: s.samples, fps: s.fps, res: s.resolution, compiling: s.compiling }; });
    const t = (Date.now() - t0) / 1000;
    if (st.samples >= 1 && firstSampleAt === null) firstSampleAt = t;
    if (st.phase === 'tracing' && firstAccumAt === null) firstAccumAt = t;
    series.push({ t: +t.toFixed(1), ...st });
    if (series.length % 10 === 0) console.log(engine, JSON.stringify(series[series.length - 1]));
    if (st.samples >= 200) break;
  }
  // 누적 속도: 누적이 시작된 뒤 구간의 spp/s
  const acc = series.filter((s) => s.phase === 'tracing' || s.phase === 'done');
  let spps = null;
  if (acc.length >= 2) spps = (acc[acc.length - 1].samples - acc[0].samples) / (acc[acc.length - 1].t - acc[0].t);
  const last = series[series.length - 1];
  await page.screenshot({ path: path.join(outDir, `engine_${engine}.png`) });
  result.engines[engine] = { firstSampleAt, firstAccumAt, spps, last, resolution: last?.res, series };
  console.log(engine, 'first sample', firstSampleAt, 's; accumulating from', firstAccumAt, 's; spp/s', spps?.toFixed(2), 'res', last?.res);
}

await measure('webgl');
await measure('webgpu');
fs.writeFileSync(path.join(outDir, 'engines_bench.json'), JSON.stringify(result, null, 1));
await browser.close();
console.log('done');
