/**
 * 개발용 UI 스크린샷: 브라우저 pane 이 보이지 않아도 DOM(foreignObject SVG) + WebGL/WebGPU 캔버스를 합성해
 * dev 서버 `/__capture` 로 저장한다. 콘솔: `(await import('/src/dev/uishot.ts')).uiShot('name')`
 */
export async function uiShot(name: string): Promise<boolean> {
  const v = (window as any).viewer;
  const W = innerWidth;
  const H = innerHeight;
  const collect = (sheet: CSSStyleSheet): string => {
    let out = '';
    let rules: CSSRule[];
    try {
      rules = [...sheet.cssRules];
    } catch {
      return '';
    }
    for (const r of rules) {
      if (r instanceof CSSImportRule) {
        if (r.styleSheet) out += collect(r.styleSheet);
      } else out += r.cssText.replace(/url\((['"]?)https?:[^)]*\1\)/g, 'none') + '\n';
    }
    return out;
  };
  const css = [...document.styleSheets].map(collect).join('\n') + '\nhtml,body,#app,#body,#stage,#viewport{background:transparent !important;}';
  const clone = document.documentElement.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('script,link,canvas,#still-overlay,style,img').forEach((e) => e.remove());
  const selsSrc = [...document.querySelectorAll('select')];
  const selsDst = [...clone.querySelectorAll('select')];
  selsSrc.forEach((s, i) => {
    const d = selsDst[i];
    if (d) [...d.options].forEach((o) => (o.value === s.value ? o.setAttribute('selected', 'selected') : o.removeAttribute('selected')));
  });
  const insSrc = [...document.querySelectorAll('input')];
  const insDst = [...clone.querySelectorAll('input')];
  insSrc.forEach((s, i) => {
    const d = insDst[i];
    if (!d) return;
    if (s.type === 'checkbox') s.checked ? d.setAttribute('checked', 'checked') : d.removeAttribute('checked');
    else d.setAttribute('value', s.value);
  });
  const html = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject width="100%" height="100%"><style>${css.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</style>${html}</foreignObject></svg>`;
  const img = new Image();
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error('svg load fail'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const out = document.createElement('canvas');
  out.width = W;
  out.height = H;
  const ctx = out.getContext('2d')!;
  ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
  ctx.fillRect(0, 0, W, H);
  const stageEl = document.getElementById('stage')!;
  const sr = stageEl.getBoundingClientRect();
  ctx.fillStyle = getComputedStyle(stageEl).backgroundColor;
  ctx.fillRect(sr.left, sr.top, sr.width, sr.height);
  if (v.currentEngine === 'webgpu') {
    const blob: Blob = await v.captureBlob('image/png');
    const bmp = await createImageBitmap(blob);
    const c = v.rayzee.canvas as HTMLCanvasElement;
    const r = c.getBoundingClientRect();
    ctx.drawImage(bmp, r.left, r.top, r.width, r.height);
  } else {
    if (v.settings.render.pathTracing && !v.getStats().bvhBuilding) v.composite();
    else v.renderRaster();
    const c = v.renderer.domElement as HTMLCanvasElement;
    const r = c.getBoundingClientRect();
    ctx.drawImage(c, r.left, r.top, r.width, r.height);
  }
  ctx.drawImage(img, 0, 0);
  const dataUrl = out.toDataURL('image/png');
  const resp = await fetch('/__capture', { method: 'POST', body: JSON.stringify({ name, dataUrl }) });
  return (await resp.json()).ok;
}
(window as any).uiShot = uiShot;
