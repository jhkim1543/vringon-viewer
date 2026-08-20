/**
 * stratifiedTexture 축 교정 검증:
 *  A) 치수 확인 (정지/조작/Bounces 16)
 *  B) 조작 중 프리뷰가 실제로 수렴하는가 — 저해상 프리뷰 프레임 간 변화량을 측정
 *     (버그 상태면 rand 가 픽셀 상수라 프레임이 거의 안 변한다)
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1280,800'], defaultViewport: { width: 1280, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11'), protocolTimeout: 900000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer?.getStats().samples >= 1, { timeout: 600000, polling: 1000 });

const dims = () => page.evaluate(() => { const s = window.viewer.pathTracer._pathTracer.material.stratifiedTexture; return [s.image.width, s.image.height]; });
console.log('정지(5/10):', JSON.stringify(await dims()));
await page.evaluate(() => window.viewer.beginInteraction());
await new Promise((r) => setTimeout(r, 800));
console.log('조작중(3/4):', JSON.stringify(await dims()));
await page.evaluate(() => window.viewer.endInteraction());
await page.evaluate(() => window.viewer.setRender({ bounces: 16 }));
await new Promise((r) => setTimeout(r, 800));
console.log('Bounces 16:', JSON.stringify(await dims()));
await page.evaluate(() => window.viewer.setRender({ bounces: 5 }));
await new Promise((r) => setTimeout(r, 500));

// B) 조작 중(버튼 누른 채 정지) 저해상 프리뷰가 프레임마다 변하는가
const drift = await page.evaluate(async () => {
  const v = window.viewer;
  v.beginInteraction();
  const low = v.pathTracer._lowResPathTracer;
  const r = v.renderer;
  const grab = () => {
    const src = r.domElement;
    const c = document.createElement('canvas'); c.width = 160; c.height = 120;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(src, 0, 0, 160, 120);
    return ctx.getImageData(0, 0, 160, 120).data;
  };
  await new Promise((res) => setTimeout(res, 500));
  const a = grab();
  await new Promise((res) => setTimeout(res, 1500));
  const b = grab();
  let diff = 0, n = 0;
  for (let i = 0; i < a.length; i += 4) { for (let k = 0; k < 3; k++) { diff += Math.abs(a[i + k] - b[i + k]); n++; } }
  v.endInteraction();
  return { meanAbsDiff: +(diff / n).toFixed(3), lowSamples: low.samples };
});
console.log('조작 중 프리뷰 프레임 변화(평균 절대차):', JSON.stringify(drift));
await browser.close();
