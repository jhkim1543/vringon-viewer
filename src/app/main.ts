import { Color, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import {
  ENVIRONMENT_PRESETS,
  LIGHT_RIGS,
  PathTraceViewer,
  RenderPhase,
  RigLight,
  StillProgress,
  StillResult,
  ToneMappingName,
  ViewerStats,
} from '../viewer/PathTraceViewer';
import { Section, button, chips, color, el, group, hint, kv, select, slider, subgroup, toast, toggle } from './ui';
import { buildEternityBand, buildSolitaireRing } from '../viewer/procedural/jewelry';
import { createTimeline } from './timeline';
import { applyDeviceProfile, createThroughputRecorder } from './deviceProfile';

const SAMPLES = [
  { value: 'samples/MaterialsVariantsShoe.glb', label: '신발 · 스니커즈 (glTF Sample)' },
  { value: 'proc:solitaire-gold', label: '주얼리 · 다이아 솔리테어 링 (골드)' },
  { value: 'proc:solitaire-platinum', label: '주얼리 · 다이아 솔리테어 링 (플래티넘)' },
  { value: 'proc:eternity', label: '주얼리 · 파베 이터니티 밴드' },
  { value: 'samples/vringon_jewelry_hoop.glb', label: '주얼리 · 후프 이어링 (VRINGON 주얼리 에이전트 생성)' },
  { value: 'samples/SheenChair.glb', label: '패브릭 체어 (Sheen)' },
  { value: 'samples/DamagedHelmet.glb', label: '헬멧 (PBR 텍스처)' },
  { value: 'samples/IridescenceLamp.glb', label: '램프 (Iridescence · Transmission)' },
  { value: 'samples/ToyCar.glb', label: '토이카 (Clearcoat)' },
];

const app = document.getElementById('app')!;
const stage = document.getElementById('stage')!;
const viewport = document.getElementById('viewport')!;
const panel = document.getElementById('panel-sections')!;
const hudStats = document.getElementById('hud-stats')!;
const hudStatus = document.getElementById('hud-status')!;
const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';

const viewer = new PathTraceViewer({ container: viewport, assetBase: base });
(window as any).viewer = viewer; // 콘솔 디버깅용
const S = viewer.settings;
// 접속 GPU 에 맞춘 자동 프로파일(첫 방문: 문자열 추정 / 재방문: 지난 실측 spp/s)
const deviceProfile = applyDeviceProfile(viewer);
const recordThroughput = createThroughputRecorder(viewer);
viewer.on('stats', (st: ViewerStats) => recordThroughput(st.phase, st.samples, st.elapsedMs, st.resolution));
// 누적 타임라인(좌측 필름스트립) + 비교 오버레이 — "누적되는 게 보이게"
const timeline = createTimeline(viewer, stage);
(window as any).timeline = timeline;

/* ------------------------------ 상단 바 ------------------------------ */

const sampleSelect = document.getElementById('sample-select') as HTMLSelectElement;
for (const s of SAMPLES) {
  const o = el('option');
  o.value = s.value;
  o.textContent = s.label;
  sampleSelect.appendChild(o);
}
sampleSelect.addEventListener('change', () => void loadUrl(sampleSelect.value));

const fileInput = document.getElementById('file-input') as HTMLInputElement;
document.getElementById('btn-upload')!.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  const f = fileInput.files?.[0];
  if (f) void handleFile(f);
  fileInput.value = '';
});

document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((b) => {
  b.addEventListener('click', () => viewer.setView(b.dataset.view as any));
});

