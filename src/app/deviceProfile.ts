/**
 * 접속 기기의 GPU 를 최대한 활용하기 위한 자동 프로파일.
 *
 * 1) 첫 방문: WebGL 렌더러 문자열로 티어를 추정해 시작 설정을 고른다.
 *    - high(외장/애플 실리콘): 목표 spp 를 올려 더 깨끗한 정지 이미지 (GPU 여유를 품질로)
 *    - low(구형 내장·모바일): 내부 해상도를 낮춰 수렴 시간을 지킨다 (시간을 고정, 해상도로 조절)
 *    - mid: 기본값 그대로
 * 2) 재방문: 지난 방문에 실측한 누적 처리량(spp/s)으로 티어 추정을 덮어쓴다 — 문자열 추정보다 정확하다.
 *    128 spp 목표가 12 s 를 넘길 기기는 해상도를 한 단계 낮추고, 3 s 안에 끝내는 기기는 목표 spp 를 올린다.
 *
 * WebGPU 활용: AI 디노이즈(OIDN)가 WebGPU 로 돈다. 뷰어가 시작 시 256² 속도 점검으로
 * "이 GPU 에서 이득인가" 를 실측해 자동 선택하므로 여기서는 건드리지 않는다.
 * (렌더 엔진 자체의 WebGPU(Rayzee) 전환은 이 PC 실측에서 WebGL2 의 1/27 이라 자동화하지 않는다 — 수동 옵션 유지)
 */
import type { PathTraceViewer } from '../viewer/PathTraceViewer';

export type GpuTier = 'high' | 'mid' | 'low';

interface Throughput {
  /** 실측 spp/s */
  spps: number;
  /** 실측 당시 내부 해상도(픽셀 수) — 다른 해상도로 환산할 때 사용 */
  pixels: number;
  at: string;
}

function gpuString(viewer: PathTraceViewer): string {
  try {
    const gl = viewer.renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) return String(gl.getParameter((ext as any).UNMASKED_RENDERER_WEBGL));
  } catch {
    /* noop */
  }
  return 'unknown';
}

export function detectTier(gpu: string): GpuTier {
  // 외장·고성능: 지포스/라데온 RX/애플 실리콘/인텔 Arc A 시리즈(외장)
  if (/RTX|GTX 1[6-9]|GeForce|Radeon (RX|Pro)|Apple (M\d|GPU)|Arc(\(TM\))? A\d{3}/i.test(gpu)) return 'high';
  // 구형·저전력 내장, 소프트웨어 래스터라이저, 모바일
  if (/SwiftShader|llvmpipe|Mali|Adreno|PowerVR|HD Graphics [2-6]\d{2}|UHD Graphics(?! 7)/i.test(gpu)) return 'low';
  return 'mid';
}

const throughputKey = (gpu: string) => `vringon-pt-throughput:${gpu}`;

export function loadThroughput(gpu: string): Throughput | null {
  try {
    const raw = localStorage.getItem(throughputKey(gpu));
    if (!raw) return null;
    const v = JSON.parse(raw) as Throughput;
    return Number.isFinite(v.spps) && v.spps > 0 ? v : null;
  } catch {
    return null;
  }
}

export function saveThroughput(gpu: string, spps: number, pixels: number) {
  try {
    localStorage.setItem(throughputKey(gpu), JSON.stringify({ spps, pixels, at: new Date().toISOString() } satisfies Throughput));
  } catch {
    /* noop */
  }
}

export interface AppliedProfile {
  gpu: string;
  tier: GpuTier;
  /** 결정 근거: 'measured'(지난 실측) | 'heuristic'(문자열 추정) */
  basis: 'measured' | 'heuristic';
  renderScale: number;
  maxSamples: number;
  /** 예상 128→목표 spp 수렴 시간(s), 실측 기반일 때만 */
  etaS: number | null;
  note: string;
}

/**
 * 뷰어 생성 직후 1회 호출. 사용자가 손댄 값을 덮지 않도록 "기본값에서 벗어나지 않았을 때만" 조정한다.
 */
