import puppeteer from 'puppeteer-core';
import path from 'node:path';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu', '--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11') });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer && window.viewer.oidn && window.viewer.oidn.ready, { timeout: 120000, polling: 500 });
const r = await page.evaluate(async () => {
  const v = window.viewer; const out = [];
  for (const n of [256, 256, 512, 256]) {
    const color = new Float32Array(n * n * 4); const alb = new Uint8ClampedArray(n * n * 4); const nrm = new Uint8ClampedArray(n * n * 4);
    for (let i = 0; i < n * n; i++) { color[i * 4] = Math.random(); color[i * 4 + 1] = Math.random() * 0.5; color[i * 4 + 2] = 0.2; color[i * 4 + 3] = 1; alb[i * 4] = 200; alb[i * 4 + 1] = 180; alb[i * 4 + 2] = 120; alb[i * 4 + 3] = 255; nrm[i * 4] = 128; nrm[i * 4 + 1] = 128; nrm[i * 4 + 2] = 255; nrm[i * 4 + 3] = 255; }
    const t = performance.now();
    await v.oidn.denoise({ color, albedo: alb, normal: nrm, width: n, height: n });
    out.push({ n, ms: Math.round(performance.now() - t) });
  }
  return out;
});
console.log(JSON.stringify(r));
await browser.close();
