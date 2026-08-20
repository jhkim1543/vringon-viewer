/** OIDN(oidn-web, WebGPU) 1 패스 시간 측정 — PT 컴파일과 무관하게 뷰어의 runOidn 을 직접 호출한다. */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu', '--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11') });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { const t = m.text(); if (/oidn|OIDN|tfjs|WebGPU|NaN/i.test(t) && !/WebSocket/.test(t)) console.log('[console]', t.slice(0, 300)); });
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer && window.viewer.getStats().modelName, { timeout: 90000 });
const t0 = Date.now();
await page.waitForFunction(() => { const v = window.viewer; return (v.oidn && v.oidn.ready) || v.oidnSupported === false || v.settings.post.denoise !== 'oidn'; }, { timeout: 120000, polling: 500 });
const st = await page.evaluate(() => ({ ready: !!(window.viewer.oidn && window.viewer.oidn.ready), supported: window.viewer.oidnSupported, denoise: window.viewer.settings.post.denoise }));
console.log('oidn load', ((Date.now() - t0) / 1000).toFixed(1), 's', JSON.stringify(st));
if (st.ready) {
  for (let i = 0; i < 3; i++) {
    const r = await page.evaluate(async () => { const v = window.viewer; const tg = v.pathTracer.target; const t = performance.now(); await v.runOidn(); return { ms: Math.round(performance.now() - t), w: tg.width, h: tg.height, valid: v.oidnValidSamples, denoise: v.settings.post.denoise }; });
    console.log('pass', i, JSON.stringify(r));
  }
}
await browser.close();
