import {
  DataTexture,
  EquirectangularReflectionMapping,
  FloatType,
  LinearFilter,
  RGBAFormat,
  Texture,
} from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

/**
 * 절차적 스튜디오 환경맵.
 *
 * WebRTX(V-REN)에서 쓰던 "라이팅룸" 아이디어를 파일 없이 재현한다 — 소프트박스 몇 개를
 * 구면 위에 그려 넣은 float equirect 텍스처를 만들고, 그것을 path tracer 의 envmap 으로 준다.
 * 파일 HDR 과 달리 배포 용량이 0 이고, 프리셋을 파라미터로 무한히 만들 수 있다.
 */

export interface SoftBox {
  /** 방위각(deg). 0 = 카메라 정면(+Z), 90 = 오른쪽(+X) */
  azimuth: number;
  /** 고도각(deg). 90 = 천정 */
  elevation: number;
  /** 각 크기(deg) — 가로/세로 */
  width: number;
  height: number;
  /** 선형 RGB 색 (0~1) */
  color: [number, number, number];
  intensity: number;
  /** 가장자리 부드러움(0~1) */
  softness?: number;
}

export interface ProceduralEnvSpec {
  /** 위/아래 주변광 (선형 RGB) */
  skyTop: [number, number, number];
  skyHorizon: [number, number, number];
  ground: [number, number, number];
  boxes: SoftBox[];
  /** 지평선 그라데이션 폭 (0~1) */
  horizonSoftness?: number;
}

const DEG = Math.PI / 180;

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/** equirect(u,v) → 월드 방향. three.js 의 equirect 규약(+X 가 u=0.5 지점, -Z 가 u=0)에 맞춘다. */
function dirFromUv(u: number, v: number): [number, number, number] {
  // three.js equirectUv: u = atan2(dir.z, dir.x) / (2π) + 0.5, v = asin(dir.y)/π + 0.5
  const phi = (u - 0.5) * 2 * Math.PI; // -π..π
  const theta = (v - 0.5) * Math.PI; // -π/2..π/2
  const cosT = Math.cos(theta);
  return [Math.cos(phi) * cosT, Math.sin(theta), Math.sin(phi) * cosT];
}

/** 방위/고도(deg) → 월드 방향. 방위 0 이 +Z(카메라 쪽) */
function dirFromAzEl(az: number, el: number): [number, number, number] {
  const a = az * DEG;
  const e = el * DEG;
  return [Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)];
}

