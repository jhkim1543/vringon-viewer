/**
 * texelFetch 패치 동등성 검증 (엄밀 설계):
 * 한 세션에서 A(패치)·B(패치, 재렌더)·C(패치 해제) 를 같은 spp 로 렌더하고
 *   대조군 = |A-B| (같은 셰이더, 런투런 노이즈만)
 *   실험군 = |A-C| (패치 유무 차이 + 같은 노이즈)
 * 실험군이 대조군 수준이면 패치는 이미지를 바꾸지 않는다.
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const N = Number(process.argv[2] ?? 256);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1024,768'], defaultViewport: { width: 1024, height: 768 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pt-vulkan-profile'), protocolTimeout: 900000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer?.getStats().samples >= 1, { timeout: 600000, polling: 1000 });
const res = await page.evaluate(async ({ N }) => {
  const v = window.viewer;
  const mat = v.pathTracer._pathTracer.material;
  v.setPost({ denoise: 'off' });
  v.setRender({ temporal: false, hybridFill: false, maxSamples: N });
  const shot = async () => {
    v.resetAccumulation();
    await new Promise((res) => { const c = () => (v.pathTracer.samples >= N ? res() : setTimeout(c, 250)); c(); });
    v.composite();
    const src = v.renderer.domElement;
    const cv = document.createElement('canvas'); cv.width = 400; cv.height = Math.round((400 * src.height) / src.width);
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(src, 0, 0, cv.width, cv.height);
    return ctx.getImageData(0, 0, cv.width, cv.height).data;
  };
  const stat = (a, b) => { let max = 0, n = 0, se = 0; for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = Math.abs(a[i + k] - b[i + k]); if (d > 0) n++; if (d > max) max = d; se += d * d; } return { max, nDiff: n, rmse: +Math.sqrt(se / (a.length / 4 * 3)).toFixed(3) }; };

  const A = await shot();
  const B = await shot(); // 대조군
  const ORIG = 'uint width = uint( textureSize( tex, 0 ).x );\n\tuvec2 uv;\n\tuv.x = index % width;\n\tuv.y = index / width;\n\n\treturn texelFetch( tex, ivec2( uv ), 0 );';
  const FAST = /int w = textureSize\( tex, 0 \)\.x;[\s\S]*?return texelFetch\( tex, ivec2\( x, y \), 0 \);/g;
  const reverted = (mat.fragmentShader.match(FAST) || []).length;
  mat.fragmentShader = mat.fragmentShader.replace(FAST, ORIG);
  mat.needsUpdate = true;
  await new Promise((r) => setTimeout(r, 1500));
  await new Promise((res) => { const c = () => (v.pathTracer.isCompiling ? setTimeout(c, 300) : res()); c(); });
  const C = await shot();
  return { spp: N, reverted, control_AB: stat(A, B), patchEffect_AC: stat(A, C) };
}, { N });
console.log('EQUIV ' + JSON.stringify(res));
await browser.close();
