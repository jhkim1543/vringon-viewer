/**
 * A/B 비교: A = 권장 조합(시간적 재투영 + 하이브리드 채움 + à-trous), B = 기존 패스트레이서(리셋 후 재누적 + à-trous).
 * 같은 모델·조명·설정, 카메라는 양쪽 동기화. 이동 후 "깨끗(유효 spp ≥ 32)" 까지 걸린 시간을 표로 비교한다.
 */
import { Vector3 } from 'three';
import { FrameInfo, PathTraceViewer, RenderPhase, ViewerStats } from '../viewer/PathTraceViewer';
import { buildEternityBand, buildSolitaireRing } from '../viewer/procedural/jewelry';
import { el } from './ui';

const SAMPLES = [
  { value: 'proc:solitaire-gold', label: '주얼리 · 다이아 솔리테어 링 (골드)' },
  { value: 'proc:solitaire-platinum', label: '주얼리 · 다이아 솔리테어 링 (플래티넘)' },
  { value: 'proc:eternity', label: '주얼리 · 파베 이터니티 밴드' },
  { value: 'samples/vringon_jewelry_hoop.glb', label: '주얼리 · 후프 이어링' },
  { value: 'samples/MaterialsVariantsShoe.glb', label: '신발 · 스니커즈' },
  { value: 'samples/SheenChair.glb', label: '패브릭 체어 (Sheen)' },
  { value: 'samples/DamagedHelmet.glb', label: '헬멧 (PBR 텍스처)' },
  { value: 'samples/ToyCar.glb', label: '토이카 (Clearcoat)' },
];
const CLEAN_SPP = 32;
const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';

const PHASE_LABEL: Record<RenderPhase, string> = {
  building: '씬 준비 중',
  compiling: '셰이더 컴파일 중',
  raster: '래스터',
  preview: '이동 중 프리뷰',
  tracing: '누적 중',
  denoising: 'AI 디노이즈',
  done: '완료',
};

const toastEl = document.getElementById('cmp-toast')!;
let toastTimer = 0;
function toast(msg: string, ms = 3000) {
  toastEl.textContent = msg;
  toastEl.classList.add('on');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('on'), ms);
}

/* ------------------------------ 뷰어 2개 ------------------------------ */

const vpA = document.getElementById('vp-a')!;
const vpB = document.getElementById('vp-b')!;
const A = new PathTraceViewer({ container: vpA, assetBase: base });
const B = new PathTraceViewer({ container: vpB, assetBase: base });
(window as any).A = A;
(window as any).B = B;
A.setRender({ temporal: true, hybridFill: true });
B.setRender({ temporal: false, hybridFill: false });
// 비교 변수는 "재투영 + 채움" 하나만: 디노이저는 양쪽 다 à-trous 로 고정 (OIDN 패스는 GPU 를 수 초 점유해 시간 측정을 흐린다)
A.setPost({ denoise: 'atrous' });
B.setPost({ denoise: 'atrous' });

/* ------------------------------ 카메라 동기화 ------------------------------ */

let syncing = false;
function link(src: PathTraceViewer, dst: PathTraceViewer) {
  src.on('camera', (pose: { position: Vector3; target: Vector3 }) => {
    if (syncing) return;
    syncing = true;
    dst.syncCamera(pose.position, pose.target);
    syncing = false;
  });
  src.on('interaction', (on: boolean) => {
    if (syncing) return;
    syncing = true;
    if (on) dst.beginInteraction();
    else dst.endInteraction();
    syncing = false;
  });
}
link(A, B);
link(B, A);

/* ------------------------------ 통계·타이머 ------------------------------ */

interface PaneState {
  viewer: PathTraceViewer;
  el: HTMLElement;
  moveAt: number; // 마지막 이동(드래그 끝/카메라 변경) 시각
  cleanMs: number | null; // 이동 후 깨끗까지 ms
  interacting: boolean;
  last: FrameInfo | null;
  stats: ViewerStats | null;
}
const pa: PaneState = { viewer: A, el: document.getElementById('st-a')!, moveAt: performance.now(), cleanMs: null, interacting: false, last: null, stats: null };
const pb: PaneState = { viewer: B, el: document.getElementById('st-b')!, moveAt: performance.now(), cleanMs: null, interacting: false, last: null, stats: null };