export function generateProceduralEnvironment(spec: ProceduralEnvSpec, width = 1024, height = 512): DataTexture {
  const data = new Float32Array(width * height * 4);
  const horizonSoft = spec.horizonSoftness ?? 0.15;

  // 소프트박스마다 로컬 프레임을 미리 계산
  const boxes = spec.boxes.map((b) => {
    const n = dirFromAzEl(b.azimuth, b.elevation);
    // up 벡터: 천정 방향을 n 에 직교화
    let up: [number, number, number] = [0, 1, 0];
    const d = n[0] * up[0] + n[1] * up[1] + n[2] * up[2];
    up = [up[0] - n[0] * d, up[1] - n[1] * d, up[2] - n[2] * d];
    let l = Math.hypot(...up);
    if (l < 1e-4) {
      up = [1, 0, 0];
      const d2 = n[0];
      up = [up[0] - n[0] * d2, -n[1] * d2, -n[2] * d2];
      l = Math.hypot(...up);
    }
    up = [up[0] / l, up[1] / l, up[2] / l];
    const right: [number, number, number] = [
      up[1] * n[2] - up[2] * n[1],
      up[2] * n[0] - up[0] * n[2],
      up[0] * n[1] - up[1] * n[0],
    ];
    return {
      n,
      up,
      right,
      hw: Math.tan(Math.min(89, b.width / 2) * DEG),
      hh: Math.tan(Math.min(89, b.height / 2) * DEG),
      soft: b.softness ?? 0.35,
      color: b.color,
      intensity: b.intensity,
    };
  });

  for (let y = 0; y < height; y++) {
    const v = (y + 0.5) / height; // DataTexture(flipY=false) 는 row 0 이 v=0 = 천저(nadir), 마지막 row 가 천정
    for (let x = 0; x < width; x++) {
      const u = (x + 0.5) / width;
      const dir = dirFromUv(u, v);
      const up = dir[1];

      // 주변광: 지면 / 지평선 / 하늘 3구간 그라데이션
      let r: number, g: number, b: number;
      if (up >= 0) {
        const t = smoothstep(0, horizonSoft, up) * 0.6 + smoothstep(horizonSoft, 1, up) * 0.4;
        r = spec.skyHorizon[0] + (spec.skyTop[0] - spec.skyHorizon[0]) * t;
        g = spec.skyHorizon[1] + (spec.skyTop[1] - spec.skyHorizon[1]) * t;
        b = spec.skyHorizon[2] + (spec.skyTop[2] - spec.skyHorizon[2]) * t;
      } else {
        const t = smoothstep(0, horizonSoft, -up);
        r = spec.skyHorizon[0] + (spec.ground[0] - spec.skyHorizon[0]) * t;
        g = spec.skyHorizon[1] + (spec.ground[1] - spec.skyHorizon[1]) * t;
        b = spec.skyHorizon[2] + (spec.ground[2] - spec.skyHorizon[2]) * t;
      }

      // 소프트박스: 방향을 박스 평면에 투영해 사각 마스크
      for (const bx of boxes) {
        const cos = dir[0] * bx.n[0] + dir[1] * bx.n[1] + dir[2] * bx.n[2];
        if (cos <= 0.02) continue;
        const px = (dir[0] * bx.right[0] + dir[1] * bx.right[1] + dir[2] * bx.right[2]) / cos;
        const py = (dir[0] * bx.up[0] + dir[1] * bx.up[1] + dir[2] * bx.up[2]) / cos;
        const ax = Math.abs(px) / bx.hw;
        const ay = Math.abs(py) / bx.hh;
        if (ax > 1 || ay > 1) continue;
        const m = (1 - smoothstep(1 - bx.soft, 1, ax)) * (1 - smoothstep(1 - bx.soft, 1, ay));
        if (m <= 0) continue;
        r += bx.color[0] * bx.intensity * m;
        g += bx.color[1] * bx.intensity * m;
        b += bx.color[2] * bx.intensity * m;
      }

      const i = (y * width + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 1;
    }
  }

  const tex = new DataTexture(data, width, height, RGBAFormat, FloatType);
  tex.mapping = EquirectangularReflectionMapping;
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export interface EnvironmentPreset {
  id: string;
  label: string;
  /** 'procedural' 은 spec 으로 생성, 'file' 은 url 로 로드 */
  kind: 'procedural' | 'file';
  spec?: ProceduralEnvSpec;
  url?: string;
  /** 권장 노출/강도 (프리셋별 밝기 차이 보정) */
  intensity?: number;
  credit?: string;
}

const white: [number, number, number] = [1, 1, 1];
const warm: [number, number, number] = [1, 0.93, 0.85];
const cool: [number, number, number] = [0.85, 0.92, 1];

/** 기본 제공 환경 프리셋 — 절차적 스튜디오 5종 + Poly Haven HDR 5종 */
export const ENVIRONMENT_PRESETS: EnvironmentPreset[] = [
  {
    id: 'studio-soft',
    label: '스튜디오 · 소프트',
    kind: 'procedural',
    intensity: 1,
    spec: {
      skyTop: [0.22, 0.22, 0.24],
      skyHorizon: [0.16, 0.16, 0.17],
      ground: [0.05, 0.05, 0.05],
      boxes: [
        { azimuth: -40, elevation: 45, width: 60, height: 45, color: white, intensity: 6, softness: 0.4 }, // key
        { azimuth: 60, elevation: 20, width: 50, height: 40, color: cool, intensity: 2.2, softness: 0.5 }, // fill
        { azimuth: 160, elevation: 40, width: 40, height: 20, color: white, intensity: 5, softness: 0.3 }, // rim
        { azimuth: 0, elevation: 88, width: 70, height: 70, color: white, intensity: 1.2, softness: 0.6 }, // top
      ],
    },
  },
  {
    id: 'studio-white',
    label: '스튜디오 · 화이트 호리존',
    kind: 'procedural',
    intensity: 1,
    spec: {
      skyTop: [0.9, 0.9, 0.9],
      skyHorizon: [0.75, 0.75, 0.75],
      ground: [0.55, 0.55, 0.55],
      horizonSoftness: 0.35,
      boxes: [
        { azimuth: -30, elevation: 55, width: 80, height: 60, color: white, intensity: 3.5, softness: 0.5 },
        { azimuth: 140, elevation: 30, width: 50, height: 30, color: white, intensity: 2.5, softness: 0.4 },
      ],
    },
  },
  {
    id: 'studio-dark',
    label: '스튜디오 · 다크 프로덕트',
    kind: 'procedural',
    intensity: 1,
    spec: {
      skyTop: [0.03, 0.03, 0.035],
      skyHorizon: [0.02, 0.02, 0.025],
      ground: [0.01, 0.01, 0.01],
      boxes: [
        { azimuth: -70, elevation: 25, width: 14, height: 90, color: white, intensity: 12, softness: 0.25 }, // 좌 스트립
        { azimuth: 70, elevation: 25, width: 14, height: 90, color: cool, intensity: 9, softness: 0.25 }, // 우 스트립
        { azimuth: 180, elevation: 55, width: 60, height: 20, color: warm, intensity: 8, softness: 0.3 }, // 백라이트
        { azimuth: 0, elevation: 80, width: 30, height: 30, color: white, intensity: 3, softness: 0.5 },
      ],
    },
  },
  {
    id: 'sunset',
    label: '야외 · 석양',
    kind: 'procedural',
    intensity: 1,
    spec: {
      skyTop: [0.18, 0.28, 0.55],
      skyHorizon: [1.0, 0.55, 0.3],
      ground: [0.12, 0.09, 0.07],
      horizonSoftness: 0.25,
      boxes: [
        { azimuth: -120, elevation: 8, width: 3, height: 3, color: [1, 0.72, 0.45], intensity: 900, softness: 0.4 }, // 태양
        { azimuth: -120, elevation: 12, width: 40, height: 25, color: [1, 0.6, 0.35], intensity: 1.2, softness: 0.9 }, // 태양 주변 광휘
      ],
    },
  },
  {
    id: 'overcast',
    label: '야외 · 흐린 하늘',
    kind: 'procedural',
    intensity: 1,
    spec: {
      skyTop: [1.1, 1.12, 1.2],
      skyHorizon: [0.8, 0.82, 0.88],
      ground: [0.2, 0.2, 0.2],
      horizonSoftness: 0.3,
      boxes: [{ azimuth: 20, elevation: 70, width: 90, height: 60, color: white, intensity: 1.0, softness: 0.9 }],
    },
  },
  { id: 'hdr-studio-small', label: 'HDR · Studio Small 09', kind: 'file', url: 'hdr/studio_small_09_1k.hdr', intensity: 1, credit: 'Poly Haven CC0' },
  { id: 'hdr-brown-studio', label: 'HDR · Brown Photostudio', kind: 'file', url: 'hdr/brown_photostudio_02_1k.hdr', intensity: 1, credit: 'Poly Haven CC0' },
  { id: 'hdr-lebombo', label: 'HDR · Lebombo (실내)', kind: 'file', url: 'hdr/lebombo_1k.hdr', intensity: 1, credit: 'Poly Haven CC0' },
  { id: 'hdr-kloofendal', label: 'HDR · Kloofendal (맑은 하늘)', kind: 'file', url: 'hdr/kloofendal_48d_partly_cloudy_puresky_1k.hdr', intensity: 1, credit: 'Poly Haven CC0' },
  { id: 'hdr-moonless', label: 'HDR · Moonless Golf (야간)', kind: 'file', url: 'hdr/moonless_golf_1k.hdr', intensity: 1, credit: 'Poly Haven CC0' },
];

const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();

/** URL/File 에서 equirect HDR(.hdr/.exr) 로드 */
export async function loadEnvironmentTexture(source: string | File): Promise<Texture> {
  const name = typeof source === 'string' ? source : source.name;
  const url = typeof source === 'string' ? source : URL.createObjectURL(source);
  try {
    const lower = name.toLowerCase();
    let tex: Texture;
    if (lower.endsWith('.exr')) {
      tex = await exrLoader.loadAsync(url);
    } else if (lower.endsWith('.hdr') || lower.endsWith('.pic')) {
      tex = await rgbeLoader.loadAsync(url);
    } else {
      throw new Error(`지원하지 않는 환경맵 형식: ${name} (.hdr / .exr 만 지원)`);
    }
    tex.mapping = EquirectangularReflectionMapping;
    tex.minFilter = LinearFilter;
    tex.magFilter = LinearFilter;
    tex.generateMipmaps = false;
    tex.name = name;
    return tex;
  } finally {
    if (typeof source !== 'string') URL.revokeObjectURL(url);
  }
}
