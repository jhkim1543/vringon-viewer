/**
 * 품질 기준선/비교: 목표 spp 도달 이미지와, 고품질 레퍼런스(1024 spp) 대비 오차를 잰다.
 *   node tools/headless-quality.mjs <model> <tag> [refSpp]
 * 같은 카메라에서 (a) 레퍼런스 누적 → (b) 리셋 후 128 spp → 픽셀 RMSE/상대오차 계산.
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
const model = process.argv[2] ?? 'proc:solitaire-gold';
const tag = process.argv[3] ?? 'q';
const refSpp = Number(process.argv[4] ?? 1024);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1280,800'], defaultViewport: { width: 1280, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11'), protocolTimeout: 900000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));
await page.goto(`http://127.0.0.1:5230/?model=${encodeURIComponent(model)}`, { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer?.getStats().samples >= 1, { timeout: 600000, polling: 1000 });

// 디노이저를 끈 raw 누적으로 비교한다 (디노이저가 오차를 가리지 않도록)
const grab = async (target) => await page.evaluate(async (target) => {
  const v = window.viewer;
  v.setPost({ denoise: 'off' });
  v.setRender({ maxSamples: target, temporal: false, hybridFill: false });
  v.resetAccumulation();
  await new Promise((res) => {
    const check = () => (v.pathTracer.samples >= target ? res() : setTimeout(check, 250));
    check();
  });
  v.composite();
  const c = document.createElement('canvas');
  const src = v.renderer.domElement;
  c.width = 320; c.height = Math.round((320 * src.height) / src.width);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(src, 0, 0, c.width, c.height);
  return { w: c.width, h: c.height, data: Array.from(ctx.getImageData(0, 0, c.width, c.height).data) };
}, target);

console.log('reference', refSpp, 'spp 누적 중...');
const ref = await grab(refSpp);
console.log('target 128 spp 누적 중...');
const cur = await grab(128);
let se = 0, n = 0, refSum = 0;
for (let i = 0; i < ref.data.length; i += 4) {
  for (let k = 0; k < 3; k++) {
    const d = cur.data[i + k] - ref.data[i + k];
    se += d * d; n++; refSum += ref.data[i + k];
  }
}
const rmse = Math.sqrt(se / n);
const meanRef = refSum / n;
const out = { model, tag, refSpp, rmse: +rmse.toFixed(3), relRmsePct: +((rmse / Math.max(1, meanRef)) * 100).toFixed(2), meanRef: +meanRef.toFixed(1) };
console.log('QUALITY ' + JSON.stringify(out));
fs.writeFileSync(`.captures/quality_${tag}.json`, JSON.stringify(out, null, 1));
await browser.close();
