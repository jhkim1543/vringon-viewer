import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer && window.viewer.getStats().modelName, { timeout: 60000 });
await new Promise((r) => setTimeout(r, 15000));
const probe = await page.evaluate(() => {
  const v = window.viewer; const gl = v.renderer.getContext();
  const full = v.pathTracer._pathTracer; const props = v.renderer.properties.get(full.material);
  const progs = props.programs ? [...props.programs.values()] : [];
  const out = { compiling: v.pathTracer.isCompiling, n: progs.length, parallel: !!gl.getExtension('KHR_parallel_shader_compile') };
  out.before = progs.map((p) => [p.id, p.isReady()]);
  const t0 = performance.now();
  // 강제 링크 대기: LINK_STATUS 질의는 컴파일이 끝날 때까지 블록된다
  out.link = progs.map((p) => gl.getProgramParameter(p.program, gl.LINK_STATUS));
  out.linkMs = Math.round(performance.now() - t0);
  out.after = progs.map((p) => [p.id, p.isReady()]);
  out.infoLog = progs.map((p) => gl.getProgramInfoLog(p.program).slice(0, 200));
  return out;
});
console.log(JSON.stringify(probe, null, 1));
// 이후 누적이 시작되는지 20초 관찰
for (let i = 0; i < 20; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  const st = await page.evaluate(() => { const s = window.viewer.getStats(); return [s.phase, Math.floor(s.samples), window.viewer.pathTracer.isCompiling]; });
  console.log(i, JSON.stringify(st));
  if (st[0] === 'tracing' && st[1] > 8) break;
}
await page.screenshot({ path: '.captures/hl_probe.png' });
await browser.close();
