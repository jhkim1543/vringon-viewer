import {
  Camera,
  DoubleSide,
  FloatType,
  LinearFilter,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NearestFilter,
  NoBlending,
  NoToneMapping,
  Object3D,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  UnsignedByteType,
  Vector2,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

/**
 * SVGF 계열 시공간 디노이저의 "공간" 절반 — À-trous 웨이블릿 에지 보존 필터.
 *
 * 목적: 카메라를 멈춘 직후 수 spp 만으로도 깨끗한 화면을 보여 "노이즈가 사라지는 체감 속도" 를 올린다.
 * 경로추적 누적 평균(선형 HDR)을 입력으로 받아,
 *   1) 알베도로 나눠(demodulate) 조도(irradiance)만 남기고   — 텍스처 디테일 보존
 *   2) 래스터 G-버퍼(뷰공간 노멀 + 선형 깊이) 로 에지를 지키며 5×5 B3-spline 커널을 1,2,4,8 스텝으로 4회 적용
 *   3) 다시 알베도를 곱하고, spp 가 쌓일수록 원본과 섞어 필터를 자연스럽게 걷어낸다(편향 제거).
 * 휘도 허용폭은 1/√spp 로 줄어들어 누적이 진행될수록 필터가 약해진다.
 * Rayzee(ASVGF)·SVGF 논문의 공간 필터와 같은 구조이며, 시간적 재투영은 정적 씬+카메라 정지 누적이라 누적 자체가 대신한다.
 *
 * 모든 단계가 GPU 안에서만 돌고(readPixels 없음) 풀스크린 패스 6회라 내장 GPU 에서도 수 ms 다.
 */

const GBUFFER_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying float vDepth;
  void main() {
    vNormal = normalize( normalMatrix * normal );
    vec4 mv = modelViewMatrix * vec4( position, 1.0 );
    vDepth = - mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const GBUFFER_FRAG = /* glsl */ `
  varying vec3 vNormal;
  varying float vDepth;
  void main() {
    vec3 n = normalize( vNormal );
    if ( ! gl_FrontFacing ) n = - n;
    gl_FragColor = vec4( n, vDepth );
  }
`;

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }
`;

// 알베도 나누기: irradiance = color / albedo (배경·검정 알베도는 그대로)
const DEMOD_FRAG = /* glsl */ `
  uniform sampler2D tColor;
  uniform sampler2D tAlbedo;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D( tColor, vUv );
    vec3 a = texture2D( tAlbedo, vUv ).rgb;
    float m = max( a.r, max( a.g, a.b ) );
    vec3 alb = m > 0.02 ? max( a, vec3( 0.02 ) ) : vec3( 1.0 );
    gl_FragColor = vec4( c.rgb / alb, c.a );
  }
`;

const ATROUS_FRAG = /* glsl */ `
  uniform sampler2D tColor;   // demodulated irradiance
  uniform sampler2D tGbuf;    // normal.xyz (view), linear depth (0 = background)
  uniform vec2 texel;
  uniform float stepSize;
  uniform float sigmaL;       // 휘도 허용폭 (상대값)
  uniform float sigmaZ;
  uniform float sigmaN;
  varying vec2 vUv;
  float lum( vec3 c ) { return dot( c, vec3( 0.2126, 0.7152, 0.0722 ) ); }
  void main() {
    const float h[5] = float[5]( 1.0 / 16.0, 1.0 / 4.0, 3.0 / 8.0, 1.0 / 4.0, 1.0 / 16.0 );
    vec4 cc = texture2D( tColor, vUv );
    vec4 gc = texture2D( tGbuf, vUv );
    bool bgC = gc.a <= 0.0;
    float lc = lum( cc.rgb );
    vec4 sum = vec4( 0.0 );
    float wsum = 0.0;
    for ( int dy = - 2; dy <= 2; dy ++ ) {
      for ( int dx = - 2; dx <= 2; dx ++ ) {
        vec2 uv = vUv + vec2( float( dx ), float( dy ) ) * stepSize * texel;
        vec4 c = texture2D( tColor, uv );
        vec4 g = texture2D( tGbuf, uv );
        bool bg = g.a <= 0.0;
        if ( bg != bgC ) continue;
        float w = h[ dx + 2 ] * h[ dy + 2 ];
        if ( ! bgC ) {
          float wn = pow( max( dot( gc.xyz, g.xyz ), 0.0 ), sigmaN );
          float wz = exp( - abs( g.a - gc.a ) / ( sigmaZ * max( gc.a, 1e-3 ) * max( stepSize, 1.0 ) ) );
          w *= wn * wz;
        }
        float wl = exp( - abs( lum( c.rgb ) - lc ) / ( sigmaL * ( lc + 0.05 ) ) );
        w *= wl;
        sum += c * w;
        wsum += w;
      }
    }
    gl_FragColor = sum / max( wsum, 1e-6 );
  }
