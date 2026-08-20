/**
 * 헤드리스 Chrome(실제 GPU, ANGLE D3D11)으로 뷰어를 띄워 rAF 루프를 그대로 돌리고 스크린샷/통계를 남기는 검증 하네스.
 *   node tools/headless-run.mjs [url] [seconds] [outPrefix]
 * 브라우저 pane 이 숨겨져 rAF 가 멈추는 환경(자동 실행)에서도 실제 누적 동작을 검증할 수 있다.
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] ?? 'http://127.0.0.1:5230/?model=proc:solitaire-gold';
const seconds = Number(process.argv[3] ?? 40);
const outPrefix = process.argv[4] ?? 'headless';
const outDir = path.resolve('.captures');
fs.mkdirSync(outDir, { recursive: true });

const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu', '--window-size=1440,900', '--no-first-run', '--autoplay-policy=no-user-gesture-required'],
  defaultViewport: { width: 1440, height: 900 },
  // 영구 프로필: Chrome 의 셰이더 디스크 캐시가 유지돼 두 번째 실행부터는 컴파일이 수 초로 줄어든다(첫 실행은 1~4분)
  userDataDir: path.join(process.env.LOCALAPPDATA ?? process.env.TEMP ?? '.', 'vringon-pathtracer-headless-profile-d3d11'),
});
const page = await browser.newPage();
page.on('console', (m) => { const t = m.text(); if (!/deprecated|X4122|connecting|connected/.test(t)) console.log('[page]', t.slice(0, 200)); });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer && window.viewer.getStats().modelName, { timeout: 60000 });
const gpu = await page.evaluate(() => { const gl = window.viewer.renderer.getContext(); const ext = gl.getExtension('WEBGL_debug_renderer_info'); return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); });
console.log('GPU:', gpu);
console.log('model loaded; waiting for compile + accumulation', seconds, 's');
const t0 = Date.now();
const log = [];
const snaps = [];
while (Date.now() - t0 < seconds * 1000) {
  await new Promise((r) => setTimeout(r, 1000));
  const st = await page.evaluate(() => { const s = window.viewer.getStats(); return { phase: s.phase, samples: Math.floor(s.samples), fps: Math.round(s.fps), el: Math.round(s.elapsedMs), shots: window.timeline ? window.timeline.shots.map((x) => x.spp) : null, chip: document.getElementById('progress-chip')?.innerText.replace(/\n/g, ' | ') }; });
  log.push({ t: Math.round((Date.now() - t0) / 1000), ...st });
  if (log.length < 3 || st.phase !== 'compiling' || log[log.length - 1].t % 10 === 0) console.log(JSON.stringify(log[log.length - 1]));
  const want = [2, 8, 32, 128];
  for (const w of want) if (st.samples >= w && !snaps.includes(w) && st.phase !== 'preview') { snaps.push(w); await page.screenshot({ path: path.join(outDir, `${outPrefix}_${w}spp.png`) }); }
  if (st.phase === 'done') { await page.screenshot({ path: path.join(outDir, `${outPrefix}_done.png`) }); break; }
}
await page.screenshot({ path: path.join(outDir, `${outPrefix}_final.png`) });
fs.writeFileSync(path.join(outDir, `${outPrefix}_log.json`), JSON.stringify(log, null, 1));
await browser.close();
console.log('done →', outDir);