function armTimer(p: PaneState) {
  p.moveAt = performance.now();
  p.cleanMs = null;
}
for (const p of [pa, pb]) {
  p.viewer.on('interaction', (on: boolean) => {
    p.interacting = on;
    if (!on) armTimer(p);
  });
  p.viewer.on('camera', () => {
    if (!p.interacting) armTimer(p);
  });
  p.viewer.on('frame', (f: FrameInfo) => {
    p.last = f;
    if (p.cleanMs === null && !p.interacting && f.accumulating && f.effectiveSamples >= CLEAN_SPP) {
      p.cleanMs = performance.now() - p.moveAt;
      onClean();
    }
  });
  p.viewer.on('stats', (st: ViewerStats) => {
    p.stats = st;
    renderStats(p);
  });
  p.viewer.on('error', (e: Error) => toast(e.message, 5000));
}

function fmt(ms: number) {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`;
}

function renderStats(p: PaneState) {
  const st = p.stats;
  if (!st) return;
  const f = p.last;
  const eff = f ? f.effectiveSamples : st.effectiveSamples;
  const since = performance.now() - p.moveAt;
  const pct = st.maxSamples ? Math.min(100, Math.round((st.samples / st.maxSamples) * 100)) : 0;
  const dotCls = st.phase === 'tracing' || st.phase === 'preview' ? 'tracing' : st.phase === 'done' ? 'done' : st.phase === 'compiling' || st.phase === 'building' ? 'compiling' : '';
  const cleanTxt = p.cleanMs !== null ? `<span class="ok">깨끗까지 ${fmt(p.cleanMs)}</span>` : p.interacting ? '이동 중…' : st.phase === 'compiling' || st.phase === 'building' ? '준비 중' : `이동 후 ${fmt(since)} — 아직 ${Math.round(eff)} / ${CLEAN_SPP} spp`;
  p.el.innerHTML =
    `<div class="row main"><span class="dot ${dotCls}"></span>${PHASE_LABEL[st.phase]} · <span class="big">${Math.round(eff)}</span> 유효 spp` +
    (p.viewer.settings.render.temporal && f ? ` <span style="color:var(--text-3)">(새 ${Math.floor(f.samples)} + 재사용 ${Math.max(0, Math.round(eff - f.samples))})</span>` : '') +
    `</div>` +
    `<div class="row">${cleanTxt}</div>` +
    `<div class="row"><span class="bar"><i style="width:${pct}%"></i></span>${pct}% · ${Math.floor(st.samples)}/${st.maxSamples || '∞'} spp · ${st.fps.toFixed(0)} fps</div>`;
}
// 타이머 표시는 stats(0.5 s) 보다 촘촘히
window.setInterval(() => {
  for (const p of [pa, pb]) if (p.cleanMs === null && !p.interacting) renderStats(p);
}, 200);

/* ------------------------------ 결과 표 ------------------------------ */

const tbody = document.querySelector<HTMLTableSectionElement>('#cmp-table tbody')!;
let moveNo = 0;
let pendingRow: { no: number; label: string; tr: HTMLTableRowElement } | null = null;
let moveLabel = '드래그';
function startMove(label: string) {
  moveNo++;
  moveLabel = label;
  const tr = el('tr');
  tr.innerHTML = `<td>${moveNo}</td><td>${label}</td><td>…</td><td>…</td><td></td>`;
  tbody.prepend(tr);
  while (tbody.children.length > 5) tbody.lastElementChild?.remove();
  pendingRow = { no: moveNo, label, tr };
}
function onClean() {
  if (!pendingRow) return;
  const tds = pendingRow.tr.querySelectorAll('td');
  if (pa.cleanMs !== null) tds[2].textContent = fmt(pa.cleanMs);
  if (pb.cleanMs !== null) tds[3].textContent = fmt(pb.cleanMs);
  if (pa.cleanMs !== null && pb.cleanMs !== null) {
    const ratio = pb.cleanMs / Math.max(1, pa.cleanMs);
    tds[4].textContent = `A ${ratio >= 1 ? ratio.toFixed(1) + '× 빠름' : (1 / ratio).toFixed(1) + '× 느림'}`;
    tds[4].className = ratio >= 1.2 ? 'good' : '';
    pendingRow = null;
  }
}
// 드래그 끝나면 새 행
A.on('interaction', (on: boolean) => {
  if (!on) startMove(moveLabel === '자동' ? '자동 15°' : '드래그');
});

/* ------------------------------ 상단 조작 ------------------------------ */

const modelSel = document.getElementById('cmp-model') as HTMLSelectElement;
for (const s of SAMPLES) {
  const o = el('option');
  o.value = s.value;
  o.textContent = s.label;
  modelSel.appendChild(o);
}
async function loadBoth(url: string) {
  try {
    if (url.startsWith('proc:')) {
      const kind = url.slice(5);
      const mk = () => (kind === 'solitaire-gold' ? buildSolitaireRing({ metal: 'gold' }) : kind === 'solitaire-platinum' ? buildSolitaireRing({ metal: 'platinum' }) : buildEternityBand({ metal: 'platinum' }));
      const oa = mk();
      const ob = mk();
      await Promise.all([A.loadObject(oa, `${oa.name}.procedural`), B.loadObject(ob, `${ob.name}.procedural`)]);
    } else {
      await Promise.all([A.loadModel(base + url), B.loadModel(base + url)]);
    }
    // 같은 출발 카메라
    B.syncCamera(A.getCameraPose().position, A.getCameraPose().target);
    for (const p of [pa, pb]) armTimer(p);
  } catch (e) {
    toast(`불러오기 실패: ${(e as Error).message}`);
  }
}
modelSel.addEventListener('change', () => void loadBoth(modelSel.value));

/** 양쪽을 동시에 타깃 주위로 deg 만큼 부드럽게 회전 (드래그와 같은 경로: begin → 카메라 변경 → end) */
async function rotateBoth(deg: number, ms = 350) {
  const pose = A.getCameraPose();
  const start = pose.position.clone();
  const target = pose.target.clone();
  const up = new Vector3(0, 1, 0);
  moveLabel = '자동';
  A.beginInteraction();
  const t0 = performance.now();
  await new Promise<void>((res) => {
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; // easeInOut
      const p = start.clone().sub(target).applyAxisAngle(up, (deg * Math.PI) / 180 * e).add(target);
      A.syncCamera(p, target); // → 'camera' 이벤트로 B 동기화
      if (k < 1) requestAnimationFrame(step);
      else res();
    };
    step();
  });
  A.endInteraction(); // → B 도 endInteraction (link)
}

document.getElementById('cmp-step')!.addEventListener('click', () => void rotateBoth(15));
document.getElementById('cmp-auto')!.addEventListener('click', async () => {
  const btn = document.getElementById('cmp-auto') as HTMLButtonElement;
  btn.disabled = true;
  for (let i = 0; i < 6; i++) {
    await rotateBoth(15);
    // 양쪽 다 깨끗해지거나 12 s 가 지나면 다음
    const t0 = performance.now();
    while ((pa.cleanMs === null || pb.cleanMs === null) && performance.now() - t0 < 12000) await new Promise((r) => setTimeout(r, 100));
    await new Promise((r) => setTimeout(r, 400));
  }
  btn.disabled = false;
});
document.getElementById('cmp-reset')!.addEventListener('click', () => {
  A.resetAccumulation();
  B.resetAccumulation();
  A.temporal.invalidate();
  for (const p of [pa, pb]) armTimer(p);
});
(document.getElementById('a-hybrid') as HTMLInputElement).addEventListener('change', (e) => {
  A.setRender({ hybridFill: (e.target as HTMLInputElement).checked });
});
window.addEventListener('keydown', (e) => {
  if ((e.target as HTMLElement).tagName === 'SELECT') return;
  if (e.key === 'r') document.getElementById('cmp-reset')!.click();
  if (e.key === ' ') {
    e.preventDefault();
    document.getElementById('cmp-step')!.click();
  }
});

/* ------------------------------ 시작 ------------------------------ */

const params = new URLSearchParams(location.search);
const initial = params.get('model') ?? SAMPLES[0].value;
if (SAMPLES.some((s) => s.value === initial)) modelSel.value = initial;
void loadBoth(initial);
