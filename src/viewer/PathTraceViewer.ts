import {
  ACESFilmicToneMapping,
  AgXToneMapping,
  CineonToneMapping,
  CircleGeometry,
  Color,
  DataTexture,
  DoubleSide,
  EquirectangularReflectionMapping,
  FloatType,
  Group,
  LinearFilter,
  LinearToneMapping,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  NoBlending,
  NoToneMapping,
  Object3D,
  RGBAFormat,
  ReinhardToneMapping,
  Scene,
  ShaderMaterial,
  Texture,
  ToneMapping,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { BlurredEnvMapGenerator, DenoiseMaterial, PhysicalCamera, WebGLPathTracer } from 'three-gpu-pathtracer';
import { ENVIRONMENT_PRESETS, EnvironmentPreset, generateProceduralEnvironment, loadEnvironmentTexture } from './environments';
import { LIGHT_RIGS, LightRig, RigLight, buildLightGroup, cloneRig } from './lights';
import { LoadedModel, loadModel, normalizeModel, wrapObject } from './loaders';
import { AuxBufferRenderer, OidnDenoiser, floatToTexture, probeOidnSupport } from './oidn';
import { ViteBVHWorker } from './bvhWorker';
import { patchShadowCatcher } from './shadowCatcher';
import { patchDispersion } from './dispersion';
import { AtrousDenoiser, DEFAULT_ATROUS, AtrousParams } from './atrous';
import { TemporalReprojector } from './temporal';
import { RayzeeBackend } from './backends/RayzeeBackend';

/* ------------------------------------------------------------------ */
/* 설정 타입                                                            */
/* ------------------------------------------------------------------ */

export interface RenderSettings {
  /** false 면 래스터(three.js 기본)로만 그린다 — 편집 중 빠른 확인용 */
  pathTracing: boolean;
  bounces: number;
  transmissiveBounces: number;
  samplesPerFrame: number;
  /** 이 샘플 수에 도달하면 누적을 멈춘다 (0 = 무제한) */
  maxSamples: number;
  /** 내부 해상도 배율 (0.25~2). DPR 포함 최종 픽셀 대비 */
  renderScale: number;
  tiles: number;
  filterGlossyFactor: number;
  multipleImportanceSampling: boolean;
  /** 카메라 이동 중 저해상도 path tracing 미리보기 (래스터 대신) */
  dynamicLowRes: boolean;
  /** 투과 재질의 분산(보석 파이어) 0~3, 1 ≈ 다이아몬드 */
  dispersion: number;
  /** 시간적 재투영 누적: 카메라를 옮겨도 직전 결과를 재투영해 재사용(temporal.ts). "한 번 옮기고 오래 기다림" 을 줄인다 */
  temporal: boolean;
  /** 하이브리드 채움: 유효 샘플이 적은 픽셀을 래스터(IBL PBR)로 메워 생 노이즈를 숨긴다 (temporal 과 함께 동작) */
  hybridFill: boolean;
}

export type BackgroundMode = 'environment' | 'blurred' | 'color' | 'transparent';
/** 렌더 엔진: webgl = three-gpu-pathtracer(WebGL2, 기본·전 브라우저), webgpu = Rayzee(wavefront, ASVGF/OIDN, WebGPU 필요) */
export type EngineKind = 'webgl' | 'webgpu';

export interface EnvironmentSettings {
  presetId: string; // ENVIRONMENT_PRESETS id 또는 'custom'
  intensity: number;
  /** Y축 회전 (deg) */
  rotation: number;
  /** 배경 흐림 0~1 (background = 'blurred' 일 때) */
  blur: number;
  background: BackgroundMode;
  backgroundColor: string;
  backgroundIntensity: number;
}

export interface CameraSettings {
  fov: number;
  dof: boolean;
  fStop: number;
  /** true 면 궤도 타깃까지 거리로 자동 포커스 */
  autoFocus: boolean;
  focusDistance: number;
  apertureBlades: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
}

export interface FloorSettings {
  enabled: boolean;
  /** shadow = 그림자만 받는 투명 바닥(매트), solid = 보이는 바닥 */
  mode: 'shadow' | 'solid';
  color: string;
  roughness: number;
  metalness: number;
  /** 모델 반경 배수 */
  size: number;
  /** 그림자 캐처 농도 0~1 (shadow 모드) */
  shadowStrength: number;
}

export type ToneMappingName = 'ACES' | 'AgX' | 'Neutral' | 'Reinhard' | 'Cineon' | 'Linear' | 'None';
export type DenoiseMode = 'off' | 'bilateral' | 'atrous' | 'oidn';

export interface PostSettings {
  toneMapping: ToneMappingName;
  exposure: number;
  denoise: DenoiseMode;
  bilateralSigma: number;
  bilateralKSigma: number;
  bilateralThreshold: number;
  /** OIDN 이 켜졌을 때 이 샘플 수마다 다시 디노이즈 */
  oidnInterval: number;
  /** À-trous 필터가 완전히 빠지는 spp (작을수록 빨리 원본으로) */
  atrousFade: number;
  /** À-trous 휘도 허용 계수 (클수록 더 부드럽게) */
  atrousStrength: number;
}

export interface LightSettings {
  rigId: string;
  lights: RigLight[];
}

export interface ViewerSettings {
  render: RenderSettings;
  environment: EnvironmentSettings;
  camera: CameraSettings;
  floor: FloorSettings;
  post: PostSettings;
  lights: LightSettings;
}

/** 화면이 지금 무엇을 보여주는지 — UX 표시용 */
export type RenderPhase = 'building' | 'compiling' | 'raster' | 'preview' | 'tracing' | 'denoising' | 'done';

export interface ViewerStats {
  engine: EngineKind;
  /** 현재 단계 */
  phase: RenderPhase;
  /** 목표 샘플 대비 진행률 0~1 (maxSamples=0 이면 0) */
  progress: number;
  samples: number;
  maxSamples: number;
  fps: number;
  triangles: number;
  meshes: number;
  materials: number;
  resolution: [number, number];
  compiling: boolean;
  bvhBuilding: boolean;
  denoiser: 'off' | 'bilateral' | 'atrous' | 'oidn' | 'oidn-loading' | 'oidn-unavailable';
  modelName: string;
  elapsedMs: number;
  /** 시간적 재투영 포함 유효 샘플 수(대략) — temporal 이 꺼져 있으면 samples 와 같다 */
  effectiveSamples: number;
  /** 셰이더 컴파일 진행 추정 (compiling 단계에서만 의미 있음) */
  compileProgress: number;
  compileElapsedMs: number;
  compileRemainMs: number;
  /** 추정치가 이 기기의 실측 기록에서 왔는가(= 두 번째 방문 이후) */
  compileEstimateMeasured: boolean;
}

export type ViewerEvent = 'model-loaded' | 'stats' | 'status' | 'settings' | 'error' | 'materials' | 'still-progress' | 'still-done' | 'frame' | 'interaction' | 'camera';

/** 매 프레임(합성 직후) 가벼운 알림 — 누적 타임라인/마일스톤 캡처용. 캔버스 드로잉 버퍼가 아직 살아있는 동기 구간에서 발행된다. */
export interface FrameInfo {
  /** 누적 샘플 수(풀해상 트레이서) */
  samples: number;
  /** 지금 프레임이 풀해상 누적 구간인가(프리뷰·컴파일·빌드·인터랙션 아님) */
  accumulating: boolean;
  /** 목표 spp(0 = 무제한) */
  maxSamples: number;
  /** 리셋 이후 경과 ms */
  elapsedMs: number;
  /** 시간적 재투영 포함 유효 샘플(대략). temporal 꺼짐 = samples */
  effectiveSamples: number;
}

/** 렌더샷(고해상도 정지 이미지) 옵션 */
export interface StillOptions {
  width: number;
  height: number;
  /** 목표 샘플 수 */
  samples: number;
  /** 'current' = 현재 배경 설정 그대로, 'transparent' = 투명 PNG */
  background?: 'current' | 'transparent';
  /** 마지막에 디노이즈 적용 ('current' = 현재 설정) */
  denoise?: 'current' | 'off' | 'bilateral' | 'oidn';
  format?: 'image/png' | 'image/jpeg';
  quality?: number;
  /** 한 프레임에 돌릴 샘플 수(응답성 vs 속도). 기본 4 */
  samplesPerFrame?: number;
}

export interface StillProgress {
  samples: number;
  target: number;
  ratio: number;
  elapsedMs: number;
  etaMs: number;
  phase: 'rendering' | 'denoising' | 'encoding';
}

export interface StillResult {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  samples: number;
  elapsedMs: number;
  options: StillOptions;
}

export const TONE_MAPPINGS: Record<ToneMappingName, ToneMapping> = {
  ACES: ACESFilmicToneMapping,
  AgX: AgXToneMapping,
  Neutral: NeutralToneMapping,
  Reinhard: ReinhardToneMapping,
  Cineon: CineonToneMapping,
  Linear: LinearToneMapping,
  None: NoToneMapping,
};

/** BVH 트리 최대 깊이 — 이보다 깊어지면 잎에 삼각형을 더 담는다(정확도 손실 없음, 해당 잎만 느려짐) */
const BVH_MAX_DEPTH = 28;
/** 순회 스택 슬롯 수. 트리 깊이보다 커야 한다(작으면 순회가 잘려 지오메트리가 사라진다). 기본값 60 → 30 */
const BVH_STACK_DEPTH = 30;

export function defaultSettings(): ViewerSettings {
  return {
    render: {
      pathTracing: true,
      // 빠른 수렴 우선: 5 바운스(금속+보석은 투과 바운스가 따로 10) · 128 spp 목표 — iGPU 에서 ~7 s, dGPU 에서 1~2 s 에 100 %
      bounces: 5,
      transmissiveBounces: 10,
      samplesPerFrame: 1,
      maxSamples: 128,
      renderScale: 1,
      // 타일은 프레임을 잘게 쪼개 응답성을 올리지만 타일마다 고정 오버헤드가 붙는다.
      // 이 iGPU 실측: tiles 2(=4타일) 8.2 spp/s vs tiles 1 **17.3 spp/s** — 2.1배. 조작 중 응답성은 저해상 프리뷰가 담당하므로 1 이 낫다.
      tiles: 1,
      filterGlossyFactor: 0.5,
      multipleImportanceSampling: true,
      dynamicLowRes: true,
      dispersion: 1,
      // 권장 조합 기본 ON: 카메라를 옮겨도 직전 결과를 재투영해 재사용 + 샘플이 적은 픽셀은 래스터로 채움
      // (실측: 확산 제품은 이동 후 "깨끗" 까지 4.6 s → 0.09 s)
      temporal: true,
      hybridFill: true,
    },
    environment: {
      presetId: 'studio-soft',
      intensity: 1,
      rotation: 0,
      blur: 0.35,
      // VRING:ON Create 화면 톤: 순흑에 가까운 단색 배경 (환경광은 그대로 스튜디오)
      background: 'color',
      backgroundColor: '#0a0a0c',
      backgroundIntensity: 1,
    },
    camera: {
      fov: 35,
      dof: false,
      fStop: 4,
      autoFocus: true,
      focusDistance: 2,
      apertureBlades: 6,
      autoRotate: false,
      autoRotateSpeed: 0.6,
    },
    floor: { enabled: true, mode: 'shadow', color: '#2a2b2f', roughness: 0.6, metalness: 0, size: 6, shadowStrength: 0.85 },
    post: {
      toneMapping: 'ACES',
      exposure: 1,
      // 기본: AI 디노이즈(OIDN, WebGPU 필요 — 없거나 실패하면 à-trous 로 자동 폴백). 4·8·16·32·64… spp 에서 기하급수 스케줄로 돌려
      // 정지 후 수 초 안에 "깨끗한 그림" 이 되고, 그 사이는 à-trous 가 채운다.
      denoise: (typeof navigator !== 'undefined' && 'gpu' in navigator ? 'oidn' : 'atrous') as DenoiseMode,
      atrousFade: 128,
      atrousStrength: 2.0,
      // 실측(48spp 직물 의자): threshold 0.03 은 HDR 값 차이가 커서 사실상 무효, 0.2 부터 잡음이 잡히고 0.35 는 디테일이 뭉개진다
      bilateralSigma: 3.0,
      bilateralKSigma: 1.0,
      bilateralThreshold: 0.2,
      oidnInterval: 32,
    },
    lights: { rigId: 'none', lights: [] },
  };
}

/* ------------------------------------------------------------------ */
/* 표시용 셰이더 (톤매핑 + 색공간)                                        */
/* ------------------------------------------------------------------ */

class DisplayMaterial extends ShaderMaterial {
  constructor(premultipliedAlpha: boolean) {
    super({
      uniforms: { map: { value: null }, opacity: { value: 1 } },
      transparent: true,
      blending: NoBlending,
      depthTest: false,
      depthWrite: false,
      premultipliedAlpha,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D map;
        uniform float opacity;
        varying vec2 vUv;
        void main() {
          vec4 c = texture2D( map, vUv );
          gl_FragColor = c;
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          gl_FragColor.a *= opacity;
          #include <premultiplied_alpha_fragment>
        }
      `,
    });
  }
  set map(t: Texture | null) {
    this.uniforms.map.value = t;
  }
  get map(): Texture | null {
    return this.uniforms.map.value;
  }
}

/* ------------------------------------------------------------------ */
/* 뷰어 본체                                                            */
/* ------------------------------------------------------------------ */

export interface PathTraceViewerOptions {
  container: HTMLElement;
  /** public 에셋 베이스 (끝에 /). 기본 './' */
  assetBase?: string;
  settings?: Partial<ViewerSettings>;
  /** 모델을 이 크기(가장 긴 변, m)로 정규화. 기본 1 */
  normalizeSize?: number;
}

type Listener = (payload: any) => void;

export class PathTraceViewer {
  readonly renderer: WebGLRenderer;
  readonly scene = new Scene();
  readonly camera: PhysicalCamera;
  readonly controls: OrbitControls;
  readonly pathTracer: WebGLPathTracer;
  readonly settings: ViewerSettings;
  readonly container: HTMLElement;
  readonly assetBase: string;

  private modelGroup = new Group();
  private lightGroup: Group | null = null;
  private floor: Mesh<CircleGeometry, MeshStandardMaterial>;
  private model: LoadedModel | null = null;
  private modelRadius = 0.5;
  private modelCenter = new Vector3(0, 0.5, 0);
  private normalizeSize: number;

  private envTexture: Texture | null = null;
  private envBlurred: Texture | null = null;
  private envBlurGen: BlurredEnvMapGenerator;
  private envToken = 0;
  private blackBackground: DataTexture;

  private quad: FullScreenQuad;
  private displayMat: DisplayMaterial;
  private denoiseMat: DenoiseMaterial;
  private atrous: AtrousDenoiser;
  private atrousLow: AtrousDenoiser;
  /** 시간적 재투영(옵션). 엔진 webgl 전용 */
  readonly temporal: TemporalReprojector;
  private temporalCamKey = '';
  /** 디버그 카운터 (헤드리스 하네스용) */
  readonly temporalDebug = { calls: 0, reprojects: 0, lastReprojectAt: 0, lastReprojectWhy: '', fallbacks: 0 };
  /** 디버그 트레이스 (temporalTraceOn 일 때 재투영마다 기록) */
  temporalTraceOn = false;
  readonly temporalTrace: any[] = [];
  private temporalSceneVersion = -1;
  /** 씬 룩이 바뀌면(조명·환경·재질·바닥·렌더 설정) 올라간다 → 히스토리 무효 */
  private sceneVersion = 0;
  private blackTex: DataTexture;
  private auxDirty = true;
  private auxKey = 0;
  private engine: EngineKind = 'webgl';
  private rayzee: RayzeeBackend | null = null;
  private interacting = false;
  private lastSampleCount = -1;
  private lastSampleTime = 0;
  private compileStatusShown = false;
  /** 씬 준비(BVH) 가 시작된 시각 · 복구 시도 횟수 — 멈춤 감지용 */
  private buildStartedAt = 0;
  private buildRecoveries = 0;
  /** 컴파일 시작 시각 · 예상 소요(ms) — 진행률 표시용. 예상치는 이 기기의 지난 실측값(localStorage)에서 온다. */
  private compileStartedAt = 0;
  private compileEstimateMs = 0;
  /** 이번 세션에서 컴파일이 실제로 걸린 시간(ms) — 끝나면 기록된다 */
  compileTookMs = 0;

  private oidn: OidnDenoiser | null = null;
  private oidnAux: AuxBufferRenderer | null = null;
  private oidnTexture: DataTexture | null = null;
  private oidnValidSamples = -1;
  private oidnBusy = false;
  /** 마지막 OIDN 패스 소요(ms) — 통계/자동 전환 판단용 */
  oidnPassMs = 0;
  private oidnAutoChecked = false;
  private oidnSupported: boolean | null = null;

  private listeners = new Map<ViewerEvent, Set<Listener>>();
  private raf = 0;
  private disposed = false;
  private stillActive = false;
  private stillCancel = false;
  private needsSceneUpdate = false;
  private sceneUpdatePromise: Promise<void> | null = null;
  private bvhBuilding = false;
  private resizeObs: ResizeObserver;
  private lastStatsTime = 0;
  private frameCount = 0;
  private fps = 0;
  private renderStart = performance.now();
  private status = '';
  private lightTargetTmp = new Vector3();
  private sizeTmp = new Vector2();

  constructor(opts: PathTraceViewerOptions) {
    this.container = opts.container;
    this.assetBase = opts.assetBase ?? './';
    this.normalizeSize = opts.normalizeSize ?? 1;
    this.settings = mergeSettings(defaultSettings(), opts.settings);

    const renderer = new WebGLRenderer({ antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = TONE_MAPPINGS[this.settings.post.toneMapping];
    renderer.toneMappingExposure = this.settings.post.exposure;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;
    RectAreaLightUniformsLib.init();
    // GPU 컨텍스트 손실(메모리 압박·드라이버 리셋·WebGPU 엔진 병행 시) 대응 — 복구되면 씬을 다시 올린다
    renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.setStatus('WebGL 컨텍스트 손실 — 복구 대기 중…');
      this.emit('error', new Error('GPU 컨텍스트가 손실되었습니다(메모리 압박 또는 드라이버 리셋). 자동 복구를 시도합니다.'));
    });
    renderer.domElement.addEventListener('webglcontextrestored', () => {
      this.setStatus('');
      this.markAuxDirty();
      void this.rebuildScene();
    });

    this.camera = new PhysicalCamera(this.settings.camera.fov, 1, 0.01, 100);
    this.camera.position.set(1.6, 1.0, 2.2);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 0.5, 0);
    this.controls.minDistance = 0.05;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI * 0.52; // 바닥 아래로 내려가지 않게 (축 고정 뷰)
    this.controls.addEventListener('change', () => this.onCameraChange());
    // 인터랙션 튜닝(Rayzee CameraOptimizer 와 같은 아이디어): 드래그 중엔 바운스를 줄여 저해상도 프리뷰 fps 를 올린다.
    // bounces 는 유니폼이라 재컴파일이 없다.
    this.controls.addEventListener('start', () => this.beginInteraction());
    this.controls.addEventListener('end', () => this.endInteraction());

    this.scene.add(this.modelGroup);
    this.floor = new Mesh(new CircleGeometry(1, 96), new MeshStandardMaterial({ color: 0x2a2b2f, roughness: 0.6, metalness: 0, side: DoubleSide }));
    this.floor.name = 'floor';
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    this.pathTracer = new WebGLPathTracer(renderer);
    this.pathTracer.renderToCanvas = false; // 합성은 직접 한다 (디노이즈/OIDN 경로 때문)
    this.pathTracer.rasterizeScene = false;
    this.pathTracer.minSamples = 1;
    this.pathTracer.renderDelay = 60;
    this.pathTracer.fadeDuration = 0;
    this.pathTracer.textureSize.set(2048, 2048);
    this.pathTracer.lowResScale = 0.5; // 이동 중 프리뷰 해상도. 바운스 절감 + 선형 필터 + 경량 à-trous 로 "큰 픽셀" 대신 부드러운 프리뷰
    // 저해상도 프리뷰 타깃은 최근접 필터로 생성되는데, 그대로 확대하면 블록이 보인다 → 선형 필터
    for (const rt of [(this.pathTracer as any)._lowResPathTracer?._primaryTarget, ...((this.pathTracer as any)._lowResPathTracer?._blendTargets ?? [])]) {
      if (rt?.texture) {
        rt.texture.minFilter = LinearFilter;
        rt.texture.magFilter = LinearFilter;
      }
    }
    // matte 재질을 홀드아웃이 아니라 진짜 그림자 캐처로 바꾼다 (shadowCatcher.ts)
    patchShadowCatcher((this.pathTracer as any)._pathTracer.material, this.settings.floor.shadowStrength);
    // 투과 재질 분산(보석 파이어) — hero channel 방식 (dispersion.ts)
    patchDispersion((this.pathTracer as any)._pathTracer.material, this.settings.render.dispersion);
    this.prepareShaderOnce();
    this.tryEnableBvhWorker();
    this.applyBvhOptions();

    this.envBlurGen = new BlurredEnvMapGenerator(renderer);
    this.blackBackground = new DataTexture(new Float32Array([0, 0, 0, 1]), 1, 1, RGBAFormat, FloatType);
    this.blackBackground.mapping = EquirectangularReflectionMapping;
    this.blackBackground.needsUpdate = true;
    this.displayMat = new DisplayMaterial(true);
    this.denoiseMat = new DenoiseMaterial({ premultipliedAlpha: true } as any);
    this.atrous = new AtrousDenoiser(renderer);
    this.atrousLow = new AtrousDenoiser(renderer);
    this.temporal = new TemporalReprojector(renderer);
    this.blackTex = new DataTexture(new Float32Array([0, 0, 0, 0]), 1, 1, RGBAFormat, FloatType);
    this.blackTex.needsUpdate = true;
    this.quad = new FullScreenQuad(this.displayMat);

    this.applyRenderSettings();
    this.applyCameraSettings();
    this.applyFloorSettings();
    void this.applyEnvironment();
    this.applyLights();
    // 기본 디노이저가 OIDN 이면 가중치·tfjs 를 지금 미리 올린다(첫 정지 직후 바로 쓰이게). 실패 시 à-trous 로 조용히 폴백.
    this.applyPostSettings();

    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(this.container);
    this.resize();
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  /* -------------------------------- 이벤트 -------------------------------- */

  on(event: ViewerEvent, fn: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(fn);
    return () => this.off(event, fn);
  }
  off(event: ViewerEvent, fn: Listener) {
    this.listeners.get(event)?.delete(fn);
  }
  private emit(event: ViewerEvent, payload?: any) {
    this.listeners.get(event)?.forEach((fn) => fn(payload));
  }
  private setStatus(s: string) {
    this.status = s;
    this.emit('status', s);
  }

  /* -------------------------------- 모델 -------------------------------- */

  get currentModel() {
    return this.model;
  }

  async loadModel(source: string | File): Promise<LoadedModel> {
    this.setStatus('모델 로딩 중…');
    let loaded: LoadedModel;
    try {
      loaded = await loadModel(source, this.renderer, {
        decoderBase: `${this.assetBase}libs/`,
        onProgress: (r) => this.setStatus(`모델 로딩 중… ${Math.round(r * 100)}%`),
      });
    } catch (e) {
      this.setStatus('');
      this.emit('error', e);
      throw e;
    }
    return this.installModel(loaded);
  }

  /** 메모리 상의 Object3D 를 바로 올린다 (VRINGON 뷰어가 이미 로드한 씬, 절차 생성 모델 등) */
  async loadObject(root: Object3D, name?: string): Promise<LoadedModel> {
    return this.installModel(wrapObject(root, name));
  }

  private async installModel(loaded: LoadedModel): Promise<LoadedModel> {
    this.clearModel();
    const fit = normalizeModel(loaded.root, this.normalizeSize);
    this.model = loaded;
    this.modelGroup.add(loaded.root);
    this.modelRadius = fit.radius;
    this.modelCenter.set(0, this.normalizeSize * (fit.size.y / Math.max(fit.size.x, fit.size.y, fit.size.z)) * 0.5, 0);
    this.frameModel();
    this.applyFloorSettings();
    this.applyLights();
    this.emit('model-loaded', loaded);
    this.emit('materials', loaded.materials);
    await this.rebuildScene();
    if (this.engine === 'webgpu') await this.syncRayzee(true);
    this.setStatus('');
    return loaded;
  }

  clearModel() {
    if (this.model) {
      this.modelGroup.remove(this.model.root);
      this.model.root.traverse((o: Object3D) => {
        const m = o as Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
      this.model = null;
    }
  }

  /** 카메라를 모델에 맞춘다 (정면 3/4 뷰) */
  frameModel(azimuthDeg = 35, elevationDeg = 18) {
    const r = this.modelRadius;
    const fov = (this.camera.fov * Math.PI) / 180;
    const dist = (r / Math.sin(fov / 2)) * 1.15;
    const a = (azimuthDeg * Math.PI) / 180;
    const e = (elevationDeg * Math.PI) / 180;
    this.controls.target.copy(this.modelCenter);
    this.camera.position.set(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)).multiplyScalar(dist).add(this.modelCenter);
    this.camera.near = Math.max(0.005, dist * 0.01);
    this.camera.far = Math.max(50, dist * 40);
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.onCameraChange();
  }

  /** 미리 정의된 뷰 (front/side/top/quarter) */
  setView(view: 'front' | 'back' | 'left' | 'right' | 'top' | 'quarter') {
    const map: Record<string, [number, number]> = {
      front: [0, 8],
      back: [180, 8],
      left: [-90, 8],
      right: [90, 8],
      top: [0, 89],
      quarter: [35, 18],
    };
    const [a, e] = map[view];
    this.frameModel(a, e);
  }

  /* -------------------------------- 엔진 전환 -------------------------------- */

  get currentEngine(): EngineKind {
    return this.engine;
  }

  static webgpuSupported(): boolean {
    return RayzeeBackend.supported();
  }

  /**
   * 렌더 엔진 전환. 'webgpu' 는 Rayzee 를 지연 로드해 초기화(첫 회 수십 초: 번들 + WGSL 컴파일)하고
   * 현재 모델·환경·조명·설정을 그대로 옮긴 뒤 WebGL 캔버스를 숨긴다. 실패하면 WebGL 로 남는다.
   */
  async setEngine(kind: EngineKind): Promise<void> {
    if (kind === this.engine) return;
    if (kind === 'webgpu') {
      if (!RayzeeBackend.supported()) {
        this.emit('error', new Error('이 브라우저는 WebGPU 를 지원하지 않아 WebGL2 엔진을 유지합니다.'));
        return;
      }
      this.setStatus('WebGPU 엔진(Rayzee) 로딩·컴파일 중…');
      try {
        if (!this.rayzee) this.rayzee = new RayzeeBackend(this, this.container);
        await this.rayzee.init();
        this.engine = 'webgpu';
        this.rayzee.show();
        this.renderer.domElement.style.display = 'none';
        this.controls.enabled = false;
        await this.syncRayzee(true);
        this.setStatus('');
      } catch (e) {
        console.error(e);
        this.setStatus('');
        this.engine = 'webgl';
        this.rayzee?.hide();
        this.renderer.domElement.style.display = 'block';
        this.controls.enabled = true;
        this.emit('error', new Error(`WebGPU 엔진 초기화 실패: ${(e as Error).message}. WebGL2 로 계속합니다.`));
      }
    } else {
      this.rayzee?.syncToViewer();
      this.rayzee?.hide();
      this.engine = 'webgl';
      this.renderer.domElement.style.display = 'block';
      this.controls.enabled = true;
      this.resize();
      this.onCameraChange();
    }
    this.emit('settings', this.settings);
  }

  /** 현재 뷰어 상태 전부를 Rayzee 로 번역 (엔진 전환·모델 교체 시) */
  private async syncRayzee(full: boolean) {
    const rz = this.rayzee;
    if (!rz || this.engine !== 'webgpu') return;
    if (full) {
      this.setStatus('WebGPU 씬 빌드 중…');
      await rz.setModel(this.model?.root ?? null, this.model?.name ?? 'model');
      this.setStatus('');
    }
    await rz.applyEnvironment(this.envTexture, this.settings.environment);
    rz.applyLights({ id: this.settings.lights.rigId, label: '', lights: this.settings.lights.lights }, this.modelRadius, this.modelCenter);
    rz.applyAll();
    rz.syncFromViewer();
  }

  /* -------------------------------- 설정 적용 -------------------------------- */

  setRender(p: Partial<RenderSettings>) {
    Object.assign(this.settings.render, p);
    this.applyRenderSettings();
    this.emit('settings', this.settings);
  }

  private applyRenderSettings() {
    this.sceneVersion++;
    const s = this.settings.render;
    const pt = this.pathTracer;
    pt.bounces = this.interacting ? Math.min(3, s.bounces) : s.bounces;
    pt.transmissiveBounces = this.interacting ? Math.min(4, s.transmissiveBounces) : s.transmissiveBounces;
    pt.filterGlossyFactor = s.filterGlossyFactor;
    pt.multipleImportanceSampling = s.multipleImportanceSampling;
    pt.renderScale = s.renderScale;
    pt.dynamicLowRes = s.dynamicLowRes;
    pt.tiles.set(s.tiles, s.tiles);
    const du = (pt as any)._pathTracer?.material?.uniforms?.dispersion;
    if (du) du.value = s.dispersion;
    pt.reset();
    this.renderStart = performance.now();
    if (this.engine === 'webgpu') this.rayzee?.applyRender(s);
  }

  setEnvironment(p: Partial<EnvironmentSettings>) {
    const prev = this.settings.environment.presetId;
    Object.assign(this.settings.environment, p);
    if (p.presetId !== undefined && p.presetId !== prev) {
      void this.applyEnvironment();
    } else {
      this.applyEnvironmentParams();
    }
    this.emit('settings', this.settings);
  }

  /** 사용자 HDR/EXR 파일 또는 URL 을 환경맵으로 */
  async setEnvironmentFromFile(source: File | string) {
    const token = ++this.envToken;
    this.setStatus('환경맵 로딩 중…');
    try {
      const tex = await loadEnvironmentTexture(source);
      if (token !== this.envToken) return;
      this.settings.environment.presetId = 'custom';
      this.installEnvironment(tex);
      this.emit('settings', this.settings);
    } catch (e) {
      this.emit('error', e);
    } finally {
      if (token === this.envToken) this.setStatus('');
    }
  }

  private async applyEnvironment() {
    this.sceneVersion++;
    const token = ++this.envToken;
    const preset = ENVIRONMENT_PRESETS.find((e) => e.id === this.settings.environment.presetId) ?? ENVIRONMENT_PRESETS[0];
    let tex: Texture;
    if (preset.kind === 'procedural') {
      tex = generateProceduralEnvironment(preset.spec!, 1024, 512);
      tex.name = preset.id;
    } else {
      this.setStatus('HDR 로딩 중…');
      try {
        tex = await loadEnvironmentTexture(this.assetBase + preset.url!);
      } catch (e) {
        this.emit('error', e);
        this.setStatus('');
        return;
      }
      if (token !== this.envToken) {
        tex.dispose();
        return;
      }
      this.setStatus('');
    }
    this.installEnvironment(tex, preset);
  }

  private installEnvironment(tex: Texture, preset?: EnvironmentPreset) {
    this.envTexture?.dispose();
    this.envBlurred?.dispose();
    this.envTexture = tex;
    this.envBlurred = null;
    if (preset?.intensity !== undefined && preset.intensity !== this.settings.environment.intensity) {
      // 프리셋 권장 강도는 사용자가 건드리기 전 기본값으로만 쓴다
    }
    this.applyEnvironmentParams();
  }

  private applyEnvironmentParams() {
    const s = this.settings.environment;
    const scene = this.scene;
    if (!this.envTexture) return;
    scene.environment = this.envTexture;
    scene.environmentIntensity = s.intensity;
    scene.environmentRotation.set(0, (s.rotation * Math.PI) / 180, 0);
    scene.backgroundRotation.set(0, (s.rotation * Math.PI) / 180, 0);
    scene.backgroundIntensity = s.backgroundIntensity;
    scene.backgroundBlurriness = 0;

    switch (s.background) {
      case 'environment':
        scene.background = this.envTexture;
        break;
      case 'blurred': {
        // 흐린 배경: PMREM 기반 블러 텍스처 (path tracer 도 같은 텍스처를 그린다)
        this.envBlurred?.dispose();
        this.envBlurred = this.envBlurGen.generate(this.envTexture as any, Math.max(0.01, s.blur));
        scene.background = this.envBlurred;
        break;
      }
      case 'color':
        scene.background = new Color(s.backgroundColor);
        break;
      case 'transparent':
        // 배경을 null 로 두면 FEATURE_BACKGROUND_MAP 디파인이 바뀌어 셰이더가 재컴파일된다(수 초~수십 초).
        // 대신 1×1 검정 텍스처를 배경으로 두고 backgroundAlpha 만 0 으로 내려 같은 결과를 재컴파일 없이 얻는다.
        scene.background = this.blackBackground;
        break;
    }
    this.pathTracer.updateEnvironment();
    if (s.background === 'transparent') {
      const mat = (this.pathTracer as any)._pathTracer?.material;
      if (mat) mat.backgroundAlpha = 0;
    }
    this.renderStart = performance.now();
    if (this.engine === 'webgpu') void this.rayzee?.applyEnvironment(this.envTexture, s);
  }

  setCamera(p: Partial<CameraSettings>) {
    Object.assign(this.settings.camera, p);
    this.applyCameraSettings();
    this.emit('settings', this.settings);
  }

  private applyCameraSettings() {
    this.markAuxDirty();
    const s = this.settings.camera;
    const cam = this.camera;
    if (cam.fov !== s.fov) {
      cam.fov = s.fov;
      cam.updateProjectionMatrix();
    }
    cam.fStop = s.dof ? s.fStop : 1e6; // 사실상 핀홀
    cam.apertureBlades = s.apertureBlades;
    if (!s.autoFocus) cam.focusDistance = s.focusDistance;
    else cam.focusDistance = cam.position.distanceTo(this.controls.target);
    this.controls.autoRotate = s.autoRotate;
    this.controls.autoRotateSpeed = s.autoRotateSpeed;
    this.pathTracer.updateCamera();
    this.renderStart = performance.now();
    if (this.engine === 'webgpu') this.rayzee?.applyCamera(s);
  }

  private markAuxDirty() {
    this.auxDirty = true;
    this.auxKey++;
  }

  /** 드래그 시작: 바운스·분산을 줄여 프리뷰 fps 를 올린다 (bounces 는 유니폼이라 재컴파일 없음). 외부 카메라 동기화에서도 호출 */
  beginInteraction() {
    if (this.interacting) return;
    this.interacting = true;
    this.pathTracer.bounces = Math.min(3, this.settings.render.bounces);
    this.pathTracer.transmissiveBounces = Math.min(4, this.settings.render.transmissiveBounces);
    // 프리뷰 중엔 분산(채널 노이즈) 끔 — 무지개 점묘 대신 차분한 프리뷰
    const du = (this.pathTracer as any)._pathTracer?.material?.uniforms?.dispersion;
    if (du) du.value = 0;
    this.emit('interaction', true);
  }

  /** 드래그 끝: 설정 복원 + 누적 재시작 */
  endInteraction() {
    if (!this.interacting) return;
    this.interacting = false;
    this.pathTracer.bounces = this.settings.render.bounces;
    this.pathTracer.transmissiveBounces = this.settings.render.transmissiveBounces;
    const du = (this.pathTracer as any)._pathTracer?.material?.uniforms?.dispersion;
    if (du) du.value = this.settings.render.dispersion;
    this.pathTracer.reset();
    this.renderStart = performance.now();
    this.emit('interaction', false);
  }

  /** 다른 뷰어(또는 외부)의 카메라를 그대로 따라간다 — 비교 화면용. position/target 만 복사하고 나머지는 onCameraChange 와 동일 */
  syncCamera(position: Vector3, target: Vector3) {
    if (this.camera.position.distanceToSquared(position) < 1e-12 && this.controls.target.distanceToSquared(target) < 1e-12) return;
    this.controls.target.copy(target);
    this.camera.position.copy(position);
    this.camera.lookAt(target);
    this.camera.updateMatrixWorld();
    this.controls.update();
    this.onCameraChange();
  }

  /** 현재 카메라 (position, target) */
  getCameraPose(): { position: Vector3; target: Vector3 } {
    return { position: this.camera.position.clone(), target: this.controls.target.clone() };
  }

  private onCameraChange() {
    this.markAuxDirty();
    this.emit('camera', this.getCameraPose());
    const s = this.settings.camera;
    if (s.autoFocus) {
      s.focusDistance = this.camera.position.distanceTo(this.controls.target);
      this.camera.focusDistance = s.focusDistance;
    }
    this.pathTracer.updateCamera();
    this.renderStart = performance.now();
  }

  setFloor(p: Partial<FloorSettings>) {
    Object.assign(this.settings.floor, p);
    this.applyFloorSettings();
    this.scheduleSceneUpdate();
    this.emit('settings', this.settings);
  }

  private applyFloorSettings() {
    this.sceneVersion++;
    this.markAuxDirty();
    const s = this.settings.floor;
    const f = this.floor;
    f.visible = s.enabled;
    const r = Math.max(this.modelRadius, 0.05) * s.size;
    f.scale.setScalar(r);
    const m = f.material;
    m.color.set(s.color);
    m.roughness = s.roughness;
    m.metalness = s.metalness;
    (m as any).matte = s.mode === 'shadow';
    (m as any).castShadow = false;
    m.needsUpdate = true;
    const u = (this.pathTracer as any)._pathTracer?.material?.uniforms?.shadowCatcherStrength;
    if (u) u.value = s.shadowStrength;
    if (this.engine === 'webgpu') this.rayzee?.applyFloor(s);
  }

  setPost(p: Partial<PostSettings>) {
    Object.assign(this.settings.post, p);
    this.applyPostSettings();
    this.emit('settings', this.settings);
  }

  private applyPostSettings() {
    const s = this.settings.post;
    this.renderer.toneMapping = TONE_MAPPINGS[s.toneMapping];
    this.renderer.toneMappingExposure = s.exposure;
    this.displayMat.needsUpdate = true;
    this.denoiseMat.needsUpdate = true;
    this.denoiseMat.uniforms.sigma.value = s.bilateralSigma;
    this.denoiseMat.uniforms.kSigma.value = s.bilateralKSigma;
    this.denoiseMat.uniforms.threshold.value = s.bilateralThreshold;
    if (s.denoise === 'oidn') this.ensureOidn();
    else this.oidnValidSamples = -1;
    // 재질을 지나는 프레임(래스터)도 톤매핑이 바뀌므로 다시 컴파일되게
    this.scene.traverse((o) => {
      const m = (o as Mesh).material as MeshStandardMaterial | MeshStandardMaterial[] | undefined;
      if (!m) return;
      (Array.isArray(m) ? m : [m]).forEach((mm) => (mm.needsUpdate = true));
    });
    if (this.engine === 'webgpu') this.rayzee?.applyPost(s, this.renderer.toneMapping);
  }

  setLights(rigIdOrRig: string | LightRig) {
    const rig = typeof rigIdOrRig === 'string' ? LIGHT_RIGS.find((r) => r.id === rigIdOrRig) ?? LIGHT_RIGS[0] : rigIdOrRig;
    const copy = cloneRig(rig);
    this.settings.lights = { rigId: copy.id, lights: copy.lights };
    this.applyLights();
    this.pathTracer.updateLights();
    this.emit('settings', this.settings);
  }

  /** 개별 조명 파라미터 수정 (UI 슬라이더용) */
  updateLight(id: string, patch: Partial<RigLight>) {
    const l = this.settings.lights.lights.find((x) => x.id === id);
    if (!l) return;
    Object.assign(l, patch);
    this.applyLights();
    this.pathTracer.updateLights();
    this.emit('settings', this.settings);
  }

  private applyLights() {
    this.sceneVersion++;
    if (this.lightGroup) {
      this.scene.remove(this.lightGroup);
      this.lightGroup.traverse((o) => (o as any).dispose?.());
    }
    const rig: LightRig = { id: this.settings.lights.rigId, label: '', lights: this.settings.lights.lights };
    this.lightTargetTmp.copy(this.modelCenter);
    this.lightGroup = buildLightGroup(rig, this.modelRadius, this.lightTargetTmp);
    this.scene.add(this.lightGroup);
    this.renderStart = performance.now();
    if (this.engine === 'webgpu') this.rayzee?.applyLights(rig, this.modelRadius, this.modelCenter);
  }

  /* -------------------------------- 재질 -------------------------------- */

  getMaterials(): MeshStandardMaterial[] {
    return this.model?.materials ?? [];
  }

  /** 재질 속성 변경 후 호출 — path tracer 재질 텍스처를 다시 올린다 */
  commitMaterials() {
    this.sceneVersion++;
    this.pathTracer.updateMaterials();
    this.renderStart = performance.now();
  }

  /** 모든 재질을 하나의 룩으로 덮어쓰는 프리셋 (클레이/메탈/유리 …) 은 원본을 잃으므로 복제해서 적용 */
  applyMaterialOverride(kind: 'original' | 'clay' | 'metal' | 'glass' | 'plastic') {
    if (!this.model) return;
    const meshes: Mesh[] = [];
    this.model.root.traverse((o) => {
      if ((o as Mesh).isMesh) meshes.push(o as Mesh);
    });
    if (kind === 'original') {
      for (const m of meshes) {
        if (m.userData.originalMaterial) {
          m.material = m.userData.originalMaterial;
        }
      }
    } else {
      const make = () => {
        const mat = new MeshPhysicalMaterial();
        switch (kind) {
          case 'clay':
            mat.color.set(0xb8b4ad);
            mat.roughness = 0.85;
            break;
          case 'metal':
            mat.color.set(0xd8d8dc);
            mat.roughness = 0.22;
            mat.metalness = 1;
            break;
          case 'glass':
            mat.color.set(0xffffff);
            mat.roughness = 0.03;
            mat.transmission = 1;
            mat.ior = 1.5;
            mat.thickness = 0.2;
            break;
          case 'plastic':
            mat.color.set(0xe84a3c);
            mat.roughness = 0.35;
            mat.clearcoat = 1;
            mat.clearcoatRoughness = 0.08;
            break;
        }
        return mat;
      };
      const shared = make();
      for (const m of meshes) {
        if (!m.userData.originalMaterial) m.userData.originalMaterial = m.material;
        m.material = Array.isArray(m.material) ? m.material.map(() => shared) : shared;
      }
    }
    this.scheduleSceneUpdate();
  }

  /* -------------------------------- 씬 재구성 -------------------------------- */

  private applyBvhOptions() {
    const gen = (this.pathTracer as any)._generator;
    if (gen) gen.bvhOptions = { ...(gen.bvhOptions ?? {}), maxDepth: BVH_MAX_DEPTH, targetLeafSize: 1 };
  }

  private tryEnableBvhWorker() {
    // 워커가 없으면 setScene 이 메인 스레드를 막는다(수십만 삼각형이면 1~2초). 실패 시 동기 빌드로 폴백.
    try {
      this.pathTracer.setBVHWorker(new ViteBVHWorker() as any);
    } catch (e) {
      console.warn('[viewer] BVH worker 사용 불가, 동기 빌드로 진행', e);
    }
  }

  /** 지오메트리/재질 구조가 바뀐 뒤 path tracer 씬을 다시 만든다 */
  async rebuildScene(): Promise<void> {
    if (this.sceneUpdatePromise) {
      this.needsSceneUpdate = true;
      return this.sceneUpdatePromise;
    }
    this.needsSceneUpdate = false;
    this.bvhBuilding = true;
    this.buildStartedAt = performance.now();
    this.setStatus('BVH 빌드 중…');
    const run = async () => {
      try {
        const hasWorker = Boolean((this.pathTracer as any)._generator?._bvhWorker);
        if (hasWorker) {
          await this.pathTracer.setSceneAsync(this.scene, this.camera, {
            onProgress: (r: number) => this.setStatus(`BVH 빌드 중… ${Math.round(r * 100)}%`),
          });
        } else {
          this.pathTracer.setScene(this.scene, this.camera);
        }
      } catch (e) {
        console.error(e);
        this.emit('error', e);
      } finally {
        this.bvhBuilding = false;
        this.buildStartedAt = 0;
        this.buildRecoveries = 0;
        this.sceneVersion++;
        this.setStatus('');
        this.renderStart = performance.now();
        this.oidnValidSamples = -1;
        this.markAuxDirty();
      }
    };
    this.sceneUpdatePromise = run().then(() => {
      this.sceneUpdatePromise = null;
      if (this.needsSceneUpdate) return this.rebuildScene();
    });
    return this.sceneUpdatePromise;
  }

  private sceneUpdateTimer = 0;
  private scheduleSceneUpdate() {
    window.clearTimeout(this.sceneUpdateTimer);
    this.sceneUpdateTimer = window.setTimeout(() => void this.rebuildScene(), 50);
  }

  /* -------------------------------- OIDN -------------------------------- */

  private async ensureOidn() {
    if (this.oidn) return;
    if (this.oidnSupported === null) {
      const probe = await probeOidnSupport();
      this.oidnSupported = probe.supported;
      if (!probe.supported) {
        this.emit('error', new Error(`OIDN(AI 디노이즈) 사용 불가: ${probe.reason}. 에지 보존 필터로 대체합니다.`));
        this.settings.post.denoise = 'atrous';
        this.emit('settings', this.settings);
        return;
      }
    }
    if (!this.oidnSupported) return;
    this.oidn = new OidnDenoiser(`${this.assetBase}oidn/rt_hdr_alb_nrm.tza`, true);
    this.oidnAux = new AuxBufferRenderer(this.renderer);
    this.setStatus('OIDN 가중치 로딩 중…');
    try {
      await this.oidn.load();
      this.setStatus('');
      // 속도 사전 점검(1 회): 256² 두 번 → 풀프레임 예상 시간. 2 s 를 넘기면 "정지 후 수 초" 목표에 해가 되므로 à-trous 로 시작한다.
      // (사용자가 Denoising 에서 AI·OIDN 을 다시 고르면 그대로 존중 — 점검은 최초 1 회만)
      if (!this.oidnAutoChecked) {
        this.oidnAutoChecked = true;
        const ms256 = await this.oidn.benchmark(256);
        this.renderer.getDrawingBufferSize(this.sizeTmp);
        const px = this.sizeTmp.x * this.sizeTmp.y * this.settings.render.renderScale ** 2;
        const est = ms256 * (px / 65536) * 3.0; // 타일·리드백 오버헤드 — 인텔 Arc 140T 실측(256² 117 ms ↔ 0.96 Mpx 7.3 s) 기준 보정
        this.oidnPassMs = est;
        console.info(`[viewer] OIDN 256² ${ms256.toFixed(0)} ms → 풀프레임 예상 ${(est / 1000).toFixed(1)} s`);
        if (est > 2000 && this.settings.post.denoise === 'oidn') {
          this.settings.post.denoise = 'atrous';
          this.oidnValidSamples = -1;
          this.emit('error', new Error(`이 GPU 에선 AI 디노이즈(OIDN) 한 패스가 약 ${(est / 1000).toFixed(0)} s 로 예상돼 에지 보존 필터(à-trous)로 시작합니다. Denoising 에서 AI·OIDN 을 고르면 그대로 씁니다(렌더샷에는 항상 사용 가능).`));
          this.emit('settings', this.settings);
        }
      }
    } catch (e) {
      this.setStatus('');
      this.emit('error', new Error(`OIDN 로드 실패: ${(e as Error).message}. 에지 보존 필터로 대체합니다.`));
      this.oidn.dispose();
      this.oidn = null;
      this.oidnSupported = false;
      this.settings.post.denoise = 'atrous';
      this.emit('settings', this.settings);
    }
  }

  private async runOidn() {
    if (!this.oidn?.ready || !this.oidnAux || this.oidnBusy) return;
    const target = this.pathTracer.target;
    const w = target.width;
    const h = target.height;
    if (w < 8 || h < 8) return;
    this.oidnBusy = true;
    const samplesAtStart = this.pathTracer.samples;
    const t0 = performance.now();
    try {
      const color = new Float32Array(w * h * 4);
      this.renderer.readRenderTargetPixels(target, 0, 0, w, h, color);
      // 투명 배경이면 알파를 곱해둔다 (배경 잡음이 색으로 번지지 않게)
      const aux = this.oidnAux.render(this.scene, this.camera, w, h);
      const out = await this.oidn.denoise({ color, albedo: aux.albedo, normal: aux.normal, width: w, height: h });
      // 알파는 원본에서 복원
      for (let i = 3; i < out.length; i += 4) out[i] = color[i];
      this.oidnTexture = floatToTexture(out, w, h, this.oidnTexture);
      this.oidnValidSamples = samplesAtStart;
      // 적응형: 이 GPU 에서 한 패스가 너무 느리면(인텔 Arc 140T 실측 1120×856 ≈ 7~12 s) "정지 후 수 초" 목표에 오히려 방해가 된다.
      // 첫 패스 기준 1 Mpx 당 3 s 를 넘으면 à-trous 로 자동 전환하고 알린다(사용자가 다시 OIDN 을 고르면 그대로 존중).
      const ms = performance.now() - t0;
      const perMpx = ms / ((w * h) / 1e6);
      this.oidnPassMs = ms;
      if (!this.oidnAutoChecked && !this.stillActive) {
        this.oidnAutoChecked = true;
        if (perMpx > 3000 && this.settings.post.denoise === 'oidn') {
          this.settings.post.denoise = 'atrous';
          this.oidnValidSamples = -1;
          this.emit('error', new Error(`AI 디노이즈(OIDN)가 이 GPU 에서 한 패스 ${(ms / 1000).toFixed(1)} s 로 느려 에지 보존 필터(à-trous)로 전환했습니다. 렌더샷(정지 이미지)에는 계속 OIDN 을 쓸 수 있습니다.`));
          this.emit('settings', this.settings);
        }
      }
    } catch (e) {
      console.warn('[viewer] OIDN 실패 — 에지 보존 필터로 대체', e);
      this.oidnValidSamples = -1;
      this.oidnSupported = false;
      this.oidn?.dispose();
      this.oidn = null;
      this.settings.post.denoise = 'atrous';
      this.emit('error', new Error(`OIDN 실행 실패: ${(e as Error).message}. 에지 보존 필터로 대체합니다.`));
      this.emit('settings', this.settings);
    } finally {
      this.oidnBusy = false;
    }
  }

  /* -------------------------------- 루프 -------------------------------- */

  private resize() {
    if (this.stillActive) return;
    this.rayzee?.resize();
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.pathTracer.updateCamera();
    this.markAuxDirty();
    this.renderStart = performance.now();
  }

  private loop() {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    if (this.stillActive) return; // 렌더샷 중에는 renderStill 이 캔버스를 소유한다
    if (this.engine === 'webgpu') {
      // Rayzee 가 자체 rAF 루프로 그린다 — 여기선 통계만 내보낸다
      const now0 = performance.now();
      if (now0 - this.lastStatsTime > 500) {
        this.lastStatsTime = now0;
        this.emit('stats', this.getStats());
      }
      return;
    }
    this.controls.update();
    const s = this.settings;
    const pt = this.pathTracer;

    if (!s.render.pathTracing || this.bvhBuilding || !this.ptReady) {
      // 모델·환경맵이 모두 준비되기 전에는 PT 셰이더를 건드리지 않는다: 빈 씬으로 한 번 컴파일하고(FOG/BACKGROUND 디파인이 다름)
      // 씬이 들어오면 또 컴파일하는 "2중 컴파일" 을 피한다 — 인텔 iGPU 에서는 한 번에 1~2분이 걸리기도 한다(실측).
      this.renderRaster();
    } else {
      const canAccumulate = s.render.maxSamples === 0 || pt.samples < s.render.maxSamples;
      if (canAccumulate) {
        for (let i = 0; i < s.render.samplesPerFrame; i++) this.safeRenderSample();
        // 워치독: 컴파일도 아닌데 3초 넘게 샘플이 늘지 않으면 내부 렌더 태스크를 버리고 다시 시작
        const nowW = performance.now();
        if (pt.samples !== this.lastSampleCount) {
          this.lastSampleCount = pt.samples;
          this.lastSampleTime = nowW;
        } else if (!this.isCompiling && nowW - this.lastSampleTime > 3000) {
          (pt as any)._pathTracer._task = null;
          (pt as any)._lowResPathTracer._task = null;
          this.lastSampleTime = nowW;
        }
      }
      this.composite();
      if (this.listeners.get('frame')?.size) {
        const accumulating = !this.isCompiling && !this.interacting && pt.samples >= pt.minSamples;
        this.emit('frame', {
          samples: pt.samples,
          accumulating,
          maxSamples: s.render.maxSamples,
          elapsedMs: performance.now() - this.renderStart,
          effectiveSamples: s.render.temporal ? pt.samples + this.temporal.meanHistWeight : pt.samples,
        } as FrameInfo);
      }
    }

    // 씬 준비(BVH) 멈춤 감지 — GPU 컨텍스트가 손실되면 setSceneAsync 가 영영 끝나지 않아
    // "씬 준비 중" 에 갇힌 채 마지막 래스터 프레임만 남는다(실측 재발). 15 s 넘으면 한 번 되살리고, 그래도 안 되면 사실대로 알린다.
    if (this.bvhBuilding && this.buildStartedAt && performance.now() - this.buildStartedAt > 15_000) {
      const lost = this.renderer.getContext().isContextLost();
      if (lost || this.buildRecoveries >= 1) {
        this.buildStartedAt = 0;
        this.setStatus(lost ? 'GPU 컨텍스트가 손실되었습니다 — 페이지를 새로고침해 주세요' : '씬 준비가 응답하지 않습니다 — 페이지를 새로고침해 주세요');
        this.emit('error', new Error(lost ? 'GPU 컨텍스트 손실로 씬 준비가 중단되었습니다. 새로고침이 필요합니다.' : '씬 준비가 15초 넘게 응답하지 않습니다. 새로고침이 필요합니다.'));
      } else {
        this.buildRecoveries++;
        this.buildStartedAt = performance.now();
        this.setStatus('씬 준비가 지연되어 다시 시도합니다…');
        this.bvhBuilding = false;
        this.sceneUpdatePromise = null;
        void this.rebuildScene();
      }
    }

    // 컴파일 중임을 눈에 띄게: 래스터 프리뷰만 보이는 동안 사용자가 "패스트레이싱이 안 된다" 고 오해하지 않게
    const compilingNow = this.isCompiling && s.render.pathTracing;
    if (compilingNow !== this.compileStatusShown) {
      this.compileStatusShown = compilingNow;
      if (compilingNow) {
        this.compileStartedAt = performance.now();
        this.compileEstimateMs = this.loadCompileEstimate();
        this.setStatus('패스트레이서 셰이더 컴파일 중… (첫 방문 1회) — 끝나면 샘플 누적이 시작됩니다');
      } else {
        // 컴파일이 끝나는 순간부터 누적 시간을 센다(경과·ETA 에 컴파일 대기가 섞이지 않게)
        this.renderStart = performance.now();
        if (this.compileStartedAt) {
          this.compileTookMs = performance.now() - this.compileStartedAt;
          this.saveCompileEstimate(this.compileTookMs);
        }
        if (this.status.startsWith('패스트레이서 셰이더 컴파일')) this.setStatus('');
      }
    }

    this.frameCount++;
    const now = performance.now();
    if (now - this.lastStatsTime > 500) {
      this.fps = (this.frameCount * 1000) / (now - this.lastStatsTime);
      this.frameCount = 0;
      this.lastStatsTime = now;
      this.emit('stats', this.getStats());
    }
  }

  /**
   * renderSample 래퍼. 탭이 백그라운드로 가거나 GPU 가 오래 막힌 뒤 제너레이터가 "already running" 상태로
   * 남는 경우가 있어(실측) 그때는 내부 태스크를 버리고 다시 시작한다. 누적 버퍼는 유지된다.
   */
  private safeRenderSample() {
    try {
      this.pathTracer.renderSample();
    } catch (e) {
      const msg = String((e as Error)?.message ?? e);
      if (msg.includes('already running')) {
        (this.pathTracer as any)._pathTracer._task = null;
        (this.pathTracer as any)._lowResPathTracer._task = null;
      } else {
        throw e;
      }
    }
  }

  /** 화면(null 타깃)에 그리기 전 렌더러 상태 정상화 — 타일 렌더 중 중단(컨텍스트 손실·디버거)으로 scissor 가 남는 경우 대비 */
  private prepareScreen() {
    const r = this.renderer;
    r.setRenderTarget(null);
    r.setScissorTest(false);
    r.getSize(this.sizeTmp);
    r.setViewport(0, 0, this.sizeTmp.x, this.sizeTmp.y);
  }

  private renderRaster() {
    const r = this.renderer;
    this.prepareScreen();
    const floorWasVisible = this.floor.visible;
    const bg = this.scene.background;
    if (this.settings.floor.mode === 'shadow') this.floor.visible = false; // 매트 바닥은 래스터에선 안 보이게
    if (this.settings.environment.background === 'transparent') this.scene.background = null;
    r.setRenderTarget(null);
    r.autoClear = true;
    r.render(this.scene, this.camera);
    this.scene.background = bg;
    this.floor.visible = floorWasVisible;
  }

  /**
   * 시간적 재투영 합성 (render.temporal). 성공하면 true, 아직 쓸 증거가 없으면 false(호출자가 기존 경로로).
   *   새 증거 = 정지 후엔 풀해상 누적(N = pt.samples), 조작 중엔 저해상 1 spp(N = 0.5 로 셈)
   *   카메라/씬이 바뀐 프레임: G-버퍼 → (하이브리드면 래스터) → 재투영
   *   매 프레임: hist ⊕ new ⊕ raster → à-trous(유효 spp 기준) → 화면, 그리고 commit
   */
  private compositeTemporal(): boolean {
    const pt = this.pathTracer;
    const r = this.renderer;
    const post = this.settings.post;
    const sr = this.settings.render;
    const full = (pt as any)._pathTracer;
    const low = (pt as any)._lowResPathTracer;
    if (!full?.target) return false;
    const w: number = full.target.width;
    const h: number = full.target.height;
    if (w < 8 || h < 8) return false;

    // 새 증거
    let newTex: Texture | null = null;
    let n = 0;
    if (pt.samples >= pt.minSamples) {
      newTex = pt.target.texture;
      n = pt.samples;
    } else if (sr.dynamicLowRes && low) {
      if (low.samples < 1) {
        low.material = full.material;
        try {
          low.update();
        } catch {
          low._task = null;
        }
      }
      if (low.samples >= 1) {
        newTex = low.target.texture;
        n = 0.5; // 저해상(0.5 스케일) 1 spp 는 풀해상 0.5 샘플 값어치로
      }
    }

    // 카메라·씬 변화 감지
    const cam = this.camera;
    const e = cam.matrixWorld.elements;
    const pe = cam.projectionMatrix.elements;
    const key = `${e[12].toFixed(5)},${e[13].toFixed(5)},${e[14].toFixed(5)},${e[0].toFixed(5)},${e[1].toFixed(5)},${e[2].toFixed(5)},${e[4].toFixed(5)},${e[5].toFixed(5)},${e[6].toFixed(5)},${pe[0].toFixed(5)},${pe[5].toFixed(5)}|${w}x${h}`;
    const sceneChanged = this.temporalSceneVersion !== this.sceneVersion;
    if (sceneChanged) {
      this.temporal.invalidate();
      this.temporalSceneVersion = this.sceneVersion;
    }
    this.temporalDebug.calls++;
    if (key !== this.temporalCamKey || sceneChanged) {
      this.temporalCamKey = key;
      this.temporalDebug.reprojects++;
      this.temporalDebug.lastReprojectAt = performance.now();
      this.temporalDebug.lastReprojectWhy = sceneChanged ? 'scene' : 'camera';
      const hideFloor = this.settings.floor.mode === 'shadow' ? [this.floor] : [];
      this.temporal.renderGbuf(this.scene, cam, w, h, [], [this.floor]);
      if (sr.hybridFill) {
        const bg = this.scene.background;
        if (this.settings.environment.background === 'transparent') this.scene.background = null;
        this.temporal.renderRaster(this.scene, cam, hideFloor);
        this.scene.background = bg;
      }
      this.temporal.reproject(cam);
      if (this.temporalTraceOn) {
        const m = this.temporal.measureHist();
        this.temporalTrace.push({
          t: Math.round(performance.now()),
          why: sceneChanged ? 'scene' : 'cam',
          histObj: +m.obj.toFixed(2),
          histAll: +m.all.toFixed(2),
          histC: +(this.temporal.measureAlpha('hist')).toFixed(2),
          prevC: +(this.temporal.measureAlpha('blendPrev')).toFixed(2),
          curC: +(this.temporal.measureAlpha('blendCur')).toFixed(2),
          interacting: this.interacting,
          samples: +pt.samples.toFixed(2),
          hasHist: this.temporal.historyAvailable,
          wh: [w, h],
        });
        if (this.temporalTrace.length > 400) this.temporalTrace.shift();
      }
    }
    if (!newTex && !this.temporal.historyAvailable && !sr.hybridFill) {
      this.temporalDebug.fallbacks++;
      return false;
    }

    // 풀해상 누적(정지)만 히스토리에 저장한다. 이동 중 저해상 1 spp 는 표시에만 쓴다(실루엣 번짐·바운스 축소 편향이 굳지 않게).
    const storeNew = pt.samples >= pt.minSamples && !this.interacting;
    const blendTex = this.temporal.combine(newTex ?? this.blackTex, newTex ? n : 0, sr.hybridFill, storeNew);
    const effSpp = n + this.temporal.meanHistWeight;
    let map: Texture = blendTex;
    if (post.denoise !== 'off') {
      this.atrous.renderAux(this.scene, cam, w, h, `${this.auxKey}|${w}x${h}`);
      const params: AtrousParams = { ...DEFAULT_ATROUS, iterations: pt.samples >= pt.minSamples ? 4 : 2, fadeSamples: post.atrousFade, lumSigma: post.atrousStrength };
      map = this.atrous.filter(blendTex, Math.max(1, effSpp), params);
    }
    this.temporal.commit(cam);
    this.displayMat.map = map;
    this.quad.material = this.displayMat;
    r.autoClear = true;
    r.clear();
    this.quad.render(r);
    return true;
  }

  private composite() {
    const pt = this.pathTracer;
    const r = this.renderer;
    const post = this.settings.post;
    this.prepareScreen();
    if (this.settings.render.temporal && !this.isCompiling && this.compositeTemporal()) return;

    // 아직 샘플이 모자라면 래스터/저해상도 미리보기
    if (pt.samples < pt.minSamples) {
      if (this.settings.render.dynamicLowRes && !this.isCompiling) {
        // renderToCanvas=false 라 저해상도 패스는 여기서 직접 돌린다 (WebGLPathTracer 내부 로직과 동일)
        const low = (pt as any)._lowResPathTracer;
        const full = (pt as any)._pathTracer;
        if (low && full && low.samples < 1) {
          low.material = full.material;
          try {
            low.update();
          } catch {
            low._task = null;
          }
        }
        if (low && low.samples >= 1) {
          // 프리뷰도 에지 보존 필터(2회)로 정리해 "큰 픽셀 노이즈" 대신 부드러운 저해상 이미지를 보여준다
          let previewTex: Texture = low.target.texture;
          if (post.denoise !== 'off') {
            const lw = low.target.width;
            const lh = low.target.height;
            this.atrousLow.renderAux(this.scene, this.camera, lw, lh, `${this.auxKey}|low|${lw}x${lh}`);
            previewTex = this.atrousLow.filter(low.target.texture, 1, { ...DEFAULT_ATROUS, iterations: 2, lumSigma: post.atrousStrength, fadeSamples: 1e9 });
          }
          this.displayMat.map = previewTex;
          this.quad.material = this.displayMat;
          r.autoClear = true;
          r.clear();
          this.quad.render(r);
          return;
        }
      }
      this.renderRaster();
      return;
    }

    let mat: ShaderMaterial = this.displayMat;
    let map: Texture = pt.target.texture;
    const useAtrous = () => {
      const w = pt.target.width;
      const h = pt.target.height;
      this.atrous.renderAux(this.scene, this.camera, w, h, `${this.auxKey}|${w}x${h}`);
      this.auxDirty = false;
      const params: AtrousParams = { ...DEFAULT_ATROUS, fadeSamples: post.atrousFade, lumSigma: post.atrousStrength };
      map = this.atrous.filter(pt.target.texture, pt.samples, params);
    };
    if (post.denoise === 'bilateral') {
      mat = this.denoiseMat;
      (this.denoiseMat as any).map = pt.target.texture;
    } else if (post.denoise === 'atrous') {
      useAtrous();
    } else if (post.denoise === 'oidn') {
      if (this.oidn?.ready) {
        // 기하급수 스케줄: 첫 패스 4 spp, 이후 샘플이 2 배가 될 때마다(4·8·16·32·64…), 간격 상한은 oidnInterval.
        // 초반엔 한 패스마다 그림이 크게 좋아지고 후반엔 변화가 작으니 패스 수를 아낀다. 목표 spp 도달 시 마지막 패스.
        const v = this.oidnValidSamples;
        const maxS = this.settings.render.maxSamples;
        const due =
          (v < 0 && pt.samples >= 4) ||
          (v >= 0 && pt.samples >= Math.min(v * 2, v + post.oidnInterval)) ||
          (v >= 0 && maxS > 0 && pt.samples >= maxS && v < maxS);
        if (due && !this.oidnBusy) void this.runOidn();
      }
      if (this.oidnTexture && this.oidnValidSamples >= 0) {
        map = this.oidnTexture;
      } else {
        // OIDN 결과 전까지는 à-trous 로 보여준다
        useAtrous();
      }
    }
    if (mat === this.displayMat) this.displayMat.map = map;
    this.quad.material = mat;
    r.autoClear = true;
    r.clear();
    this.quad.render(r);
  }

  /* -------------------------------- 렌더샷 -------------------------------- */

  get isRenderingStill() {
    return this.stillActive;
  }

  cancelStill() {
    if (this.stillActive) this.stillCancel = true;
  }

  /**
   * 고해상도 렌더샷. 화면 캔버스를 잠시 목표 해상도로 바꿔 목표 샘플까지 누적한 뒤
   * (디노이즈 →) PNG/JPEG 로 인코딩하고 원래 상태로 복구한다. 진행은 'still-progress' 이벤트.
   * 취소하면 null 을 돌려준다.
   */
  async renderStill(opts: StillOptions): Promise<StillResult | null> {
    if (this.stillActive) throw new Error('이미 렌더샷을 진행 중입니다');
    if (!this.settings.render.pathTracing) throw new Error('Path Tracing 이 꺼져 있습니다');
    if (this.engine === 'webgpu' && this.rayzee) {
      this.stillActive = true;
      this.stillCancel = false;
      try {
        const res = await this.rayzee.renderStill(opts, (p) => this.emit('still-progress', p), () => this.stillCancel);
        if (res) this.emit('still-done', res);
        return res;
      } finally {
        this.stillActive = false;
        this.stillCancel = false;
      }
    }
    const width = Math.max(16, Math.floor(opts.width));
    const height = Math.max(16, Math.floor(opts.height));
    const target = Math.max(1, Math.floor(opts.samples));
    const spf = Math.max(1, opts.samplesPerFrame ?? 4);
    const denoiseMode: DenoiseMode = !opts.denoise || opts.denoise === 'current' ? this.settings.post.denoise : opts.denoise;
    const useTransparent = opts.background === 'transparent';

    this.stillActive = true;
    this.stillCancel = false;
    const r = this.renderer;
    const pt = this.pathTracer;

    // 현재 상태 저장
    const prevSize = new Vector2();
    r.getSize(prevSize);
    const prevPixelRatio = r.getPixelRatio();
    const prevAspect = this.camera.aspect;
    const prevScale = this.settings.render.renderScale;
    const prevBg = this.settings.environment.background;
    const prevDenoise = this.settings.post.denoise;
    const prevOidnInterval = this.settings.post.oidnInterval;
    const prevAutoRotate = this.controls.autoRotate;

    const t0 = performance.now();
    const progress = (phase: StillProgress['phase'], samples: number) => {
      const elapsed = performance.now() - t0;
      const ratio = Math.min(1, samples / target);
      const eta = ratio > 0.02 ? (elapsed / ratio) * (1 - ratio) : 0;
      this.emit('still-progress', { samples, target, ratio, elapsedMs: elapsed, etaMs: eta, phase } as StillProgress);
    };

    try {
      this.controls.autoRotate = false;
      // 해상도 전환 (CSS 크기는 그대로 → 화면엔 축소 미리보기가 보인다)
      r.setPixelRatio(1);
      r.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      pt.renderScale = 1;
      if (useTransparent && prevBg !== 'transparent') {
        this.settings.environment.background = 'transparent';
        this.applyEnvironmentParams();
      }
      // 렌더샷 중엔 OIDN 을 마지막에 한 번만 돌린다 (중간 실행은 낭비)
      this.settings.post.denoise = denoiseMode === 'oidn' ? 'off' : denoiseMode;
      pt.updateCamera();
      pt.reset();
      this.oidnValidSamples = -1;

      // 누적
      await new Promise<void>((resolve) => {
        const step = () => {
          if (this.stillCancel || this.disposed) return resolve();
          if (this.isCompiling) {
            this.safeRenderSample();
            requestAnimationFrame(step);
            return;
          }
          for (let i = 0; i < spf && pt.samples < target; i++) this.safeRenderSample();
          this.composite();
          progress('rendering', pt.samples);
          if (pt.samples >= target) resolve();
          else requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      if (this.stillCancel) return null;

      // 디노이즈 (OIDN 은 완료까지 대기)
      const finalSamples = pt.samples;
      if (denoiseMode === 'oidn') {
        progress('denoising', finalSamples);
        this.settings.post.denoise = 'oidn';
        await this.ensureOidn();
        if (this.oidn?.ready) {
          this.settings.post.oidnInterval = 1;
          await this.runOidn();
        }
        if (this.stillCancel) return null;
      }
      progress('encoding', finalSamples);
      this.composite();
      const format = opts.format ?? 'image/png';
      const dataUrl = r.domElement.toDataURL(format, opts.quality ?? 0.95);
      const blob = await (await fetch(dataUrl)).blob();
      const result: StillResult = {
        dataUrl,
        blob,
        width,
        height,
        samples: finalSamples,
        elapsedMs: performance.now() - t0,
        options: { ...opts, width, height, samples: target },
      };
      this.emit('still-done', result);
      return result;
    } finally {
      // 복구
      this.settings.post.denoise = prevDenoise;
      this.settings.post.oidnInterval = prevOidnInterval;
      if (useTransparent && prevBg !== 'transparent') {
        this.settings.environment.background = prevBg;
        this.applyEnvironmentParams();
      }
      r.setPixelRatio(prevPixelRatio);
      r.setSize(prevSize.x, prevSize.y, false);
      this.camera.aspect = prevAspect;
      this.camera.updateProjectionMatrix();
      pt.renderScale = prevScale;
      this.controls.autoRotate = prevAutoRotate;
      this.oidnValidSamples = -1;
      this.stillActive = false;
      this.stillCancel = false;
      this.resize();
      pt.reset();
    }
  }

  /* -------------------------------- 캡처 / 통계 -------------------------------- */

  /** 현재 화면을 PNG dataURL 로. 같은 태스크 안에서 다시 합성한 뒤 읽는다. */
  captureImage(type: 'image/png' | 'image/jpeg' = 'image/png', quality = 0.95): string {
    if (this.engine === 'webgpu' && this.rayzee) {
      // WebGPU 캔버스는 동기 toDataURL 이 마지막 프레임을 담지 못할 수 있다 — 정확한 저장은 captureBlob() 사용
      return this.rayzee.canvas.toDataURL(type, quality);
    }
    if (this.settings.render.pathTracing && !this.bvhBuilding) this.composite();
    else this.renderRaster();
    return this.renderer.domElement.toDataURL(type, quality);
  }

  /** 엔진 무관 비동기 캡처 (WebGPU 엔진에서는 Rayzee screenshot 사용) */
  async captureBlob(type: 'image/png' | 'image/jpeg' = 'image/png', quality = 0.95): Promise<Blob> {
    if (this.engine === 'webgpu' && this.rayzee) return this.rayzee.captureBlob(type, quality);
    const url = this.captureImage(type, quality);
    return (await fetch(url)).blob();
  }

  getStats(): ViewerStats {
    this.renderer.getDrawingBufferSize(this.sizeTmp);
    let denoiser: ViewerStats['denoiser'] = this.settings.post.denoise;
    if (denoiser === 'oidn') {
      if (this.oidnSupported === false) denoiser = 'oidn-unavailable';
      else if (!this.oidn?.ready) denoiser = 'oidn-loading';
    }
    if (this.engine === 'webgpu' && this.rayzee) {
      const rs = this.rayzee.getStats();
      const maxS = this.settings.render.maxSamples;
      const progressGpu = maxS > 0 ? Math.min(1, rs.samples / maxS) : 0;
      const phaseGpu: RenderPhase = rs.compiling ? 'compiling' : rs.denoising ? 'denoising' : rs.complete ? 'done' : rs.samples < 2 ? 'preview' : 'tracing';
      return {
        engine: 'webgpu',
        phase: phaseGpu,
        progress: progressGpu,
        samples: rs.samples,
        maxSamples: this.settings.render.maxSamples,
        fps: 0,
        triangles: this.model?.triangles ?? 0,
        meshes: this.model?.meshes ?? 0,
        materials: this.model?.materials.length ?? 0,
        resolution: [Math.floor(this.sizeTmp.x * this.settings.render.renderScale), Math.floor(this.sizeTmp.y * this.settings.render.renderScale)],
        compiling: rs.compiling,
        bvhBuilding: this.bvhBuilding,
        denoiser: rs.denoising ? 'oidn' : this.settings.post.denoise,
        modelName: this.model?.name ?? '',
        elapsedMs: performance.now() - this.renderStart,
        effectiveSamples: rs.samples,
        compileProgress: 0,
        compileElapsedMs: 0,
        compileRemainMs: 0,
        compileEstimateMeasured: false,
      };
    }
    const maxSamples = this.settings.render.maxSamples;
    const samples = this.pathTracer.samples;
    const progress = maxSamples > 0 ? Math.min(1, samples / maxSamples) : 0;
    const cp = this.getCompileProgress();
    let phase: RenderPhase = 'tracing';
    if (this.bvhBuilding || !this.ptReady) phase = 'building';
    else if (!this.settings.render.pathTracing) phase = 'raster';
    else if (this.isCompiling) phase = 'compiling';
    else if (this.interacting || samples < this.pathTracer.minSamples) phase = 'preview';
    else if (this.oidnBusy) phase = 'denoising';
    else if (maxSamples > 0 && samples >= maxSamples) phase = 'done';
    return {
      engine: 'webgl',
      phase,
      progress,
      samples,
      maxSamples,
      fps: this.fps,
      triangles: this.model?.triangles ?? 0,
      meshes: this.model?.meshes ?? 0,
      materials: this.model?.materials.length ?? 0,
      resolution: [Math.floor(this.sizeTmp.x * this.settings.render.renderScale), Math.floor(this.sizeTmp.y * this.settings.render.renderScale)],
      compiling: this.isCompiling,
      bvhBuilding: this.bvhBuilding,
      denoiser,
      modelName: this.model?.name ?? '',
      elapsedMs: performance.now() - this.renderStart,
      effectiveSamples: this.settings.render.temporal ? samples + this.temporal.meanHistWeight : samples,
      compileProgress: cp.ratio,
      compileElapsedMs: cp.elapsedMs,
      compileRemainMs: cp.remainMs,
      compileEstimateMeasured: cp.measured,
    };
  }

  get statusText() {
    return this.status;
  }

  /**
   * 첫 컴파일을 "딱 한 번" 으로 만든다. (실측: 이걸 안 하면 인텔 iGPU 새 프로필에서 첫 샘플까지 279 s,
   * 그중 128 s 는 버려지는 셰이더를 컴파일하는 시간이었다.)
   *
   * 원인 2가지 —
   *  ① `PhysicalPathTracingMaterial.onBeforeRender` 가 매 프레임 FEATURE_BACKGROUND_MAP / FEATURE_FOG 를 다시 계산한다.
   *     기본값은 (0, 1) 인데 우리 씬의 최종값은 (1, 0) 이라, 1차 컴파일이 끝나는 순간 디파인이 두 번 뒤집혀 전체 재컴파일이 2회 더 일어난다.
   *     → 컴파일이 시작되기 전에 최종값을 직접 박아넣고, onBeforeRender 가 되돌리지 못하게 감싼다.
   *  ② 저해상 프리뷰 트레이서(`_lowResPathTracer`)는 자기만의 재질(우리 패치가 없는 다른 소스 문자열)을 갖고 있어
   *     한 번이라도 그리면 또 다른 프로그램이 컴파일된다. → 처음부터 풀해상 재질을 공유시킨다.
   *
   * 배경은 항상 텍스처가 있고(색 배경은 colorBackground, 투명은 1×1 검정) 포그는 쓰지 않으므로 (1, 0) 이 항상 최종값이다.
   */
  private prepareShaderOnce() {
    const pt = this.pathTracer as any;
    const mat = pt._pathTracer?.material;
    if (!mat) return;
    // ① 최종 디파인을 컴파일 전에 확정 (needsUpdate 를 건드리지 않도록 직접 대입)
    mat.defines.FEATURE_BACKGROUND_MAP = 1;
    mat.defines.FEATURE_FOG = 0;
    // BVH 순회 스택은 기본 60 슬롯(=240 B) 을 프래그먼트마다 잡아 레지스터를 스크래치로 흘린다.
    // three-mesh-bvh 업스트림 측정으로 스택을 줄이면 macOS +43 %, Android +275 %.
    // 트리 깊이를 BVH_MAX_DEPTH 로 제한하고 스택은 그보다 크게 잡는다(부족하면 순회가 조용히 잘려 지오메트리가 사라진다).
    mat.defines.BVH_STACK_DEPTH = BVH_STACK_DEPTH;
    // 톤매핑/색공간은 three 의 프로그램 캐시 키에 들어가고 "캔버스인가 렌더타깃인가" 로 갈린다.
    // 이 재질은 항상 float 타깃에만 그리므로 고정해 변형이 늘지 않게 한다.
    mat.toneMapped = false;
    const origOnBeforeRender = mat.onBeforeRender?.bind(mat);
    mat.onBeforeRender = () => {
      origOnBeforeRender?.();
      // 포그는 이 뷰어에서 쓰지 않는다. 배경은 항상 텍스처가 있다 — 되돌려져 재컴파일되는 것을 막는다.
      mat.setDefine('FEATURE_FOG', 0);
      if (mat.backgroundMap) mat.setDefine('FEATURE_BACKGROUND_MAP', 1);
    };
    // ② 저해상 트레이서가 같은(패치된) 재질을 쓰게 해 셰이더 변형을 하나로
    if (pt._lowResPathTracer) pt._lowResPathTracer.material = mat;

    // ③ 컴파일 워밍업이 "실제로 쓰는" 변형을 만들게 한다.
    //    three.js 프로그램 캐시 키에는 출력 색공간·톤매핑이 들어가는데, 이 둘은 "캔버스에 그리는 중인가 / 렌더타깃에 그리는 중인가" 로 갈린다.
    //    라이브러리의 compileAsync 는 렌더타깃이 풀린 상태(= 캔버스 변형)로 컴파일하고, 정작 패스트레이싱은 float 타깃에 그린다
    //    → 서로 다른 변형이라 전체 컴파일을 한 번 더 한다. 워밍업 때 타깃을 걸어 같은 변형이 되게 한다.
    const ptr = pt._pathTracer;
    if (ptr?.compileMaterial) {
      const orig = ptr.compileMaterial.bind(ptr);
      ptr.compileMaterial = () => {
        const prev = this.renderer.getRenderTarget();
        if (ptr.target) this.renderer.setRenderTarget(ptr.target);
        try {
          return orig();
        } finally {
          this.renderer.setRenderTarget(prev);
        }
      };
    }
  }

  /* ---------------------- 컴파일 진행률(추정) ---------------------- */

  /** localStorage 키: GPU 문자열 + 셰이더 소스 길이 (빌드가 바뀌면 소스 길이도 대개 바뀐다) */
  private compileKey(): string {
    let gpu = 'unknown';
    try {
      const gl = this.renderer.getContext();
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) gpu = String(gl.getParameter((ext as any).UNMASKED_RENDERER_WEBGL));
    } catch {
      /* 확장 미지원 */
    }
    const src = (this.pathTracer as any)._pathTracer?.material?.fragmentShader?.length ?? 0;
    return `vringon-pt-compile:${gpu}:${src}`;
  }

  /** 이 기기의 지난 컴파일 실측값(ms). 없으면 백엔드로 추정한다. */
  private loadCompileEstimate(): number {
    try {
      const v = Number(localStorage.getItem(this.compileKey()));
      if (Number.isFinite(v) && v > 500) return v;
    } catch {
      /* 프라이빗 모드 등 */
    }
    // 첫 방문 기본값: Windows/ANGLE-D3D 경로(GLSL→HLSL→fxc)가 압도적으로 느리다.
    let gpu = '';
    try {
      const gl = this.renderer.getContext();
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) gpu = String(gl.getParameter((ext as any).UNMASKED_RENDERER_WEBGL));
    } catch {
      /* noop */
    }
    const angleD3D = /Direct3D|D3D11/i.test(gpu);
    const integrated = /Intel|UHD|Iris|Arc\(TM\)|Radeon\(TM\) Graphics|Vega \d Graphics/i.test(gpu);
    if (angleD3D) return integrated ? 150_000 : 60_000;
    return 20_000;
  }

  private saveCompileEstimate(ms: number) {
    try {
      localStorage.setItem(this.compileKey(), String(Math.round(ms)));
    } catch {
      /* noop */
    }
  }

  /**
   * 컴파일 진행률(0~1)과 남은 시간(ms). **셰이더 컴파일은 진짜 진행률을 알려주는 API 가 없다**
   * (KHR_parallel_shader_compile 은 완료 여부 boolean 뿐) — 그래서 "이 기기에서 지난번 걸린 시간" 대비 경과로 추정한다.
   * 추정을 넘기면 95 %에서 멈춰 기다리고, 실제 완료 시 100 % 로 스냅한다(거짓 완료 금지).
   */
  getCompileProgress(): { elapsedMs: number; estimateMs: number; ratio: number; remainMs: number; measured: boolean } {
    const elapsed = this.compileStartedAt ? performance.now() - this.compileStartedAt : 0;
    const est = this.compileEstimateMs || 60_000;
    const ratio = Math.min(0.95, elapsed / est);
    let measured = false;
    try {
      measured = Boolean(localStorage.getItem(this.compileKey()));
    } catch {
      /* noop */
    }
    return { elapsedMs: elapsed, estimateMs: est, ratio, remainMs: Math.max(0, est - elapsed), measured };
  }

  /** PT 셰이더를 컴파일해도 되는 시점인가(모델 + 환경맵 준비 완료) — 디파인이 확정된 뒤 1회만 컴파일하기 위함 */
  private get ptReady(): boolean {
    return Boolean(this.model) && Boolean(this.envTexture);
  }

  private get isCompiling(): boolean {
    return Boolean((this.pathTracer as any).isCompiling);
  }

  resetAccumulation() {
    this.rayzee?.resetAccumulation();
    this.pathTracer.reset();
    this.oidnValidSamples = -1;
    this.renderStart = performance.now();
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObs.disconnect();
    this.controls.dispose();
    this.clearModel();
    this.envTexture?.dispose();
    this.envBlurred?.dispose();
    this.envBlurGen.dispose();
    this.oidn?.dispose();
    this.oidnAux?.dispose();
    this.oidnTexture?.dispose();
    this.quad.dispose();
    this.displayMat.dispose();
    this.denoiseMat.dispose();
    this.atrous.dispose();
    this.atrousLow.dispose();
    this.rayzee?.dispose();
    (this.pathTracer as any)._pathTracer?.dispose?.();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

/* ------------------------------------------------------------------ */

function mergeSettings(base: ViewerSettings, patch?: Partial<ViewerSettings>): ViewerSettings {
  if (!patch) return base;
  const out = { ...base } as any;
  for (const key of Object.keys(patch) as (keyof ViewerSettings)[]) {
    out[key] = { ...(base as any)[key], ...(patch as any)[key] };
  }
  return out;
}

export { ENVIRONMENT_PRESETS, LIGHT_RIGS };
export type { EnvironmentPreset, LightRig, RigLight, LoadedModel };
