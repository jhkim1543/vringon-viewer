import { Color, Group, Object3D, Vector3 } from 'three';
import { PhysicalSpotLight, ShapedAreaLight } from 'three-gpu-pathtracer';

/**
 * 조명 리그 — V-REN 계획서의 "라이팅룸/조명 템플릿" 항목을 그대로 구현.
 * 모든 조명은 모델 중심을 바라보며, 위치는 (방위각, 고도각, 거리)로 지정한다.
 * 거리는 모델 반경의 배수라 모델 크기가 달라도 같은 룩이 나온다.
 */
export interface RigLight {
  id: string;
  label: string;
  type: 'area' | 'spot';
  enabled: boolean;
  azimuth: number; // deg, 0 = 카메라 정면(+Z)
  elevation: number; // deg
  distance: number; // 모델 반경 배수
  color: string; // hex
  intensity: number;
  /** area: 폭/높이 (모델 반경 배수), circular = 원형 소프트박스 */
  width: number;
  height: number;
  circular?: boolean;
  /** spot: 원뿔 각(deg), 반경(부드러운 그림자), 페넘브라 */
  angle?: number;
  radius?: number;
  penumbra?: number;
}

export interface LightRig {
  id: string;
  label: string;
  lights: RigLight[];
}

const DEG = Math.PI / 180;

function makeLight(partial: Partial<RigLight> & Pick<RigLight, 'id' | 'label' | 'type'>): RigLight {
  return {
    enabled: true,
    azimuth: 0,
    elevation: 30,
    distance: 3,
    color: '#ffffff',
    intensity: 8,
    width: 1.2,
    height: 1.2,
    circular: false,
    angle: 40,
    radius: 0.15,
    penumbra: 0.5,
    ...partial,
  };
}

export const LIGHT_RIGS: LightRig[] = [
  { id: 'none', label: '없음 (환경광만)', lights: [] },
  {
    id: 'three-point',
    label: '3점 조명 (Key / Fill / Rim)',
    lights: [
      makeLight({ id: 'key', label: 'Key', type: 'area', azimuth: -45, elevation: 40, distance: 3, width: 1.6, height: 1.6, intensity: 10 }),
      makeLight({ id: 'fill', label: 'Fill', type: 'area', azimuth: 55, elevation: 15, distance: 3.5, width: 2, height: 2, intensity: 3, color: '#dfe8ff' }),
      makeLight({ id: 'rim', label: 'Rim', type: 'area', azimuth: 165, elevation: 45, distance: 3, width: 1.4, height: 0.6, intensity: 12 }),
    ],
  },
  {
    id: 'softbox-top',
    label: '탑 소프트박스 (제품 촬영)',
    lights: [
      makeLight({ id: 'top', label: 'Top Softbox', type: 'area', azimuth: 0, elevation: 80, distance: 3, width: 3, height: 3, intensity: 6, circular: true }),
      makeLight({ id: 'front', label: 'Front Fill', type: 'area', azimuth: 0, elevation: 10, distance: 4, width: 2.5, height: 1.5, intensity: 1.5 }),
    ],
  },
  {
    id: 'strip-accent',
    label: '스트립 악센트 (다크 무드)',
    lights: [
      makeLight({ id: 'stripL', label: 'Strip L', type: 'area', azimuth: -90, elevation: 20, distance: 3, width: 0.35, height: 3, intensity: 18 }),
      makeLight({ id: 'stripR', label: 'Strip R', type: 'area', azimuth: 90, elevation: 20, distance: 3, width: 0.35, height: 3, intensity: 14, color: '#cfe0ff' }),
      makeLight({ id: 'back', label: 'Back Kick', type: 'area', azimuth: 180, elevation: 60, distance: 3, width: 1.5, height: 0.5, intensity: 15, color: '#ffe2c4' }),
    ],
  },
  {
    id: 'spot-drama',
    label: '스포트 드라마틱',
    lights: [
      makeLight({ id: 'spot', label: 'Spot', type: 'spot', azimuth: -30, elevation: 60, distance: 3.5, intensity: 120, angle: 35, radius: 0.12, penumbra: 0.4 }),
      makeLight({ id: 'rim2', label: 'Rim', type: 'area', azimuth: 150, elevation: 35, distance: 3, width: 1.2, height: 0.5, intensity: 8, color: '#dfe8ff' }),
    ],
  },
];

export function cloneRig(rig: LightRig): LightRig {
  return { ...rig, lights: rig.lights.map((l) => ({ ...l })) };
}

/**
 * RigLight 정의 → three.js 조명 오브젝트. modelRadius / target 으로 씬 스케일에 맞춘다.
 * 반환 그룹을 씬에 넣고, 정의가 바뀌면 다시 호출해 갈아끼운다.
 */
export function buildLightGroup(rig: LightRig, modelRadius: number, target: Vector3): Group {
  const group = new Group();
  group.name = `light-rig:${rig.id}`;
  const r = Math.max(modelRadius, 0.05);

  for (const def of rig.lights) {
    if (!def.enabled) continue;
    const a = def.azimuth * DEG;
    const e = def.elevation * DEG;
    const d = def.distance * r;
    const pos = new Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)).multiplyScalar(d).add(target);

    let light: Object3D;
    if (def.type === 'area') {
      const l = new ShapedAreaLight(new Color(def.color), def.intensity, def.width * r, def.height * r);
      l.isCircular = Boolean(def.circular);
      l.position.copy(pos);
      l.lookAt(target);
      light = l;
    } else {
      const l = new PhysicalSpotLight(new Color(def.color));
      l.intensity = def.intensity;
      l.angle = (def.angle ?? 40) * DEG;
      l.penumbra = def.penumbra ?? 0.5;
      l.radius = (def.radius ?? 0.1) * r;
      l.decay = 2;
      l.distance = 0;
      l.position.copy(pos);
      l.target.position.copy(target);
      l.castShadow = false;
      group.add(l.target);
      light = l;
    }
    light.name = def.id;
    light.userData.rigLight = def;
    group.add(light);
  }
  return group;
}
