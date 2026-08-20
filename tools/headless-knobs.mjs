/** 런타임 노브 스윕: samplesPerFrame × tiles → spp/s (재컴파일 없는 설정만). 캐시된 프로필 사용. */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1200,800'], defaultViewport: { width: 1200, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11'), protocolTimeout: 600000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer && window.viewer.getStats().modelName, { timeout: 120000 });
// 컴파일 끝날 때까지 대기
const t0 = Date.now();
while (Date.now() - t0 < 600000) {
  await new Promise((r) => setTimeout(r, 2000));
  const s = await page.evaluate(() => { const st = window.viewer.getStats(); return [st.phase, Math.floor(st.samples)]; });
  if ((Date.now() - t0) % 60000 < 2000) console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(s));
  if (s[0] === 'tracing' && s[1] >= 2) break;
}
console.log('ready, sweeping...');
const results = [];
for (const spf of [1, 2, 4]) {
  for (const tiles of [1, 2, 3]) {
    const r = await page.evaluate(async ({ spf, tiles }) => {
      const v = window.viewer;
      v.settings.render.samplesPerFrame = spf;
      v.pathTracer.tiles.set(tiles, tiles);
      v.resetAccumulation();
      await new Promise((res) => setTimeout(res, 1200)); // 워밍업
      const s0 = v.pathTracer.samples, t0 = performance.now();
      await new Promise((res) => setTimeout(res, 6000));
      const s1 = v.pathTracer.samples, t1 = performance.now();
      return { spf, tiles, spps: +(((s1 - s0) / (t1 - t0)) * 1000).toFixed(2), fps: Math.round(v.getStats().fps) };
    }, { spf, tiles });
    results.push(r);
    console.log(JSON.stringify(r));
  }
}
results.sort((a, b) => b.spps - a.spps);
console.log('BEST:', JSON.stringify(results.slice(0, 3)));
await browser.close();
