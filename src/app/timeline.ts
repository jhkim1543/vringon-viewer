/**
 * 누적 타임라인 — "지금 화면이 어떻게 쌓여 왔는지" 를 눈으로 보여준다.
 *
 *  · 리셋 후 샘플이 1 → 2 → 4 → 8 → … → 목표 spp 를 넘는 순간마다 그 프레임을 저장(반해상 JPEG)해 좌측 필름스트립에 쌓는다.
 *  · 썸네일에 마우스를 올리면 그 시점 프레임을 캔버스 위에 겹쳐 보여주고(A/B 깜빡이 비교), 클릭하면 분할 비교를 고정한다
 *    (마우스 X 가 분할선 — 왼쪽: 과거 spp, 오른쪽: 현재). 다시 클릭/Esc/카메라 조작 시 해제.
 *  · 카메라·설정 변경으로 누적이 리셋되면 타임라인도 비워진다(새 뷰 = 새 타임라인).
 *
 * WebGL2 엔진 전용: 'frame' 이벤트는 합성 직후 같은 동기 구간에서 오므로 드로잉 버퍼를 그대로 drawImage 할 수 있다.
 * (WebGPU·Rayzee 는 자체 rAF 루프라 프레젠트 뒤 캔버스가 비어 캡처가 안 된다 — 스트립을 숨기고 안내만 남긴다.)
 */
import type { FrameInfo, PathTraceViewer } from '../viewer/PathTraceViewer';
import { el } from './ui';

export interface TimelineShot {
  spp: number;
  url: string;
  elapsedMs: number;
}

const MILESTONES = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
const MAX_SHOTS = 14;
const THUMB_MAX_W = 960; // 저장 해상도 상한(비교 오버레이용) — 14장 × ~120 KB

