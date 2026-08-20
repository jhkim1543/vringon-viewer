import puppeteer from 'puppeteer-core';
import path from 'node:path';
const mode = process.argv[2] ?? 'new'; // new | false(headful)
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: mode === 'false' ? false : 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu', '--window-size=1440,900', '--window-position=0,0'], defaultViewport: { width: 1440, height: 900 }, userDataDir: path.join(process.env.LOCALAPPDATA, `vringon-pathtracer-headless-profile${mode === 'false' ? '-headful' : ''}`) });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer, { timeout: 60000 });
const info = await page.evaluate(async () => {
  const gl = window.viewer.renderer.getContext();
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const names = ['EXT_float_blend', 'EXT_color_buffer_float', 'OES_texture_float_linear', 'KHR_parallel_shader_compile', 'EXT_texture_filter_anisotropic'];
  const o = { renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), version: gl.getParameter(gl.VERSION), hidden: document.hidden, dpr: devicePixelRatio };
  for (const n of names) o[n] = !!gl.getExtension(n);
  o.maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  o.webgpu = !!navigator.gpu; try { const a = await navigator.gpu?.requestAdapter(); o.adapter = a ? JSON.stringify(a.info ?? {}) : null; } catch (e) { o.adapter = 'err ' + e.message; }
  return o;
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