`;

// 알베도 재곱 + 원본과 혼합 (spp 가 쌓일수록 원본 비중↑)
const REMOD_FRAG = /* glsl */ `
  uniform sampler2D tFiltered;
  uniform sampler2D tAlbedo;
  uniform sampler2D tRaw;
  uniform float blend; // 0 = 필터 100%, 1 = 원본 100%
  varying vec2 vUv;
  void main() {
    vec4 f = texture2D( tFiltered, vUv );
    vec3 a = texture2D( tAlbedo, vUv ).rgb;
    float m = max( a.r, max( a.g, a.b ) );
    vec3 alb = m > 0.02 ? max( a, vec3( 0.02 ) ) : vec3( 1.0 );
    vec4 raw = texture2D( tRaw, vUv );
    vec3 col = mix( f.rgb * alb, raw.rgb, blend );
    gl_FragColor = vec4( col, raw.a );
  }
`;

export interface AtrousParams {
  /** 반복 횟수(스텝 1,2,4,8,…) 기본 4 */
  iterations: number;
  /** 휘도 허용 기본 계수 — sigmaL = lumSigma / sqrt(spp). 기본 2.0 */
  lumSigma: number;
  /** 깊이 허용(상대) 기본 0.05 */
  depthSigma: number;
  /** 노멀 지수 기본 64 */
  normalPower: number;
  /** 이 spp 에 도달하면 필터가 완전히 빠진다. 기본 128 */
  fadeSamples: number;
}

export const DEFAULT_ATROUS: AtrousParams = { iterations: 4, lumSigma: 2.0, depthSigma: 0.05, normalPower: 64, fadeSamples: 128 };

export class AtrousDenoiser {
  private gbufTarget: WebGLRenderTarget;
  private albedoTarget: WebGLRenderTarget;
  private ping: WebGLRenderTarget;
  private pong: WebGLRenderTarget;
  private out: WebGLRenderTarget;
  private gbufMat = new ShaderMaterial({ vertexShader: GBUFFER_VERT, fragmentShader: GBUFFER_FRAG, side: DoubleSide });
  private demodMat: ShaderMaterial;
  private atrousMat: ShaderMaterial;
  private remodMat: ShaderMaterial;
  private quad: FullScreenQuad;
  private albedoCache = new WeakMap<Material, MeshBasicMaterial>();
  private size = new Vector2();
  /** 마지막으로 G-버퍼를 그린 카메라/씬 버전 — 같은 프레임에 다시 그리지 않기 위함 */
  private gbufKey = '';

  constructor(private renderer: WebGLRenderer) {
    const f = { type: FloatType, format: RGBAFormat, minFilter: NearestFilter, magFilter: NearestFilter, depthBuffer: false, stencilBuffer: false } as const;
    this.gbufTarget = new WebGLRenderTarget(1, 1, { ...f, depthBuffer: true });
    this.albedoTarget = new WebGLRenderTarget(1, 1, { type: UnsignedByteType, format: RGBAFormat, colorSpace: SRGBColorSpace, minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: true, stencilBuffer: false });
    this.ping = new WebGLRenderTarget(1, 1, f);
    this.pong = new WebGLRenderTarget(1, 1, f);
    this.out = new WebGLRenderTarget(1, 1, f);
    const common = { blending: NoBlending, depthTest: false, depthWrite: false, transparent: false };
    this.demodMat = new ShaderMaterial({ ...common, vertexShader: QUAD_VERT, fragmentShader: DEMOD_FRAG, uniforms: { tColor: { value: null }, tAlbedo: { value: null } } });
    this.atrousMat = new ShaderMaterial({
      ...common,
      vertexShader: QUAD_VERT,
      fragmentShader: ATROUS_FRAG,
      uniforms: { tColor: { value: null }, tGbuf: { value: null }, texel: { value: new Vector2() }, stepSize: { value: 1 }, sigmaL: { value: 1 }, sigmaZ: { value: 0.05 }, sigmaN: { value: 64 } },
    });
    this.remodMat = new ShaderMaterial({ ...common, vertexShader: QUAD_VERT, fragmentShader: REMOD_FRAG, uniforms: { tFiltered: { value: null }, tAlbedo: { value: null }, tRaw: { value: null }, blend: { value: 0 } } });
    this.quad = new FullScreenQuad(this.demodMat);
  }

  private albedoFor(mat: Material): MeshBasicMaterial {
    let m = this.albedoCache.get(mat);
    if (!m) {
      const src = mat as MeshStandardMaterial;
      m = new MeshBasicMaterial({ color: src.color ?? 0xffffff, map: src.map ?? null, vertexColors: src.vertexColors, side: src.side, alphaTest: src.alphaTest, alphaMap: src.alphaMap ?? null, transparent: false });
      this.albedoCache.set(mat, m);
    }
    return m;
  }

  private ensureSize(w: number, h: number) {
    if (this.size.x === w && this.size.y === h) return;
    this.size.set(w, h);
    for (const t of [this.gbufTarget, this.albedoTarget, this.ping, this.pong, this.out]) t.setSize(w, h);
    this.gbufKey = '';
  }

  /** G-버퍼(노멀·깊이)와 알베도를 래스터로 그린다. 카메라·씬이 같으면 건너뛴다. */
  renderAux(scene: Scene, camera: Camera, w: number, h: number, key: string, hideObjects: Object3D[] = []) {
    this.ensureSize(w, h);
    if (this.gbufKey === key) return;
    this.gbufKey = key;
    const r = this.renderer;
    const prevTarget = r.getRenderTarget();
    const prevTone = r.toneMapping;
    const prevBg = scene.background;
    const prevEnv = scene.environment;
    const prevOverride = scene.overrideMaterial;
    const prevAutoClear = r.autoClear;
    const hidden: Object3D[] = [];
    for (const o of hideObjects) if (o.visible) { o.visible = false; hidden.push(o); }
    r.toneMapping = NoToneMapping;
    scene.background = null;
    scene.environment = null;
    r.autoClear = true;

    // G-buffer
    scene.overrideMaterial = this.gbufMat;
    r.setRenderTarget(this.gbufTarget);
    r.setClearColor(0x000000, 0);
    r.clear();
    r.render(scene, camera);
    scene.overrideMaterial = prevOverride;

    // albedo (재질 임시 교체)
    const swapped: Array<[Mesh, Material | Material[]]> = [];
    scene.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      swapped.push([mesh, mesh.material]);
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map((m) => this.albedoFor(m)) : this.albedoFor(mesh.material);
    });
    r.setRenderTarget(this.albedoTarget);
    r.setClearColor(0x000000, 0);
    r.clear();
    r.render(scene, camera);
    for (const [mesh, mat] of swapped) mesh.material = mat;

    for (const o of hidden) o.visible = true;
    scene.background = prevBg;
    scene.environment = prevEnv;
    r.toneMapping = prevTone;
    r.autoClear = prevAutoClear;
    r.setRenderTarget(prevTarget);
  }

  /**
   * 누적 평균 텍스처를 필터링해 선형 HDR 결과 텍스처를 돌려준다 (톤매핑은 호출자가).
   * spp 가 fadeSamples 이상이면 원본을 그대로 돌려준다.
   */
  filter(colorTex: Texture, spp: number, params: AtrousParams = DEFAULT_ATROUS): Texture {
    const r = this.renderer;
    const w = this.size.x;
    const h = this.size.y;
    if (w < 2 || h < 2) return colorTex;
    const blend = Math.min(1, Math.max(0, spp / Math.max(1, params.fadeSamples)));
    if (blend >= 1) return colorTex;

    const prevTarget = r.getRenderTarget();
    const prevAutoClear = r.autoClear;
    r.autoClear = false;

    // 1) demodulate
    this.demodMat.uniforms.tColor.value = colorTex;
    this.demodMat.uniforms.tAlbedo.value = this.albedoTarget.texture;
    this.quad.material = this.demodMat;
    r.setRenderTarget(this.ping);
    this.quad.render(r);

    // 2) à-trous ×N
    const u = this.atrousMat.uniforms;
    u.tGbuf.value = this.gbufTarget.texture;
    u.texel.value.set(1 / w, 1 / h);
    const sigmaL0 = params.lumSigma / Math.sqrt(Math.max(1, spp));
    u.sigmaZ.value = params.depthSigma;
    u.sigmaN.value = params.normalPower;
    this.quad.material = this.atrousMat;
    let src = this.ping;
    let dst = this.pong;
    for (let i = 0; i < params.iterations; i++) {
      // 반복마다 커널 간격이 2배로 넓어지므로 휘도 허용폭도 함께 좁힌다.
      // (고정 허용폭이면 넓은 패스가 앞 패스의 뭉갬을 다시 뭉개 디테일 손상이 반복 수에 비례해 커진다 — 사내 디노이저 벤치에서 확인된 패턴)
      // 0.45 는 너무 공격적이었다(실측: 128 spp 금속면에 반점이 남음 — 넓은 패스가 저주파 얼룩을 못 지운다).
      // 0.7 이면 패스가 넓어질수록 허용폭이 완만히 좁아져 디테일 손상 누적은 줄이면서 얼룩 제거는 유지한다.
      u.sigmaL.value = sigmaL0 * Math.pow(0.7, i);
      u.tColor.value = src.texture;
      u.stepSize.value = 1 << i;
      r.setRenderTarget(dst);
      this.quad.render(r);
      [src, dst] = [dst, src];
    }

    // 3) remodulate + blend
    const m = this.remodMat.uniforms;
    m.tFiltered.value = src.texture;
    m.tAlbedo.value = this.albedoTarget.texture;
    m.tRaw.value = colorTex;
    m.blend.value = blend * blend; // 초반엔 필터를 오래 유지, 막판에 빠르게 원본으로
    this.quad.material = this.remodMat;
    r.setRenderTarget(this.out);
    this.quad.render(r);

    r.setRenderTarget(prevTarget);
    r.autoClear = prevAutoClear;
    return this.out.texture;
  }

  dispose() {
    for (const t of [this.gbufTarget, this.albedoTarget, this.ping, this.pong, this.out]) t.dispose();
    this.gbufMat.dispose();
    this.demodMat.dispose();
    this.atrousMat.dispose();
    this.remodMat.dispose();
    this.quad.dispose();
  }
}
