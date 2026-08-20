/**
 * texelFetch 패치의 비트 동일성 검증:
 * 같은 페이지에서 (a) 패치된 셰이더로 N spp, (b) 패치 해제(원본 본문 복원) 후 N spp 를 렌더해 픽셀 diff 를 잰다.
 * 주소 계산만 바꾼 것이므로 diff 는 0 이어야 한다. (재컴파일이 각각 1회씩 필요)
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const N = Number(process.argv[2] ?? 32);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1024,768'], defaultViewport: { width: 1024, height: 768 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pt-vulkan-profile'), protocolTimeout: 900000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));
page.on('console', (m) => { const t = m.text(); if (/texel-fetch/.test(t)) console.log('[console]', t.slice(0, 200)); });
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer?.getStats().samples >= 1, { timeout: 600000, polling: 1000 });
const res = await page.evaluate(async ({ N }) => {
  const v = window.viewer;
  const mat = v.pathTracer._pathTracer.material;
  v.setPost({ denoise: 'off' });
  v.setRender({ temporal: false, hybridFill: false, maxSamples: N });
  // 결정적 노이즈: 리셋마다 시드를 0 으로 되돌려 두 렌더가 같은 난수열을 쓰게 한다
  v.pathTracer._pathTracer.stableNoise = true;
  const shot = async () => {
    v.resetAccumulation();
    await new Promise((res) => { const c = () => (v.pathTracer.samples >= N ? res() : setTimeout(c, 200)); c(); });
    v.composite();
    const src = v.renderer.domElement;
    const cv = document.createElement('canvas'); cv.width = 400; cv.height = Math.round((400 * src.height) / src.width);
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(src, 0, 0, cv.width, cv.height);
    return ctx.getImageData(0, 0, cv.width, cv.height).data;
  };
  const patched = mat.fragmentShader.includes('float invW = 1.0 / float( w );');
  const a = await shot();
  // 원본 본문으로 되돌린다
  const ORIG = 'uint width = uint( textureSize( tex, 0 ).x );\n\tuvec2 uv;\n\tuv.x = index % width;\n\tuv.y = index / width;\n\n\treturn texelFetch( tex, ivec2( uv ), 0 );';
  const FAST = /int w = textureSize\( tex, 0 \)\.x;[\s\S]*?return texelFetch\( tex, ivec2\( x, y \), 0 \);/g;
  const before = mat.fragmentShader;
  mat.fragmentShader = before.replace(FAST, ORIG);
  const reverted = (before.match(FAST) || []).length;
  mat.needsUpdate = true;
  await new Promise((r) => setTimeout(r, 1200));
  await new Promise((res) => { const c = () => (v.pathTracer.isCompiling ? setTimeout(c, 300) : res()); c(); });
  const b = await shot();
  let maxDiff = 0, nDiff = 0;
  for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = Math.abs(a[i + k] - b[i + k]); if (d > 0) nDiff++; if (d > maxDiff) maxDiff = d; }
  return { patchedInitially: patched, revertedCount: reverted, maxDiff, diffPixels: nDiff, totalCh: a.length / 4 * 3 };
}, { N });
console.log('BITEXACT ' + JSON.stringify(res));
await browser.close();
