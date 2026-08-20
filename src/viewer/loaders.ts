import {
  Box3,
  BufferGeometry,
  Color,
  DoubleSide,
  FrontSide,
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Sphere,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export type SupportedFormat = 'glb' | 'gltf' | 'obj' | 'stl' | 'fbx';

export const SUPPORTED_EXTENSIONS: SupportedFormat[] = ['glb', 'gltf', 'obj', 'stl', 'fbx'];

export interface LoadedModel {
  root: Group;
  name: string;
  format: SupportedFormat;
  triangles: number;
  meshes: number;
  materials: MeshStandardMaterial[];
  /** 정규화 전 원본 바운딩 박스 크기 */
  originalSize: Vector3;
}

export interface LoadOptions {
  /** 디코더 경로 기준(끝에 /) — 기본 './libs/' 아래 draco/, basis/ */
  decoderBase?: string;
  onProgress?: (ratio: number) => void;
}

function extOf(name: string): SupportedFormat {
  const m = /\.([a-z0-9]+)(\?.*)?$/i.exec(name);
  const ext = (m?.[1] ?? '').toLowerCase();
  if ((SUPPORTED_EXTENSIONS as string[]).includes(ext)) return ext as SupportedFormat;
  throw new Error(`지원하지 않는 형식: .${ext} (지원: ${SUPPORTED_EXTENSIONS.join(', ')})`);
}

let gltfLoader: GLTFLoader | null = null;
let ktx2: KTX2Loader | null = null;

function getGltfLoader(renderer: WebGLRenderer, base: string) {
  if (!gltfLoader) {
    const draco = new DRACOLoader().setDecoderPath(`${base}draco/`);
    ktx2 = new KTX2Loader().setTranscoderPath(`${base}basis/`).detectSupport(renderer);
    gltfLoader = new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder);
  }
  return gltfLoader;
}

/**
 * 어떤 재질이 들어와도 path tracer 가 이해하는 MeshStandard/MeshPhysical 로 맞춘다.
 * three-gpu-pathtracer 는 MeshStandardMaterial / MeshPhysicalMaterial 만 지원한다.
 */
function normalizeMaterial(mat: Material): MeshStandardMaterial {
  if ((mat as MeshPhysicalMaterial).isMeshPhysicalMaterial || (mat as MeshStandardMaterial).isMeshStandardMaterial) {
    return mat as MeshStandardMaterial;
  }
  const out = new MeshPhysicalMaterial();
  out.name = mat.name;
  const anyMat = mat as MeshBasicMaterial & MeshPhongMaterial & MeshLambertMaterial;
  if (anyMat.color) out.color.copy(anyMat.color);
  if (anyMat.map) out.map = anyMat.map;
  if (anyMat.normalMap) out.normalMap = anyMat.normalMap;
  if (anyMat.emissive) out.emissive.copy(anyMat.emissive);
  if (anyMat.emissiveMap) out.emissiveMap = anyMat.emissiveMap;
  if (anyMat.alphaMap) out.alphaMap = anyMat.alphaMap;
  out.transparent = mat.transparent;
  out.opacity = mat.opacity;
  out.side = mat.side;
  out.alphaTest = mat.alphaTest;
  // Phong specular → roughness 대략 환산
  if (typeof anyMat.shininess === 'number') {
    out.roughness = Math.min(1, Math.max(0.05, 1 - Math.log2(anyMat.shininess + 1) / 10));
    out.metalness = 0;
  } else {
    out.roughness = 0.6;
    out.metalness = 0;
  }
  return out;
}

