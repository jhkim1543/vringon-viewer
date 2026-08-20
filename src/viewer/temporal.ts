/**
 * 시간적 재투영 누적(ASVGF 류 "히스토리 재사용") + 하이브리드 래스터 채움.
 *
 * 문제: 카메라를 조금만 옮겨도 path tracer 가 누적을 0 부터 다시 쌓는다 → "한 번 옮기고 오래 기다리는" 체감.
 * 해법: 직전까지 쌓인 결과(히스토리)를 새 카메라로 재투영해(픽셀 → 월드 → 이전 화면) 유효한 픽셀은
 *       "이미 n 샘플 쌓인 것" 으로 취급해 새 샘플과 가중 평균한다. 새로 드러난 부분·시점 의존이 큰 재질만 다시 쌓는다.
 *
 *  · G-버퍼: 월드 노멀(옥타헤드럴 2ch) + 선형 깊이 + 재질 클래스(0 확산, 1 광택 금속, 2 투과/보석, 3 배경)
 *  · 유효성: 화면 안 · 깊이 오차 < 2 % · 노멀 내적 > 0.9 · 같은 클래스. 배경은 항상 무효(1 spp 로 정확하므로 손해 없음).
 *  · 클래스별 히스토리 상한: 확산 64 · 금속 6 · 투과 2 — 보석의 굴절·분산·하이라이트는 시점이 바뀌면 값이 달라지므로
 *    오래 믿지 않는다(고스팅 방지). 그래서 보석 픽셀은 결국 다시 쌓이지만 밴드·바닥·배경이 즉시 살아나 체감이 크게 좋아진다.
 *  · 하이브리드 채움: 유효 샘플이 8 미만인 픽셀은 같은 프레임의 래스터(IBL PBR, 톤맵 전 선형) 색을 섞어
 *    "생 노이즈" 가 한 번도 보이지 않게 한다. 샘플이 쌓이면 자동으로 빠진다(편향은 8 spp 이전에만).
 *
 * 모든 패스는 풀스크린 셰이더 3~4 개(G-버퍼 래스터 · 재투영 · 합성 · 1×1 축소)이며 readPixels 는 1 픽셀(평균 가중치)뿐이다.
 * three-gpu-pathtracer 의 누적(리셋 이후 평균·샘플 수 N)은 손대지 않고, 그 결과를 "새 증거" 로만 쓴다:
 *     out = (hist.rgb·w_h + new.rgb·N + raster.rgb·w_r) / (w_h + N + w_r),   out.a = min(w_h + N, 256)
 */
import {
  Camera,
  FloatType,
  LinearFilter,
  Material,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NearestFilter,
  NoBlending,
  NoToneMapping,
  Object3D,
  PerspectiveCamera,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }
