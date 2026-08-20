/**
 * stratified 축 버그의 실제 화질 영향 A/B.
 * 조작 프리셋(bounces 3 / transmissive 4)에서 폭 12(버그 재현) vs 24(수정) 로 각각 N spp 렌더하고,
 * 같은 설정의 고품질 레퍼런스(512spp, 폭 24) 대비 RMSE 를 비교한다. 디노이저는 끈다.
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const model = process.argv[2] ?? 'proc:solitaire-gold';
const N = Number(process.argv[3] ?? 16);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1280,800'], defaultViewport: { width: 1280, height: 800 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11'), protocolTimeout: 900000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));
await page.goto(`http://127.0.0.1:5230/?model=${encodeURIComponent(model)}`, { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer?.getStats().samples >= 1, { timeout: 600000, polling: 1000 });

const run = await page.evaluate(async ({ N }) => {
  const v = window.viewer;
  const mat = v.pathTracer._pathTracer.material;
  const stx = mat.stratifiedTexture;
  // 원본 init (축 교정 래퍼 이전) 확보
  const proto = Object.getPrototypeOf(stx);
  const rawInit = proto.init.bind(stx);
  v.setPost({ denoise: 'off' });
  v.setRender({ temporal: false, hybridFill: false, bounces: 3, transmissiveBounces: 4 });

  const render = async (width, target) => {
    // 매 프레임 라이브러리가 init 을 부르므로, 원하는 폭으로 강제하는 래퍼를 씌운다
    stx.init = (count, depth, strata) => rawInit(20, width, strata);
    stx.init(20, width);
    v.setRender({ maxSamples: target });
    v.resetAccumulation();
    await new Promise((res) => { const c = () => (v.pathTracer.samples >= target ? res() : setTimeout(c, 200)); c(); });
    v.composite();
    const src = v.renderer.domElement;
    const cv = document.createElement('canvas'); cv.width = 320; cv.height = Math.round((320 * src.height) / src.width);
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(src, 0, 0, cv.width, cv.height);
    return { data: ctx.getImageData(0, 0, cv.width, cv.height).data, dims: [stx.image.width, stx.image.height] };
  };
  const rmse = (a, b) => { let se = 0, n = 0; for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = a[i + k] - b[i + k]; se += d * d; n++; } return Math.sqrt(se / n); };

  const ref = await render(24, 512);
  const fixed = await render(24, N);
  const buggy = await render(12, N);
  return {
    refDims: ref.dims, fixedDims: fixed.dims, buggyDims: buggy.dims,
    rmseFixed: +rmse(fixed.data, ref.data).toFixed(3),
    rmseBuggy: +rmse(buggy.data, ref.data).toFixed(3),
  };
}, { N });
console.log('STRATIFIED_AB ' + JSON.stringify({ model, spp: N, ...run, improvementPct: +(((run.rmseBuggy - run.rmseFixed) / run.rmseBuggy) * 100).toFixed(1) }));
await browser.close();