export function createTimeline(viewer: PathTraceViewer, stage: HTMLElement) {
  /* ---- DOM ---- */
  const root = el('div');
  root.id = 'timeline';
  const head = el('div', 'tl-head');
  const title = el('span', 'tl-title', '누적 타임라인');
  const sub = el('span', 'tl-sub', '1 spp → 목표');
  head.append(title, sub);
  const list = el('div', 'tl-list');
  const foot = el('div', 'tl-foot', 'hover 비교 · click 분할 고정');
  root.append(head, list, foot);

  const overlay = el('div');
  overlay.id = 'compare-overlay';
  const ovImg = el('div', 'ov-img');
  const ovDivider = el('div', 'ov-divider');
  const ovLabelL = el('div', 'ov-label l');
  const ovLabelR = el('div', 'ov-label r');
  overlay.append(ovImg, ovDivider, ovLabelL, ovLabelR);
  stage.append(root, overlay);

  /* ---- 상태 ---- */
  const shots: TimelineShot[] = [];
  let lastSamples = 0;
  let nextIdx = 0; // MILESTONES 인덱스
  let gotMax = false;
  let enabled = true;
  let hovered: TimelineShot | null = null;
  let pinned: TimelineShot | null = null;
  let splitX = 0.5;
  let currentSpp = 0;
  const off = document.createElement('canvas');
  const ctx = off.getContext('2d', { alpha: false })!;

  const fmtT = (ms: number) => (ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`);

  function reset() {
    shots.length = 0;
    nextIdx = 0;
    gotMax = false;
    hovered = null;
    pinned = null;
    list.innerHTML = '';
    updateOverlay();
    sub.textContent = '1 spp → 목표';
  }

  function capture(spp: number, elapsedMs: number) {
    const src = viewer.renderer.domElement;
    const scale = Math.min(1, THUMB_MAX_W / src.width);
    off.width = Math.max(1, Math.round(src.width * scale));
    off.height = Math.max(1, Math.round(src.height * scale));
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(src, 0, 0, off.width, off.height);
    const url = off.toDataURL('image/jpeg', 0.86);
    const shot: TimelineShot = { spp, url, elapsedMs };
    shots.push(shot);
    appendItem(shot);
    if (shots.length > MAX_SHOTS) {
      shots.shift();
      list.firstElementChild?.remove();
    }
    renderList();
  }

  /** 썸네일은 증분 추가만 한다 — 전체 재생성하면 hover 중인 요소가 떨어져 나가 비교가 끊긴다 */
  function appendItem(shot: TimelineShot) {
    const item = el('div', 'tl-item');
    item.style.backgroundImage = `url(${shot.url})`;
    const lab = el('span', 'tl-spp', `${shot.spp} spp`);
    const tm = el('span', 'tl-time', fmtT(shot.elapsedMs));
    item.append(lab, tm);
    item.title = `${shot.spp} spp · ${fmtT(shot.elapsedMs)} — 올리면 이 시점과 비교, 클릭하면 분할 고정`;
    item.addEventListener('mouseenter', () => {
      hovered = shot;
      updateOverlay();
    });
    item.addEventListener('mouseleave', () => {
      hovered = null;
      updateOverlay();
    });
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      pinned = pinned === shot ? null : shot;
      updateOverlay();
    });
    list.appendChild(item);
  }

  function renderList() {
    const last = shots[shots.length - 1];
    const max = viewer.settings.render.maxSamples;
    sub.textContent = last ? `${shots[0].spp} → ${last.spp} spp${max ? ` / ${max}` : ''}` : '1 spp → 목표';
    // 최신 썸네일이 보이게
    list.scrollTop = list.scrollHeight;
  }

  function updateOverlay() {
    const shot = pinned ?? hovered;
    list.querySelectorAll('.tl-item').forEach((it, i) => it.classList.toggle('pinned', shots[i] === pinned));
    if (!shot) {
      overlay.classList.remove('on', 'split');
      return;
    }
    overlay.classList.add('on');
    overlay.classList.toggle('split', Boolean(pinned));
    ovImg.style.backgroundImage = `url(${shot.url})`;
    if (pinned) {
      const pct = Math.round(splitX * 100);
      ovImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      ovDivider.style.left = `${pct}%`;
      ovLabelL.textContent = `◀ ${shot.spp} spp · ${fmtT(shot.elapsedMs)}`;
      ovLabelR.textContent = `현재 ${currentSpp} spp ▶`;
    } else {
      ovImg.style.clipPath = '';
      ovLabelL.textContent = `${shot.spp} spp · ${fmtT(shot.elapsedMs)} 시점 (마우스를 떼면 현재 ${currentSpp} spp)`;
      ovLabelR.textContent = '';
    }
  }

  /* ---- 이벤트 ---- */
  viewer.on('frame', (f: FrameInfo) => {
    const spp = Math.floor(f.samples);
    currentSpp = spp;
    if (spp < lastSamples || spp === 0) {
      if (shots.length || pinned || hovered) reset();
      nextIdx = 0;
      gotMax = false;
    }
    lastSamples = spp;
    if (!enabled || !f.accumulating) return;
    // 마일스톤 교차(샘플이 한 프레임에 여러 개 늘 수 있어 "처음 넘은 프레임" 을 기록)
    let due = false;
    while (nextIdx < MILESTONES.length && MILESTONES[nextIdx] <= spp) {
      nextIdx++;
      due = true;
    }
    if (!due && f.maxSamples > 0 && !gotMax && spp >= f.maxSamples) due = true;
    if (f.maxSamples > 0 && spp >= f.maxSamples) gotMax = true;
    if (due) {
      // 같은 spp 중복 방지
      if (shots.length && shots[shots.length - 1].spp === spp) return;
      capture(spp, f.elapsedMs);
    }
    if (pinned || hovered) updateOverlay();
  });

  viewer.on('settings', () => {
    const gpu = viewer.currentEngine === 'webgpu';
    root.classList.toggle('unsupported', gpu);
    foot.textContent = gpu ? 'WebGPU 엔진에서는 타임라인을 지원하지 않습니다' : 'hover 비교 · click 분할 고정';
  });

  stage.addEventListener('mousemove', (e) => {
    if (!pinned) return;
    const r = stage.getBoundingClientRect();
    splitX = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    updateOverlay();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pinned) {
      pinned = null;
      updateOverlay();
    }
  });

  return {
    root,
    get shots() {
      return shots;
    },
    setEnabled(v: boolean) {
      enabled = v;
      root.hidden = !v;
      if (!v) {
        pinned = hovered = null;
        updateOverlay();
      }
    },
    get enabled() {
      return enabled;
    },
  };
}