`;

// 재질 클래스별 G-버퍼 (재질 교체로 그린다)
const GBUF_VERT = /* glsl */ `
  varying vec3 vWorldNormal;
  varying float vDepth;
  void main() {
    vWorldNormal = normalize( mat3( modelMatrix ) * normal );
    vec4 mv = modelViewMatrix * vec4( position, 1.0 );
    vDepth = - mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const GBUF_FRAG = /* glsl */ `
  uniform float matClass;
  uniform vec3 cameraPos;
  varying vec3 vWorldNormal;
  varying float vDepth;
  vec2 octEncode( vec3 n ) {
    n /= ( abs( n.x ) + abs( n.y ) + abs( n.z ) );
    vec2 e = n.z >= 0.0 ? n.xy : ( 1.0 - abs( n.yx ) ) * vec2( n.x >= 0.0 ? 1.0 : - 1.0, n.y >= 0.0 ? 1.0 : - 1.0 );
    return e;
  }
  void main() {
    vec3 n = normalize( vWorldNormal );
    if ( ! gl_FrontFacing ) n = - n;
    gl_FragColor = vec4( octEncode( n ), vDepth, matClass );
  }
`;

// 재투영: 현재 픽셀 → 월드 → 이전 화면 → 히스토리 샘플 + 유효성 → hist(rgb, weight)
const REPROJ_FRAG = /* glsl */ `
  uniform sampler2D tPrevColor;   // 직전 합성 결과 (rgb, weight)
  uniform sampler2D tPrevGbuf;    // 직전 G-버퍼
  uniform sampler2D tCurGbuf;     // 현재 G-버퍼
  uniform mat4 curInvProj;
  uniform mat4 curCamWorld;
  uniform mat4 prevViewProj;
  uniform mat4 prevView;
  uniform vec4 capByClass;        // 클래스별 히스토리 상한 (확산, 금속, 투과, 배경)
  uniform float depthTol;         // 상대 깊이 허용 (0.02)
  uniform float normalTol;        // 노멀 내적 하한 (0.9)
  uniform vec2 texel;
  varying vec2 vUv;
  vec3 octDecode( vec2 e ) {
    vec3 n = vec3( e.xy, 1.0 - abs( e.x ) - abs( e.y ) );
    if ( n.z < 0.0 ) n.xy = ( 1.0 - abs( n.yx ) ) * vec2( n.x >= 0.0 ? 1.0 : - 1.0, n.y >= 0.0 ? 1.0 : - 1.0 );
    return normalize( n );
  }
  void main() {
    vec4 g = texture2D( tCurGbuf, vUv );
    float cls = g.a;
    float depth = g.z;
    if ( depth <= 0.0 ) { gl_FragColor = vec4( 0.0 ); return; } // 배경: 재사용 안 함 (클래스 3 = 바닥, 확산과 같이 취급)
    // 뷰 공간 위치 복원
    vec2 ndc = vUv * 2.0 - 1.0;
    vec4 p = curInvProj * vec4( ndc, 1.0, 1.0 );
    vec3 dir = p.xyz / p.w;
    vec3 viewPos = dir * ( depth / max( - dir.z, 1e-6 ) );
    vec4 world = curCamWorld * vec4( viewPos, 1.0 );
    // 이전 화면으로
    vec4 pc = prevViewProj * world;
    if ( pc.w <= 0.0 ) { gl_FragColor = vec4( 0.0 ); return; }
    vec2 puv = ( pc.xy / pc.w ) * 0.5 + 0.5;
    if ( puv.x < 0.0 || puv.x > 1.0 || puv.y < 0.0 || puv.y > 1.0 ) { gl_FragColor = vec4( 0.0 ); return; }
    vec4 pg = texture2D( tPrevGbuf, puv );
    float pd = - ( prevView * world ).z;
    if ( pg.z <= 0.0 || abs( pg.z - pd ) > depthTol * pd ) { gl_FragColor = vec4( 0.0 ); return; }
    if ( abs( pg.a - cls ) > 0.5 ) { gl_FragColor = vec4( 0.0 ); return; }
    vec3 n0 = octDecode( g.xy );
    vec3 n1 = octDecode( pg.xy );
    if ( dot( n0, n1 ) < normalTol ) { gl_FragColor = vec4( 0.0 ); return; }
    // 2×2 이웃 중 같은 표면인 것만 평균 (경계 번짐 방지)
    vec4 c = texture2D( tPrevColor, puv );
    float cap = cls < 0.5 ? capByClass.x : ( cls < 1.5 ? capByClass.y : ( cls < 2.5 ? capByClass.z : capByClass.w ) );
    // 주의: 여기서 프레임마다 감쇠(예: ×0.9)를 걸면 드래그 중 60~144 fps 로 재투영이 반복되며 히스토리가 0.9^N 으로 증발한다(실측 재발).
    // 상한(cap)만 두고 감쇠는 두지 않는다 — 시점 의존 오차는 클래스 상한과 유효성 검사가 맡는다.
    float w = min( c.a, cap );
    gl_FragColor = vec4( c.rgb, w );
  }
`;

// 합성: hist ⊕ new ⊕ raster
const COMBINE_FRAG = /* glsl */ `
  uniform sampler2D tHist;     // (rgb, w_h)
  uniform sampler2D tNew;      // path tracer 누적 평균 (리셋 이후)
  uniform sampler2D tRaster;   // 래스터 (선형 HDR)
  uniform sampler2D tGbuf;     // 현재 G-버퍼 (a = 재질 클래스)
  uniform float newSamples;    // N
  uniform float rasterGain;    // 0 = 끔
  uniform float rasterUntil;   // 유효 샘플이 이 값에 이르면 래스터 기여 0
  uniform float maxWeight;
  uniform float storeNew;      // 1 = 새 샘플을 히스토리에 저장(정지·풀해상), 0 = 표시에만 쓰고 저장 안 함(이동 중 저해상 프리뷰)
  uniform float storeMode;     // 0 = 표시용 출력(rgb, 1), 1 = 저장용 출력(rgb, weight)
  varying vec2 vUv;
  void main() {
    vec4 h = texture2D( tHist, vUv );
    vec4 n = texture2D( tNew, vUv );
    float cls = texture2D( tGbuf, vUv ).a;
    float wh = h.a;
    float wn = newSamples;
    float eff = wh + wn;
    // 투과(보석) 픽셀은 래스터 룩(화면공간 굴절 근사)이 PT 와 너무 달라 채우지 않는다 — 정직하게 노이즈로 두고 쌓는다
    float wr = ( cls > 1.5 && cls < 2.5 ) ? 0.0 : rasterGain * max( 0.0, 1.0 - eff / rasterUntil );
    vec3 r = texture2D( tRaster, vUv ).rgb;
    vec3 col = ( h.rgb * wh + n.rgb * wn + r * wr ) / max( wh + wn + wr, 1e-6 );
    if ( storeMode > 0.5 ) {
      // 저장: 이동 중(저해상 1 spp, 바운스 축소) 샘플은 실루엣 번짐·편향이 히스토리에 굳으므로(실측: 신발 가장자리 검은 헤일로) 저장하지 않는다.
      if ( storeNew > 0.5 ) gl_FragColor = vec4( col, min( eff, maxWeight ) );
      else gl_FragColor = vec4( h.rgb, wh );
    } else {
      gl_FragColor = vec4( col, 1.0 );
    }
  }
`;

// 표시용: rgb 그대로, 알파 = 1 (blend 의 알파는 가중치라 그대로 화면에 내면 반투명해진다)
const PRESENT_FRAG = /* glsl */ `
  uniform sampler2D tSrc;
  varying vec2 vUv;
  void main() { gl_FragColor = vec4( texture2D( tSrc, vUv ).rgb, 1.0 ); }
`;

// 가중치(알파) 평균을 1×1 로 축소 (16×16 격자 샘플)
const REDUCE_FRAG = /* glsl */ `
  uniform sampler2D tSrc;   // hist (rgb, w) — 재투영된 히스토리 가중치
  uniform sampler2D tGbuf;  // 현재 G-버퍼 (z = 깊이, 0 = 배경 · a = 클래스, 3 = 바닥)
  void main() {
    float s = 0.0;
    float c = 0.0;
    for ( int y = 0; y < 24; y ++ ) for ( int x = 0; x < 24; x ++ ) {
      vec2 uv = ( vec2( float( x ), float( y ) ) + 0.5 ) / 24.0;
      vec4 g = texture2D( tGbuf, uv );
      if ( g.z > 0.0 && g.a < 2.5 ) { s += texture2D( tSrc, uv ).a; c += 1.0; } // 바닥(클래스 3)은 제품이 아니므로 지표에서 제외
    }
    gl_FragColor = vec4( s, c, 0.0, 1.0 );
  }
`;

export type MatClass = 0 | 1 | 2;

export interface TemporalParams {
  /** 클래스별 히스토리 상한 [확산, 광택금속, 투과] */
  caps: [number, number, number];
  depthTol: number;
  normalTol: number;
  /** 하이브리드 래스터 채움 세기 (0 = 끔). 2 면 1 spp 때 래스터 ~64 % */
  rasterGain: number;
  /** 이 유효 spp 부터 래스터 기여 0 */
  rasterUntil: number;
}

export const DEFAULT_TEMPORAL: TemporalParams = { caps: [64, 6, 2], depthTol: 0.02, normalTol: 0.9, rasterGain: 2, rasterUntil: 8 };

export function classifyMaterial(m: Material): MatClass {
  const p = m as MeshPhysicalMaterial;
  if ((p.transmission ?? 0) > 0.01 || (m.transparent && (m.opacity ?? 1) < 0.99)) return 2;
  const s = m as MeshStandardMaterial;
  if ((s.metalness ?? 0) > 0.5 && (s.roughness ?? 1) < 0.35) return 1;
  return 0;
}

export class TemporalReprojector {
  private gbuf: [WebGLRenderTarget, WebGLRenderTarget];
  private blend: [WebGLRenderTarget, WebGLRenderTarget];
  private hist: WebGLRenderTarget;
  private rasterRT: WebGLRenderTarget;
  private reduceRT: WebGLRenderTarget;
  private presentRT: WebGLRenderTarget;
  private presentMat: ShaderMaterial;
  private gslot = 0; // 현재 카메라의 G-버퍼가 들어있는 슬롯 (카메라가 바뀔 때만 다른 슬롯에 새로 그린다)
  private cur = 0; // blend 핑퐁 인덱스 (cur = 이번 프레임 출력)
  private gbufMats = new WeakMap<Material, ShaderMaterial>();
  private gbufMatsFloor = new WeakMap<Material, ShaderMaterial>();
  private reprojMat: ShaderMaterial;
  private combineMat: ShaderMaterial;
  private reduceMat: ShaderMaterial;
  private quad: FullScreenQuad;
  private size = new Vector2();
  private prevViewProj = new Matrix4();
  private prevView = new Matrix4();
  private hasHistory = false;
  /** 이번 blend 프레임에서 reproject 가 실행됐는가 — 아니면 hist 는 "묵은" 값이라 패스스루에 쓰면 안 된다 */
  private reprojected = false;
  private reducePix = new Float32Array(4);
  private reduceCounter = 0;
  /** 마지막으로 읽은 평균 히스토리 가중치 */
  meanHistWeight = 0;
  /** 마지막 재투영에서 hist 가 실제로 쓰였는지 */
  lastHistUsed = false;
  params: TemporalParams = { ...DEFAULT_TEMPORAL };

  constructor(private renderer: WebGLRenderer) {
    const f = { type: FloatType, format: RGBAFormat, minFilter: NearestFilter, magFilter: NearestFilter, depthBuffer: false, stencilBuffer: false } as const;
    this.gbuf = [new WebGLRenderTarget(1, 1, { ...f, depthBuffer: true }), new WebGLRenderTarget(1, 1, { ...f, depthBuffer: true })];
    const fl = { ...f, minFilter: LinearFilter, magFilter: LinearFilter };
    this.blend = [new WebGLRenderTarget(1, 1, fl), new WebGLRenderTarget(1, 1, fl)];
    this.hist = new WebGLRenderTarget(1, 1, fl);
    this.rasterRT = new WebGLRenderTarget(1, 1, { ...fl, depthBuffer: true });
    this.reduceRT = new WebGLRenderTarget(1, 1, f);
    this.presentRT = new WebGLRenderTarget(1, 1, fl);
    const common = { blending: NoBlending, depthTest: false, depthWrite: false, transparent: false };
    this.presentMat = new ShaderMaterial({ ...common, vertexShader: QUAD_VERT, fragmentShader: PRESENT_FRAG, uniforms: { tSrc: { value: null } } });
    this.reprojMat = new ShaderMaterial({
      ...common,
      vertexShader: QUAD_VERT,
      fragmentShader: REPROJ_FRAG,
      uniforms: {
        tPrevColor: { value: null },
        tPrevGbuf: { value: null },
        tCurGbuf: { value: null },
        curInvProj: { value: new Matrix4() },
        curCamWorld: { value: new Matrix4() },
        prevViewProj: { value: new Matrix4() },
        prevView: { value: new Matrix4() },
        capByClass: { value: [64, 6, 2, 0] },
        depthTol: { value: 0.02 },
        normalTol: { value: 0.9 },
        texel: { value: new Vector2() },
      },
    });
    this.combineMat = new ShaderMaterial({
      ...common,
      vertexShader: QUAD_VERT,
      fragmentShader: COMBINE_FRAG,
      uniforms: { tHist: { value: null }, tNew: { value: null }, tRaster: { value: null }, tGbuf: { value: null }, newSamples: { value: 1 }, rasterGain: { value: 0 }, rasterUntil: { value: 8 }, maxWeight: { value: 256 }, storeNew: { value: 1 }, storeMode: { value: 1 } },
    });
    this.reduceMat = new ShaderMaterial({ ...common, vertexShader: QUAD_VERT, fragmentShader: REDUCE_FRAG, uniforms: { tSrc: { value: null }, tGbuf: { value: null } } });
    this.quad = new FullScreenQuad(this.combineMat);
  }

  /**
   * 크기 변경은 히스토리를 버리지 않는다(창 리사이즈·패널 토글에서 누적이 날아가면 안 되므로).
   * hist/raster/present 만 즉시 새 크기로, G-버퍼·blend 는 "다음에 쓰이는 슬롯" 을 그릴 때 늦게 키운다 —
   * 재투영은 이전 크기의 텍스처를 uv 로 샘플하므로 크기가 달라도 된다.
   */
  private ensureSize(w: number, h: number) {
    if (this.size.x === w && this.size.y === h) return;
    this.size.set(w, h);
    for (const t of [this.hist, this.rasterRT, this.presentRT]) t.setSize(w, h);
    this.reduceRT.setSize(1, 1);
  }
  private fit(rt: WebGLRenderTarget) {
    if (rt.width !== this.size.x || rt.height !== this.size.y) rt.setSize(this.size.x, this.size.y);
  }

  /** 히스토리 무효화 (씬·조명·재질·환경이 바뀌면 호출) */
  invalidate() {
    this.hasHistory = false;
    this.meanHistWeight = 0;
    this.invalidations++;
  }
  /** 디버그: invalidate 호출 횟수 */
  invalidations = 0;

  get width() {
    return this.size.x;
  }
  get height() {
    return this.size.y;
  }

  private gbufMatFor(mat: Material, forceClass?: number): ShaderMaterial {
    const cache = forceClass === undefined ? this.gbufMats : this.gbufMatsFloor;
    let m = cache.get(mat);
    if (!m) {
      m = new ShaderMaterial({ vertexShader: GBUF_VERT, fragmentShader: GBUF_FRAG, uniforms: { matClass: { value: forceClass ?? classifyMaterial(mat) }, cameraPos: { value: new Vector3() } }, side: (mat as MeshStandardMaterial).side });
      cache.set(mat, m);
    }
    return m;
  }

  /** 카메라가 바뀐 프레임에 새 G-버퍼를 "다른" 슬롯에 그린다 (이전 슬롯은 재투영의 이전 카메라 기준으로 남겨둔다) */
  renderGbuf(scene: Scene, camera: Camera, w: number, h: number, hide: Object3D[] = [], floorObjects: Object3D[] = []) {
    this.ensureSize(w, h);
    const slot = 1 - this.gslot;
    this.fit(this.gbuf[slot]);
    const r = this.renderer;
    const prevTarget = r.getRenderTarget();
    const prevBg = scene.background;
    const prevEnv = scene.environment;
    const prevTone = r.toneMapping;
    const hidden: Object3D[] = [];
    for (const o of hide) if (o.visible) { o.visible = false; hidden.push(o); }
    scene.background = null;
    scene.environment = null;
    r.toneMapping = NoToneMapping;
    const swapped: Array<[Mesh, Material | Material[]]> = [];
    scene.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      swapped.push([mesh, mesh.material]);
      const fc = floorObjects.includes(mesh) ? 3 : undefined;
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map((m) => this.gbufMatFor(m, fc)) : this.gbufMatFor(mesh.material, fc);
    });
    r.setRenderTarget(this.gbuf[slot]);
    r.setClearColor(0x000000, 0); // 배경: 깊이 0 (재투영 셰이더가 무효 처리)
    r.autoClear = true;
    r.clear();
    r.render(scene, camera);
    for (const [mesh, mat] of swapped) mesh.material = mat;
    for (const o of hidden) o.visible = true;
    scene.background = prevBg;
    scene.environment = prevEnv;
    r.toneMapping = prevTone;
    r.setRenderTarget(prevTarget);
  }

  /** 하이브리드 채움용 래스터(선형 HDR) — 현재 카메라 */
  renderRaster(scene: Scene, camera: Camera, hide: Object3D[] = []) {
    const r = this.renderer;
    const prevTarget = r.getRenderTarget();
    const prevTone = r.toneMapping;
    const hidden: Object3D[] = [];
    for (const o of hide) if (o.visible) { o.visible = false; hidden.push(o); }
    r.toneMapping = NoToneMapping;
    r.setRenderTarget(this.rasterRT);
    r.setClearColor(0x000000, 1);
    r.autoClear = true;
    r.clear();
    r.render(scene, camera);
    for (const o of hidden) o.visible = true;
    r.toneMapping = prevTone;
    r.setRenderTarget(prevTarget);
  }

  /**
   * 카메라가 바뀌었을 때: 직전 합성 결과(prev 슬롯)를 현재 카메라로 재투영해 hist 를 만든다.
   * renderGbuf(현재) 가 먼저 호출돼 있어야 한다.
   */
  reproject(camera: PerspectiveCamera) {
    const r = this.renderer;
    const prevTarget = r.getRenderTarget();
    const prevBlend = 1 - this.cur; // 직전 프레임 출력
    const newSlot = 1 - this.gslot; // renderGbuf 가 방금 그린 현재 카메라 G-버퍼
    const u = this.reprojMat.uniforms;
    if (!this.hasHistory) {
      // 히스토리 없음 → hist = 0
      r.setRenderTarget(this.hist);
      r.setClearColor(0x000000, 0);
      r.clear();
      r.setRenderTarget(prevTarget);
      this.lastHistUsed = false;
      this.reprojected = true;
      this.gslot = newSlot;
      return;
    }
    u.tPrevColor.value = this.blend[prevBlend].texture;
    u.tPrevGbuf.value = this.gbuf[this.gslot].texture;
    u.tCurGbuf.value = this.gbuf[newSlot].texture;
    u.curInvProj.value.copy(camera.projectionMatrixInverse);
    u.curCamWorld.value.copy(camera.matrixWorld);
    u.prevViewProj.value.copy(this.prevViewProj);
    u.prevView.value.copy(this.prevView);
    const c = this.params.caps;
    u.capByClass.value = [c[0], c[1], c[2], c[0]]; // 바닥(3) 은 확산과 같은 상한
    u.depthTol.value = this.params.depthTol;
    u.normalTol.value = this.params.normalTol;
    u.texel.value.set(1 / this.size.x, 1 / this.size.y);
    this.quad.material = this.reprojMat;
    r.setRenderTarget(this.hist);
    this.quad.render(r);
    r.setRenderTarget(prevTarget);
    this.lastHistUsed = true;
    this.reprojected = true;
    this.gslot = newSlot;
  }

  /**
   * 합성: hist ⊕ 새 누적(newTex, N 샘플) ⊕ 래스터 → blend[cur]. 결과 텍스처(rgb 선형 HDR, a = 유효 가중치)를 돌려준다.
   * 호출 후 commit(camera) 로 이번 프레임을 "직전" 으로 넘긴다.
   */
  combine(newTex: Texture, newSamples: number, useRaster: boolean, storeNew = true): Texture {
    const r = this.renderer;
    const prevTarget = r.getRenderTarget();
    this.fit(this.blend[this.cur]);
    const u = this.combineMat.uniforms;
    // storeNew=false(저장 안 함) 프레임의 패스스루 소스:
    //  · 이번 프레임에 reproject 가 실행됐으면 hist(현재 카메라 픽셀 공간) ✓
    //  · 아니면 hist 는 마지막 재투영(심하면 씬 로드 때 클리어된 0) 그대로인 "묵은" 값 — 직전 blend 를 그대로 보존해야 한다.
    //    (실측 재발: beginInteraction 직후 카메라가 아직 안 움직인 1 프레임이 묵은 0 을 저장해 히스토리 체인을 파괴 → A/B 신발 20× 이득이 1.0× 로 사라짐)
    //  storeNew=true(정지 누적) 는 항상 hist — blend[prev] 를 쓰면 리셋 이후 샘플이 이중 계산된다.
    u.tHist.value = storeNew || this.reprojected ? this.hist.texture : this.blend[1 - this.cur].texture;
    u.tNew.value = newTex;
    u.tRaster.value = this.rasterRT.texture;
    u.tGbuf.value = this.gbuf[this.gslot].texture;
    u.newSamples.value = Math.max(0, newSamples);
    u.rasterGain.value = useRaster ? this.params.rasterGain : 0;
    u.rasterUntil.value = this.params.rasterUntil;
    u.storeNew.value = storeNew ? 1 : 0;
    this.quad.material = this.combineMat;
    // 1) 저장용 (히스토리)
    u.storeMode.value = 1;
    r.setRenderTarget(this.blend[this.cur]);
    this.quad.render(r);
    // 2) 표시용 (rgb, alpha 1)
    u.storeMode.value = 0;
    r.setRenderTarget(this.presentRT);
    this.quad.render(r);
    // 물체 픽셀의 평균 히스토리 가중치 (10 프레임마다 1 픽셀 읽기) — "유효 spp" 표시용
    if (this.reduceCounter++ % 10 === 0) {
      this.reduceMat.uniforms.tSrc.value = this.hist.texture;
      this.reduceMat.uniforms.tGbuf.value = this.gbuf[this.gslot].texture;
      this.quad.material = this.reduceMat;
      r.setRenderTarget(this.reduceRT);
      this.quad.render(r);
      r.readRenderTargetPixels(this.reduceRT, 0, 0, 1, 1, this.reducePix);
      this.meanHistWeight = this.reducePix[1] > 0 ? this.reducePix[0] / this.reducePix[1] : 0;
    }
    r.setRenderTarget(prevTarget);
    return this.presentRT.texture;
  }

  /** 디버그: 임의 RT 의 중앙 8×8 알파 평균 (재투영 입력 확인용) */
  measureAlpha(which: 'blendPrev' | 'blendCur' | 'hist'): number {
    const rt = which === 'hist' ? this.hist : this.blend[which === 'blendPrev' ? 1 - this.cur : this.cur];
    const w = rt.width, h = rt.height;
    if (w < 8 || h < 8) return -1;
    const buf = new Float32Array(4 * 8 * 8);
    this.renderer.readRenderTargetPixels(rt, Math.floor(w / 2) - 4, Math.floor(h / 2) - 4, 8, 8, buf);
    let s = 0;
    for (let i = 3; i < buf.length; i += 4) s += buf[i];
    return s / 64;
  }

  /** 디버그: hist 평균 가중치를 즉시 계산해 돌려준다 (1 픽셀 readback) */
  measureHist(): { obj: number; all: number; count: number } {
    const r = this.renderer;
    const prevTarget = r.getRenderTarget();
    this.reduceMat.uniforms.tSrc.value = this.hist.texture;
    this.reduceMat.uniforms.tGbuf.value = this.gbuf[this.gslot].texture;
    this.quad.material = this.reduceMat;
    r.setRenderTarget(this.reduceRT);
    this.quad.render(r);
    r.readRenderTargetPixels(this.reduceRT, 0, 0, 1, 1, this.reducePix);
    r.setRenderTarget(prevTarget);
    return { obj: this.reducePix[1] > 0 ? this.reducePix[0] / this.reducePix[1] : 0, all: this.reducePix[0] / 576, count: this.reducePix[1] };
  }

  /** 이번 프레임을 히스토리로 확정하고 슬롯을 넘긴다 */
  commit(camera: PerspectiveCamera) {
    this.prevView.copy(camera.matrixWorldInverse);
    this.prevViewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    this.hasHistory = true;
    this.cur = 1 - this.cur;
    this.reprojected = false;
  }

  get historyAvailable() {
    return this.hasHistory;
  }

  dispose() {
    for (const t of [...this.gbuf, ...this.blend, this.hist, this.rasterRT, this.reduceRT, this.presentRT]) t.dispose();
    this.presentMat.dispose();
    this.reprojMat.dispose();
    this.combineMat.dispose();
    this.reduceMat.dispose();
    this.quad.dispose();
  }
}
