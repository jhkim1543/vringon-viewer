/** 성능 벤치: 모델별 누적 처리량(spp/s)·목표 도달 시간·해상도. 캐시된 프로필(웜) 사용. */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const MODELS = [
  ['proc:solitaire-gold', '다이아 솔리테어 링'],
  ['samples/MaterialsVariantsShoe.glb', '스니커즈'],
  ['samples/SheenChair.glb', '패브릭 체어'],
  ['samples/DamagedHelmet.glb', '헬멧(PBR)'],
];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu', '--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11'), protocolTimeout: 600000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));
const rows = [];
for (const [model, label] of MODELS) {
  await page.goto(`http://127.0.0.1:5230/?model=${encodeURIComponent(model)}`, { waitUntil: 'load' });
  const t0 = Date.now();
  let firstSample = 0, done = 0, st = null;
  while (Date.now() - t0 < 420000) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      st = await page.evaluate(() => { const s = window.viewer?.getStats(); return s ? { phase: s.phase, samples: s.samples, max: s.maxSamples, el: s.elapsedMs, res: s.resolution, tri: s.triangles, denoiser: s.denoiser } : null; });
    } catch { continue; }
    if (!st) continue;
    if (!firstSample && st.samples >= 1) firstSample = Date.now();
    if (st.phase === 'done') { done = Date.now(); break; }
  }
  const row = {
    model: label,
    tri: st?.tri,
    res: st ? `${st.res[0]}×${st.res[1]}` : '?',
    target: st?.max,
    startS: firstSample ? +((firstSample - t0) / 1000).toFixed(1) : null,
    convergeS: st && done ? +(st.el / 1000).toFixed(1) : null,
    sppPerSec: st && done ? +(st.samples / (st.el / 1000)).toFixed(1) : null,
    denoiser: st?.denoiser,
  };
  rows.push(row);
  console.log(JSON.stringify(row));
}
console.log('TABLE');
console.log(JSON.stringify(rows, null, 1));
await browser.close();