function prepareObject(root: Object3D): { triangles: number; meshes: number; materials: MeshStandardMaterial[] } {
  let triangles = 0;
  let meshes = 0;
  const materials = new Set<MeshStandardMaterial>();
  const removals: Object3D[] = [];
  const materialCache = new Map<Material, MeshStandardMaterial>();

  root.traverse((obj) => {
    // 로드된 씬에 딸려오는 조명/카메라는 뷰어 조명 체계와 충돌하므로 제거
    if ((obj as any).isLight || (obj as any).isCamera) {
      removals.push(obj);
      return;
    }
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    // 스킨/인스턴스 메시는 정적 지오메트리로 취급 (path tracer 는 정적 BVH)
    const geom = mesh.geometry as BufferGeometry;
    if (!geom.getAttribute('normal')) geom.computeVertexNormals();
    // 인터리브 속성은 path tracer 가 지원하지 않으므로 풀어준다
    for (const key of Object.keys(geom.attributes)) {
      const attr = geom.attributes[key];
      if ((attr as any).isInterleavedBufferAttribute) {
        geom.setAttribute(key, (attr as any).clone());
      }
    }
    if (geom.index && (geom.index as any).isInterleavedBufferAttribute) {
      geom.setIndex((geom.index as any).clone());
    }
    const idx = geom.index;
    triangles += Math.floor((idx ? idx.count : geom.getAttribute('position').count) / 3);
    meshes++;

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const converted = mats.map((m) => {
      let c = materialCache.get(m);
      if (!c) {
        c = normalizeMaterial(m);
        materialCache.set(m, c);
      }
      materials.add(c);
      return c;
    });
    mesh.material = Array.isArray(mesh.material) ? converted : converted[0];
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
  removals.forEach((o) => o.removeFromParent());
  return { triangles, meshes, materials: [...materials] };
}

/**
 * 모델을 원점 기준으로 정렬한다: XZ 중심을 0 으로, 바닥(min.y)을 0 으로, 가장 긴 변을 targetSize 로.
 * "업로드된 모델이 축에 고정" 요구사항 — 어떤 스케일/오프셋의 파일이 와도 같은 자리에 같은 크기로 선다.
 */
export function normalizeModel(root: Object3D, targetSize = 1): { size: Vector3; scale: number; radius: number } {
  root.updateMatrixWorld(true);
  const box = new Box3().setFromObject(root);
  const size = box.getSize(new Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDim;
  const center = box.getCenter(new Vector3());
  // 스케일 → 이동 순서: 스케일 후 중심을 원점, 바닥을 y=0
  root.scale.setScalar(scale);
  root.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
  root.updateMatrixWorld(true);
  const sphere = new Box3().setFromObject(root).getBoundingSphere(new Sphere());
  return { size, scale, radius: sphere.radius };
}

export async function loadModel(source: string | File, renderer: WebGLRenderer, opts: LoadOptions = {}): Promise<LoadedModel> {
  const name = typeof source === 'string' ? source.split('/').pop() ?? source : source.name;
  const format = extOf(name);
  const url = typeof source === 'string' ? source : URL.createObjectURL(source);
  const base = opts.decoderBase ?? './libs/';
  const onProgress = (e: ProgressEvent) => {
    if (opts.onProgress && e.total) opts.onProgress(e.loaded / e.total);
  };

  try {
    let root: Object3D;
    switch (format) {
      case 'glb':
      case 'gltf': {
        const gltf = await getGltfLoader(renderer, base).loadAsync(url, onProgress);
        root = gltf.scene;
        break;
      }
      case 'obj': {
        root = await new OBJLoader().loadAsync(url, onProgress);
        break;
      }
      case 'stl': {
        const geom = await new STLLoader().loadAsync(url, onProgress);
        geom.computeVertexNormals();
        const mat = new MeshPhysicalMaterial({ color: new Color(0.8, 0.8, 0.82), roughness: 0.45, metalness: 0 });
        root = new Mesh(geom, mat);
        break;
      }
      case 'fbx': {
        root = await new FBXLoader().loadAsync(url, onProgress);
        break;
      }
    }

    const group = new Group();
    group.name = name;
    group.add(root);
    const stats = prepareObject(group);
    const box = new Box3().setFromObject(group);
    const originalSize = box.getSize(new Vector3());
    return { root: group, name, format, originalSize, ...stats };
  } finally {
    if (typeof source !== 'string') URL.revokeObjectURL(url);
  }
}

/**
 * 이미 메모리에 있는 Object3D(예: VRINGON 뷰어가 로드해 둔 씬, 절차 생성 모델)를 LoadedModel 로 감싼다.
 * 재질 정규화·통계 계산은 파일 로드와 동일하게 거친다.
 */
export function wrapObject(root: Object3D, name = root.name || 'object', format: SupportedFormat = 'glb'): LoadedModel {
  const group = new Group();
  group.name = name;
  group.add(root);
  const stats = prepareObject(group);
  const box = new Box3().setFromObject(group);
  const originalSize = box.getSize(new Vector3());
  return { root: group, name, format, originalSize, ...stats };
}

/** 양면 렌더링이 필요한 얇은 메시(가죽 조각, 끈 등)를 위한 편의 함수 */
export function setDoubleSided(materials: Material[], doubleSided: boolean) {
  for (const m of materials) {
    m.side = doubleSided ? DoubleSide : FrontSide;
    m.needsUpdate = true;
  }
}
