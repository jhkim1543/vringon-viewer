/** "씬 준비 중" 에서 멈추는지 진단: phase / model / envTexture / bvhBuilding / 콘솔 에러를 시간별로 본다. */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const model = process.argv[2] ?? 'samples/MaterialsVariantsShoe.glb';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11'), protocolTimeout: 600000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 300)));
page.on('console', (m) => { const t = m.text(); if (!/X4122|X4000|deprecated|connecting|connected|WebSocket/.test(t)) console.log('[console]', m.type(), t.slice(0, 300)); });
page.on('requestfailed', (r) => console.log('[reqfail]', r.url().slice(-70), r.failure()?.errorText));
await page.goto(`http://127.0.0.1:5230/?model=${encodeURIComponent(model)}`, { waitUntil: 'load' });
const t0 = Date.now();
let prev = '';
while (Date.now() - t0 < 240000) {
  await new Promise((r) => setTimeout(r, 1000));
  let s;
  try {
    s = await page.evaluate(() => {
      const v = window.viewer;
      if (!v) return { noViewer: true };
      const st = v.getStats();
      return { phase: st.phase, samples: Math.floor(st.samples), model: !!v.model, env: !!v.envTexture, bvh: v.bvhBuilding, ptReady: !!(v.model && v.envTexture), status: v.statusText?.slice(0, 60), scenePromise: !!v.sceneUpdatePromise, tri: st.triangles };
    });
  } catch (e) { console.log('[eval]', String(e).slice(0, 80)); continue; }
  const key = JSON.stringify(s);
  if (key !== prev) { console.log(Math.round((Date.now() - t0) / 1000) + 's', key); prev = key; }
  if (s.phase === 'tracing' && s.samples >= 3) { console.log('OK — 정상 진입'); break; }
}
await page.screenshot({ path: '.captures/stuck_check.png' });
await browser.close();
