/**
 * 헤드리스 Chrome 진단: PT 누적 타깃이 실제로 값을 갖는지(검은 화면 원인), 콘솔 전체, GL 에러, 프로그램 검증.
 *   node tools/headless-diag.mjs [url] [maxWaitSec] [angle=d3d11|gl|vulkan|swiftshader]
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';

const url = process.argv[2] ?? 'http://127.0.0.1:5230/?model=proc:solitaire-gold';
const maxWait = Number(process.argv[3] ?? 400);
const angle = process.argv[4] ?? 'd3d11';
const NL = String.fromCharCode(10);
const flat = (s) => String(s).split(NL).join(' ⏎ ');
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--use-gl=angle', `--use-angle=${angle}`, '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu', '--window-size=1440,900'],
  defaultViewport: { width: 1440, height: 900 },
  userDataDir: path.join(process.env.LOCALAPPDATA ?? process.env.TEMP ?? '.', `vringon-pathtracer-headless-profile-${angle}`),
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => {
  const t = m.text();
  if (/connecting|connected|deprecated|maxLeafTris|WebSocket|websocket|ERR_CONNECTION/.test(t)) return;
  console.log('[console]', m.type(), flat(t).slice(0, 1500));
});
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer && window.viewer.getStats().modelName, { timeout: 90000 });
console.log('GPU:', await page.evaluate(() => { const gl = window.viewer.renderer.getContext(); const ext = gl.getExtension('WEBGL_debug_renderer_info'); return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); }));
const t0 = Date.now();
let st;
while (Date.now() - t0 < maxWait * 1000) {
  await new Promise((r) => setTimeout(r, 1000));
  st = await page.evaluate(() => { const s = window.viewer.getStats(); return { phase: s.phase, samples: Math.floor(s.samples), el: Math.round(s.elapsedMs), denoiser: s.denoiser }; });
  if ((Date.now() - t0) % 15000 < 1000) console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(st));
  if (st.phase === 'tracing' && st.samples >= 16) break;
}
console.log('state', JSON.stringify(st), 'after', Math.round((Date.now() - t0) / 1000), 's');
const diag = await page.evaluate(() => {
  const v = window.viewer; const r = v.renderer; const gl = r.getContext();
  const out = { lost: gl.isContextLost(), glError: gl.getError() };
  const pt = v.pathTracer._pathTracer; const tgt = pt.target;
  const w = tgt.width, h = tgt.height; out.target = [w, h, tgt.texture.type];
  const buf = new Float32Array(4 * 64 * 64);
  try { r.readRenderTargetPixels(tgt, Math.floor(w / 2) - 32, Math.floor(h / 2) - 32, 64, 64, buf); let s = 0, nan = 0; for (let i = 0; i < buf.length; i += 4) { const l = buf[i] + buf[i + 1] + buf[i + 2]; if (Number.isNaN(l)) nan++; else s += l; } out.ptMean = s / (64 * 64 * 3); out.ptNaN = nan; out.ptAlpha = buf[3]; } catch (e) { out.ptErr = e.message; }
  v.composite();
  const c = document.createElement('canvas'); c.width = 96; c.height = 64; const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(r.domElement, 0, 0, 96, 64); const d = ctx.getImageData(0, 0, 96, 64).data; let s2 = 0; for (let i = 0; i < d.length; i += 4) s2 += d[i] + d[i + 1] + d[i + 2]; out.canvasMean = s2 / (96 * 64 * 3);
  v.renderRaster(); ctx.drawImage(r.domElement, 0, 0, 96, 64); const d2 = ctx.getImageData(0, 0, 96, 64).data; let s3 = 0; for (let i = 0; i < d2.length; i += 4) s3 += d2[i] + d2[i + 1] + d2[i + 2]; out.rasterMean = s3 / (96 * 64 * 3);
  const props = r.properties.get(pt.material); const prog = props.currentProgram;
  out.progLink = prog ? gl.getProgramParameter(prog.program, gl.LINK_STATUS) : null;
  out.progLog = prog ? String(gl.getProgramInfoLog(prog.program)).slice(0, 300) : null;
  gl.getError(); pt.update(); out.glErrAfterSample = gl.getError();
  if (prog) { gl.validateProgram(prog.program); out.validate = gl.getProgramParameter(prog.program, gl.VALIDATE_STATUS); out.validateLog = String(gl.getProgramInfoLog(prog.program)).slice(0, 600); }
  out.alphaMode = pt.alpha; out.floatBlend = !!gl.getExtension('EXT_float_blend'); out.bgAlpha = pt.material.backgroundAlpha; out.tiles = pt.tiles && [pt.tiles.x, pt.tiles.y];
  out.env = !!v.envTexture; out.bg = v.settings.environment.background; out.denoise = v.settings.post.denoise; out.lowRes = v.pathTracer.dynamicLowRes; out.samplesFull = pt.samples;
  return out;
});
console.log('diag', JSON.stringify(diag, null, 1));
await page.screenshot({ path: path.join('.captures', `diag_${angle}.png`) });
await browser.close();
