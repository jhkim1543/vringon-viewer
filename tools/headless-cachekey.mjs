/** 같은 재질에 프로그램이 여러 개 잡히는 원인 특정: cacheKey 를 비교한다 (캐시 있는 프로필이라 빠름) */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1200,800'], defaultViewport: { width: 1200, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11') });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer && window.viewer.getStats().modelName, { timeout: 120000 });
const t0 = Date.now();
while (Date.now() - t0 < 900000) {
  await new Promise((r) => setTimeout(r, 1000));
  const s = await page.evaluate(() => { const st = window.viewer.getStats(); return [st.phase, Math.floor(st.samples)]; });
  if ((Date.now() - t0) % 30000 < 1000) console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(s));
  if (s[0] === 'tracing' && s[1] >= 2) break;
}
const out = await page.evaluate(() => {
  const v = window.viewer; const r = v.renderer;
  const mat = v.pathTracer._pathTracer.material;
  const lowMat = v.pathTracer._lowResPathTracer.material;
  const props = r.properties.get(mat);
  const keys = props.programs ? [...props.programs.keys()] : [];
  const res = { sameMaterial: mat === lowMat, count: keys.length, keys: keys.map((k) => k.length) };
  if (keys.length >= 2) {
    const a = keys[0], b = keys[1];
    // 다른 부분만 추출
    let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
    let j = 0; while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j++;
    res.diffA = a.slice(Math.max(0, i - 60), a.length - j + 60);
    res.diffB = b.slice(Math.max(0, i - 60), b.length - j + 60);
  }
  res.allPrograms = r.info.programs.map((p) => ({ name: p.name, key: String(p.cacheKey).slice(-120), usedTimes: p.usedTimes }));
  return res;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