document.getElementById('btn-capture')!.addEventListener('click', async () => {
  const blob = await viewer.captureBlob('image/png');
  const a = document.createElement('a');
  const name = (viewer.currentModel?.name ?? 'render').replace(/\.[^.]+$/, '');
  a.href = URL.createObjectURL(blob);
  a.download = `${name}_${Math.floor(viewer.getStats().samples)}spp.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
});

document.getElementById('btn-panel')!.addEventListener('click', () => app.classList.toggle('panel-hidden'));
document.getElementById('btn-theme')!.addEventListener('click', () => {
  const root = document.documentElement;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('vringon-pt-theme', next);
});
document.documentElement.dataset.theme = localStorage.getItem('vringon-pt-theme') ?? 'dark';

/* ------------------------------ 드래그 & 드롭 ------------------------------ */

let dragDepth = 0;
stage.addEventListener('dragenter', (e) => {
  e.preventDefault();
  dragDepth++;
  stage.classList.add('dragging');
});
stage.addEventListener('dragleave', () => {
  if (--dragDepth <= 0) {
    dragDepth = 0;
    stage.classList.remove('dragging');
  }
});
stage.addEventListener('dragover', (e) => e.preventDefault());
stage.addEventListener('drop', (e) => {
  e.preventDefault();
  dragDepth = 0;
  stage.classList.remove('dragging');
  const f = e.dataTransfer?.files?.[0];
  if (f) void handleFile(f);
});

async function handleFile(f: File) {
  const lower = f.name.toLowerCase();
  if (lower.endsWith('.hdr') || lower.endsWith('.exr')) {
    await viewer.setEnvironmentFromFile(f);
    envSelect.set('custom');
    toast(`환경맵 적용: ${f.name}`);
    return;
  }
  try {
    await viewer.loadModel(f);
  } catch (e) {
    toast(`불러오기 실패: ${(e as Error).message}`);
  }
}

async function loadUrl(url: string) {
  try {
    if (url.startsWith('proc:')) {
      const kind = url.slice(5);
      const obj =
        kind === 'solitaire-gold' ? buildSolitaireRing({ metal: 'gold' })
        : kind === 'solitaire-platinum' ? buildSolitaireRing({ metal: 'platinum' })
        : buildEternityBand({ metal: 'platinum' });
      await viewer.loadObject(obj, `${obj.name}.procedural`);
      return;
    }
    await viewer.loadModel(base + url);
  } catch (e) {
    toast(`불러오기 실패: ${(e as Error).message}`);
  }
}

/* ============================== 탭 1: Tracer ============================== */

{
  const sec = new Section(panel, '패스트레이서', false, 'render', 'Tracer');
  const g = group(sec.body, 'Path Tracer', true);
  const gpuOk = PathTraceViewer.webgpuSupported();
  const engineSel = select(
    g,
    '엔진',
    [
      { value: 'webgl', label: 'WebGL2 (기본 · 모든 브라우저)' },
      { value: 'webgpu', label: gpuOk ? 'WebGPU · Rayzee (베타)' : 'WebGPU · 미지원 브라우저' },
    ],
    viewer.currentEngine,
    (v) => {
      if (v === 'webgpu' && !gpuOk) {
        toast('이 브라우저는 WebGPU 를 지원하지 않습니다.');
        engineSel.set('webgl');
        return;
      }
      void viewer.setEngine(v as any).then(() => engineSel.set(viewer.currentEngine));
    },
  );
  toggle(g, 'Enable', S.render.pathTracing, (v) => viewer.setRender({ pathTracing: v }));
  toggle(g, 'Interaction Mode', S.render.dynamicLowRes, (v) => viewer.setRender({ dynamicLowRes: v }));
  // 권장 조합(기본 ON): 카메라를 옮겨도 직전 결과를 재투영해 재사용 + 샘플이 적은 픽셀은 래스터로 채움
  toggle(g, 'Realtime Mode', S.render.temporal, (v) => viewer.setRender({ temporal: v, hybridFill: v }));
  slider(g, 'Bounces', { min: 1, max: 16, step: 1, value: S.render.bounces, onInput: (v) => viewer.setRender({ bounces: v }) });
  select(
    g,
    'Quality',
    [
      { value: '32', label: 'Draft · 32 spp' },
      { value: '128', label: 'Standard · 128 spp' },
      { value: '512', label: 'High · 512 spp' },
      { value: '2048', label: 'Ultra · 2048 spp' },
      { value: '0', label: 'Unlimited' },
    ],
    String(S.render.maxSamples),
    (v) => viewer.setRender({ maxSamples: Number(v) }),
  );
  select(
    g,
    'Resolution',
    [
      { value: '0.5', label: '50 %' },
      { value: '0.75', label: '75 %' },
      { value: '1', label: '100 %' },
      { value: '1.5', label: '150 %' },
      { value: '2', label: '200 %' },
    ],
    String(S.render.renderScale),
    (v) => viewer.setRender({ renderScale: Number(v) }),
  );
  const outKv = kv(g, 'Output', '—');
  viewer.on('stats', (st: ViewerStats) => outKv.set(`${st.resolution[0]} × ${st.resolution[1]}`));

  const sc = group(sec.body, 'Scene', false);
  select(
    sc,
    'Floor',
    [
      { value: 'shadow', label: '그림자만 (투명)' },
      { value: 'solid', label: '보이는 바닥' },
      { value: 'none', label: '없음' },
    ],
    S.floor.enabled ? S.floor.mode : 'none',
    (v) => (v === 'none' ? viewer.setFloor({ enabled: false }) : viewer.setFloor({ enabled: true, mode: v as any })),
  );
  slider(sc, 'Shadow', { min: 0, max: 1, step: 0.05, value: S.floor.shadowStrength, onInput: (v) => viewer.setFloor({ shadowStrength: v }) });
  select(
    sc,
    'Background',
    [
      { value: 'color', label: '단색' },
      { value: 'blurred', label: '흐린 환경맵' },
      { value: 'environment', label: '환경맵 그대로' },
      { value: 'transparent', label: '투명 (합성용)' },
    ],
    S.environment.background,
    (v) => viewer.setEnvironment({ background: v as any }),
  );
  color(sc, 'BG Color', S.environment.backgroundColor, (v) => viewer.setEnvironment({ backgroundColor: v }));

  const dn = group(sec.body, 'Denoising', false);
  const dnChips = chips(
    dn,
    [
      { value: 'off', label: 'Off' },
      { value: 'atrous', label: 'Edge-aware' },
      { value: 'oidn', label: 'AI · OIDN' },
    ],
    S.post.denoise === 'bilateral' ? 'atrous' : S.post.denoise,
    (v) => viewer.setPost({ denoise: v as any }),
  );
  viewer.on('settings', () => dnChips.set(S.post.denoise === 'bilateral' ? 'atrous' : S.post.denoise));
  slider(dn, 'Strength', { min: 0.5, max: 6, step: 0.1, value: S.post.atrousStrength, onInput: (v) => viewer.setPost({ atrousStrength: v }) });
  hint(dn, 'Edge-aware: 수 spp 에서 깨끗, 누적되면 원본으로 수렴. AI: 최종 품질(WebGPU 필요, 없으면 Edge-aware 로 대체).');

  const adv = group(sec.body, 'Advanced', false);
  slider(adv, 'Transmissive', { min: 1, max: 20, step: 1, value: S.render.transmissiveBounces, onInput: (v) => viewer.setRender({ transmissiveBounces: v }) });
  slider(adv, 'Dispersion', { min: 0, max: 3, step: 0.05, value: S.render.dispersion, onInput: (v) => viewer.setRender({ dispersion: v }) });
  slider(adv, 'Glossy filter', { min: 0, max: 1, step: 0.05, value: S.render.filterGlossyFactor, onInput: (v) => viewer.setRender({ filterGlossyFactor: v }) });
  slider(adv, 'Tiles', { min: 1, max: 6, step: 1, value: S.render.tiles, onInput: (v) => viewer.setRender({ tiles: v }) });
  toggle(adv, 'MIS', S.render.multipleImportanceSampling, (v) => viewer.setRender({ multipleImportanceSampling: v }));
  slider(adv, 'Denoise fade', { min: 16, max: 512, step: 16, value: S.post.atrousFade, format: (v) => `${v}spp`, onInput: (v) => viewer.setPost({ atrousFade: v }) });
  slider(adv, 'OIDN interval', { min: 8, max: 256, step: 8, value: S.post.oidnInterval, format: (v) => `${v}spp`, onInput: (v) => viewer.setPost({ oidnInterval: v }) });
  const tones: ToneMappingName[] = ['ACES', 'AgX', 'Neutral', 'Reinhard', 'Cineon', 'Linear', 'None'];
  select(adv, 'Tone map', tones.map((t) => ({ value: t, label: t })), S.post.toneMapping, (v) => viewer.setPost({ toneMapping: v }));
  hint(adv, 'MIS 토글은 셰이더를 다시 컴파일합니다(수 초~1분). 나머지는 즉시 반영.');
}

/* ============================== 탭 2: Camera ============================== */

{
  const sec = new Section(panel, '카메라', false, 'camera', 'Camera');
  const g = group(sec.body, 'Camera', true);
  slider(g, 'FOV', { min: 10, max: 90, step: 1, value: S.camera.fov, format: (v) => `${v}°`, onInput: (v) => viewer.setCamera({ fov: v }) });
  slider(g, 'Exposure', { min: 0.1, max: 4, step: 0.05, value: S.post.exposure, onInput: (v) => viewer.setPost({ exposure: v }) });
  toggle(g, 'Turntable', S.camera.autoRotate, (v) => viewer.setCamera({ autoRotate: v }));
  const d = group(sec.body, 'Depth of Field', false);
  toggle(d, 'Enable', S.camera.dof, (v) => viewer.setCamera({ dof: v }));
  slider(d, 'f-stop', { min: 0.7, max: 22, step: 0.1, value: S.camera.fStop, format: (v) => `f/${v.toFixed(1)}`, onInput: (v) => viewer.setCamera({ fStop: v }) });
  toggle(d, 'Auto focus', S.camera.autoFocus, (v) => viewer.setCamera({ autoFocus: v }));
  const focus = slider(d, 'Focus', { min: 0.05, max: 10, step: 0.01, value: S.camera.focusDistance, format: (v) => `${v.toFixed(2)}m`, onInput: (v) => viewer.setCamera({ focusDistance: v, autoFocus: false }) });
  viewer.on('settings', () => focus.set(S.camera.focusDistance));
  hint(sec.body, '모델은 원점·바닥에 고정되고 카메라만 움직입니다. 뷰 프리셋(¾ F L R B T)은 하단 툴바.');
}

/* ============================== 탭 3: Light ============================== */

const envSelect = (() => {
  const sec = new Section(panel, '조명', false, 'light', 'Light');
  const g = group(sec.body, 'Environment', true);
  const opts = [...ENVIRONMENT_PRESETS.map((e) => ({ value: e.id, label: e.label })), { value: 'custom', label: '사용자 HDR/EXR…' }];
  const sel = select(g, 'HDRI', opts, S.environment.presetId, (v) => {
    if (v === 'custom') {
      fileInput.accept = '.hdr,.exr';
      fileInput.click();
      fileInput.accept = '.glb,.gltf,.obj,.stl,.fbx,.hdr,.exr';
      return;
    }
    viewer.setEnvironment({ presetId: v });
  });
  slider(g, 'Intensity', { min: 0, max: 5, step: 0.05, value: S.environment.intensity, onInput: (v) => viewer.setEnvironment({ intensity: v }) });
  slider(g, 'Rotation', { min: 0, max: 360, step: 1, value: S.environment.rotation, format: (v) => `${v}°`, onInput: (v) => viewer.setEnvironment({ rotation: v }) });

  const rg = group(sec.body, 'Light Rig', true);
  const lightsHost = el('div');
  select(
    rg,
    'Preset',
    LIGHT_RIGS.map((r) => ({ value: r.id, label: r.label })),
    S.lights.rigId,
    (v) => {
      viewer.setLights(v);
      renderLightControls();
    },
  );
  rg.appendChild(lightsHost);

  function renderLightControls() {
    lightsHost.innerHTML = '';
    for (const l of S.lights.lights) {
      const on = el('label', 'toggle');
      const cb = el('input');
      cb.type = 'checkbox';
      cb.checked = l.enabled;
      cb.addEventListener('change', () => viewer.updateLight(l.id, { enabled: cb.checked }));
      on.appendChild(cb);
      const body = group(lightsHost, `${l.label} · ${l.type === 'area' ? '면광원' : '스포트'}`, false, on);
      const upd = (patch: Partial<RigLight>) => viewer.updateLight(l.id, patch);
      slider(body, 'Power', { min: 0, max: l.type === 'spot' ? 400 : 60, step: 0.5, value: l.intensity, onInput: (v) => upd({ intensity: v }) });
      color(body, 'Color', l.color, (v) => upd({ color: v }));
      slider(body, 'Azimuth', { min: -180, max: 180, step: 1, value: l.azimuth, format: (v) => `${v}°`, onInput: (v) => upd({ azimuth: v }) });
      slider(body, 'Elevation', { min: -10, max: 89, step: 1, value: l.elevation, format: (v) => `${v}°`, onInput: (v) => upd({ elevation: v }) });
      if (l.type === 'area') {
        const ratio = l.height / (l.width || 1);
        slider(body, 'Size', { min: 0.1, max: 6, step: 0.05, value: l.width, onInput: (v) => upd({ width: v, height: v * ratio }) });
      } else {
        slider(body, 'Cone', { min: 5, max: 89, step: 1, value: l.angle ?? 40, format: (v) => `${v}°`, onInput: (v) => upd({ angle: v }) });
      }
    }
  }
  renderLightControls();
  hint(sec.body, '스튜디오 프리셋은 파일 없이 만든 소프트박스 환경. 면광원·스포트는 실제 면적/원뿔로 샘플링됩니다. .hdr/.exr 을 캔버스에 끌어다 놓으면 바로 적용.');
  return sel;
})();

/* ============================== 탭 4: Material ============================== */

{
  const sec = new Section(panel, '재질', false, 'material', 'Material');
  const g = group(sec.body, 'Look', true);
  chips(
    g,
    [
      { value: 'original', label: '원본' },
      { value: 'clay', label: '클레이' },
      { value: 'plastic', label: '플라스틱' },
      { value: 'metal', label: '메탈' },
      { value: 'glass', label: '유리' },
    ],
    'original',
    (v) => viewer.applyMaterialOverride(v as any),
  );
  const lg = group(sec.body, 'Materials', true);
  const list = el('div', 'mat-list');
  const editor = el('div');
  lg.append(list, editor);

  function renderList() {
    list.innerHTML = '';
    editor.innerHTML = '';
    const mats = viewer.getMaterials();
    if (!mats.length) {
      list.appendChild(el('div', 'hint', '모델을 불러오면 재질 목록이 표시됩니다.'));
      return;
    }
    mats.forEach((m, i) => {
      const item = el('div', 'mat-item');
      const sw = el('span', 'swatch');
      sw.style.background = `#${m.color.getHexString()}`;
      const name = el('span', undefined, m.name || `material_${i}`);
      const meta = el('span', 'meta', `R ${m.roughness.toFixed(2)} · M ${m.metalness.toFixed(2)}`);
      item.append(sw, name, meta);
      item.addEventListener('click', () => {
        list.querySelectorAll('.mat-item').forEach((x) => x.classList.remove('active'));
        item.classList.add('active');
        renderEditor(m, () => {
          sw.style.background = `#${m.color.getHexString()}`;
          meta.textContent = `R ${m.roughness.toFixed(2)} · M ${m.metalness.toFixed(2)}`;
        });
      });
      list.appendChild(item);
    });
  }

  function renderEditor(m: MeshStandardMaterial, onChanged: () => void) {
    editor.innerHTML = '';
    const gg = subgroup(editor, m.name || '재질 편집');
    const commit = () => {
      m.needsUpdate = true;
      viewer.commitMaterials();
      onChanged();
    };
    color(gg, 'Base color', `#${m.color.getHexString()}`, (v) => {
      m.color.set(v);
      commit();
    });
    slider(gg, 'Roughness', { min: 0, max: 1, step: 0.01, value: m.roughness, onInput: (v) => ((m.roughness = v), commit()) });
    slider(gg, 'Metalness', { min: 0, max: 1, step: 0.01, value: m.metalness, onInput: (v) => ((m.metalness = v), commit()) });
    const p = m as MeshPhysicalMaterial;
    if (p.isMeshPhysicalMaterial) {
      slider(gg, 'Clearcoat', { min: 0, max: 1, step: 0.01, value: p.clearcoat, onInput: (v) => ((p.clearcoat = v), commit()) });
      slider(gg, 'Transmission', { min: 0, max: 1, step: 0.01, value: p.transmission, onInput: (v) => ((p.transmission = v), commit()) });
      slider(gg, 'IOR', { min: 1, max: 2.5, step: 0.01, value: p.ior, onInput: (v) => ((p.ior = v), commit()) });
      slider(gg, 'Sheen', { min: 0, max: 1, step: 0.01, value: p.sheen, onInput: (v) => ((p.sheen = v), commit()) });
    }
    slider(gg, 'Emissive', { min: 0, max: 10, step: 0.1, value: m.emissiveIntensity, onInput: (v) => ((m.emissiveIntensity = v), commit()) });
    color(gg, 'Emissive color', `#${m.emissive.getHexString()}`, (v) => {
      m.emissive = new Color(v);
      commit();
    });
    button(gg, '양면 렌더 토글', () => {
      m.side = m.side === 2 ? 0 : 2;
      commit();
    });
  }
  viewer.on('materials', renderList);
  renderList();
}