export function applyDeviceProfile(viewer: PathTraceViewer): AppliedProfile {
  const gpu = gpuString(viewer);
  const measured = loadThroughput(gpu);
  const tier = detectTier(gpu);
  const s = viewer.settings.render;

  let renderScale = s.renderScale;
  let maxSamples = s.maxSamples;
  let basis: AppliedProfile['basis'] = 'heuristic';
  let etaS: number | null = null;
  let note = '';

  if (measured) {
    basis = 'measured';
    // 현재 캔버스 픽셀 수로 환산한 예상 처리량 → 목표 도달 시간
    const rect = viewer.renderer.domElement;
    const pixels = Math.max(1, rect.width * rect.height);
    const sppsHere = measured.spps * (measured.pixels / pixels);
    etaS = maxSamples / Math.max(0.1, sppsHere);
    if (etaS > 25) {
      renderScale = 0.65;
      note = `지난 실측 ${measured.spps.toFixed(1)} spp/s — 수렴 ${Math.round(etaS)}s 예상이라 내부 해상도 65%`;
    } else if (etaS > 12) {
      renderScale = 0.75;
      note = `지난 실측 ${measured.spps.toFixed(1)} spp/s — 수렴 ${Math.round(etaS)}s 예상이라 내부 해상도 75%`;
    } else if (etaS < 3 && maxSamples === 128) {
      maxSamples = 256;
      note = `지난 실측 ${measured.spps.toFixed(1)} spp/s — 3s 내 수렴이라 목표를 256 spp 로 상향`;
    } else {
      note = `지난 실측 ${measured.spps.toFixed(1)} spp/s — 기본값 유지`;
    }
  } else if (tier === 'high') {
    maxSamples = 256;
    note = '고성능 GPU 추정 — 목표 256 spp';
  } else if (tier === 'low') {
    renderScale = 0.75;
    viewer.settings.post.denoise = 'atrous'; // OIDN 속도 점검 비용도 아낀다
    note = '저전력 GPU 추정 — 내부 해상도 75% · 에지 보존 디노이즈';
  } else {
    note = '표준 프로파일';
  }

  // 기본값(1 / 128)일 때만 자동 조정 — 사용자가 바꾼 값은 존중
  const patch: Record<string, number> = {};
  if (s.renderScale === 1 && renderScale !== 1) patch.renderScale = renderScale;
  if (s.maxSamples === 128 && maxSamples !== 128) patch.maxSamples = maxSamples;
  if (Object.keys(patch).length) viewer.setRender(patch as any);

  return { gpu, tier, basis, renderScale: viewer.settings.render.renderScale, maxSamples: viewer.settings.render.maxSamples, etaS, note };
}

/**
 * 누적이 완주될 때마다 처리량을 기록한다(다음 방문의 프로파일 근거).
 * main.ts 에서 stats 이벤트로 호출.
 */
export function createThroughputRecorder(viewer: PathTraceViewer) {
  const gpu = gpuString(viewer);
  let recordedForThisRun = false;
  let lastPhase = '';
  return (phase: string, samples: number, elapsedMs: number, resolution: [number, number]) => {
    if (phase !== 'done') {
      if (lastPhase === 'done') recordedForThisRun = false; // 리셋 후 새 런
      lastPhase = phase;
      return;
    }
    lastPhase = phase;
    if (recordedForThisRun || elapsedMs < 500 || samples < 16) return;
    recordedForThisRun = true;
    const spps = samples / (elapsedMs / 1000);
    const pixels = resolution[0] * resolution[1];
    // 이동 평균(2:1)으로 기록 — 한 번의 요행/불운에 흔들리지 않게
    const prev = loadThroughput(gpu);
    const blended = prev && prev.pixels === pixels ? prev.spps * (1 / 3) + spps * (2 / 3) : spps;
    saveThroughput(gpu, blended, pixels);
  };
}
