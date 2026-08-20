/** 대조 실험: 셰이더를 전혀 바꾸지 않고 같은 조건으로 두 번 렌더 → diff 가 0 이어야 stableNoise 가 결정적이다 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const N = Number(process.argv[2] ?? 32);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1024,768'], defaultViewport: { width: 1024, height: 768 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pt-vulkan-profile'), protocolTimeout: 900000 });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer?.getStats().samples >= 1, { timeout: 600000, polling: 1000 });
const res = await page.evaluate(async ({ N }) => {
  const v = window.viewer;
  v.setPost({ denoise: 'off' });
  v.setRender({ temporal: false, hybridFill: false, maxSamples: N });
  v.pathTracer._pathTracer.stableNoise = true;
  const shot = async () => {
    v.resetAccumulation();
    await new Promise((res) => { const c = () => (v.pathTracer.samples >= N ? res() : setTimeout(c, 200)); c(); });
    v.composite();
    const src = v.renderer.domElement;
    const cv = document.createElement('canvas'); cv.width = 400; cv.height = Math.round((400 * src.height) / src.width);
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(src, 0, 0, cv.width, cv.height);
    return ctx.getImageData(0, 0, cv.width, cv.height).data;
  };
  const a = await shot();
  const b = await shot();
  let maxDiff = 0, nDiff = 0;
  for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = Math.abs(a[i + k] - b[i + k]); if (d > 0) nDiff++; if (d > maxDiff) maxDiff = d; }
  return { maxDiff, diffPixels: nDiff, totalCh: a.length / 4 * 3 };
}, { N });
console.log('CONTROL ' + JSON.stringify(res));
await browser.close();