/* ============================== 탭 5: Render (렌더샷) ============================== */

const stillUI = (() => {
  const sec = new Section(panel, '렌더샷', false, 'still', 'Render');
  const g = group(sec.body, 'Render Shot', true);
  const RES = [
    { value: '1280x720', label: 'HD · 1280×720' },
    { value: '1920x1080', label: 'FHD · 1920×1080' },
    { value: '2560x1440', label: 'QHD · 2560×1440' },
    { value: '3840x2160', label: '4K · 3840×2160' },
    { value: '2048x2048', label: '정사각 · 2048×2048' },
    { value: '1080x1350', label: '세로(SNS) · 1080×1350' },
    { value: 'custom', label: '직접 입력' },
  ];
  const state = { res: '1920x1080', w: 1920, h: 1080, samples: 256, bg: 'current' as 'current' | 'transparent', denoise: 'current' as 'current' | 'off' | 'bilateral' | 'oidn', format: 'image/png' as 'image/png' | 'image/jpeg' };
  const custom = el('div', 'row pair');
  const applyRes = (v: string) => {
    state.res = v;
    custom.style.display = v === 'custom' ? '' : 'none';
    if (v !== 'custom') {
      const [w, h] = v.split('x').map(Number);
      state.w = w;
      state.h = h;
      wIn.value = String(w);
      hIn.value = String(h);
    }
  };
  select(g, 'Resolution', RES, state.res, applyRes);
  custom.append(el('label', undefined, 'W × H'));
  const wIn = el('input');
  wIn.type = 'number';
  wIn.min = '64';
  wIn.max = '8192';
  wIn.value = String(state.w);
  const hIn = el('input');
  hIn.type = 'number';
  hIn.min = '64';
  hIn.max = '8192';
  hIn.value = String(state.h);
  wIn.addEventListener('change', () => (state.w = Math.max(64, Math.min(8192, Number(wIn.value) || 1920))));
  hIn.addEventListener('change', () => (state.h = Math.max(64, Math.min(8192, Number(hIn.value) || 1080))));
  custom.append(wIn, hIn);
  custom.style.display = 'none';
  g.appendChild(custom);
  select(g, 'Samples', [64, 128, 256, 512, 1024, 2048].map((n) => ({ value: String(n), label: `${n} spp` })), String(state.samples), (v) => (state.samples = Number(v)));
  select(
    g,
    'Background',
    [
      { value: 'current', label: '현재 설정 그대로' },
      { value: 'transparent', label: '투명 PNG (합성용)' },
    ],
    state.bg,
    (v) => (state.bg = v as any),
  );
  select(
    g,
    'Denoise',
    [
      { value: 'current', label: '현재 설정 그대로' },
      { value: 'oidn', label: 'AI · OIDN (권장)' },
      { value: 'bilateral', label: 'Edge-aware' },
      { value: 'off', label: '끔' },
    ],
    state.denoise,
    (v) => (state.denoise = v as any),
  );
  select(
    g,
    'Format',
    [
      { value: 'image/png', label: 'PNG (무손실·알파)' },
      { value: 'image/jpeg', label: 'JPEG (95%)' },
    ],
    state.format,
    (v) => (state.format = v as any),
  );
  const startBtn = button(g, '렌더샷 시작', () => void start(), 'btn accent');
  const gal = group(sec.body, 'Gallery', true);
  const gallery = el('div', 'shot-grid');
  gal.appendChild(gallery);
  hint(sec.body, '카메라·조명·환경은 현재 뷰 그대로, 지정 해상도·샘플로 다시 누적해 저장합니다. 진행 중에는 뷰가 잠깁니다.');

  const shots: StillResult[] = [];
  const meta = document.getElementById('still-meta')!;
  const bar = document.getElementById('still-bar-fill')!;
  document.getElementById('btn-still-cancel')!.addEventListener('click', () => viewer.cancelStill());
  document.getElementById('btn-still')!.addEventListener('click', () => {
    Section.show(sec);
    void start();
  });

  const fmt = (ms: number) => (ms < 60000 ? `${(ms / 1000).toFixed(0)}s` : `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`);
  viewer.on('still-progress', (p: StillProgress) => {
    const phase = p.phase === 'rendering' ? '누적' : p.phase === 'denoising' ? 'AI 디노이즈' : '인코딩';
    meta.textContent = `${phase} · ${Math.floor(p.samples)} / ${p.target} spp · ${Math.round(p.ratio * 100)}% · 경과 ${fmt(p.elapsedMs)}${p.etaMs ? ` · 남음 ${fmt(p.etaMs)}` : ''}`;
    bar.style.width = `${p.ratio * 100}%`;
  });

  function download(shot: StillResult) {
    const name = (viewer.currentModel?.name ?? 'render').replace(/\.[^.]+$/, '');
    const ext = shot.options.format === 'image/jpeg' ? 'jpg' : 'png';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(shot.blob);
    a.download = `${name}_${shot.width}x${shot.height}_${shot.samples}spp.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  function addShot(shot: StillResult) {
    shots.unshift(shot);
    const card = el('div', 'shot');
    const img = el('img');
    img.src = shot.dataUrl;
    img.alt = 'render shot';
    const cap = el('div', 'shot-cap', `${shot.width}×${shot.height} · ${shot.samples}spp · ${fmt(shot.elapsedMs)}`);
    const x = el('button', 'shot-x', '×');
    x.title = '삭제';
    x.addEventListener('click', (e) => {
      e.stopPropagation();
      card.remove();
      const i = shots.indexOf(shot);
      if (i >= 0) shots.splice(i, 1);
    });
    card.title = '클릭하면 다시 다운로드';
    card.addEventListener('click', () => download(shot));
    card.append(img, cap, x);
    gallery.prepend(card);
    while (gallery.children.length > 9) gallery.lastElementChild?.remove();
  }

  async function start() {
    if (viewer.isRenderingStill) return;
    if (!S.render.pathTracing) {
      toast('Path Tracing 을 켠 뒤 렌더샷을 찍을 수 있습니다.');
      return;
    }
    startBtn.disabled = true;
    stage.classList.add('still');
    meta.textContent = '준비 중…';
    bar.style.width = '0%';
    try {
      const shot = await viewer.renderStill({ width: state.w, height: state.h, samples: state.samples, background: state.bg, denoise: state.denoise, format: state.format });
      if (shot) {
        addShot(shot);
        download(shot);
        toast(`렌더샷 완료 · ${shot.width}×${shot.height} · ${shot.samples}spp · ${fmt(shot.elapsedMs)}`, 4000);
      } else {
        toast('렌더샷을 취소했습니다.');
      }
    } catch (e) {
      toast(`렌더샷 실패: ${(e as Error).message}`, 5000);
    } finally {
      stage.classList.remove('still');
      startBtn.disabled = false;
    }
  }
  return { start, shots };
})();
void stillUI;

/* ============================== 탭 6: Info ============================== */

const PHASE_LABEL: Record<RenderPhase, string> = {
  building: '씬 준비 중 (모델 · 환경 · BVH)',
  compiling: '셰이더 컴파일 중 (첫 1회)',
  raster: '래스터 미리보기 (PT 꺼짐)',
  preview: '실시간 프리뷰 · 저해상 PT',
  tracing: '패스트레이싱 누적',
  denoising: 'AI 디노이즈',
  done: '렌더 완료',
};

const info = (() => {
  const sec = new Section(panel, '정보', false, 'info', 'Info');
  const g = group(sec.body, 'Model', true);
  const kvEl = el('div', 'kv');
  g.appendChild(kvEl);
  const e = group(sec.body, 'Engine', true);
  const engKv = el('div', 'kv');
  e.appendChild(engKv);
  const k = group(sec.body, 'Shortcuts', false);
  k.appendChild(el('div', 'hint', 'Space: Path Tracing ↔ 래스터 · R: 누적 초기화 · T: 누적 타임라인(기본 숨김) · F: 3/4 뷰 · H: 패널 접기 · Esc: 분할 비교 해제 · 드래그/휠: 궤도/줌 · 파일 드롭: 모델 / .hdr·.exr'));
  viewer.on('stats', (st: ViewerStats) => {
    engKv.innerHTML = '';
    const rows: [string, string][] = [
      ['Engine', st.engine === 'webgpu' ? 'WebGPU · Rayzee wavefront' : 'WebGL2 · three-gpu-pathtracer'],
      ['Device profile', `${deviceProfile.tier} (${deviceProfile.basis === 'measured' ? '실측 기반' : '추정'})`],
      ['Phase', PHASE_LABEL[st.phase]],
      ['Samples', `${Math.floor(st.samples)}${st.maxSamples ? ` / ${st.maxSamples}` : ''} spp`],
      ['Denoiser', st.denoiser],
      ['Internal res', `${st.resolution[0]} × ${st.resolution[1]}`],
      ['Elapsed', `${(st.elapsedMs / 1000).toFixed(1)} s`],
    ];
    for (const [a, b] of rows) engKv.append(el('span', undefined, a), el('span', undefined, b));
  });
  return kvEl;
})();

/* ------------------------------ 진행률 칩 · HUD ------------------------------ */

const chip = document.getElementById('progress-chip')!;
const chipLabel = document.getElementById('progress-label')!;
const chipPct = document.getElementById('progress-pct')!;
const chipFill = document.getElementById('progress-fill')!;

/* ---------- 첫 방문 준비 카드 ---------- */
const fv = document.getElementById('first-visit')!;
const fvEls = {
  assets: { li: fv.querySelector<HTMLElement>('[data-step="assets"]')!, em: document.getElementById('fv-assets')! },
  scene: { li: fv.querySelector<HTMLElement>('[data-step="scene"]')!, em: document.getElementById('fv-scene')! },
  shader: { li: fv.querySelector<HTMLElement>('[data-step="shader"]')!, em: document.getElementById('fv-shader')! },
};
let fvDismissed = false;
const fvStep = (k: keyof typeof fvEls, state: 'wait' | 'active' | 'done', label: string) => {
  const e = fvEls[k];
  e.li.classList.toggle('active', state === 'active');
  e.li.classList.toggle('done', state === 'done');
  e.em.textContent = label;
};
viewer.on('stats', (st: ViewerStats) => {
  if (fvDismissed) return;
  // 이 기기에 컴파일 기록이 있으면(재방문) 카드를 띄우지 않는다
  if (st.compileEstimateMeasured && fv.hidden) {
    fvDismissed = true;
    return;
  }
  if (st.phase === 'tracing' || st.phase === 'done' || st.phase === 'preview') {
    fvStep('assets', 'done', '완료');
    fvStep('scene', 'done', '완료');
    fvStep('shader', 'done', '완료');
    fvDismissed = true;
    window.setTimeout(() => (fv.hidden = true), 1500);
    return;
  }
  fv.hidden = false;
  const loaded = Boolean(st.modelName);
  fvStep('assets', loaded ? 'done' : 'active', loaded ? '완료' : '내려받는 중…');
  if (st.phase === 'building') {
    // BVH % 는 상태 문자열("BVH 빌드 중… n%")에서 온다
    const m = /(\d+)%/.exec(viewer.statusText);
    fvStep('scene', 'active', m ? `${m[1]}%` : '진행 중…');
    fvStep('shader', 'wait', '대기');
  } else if (st.phase === 'compiling') {
    fvStep('scene', 'done', '완료');
    const pct = Math.round(st.compileProgress * 100);
    fvStep('shader', 'active', `약 ${pct}% · 남은 ≈ ${fmtSec(st.compileRemainMs)}`);
  }
});

viewer.on('status', (s: string) => (hudStatus.textContent = s));
viewer.on('error', (e: Error) => toast(e.message ?? String(e), 5000));
const accumBar = document.getElementById('accum-bar')!;
const chipSub = document.getElementById('progress-sub')!;
const fmtSec = (ms: number) => (ms < 10_000 ? `${(ms / 1000).toFixed(1)}s` : ms < 120_000 ? `${Math.round(ms / 1000)}s` : `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`);
const rate = { samples: 0, t: performance.now(), spps: 0 };

viewer.on('stats', (st: ViewerStats) => {
  // 상단 진행률 칩: 단계 + 퍼센트 + 바 — "지금 보는 화면이 몇 % 짜리인지"
  chip.dataset.phase = st.phase;
  chipLabel.textContent = PHASE_LABEL[st.phase];
  const samples = Math.floor(st.samples);
  const pct = Math.round(st.progress * 100);
  const showPct = st.phase === 'tracing' || st.phase === 'done' || st.phase === 'denoising';
  chipPct.textContent =
    showPct ? (st.maxSamples ? `${pct}% · ${samples}/${st.maxSamples} spp` : `${samples} spp`)
    : st.phase === 'compiling' ? `약 ${Math.round(st.compileProgress * 100)}%`
    : '';
  // 컴파일 중에는 추정 진행률 막대를 실제로 채운다(불확정 애니메이션 대신) — 얼마나 남았는지 눈에 보이게
  const indeterminate = st.phase === 'building';
  chip.classList.toggle('indeterminate', indeterminate);
  chipFill.style.width =
    st.phase === 'compiling' ? `${Math.round(st.compileProgress * 100)}%`
    : indeterminate ? ''
    : showPct ? `${st.maxSamples ? pct : 100}%`
    : '0%';
  // 두 번째 줄: 경과 · 남은 시간 · 잔여 노이즈(1/√spp — 몬테카를로 표준편차 기준 추정치) · 누적 속도
  // 누적 속도(spp/s): 최근 stats 틱 사이의 증분으로 — 컴파일 대기 시간이 섞이지 않게
  const nowT = performance.now();
  if (st.samples < rate.samples || st.phase !== 'tracing') rate.spps = 0;
  else if (nowT - rate.t > 400) rate.spps = rate.spps * 0.5 + ((st.samples - rate.samples) / ((nowT - rate.t) / 1000)) * 0.5;
  if (nowT - rate.t > 400 || st.samples < rate.samples) {
    rate.samples = st.samples;
    rate.t = nowT;
  }
  if (st.phase === 'tracing' || st.phase === 'denoising') {
    const eta = st.maxSamples && rate.spps > 0.05 ? ((st.maxSamples - st.samples) / rate.spps) * 1000 : NaN;
    const noise = samples > 0 ? 100 / Math.sqrt(samples) : 100;
    chipSub.textContent =
      `누적 중 ▲ ${rate.spps > 0 ? rate.spps.toFixed(1) : '–'} spp/s · 경과 ${fmtSec(st.elapsedMs)}` +
      (Number.isFinite(eta) ? ` · 남은 ≈ ${fmtSec(eta)}` : '') +
      ` · 잔여 노이즈 ≈ ${noise < 10 ? noise.toFixed(1) : Math.round(noise)}%`;
  } else if (st.phase === 'done') {
    chipSub.textContent = `${samples} spp 수렴 · ${fmtSec(st.elapsedMs)} 소요 · 잔여 노이즈 ≈ ${(100 / Math.sqrt(Math.max(1, samples))).toFixed(1)}% (1 spp 대비)`;
  } else if (st.phase === 'preview') {
    chipSub.textContent = '조작 중 — 50% 해상도 · 1 spp · 디노이즈 프리뷰. 손을 떼면 풀해상 누적 시작';
  } else if (st.phase === 'compiling') {
    // 셰이더 컴파일은 진짜 진행률 API 가 없다(완료 여부 boolean 뿐) → 이 기기의 지난 실측값 대비 경과로 "추정" 임을 명시한다
    const pct = Math.round(st.compileProgress * 100);
    const src = st.compileEstimateMeasured ? '이 기기 지난 기록 기준' : '기기 종류 기준 추정';
    chipSub.textContent =
      `GPU 셰이더 컴파일 · 약 ${pct}% (${src}) · 경과 ${fmtSec(st.compileElapsedMs)}` +
      (st.compileRemainMs > 500 ? ` · 남은 ≈ ${fmtSec(st.compileRemainMs)}` : ' · 곧 완료') +
      ' — 첫 방문 1회만, 다음부터는 수 초';
  } else if (st.phase === 'raster') {
    chipSub.textContent = 'Space 또는 PT 버튼으로 패스트레이싱 켜기';
  } else {
    chipSub.textContent = '';
  }
  // 스테이지 상단 2px 누적 바 (칩을 못 봐도 누적이 진행 중임이 보이게)
  accumBar.dataset.phase = st.phase;
  accumBar.style.width = showPct ? `${st.maxSamples ? pct : 100}%` : '0%';
  // 하단 작은 통계
  hudStats.innerHTML =
    `<span class="eng">${st.engine === 'webgpu' ? 'WebGPU' : 'WebGL2'}</span>` +
    (st.engine === 'webgl' ? `<span class="sep">|</span>${st.fps.toFixed(0)} fps` : '') +
    `<span class="sep">|</span>${st.resolution[0]}×${st.resolution[1]}` +
    `<span class="sep">|</span>${(st.triangles / 1000).toFixed(1)}k tri` +
    (st.denoiser !== 'off' ? `<span class="sep">|</span>${st.denoiser}` : '');
});
viewer.on('model-loaded', (m) => {
  info.innerHTML = '';
  const rows: [string, string][] = [
    ['File', m.name],
    ['Format', m.format.toUpperCase()],
    ['Triangles', m.triangles.toLocaleString()],
    ['Meshes', String(m.meshes)],
    ['Materials', String(m.materials.length)],
    ['Size', `${m.originalSize.x.toFixed(3)} × ${m.originalSize.y.toFixed(3)} × ${m.originalSize.z.toFixed(3)}`],
  ];
  for (const [k2, v] of rows) info.append(el('span', undefined, k2), el('span', undefined, v));
  toast(`${m.name} · ${m.triangles.toLocaleString()} 삼각형`, 2500);
});

/* ------------------------------ 탭 · 플로팅 툴바 ------------------------------ */

Section.buildTabs(document.getElementById('panel-tabs')!, 'Tracer');

const ptToggleBtn = document.getElementById('btn-pt-toggle') as HTMLButtonElement;
const ttBtn = document.getElementById('btn-turntable') as HTMLButtonElement;
const syncFloat = () => {
  ptToggleBtn.classList.toggle('active', S.render.pathTracing);
  ptToggleBtn.title = S.render.pathTracing ? 'Path Tracing 켜짐 — 클릭하면 래스터 (Space)' : '래스터 — 클릭하면 Path Tracing (Space)';
  ttBtn.classList.toggle('active', S.camera.autoRotate);
};
ptToggleBtn.addEventListener('click', () => viewer.setRender({ pathTracing: !S.render.pathTracing }));
// 누적 타임라인은 기본 숨김(사용자 피드백: 없어도 됨) — 단축키 T 로 켤 수 있다
timeline.setEnabled(false);
ttBtn.addEventListener('click', () => viewer.setCamera({ autoRotate: !S.camera.autoRotate }));
viewer.on('settings', syncFloat);
syncFloat();

document.getElementById('btn-share')!.addEventListener('click', async () => {
  const u = new URL(location.href);
  u.searchParams.set('model', sampleSelect.value);
  u.searchParams.set('env', S.environment.presetId);
  u.searchParams.set('rig', S.lights.rigId);
  u.searchParams.set('bg', S.environment.background);
  try {
    await navigator.clipboard.writeText(u.toString());
    toast('뷰 링크를 복사했습니다.');
  } catch {
    toast(u.toString(), 6000);
  }
});

viewer.on('settings', () => stage.classList.toggle('transparent-bg', S.environment.background === 'transparent'));

/* ------------------------------ 키보드 ------------------------------ */

window.addEventListener('keydown', (e) => {
  if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT') return;
  switch (e.key) {
    case ' ':
      e.preventDefault();
      viewer.setRender({ pathTracing: !S.render.pathTracing });
      break;
    case 'r':
      viewer.resetAccumulation();
      break;
    case 'f':
      viewer.setView('quarter');
      break;
    case 'h':
      app.classList.toggle('panel-hidden');
      break;
    case 't':
      timeline.setEnabled(!timeline.enabled);
      break;
  }
});

/* ------------------------------ 시작 ------------------------------ */

const params = new URLSearchParams(location.search);
const initial = params.get('model') ?? SAMPLES[0].value;
if (SAMPLES.some((s) => s.value === initial)) sampleSelect.value = initial;
if (params.get('env')) viewer.setEnvironment({ presetId: params.get('env')! });
if (params.get('bg')) viewer.setEnvironment({ background: params.get('bg') as any });
if (params.get('rig')) viewer.setLights(params.get('rig')!);
void loadUrl(initial);
