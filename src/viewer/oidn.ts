import {
  Camera,
  DataTexture,
  FloatType,
  LinearFilter,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshStandardMaterial,
  NoToneMapping,
  Object3D,
  RGBAFormat,
  Scene,
  SRGBColorSpace,
  UnsignedByteType,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';
import type UNet from 'oidn-web/lib/UNet';

/**
 * Intel Open Image Denoise(OIDN) 를 브라우저에서 돌리는 oidn-web(WebGPU/tfjs) 래퍼.
 *
 * Notion "Denoising Research" 문서에서 후보로 올렸던 OIDN 을 실제로 붙인 것.
 * WebRTX(V-REN) 는 `denoiser` 패키지(tfjs+OIDN)로 서버사이드 디노이징을 했는데,
 * 여기서는 같은 가중치(rt_hdr_alb_nrm)를 클라이언트에서 직접 실행한다.
 *
 * 흐름: path tracer float 타깃 → readRenderTargetPixels → (albedo/normal 은 래스터로 생성)
 *       → UNet.tileExecute → Float32 RGBA → DataTexture → 톤매핑 quad 로 표시.
 */
export interface OidnStatus {
  supported: boolean;
  reason?: string;
}

export async function probeOidnSupport(): Promise<OidnStatus> {
  const gpu = (navigator as any).gpu;
  if (!gpu) return { supported: false, reason: 'WebGPU 미지원 브라우저' };
  try {
    const adapter = await gpu.requestAdapter();
    if (!adapter) return { supported: false, reason: 'WebGPU 어댑터 없음' };
    return { supported: true };
  } catch (e) {
    return { supported: false, reason: String(e) };
  }
}

export interface DenoiseInput {
  color: Float32Array; // RGBA, linear HDR, 크기 = width*height*4
  albedo?: Uint8ClampedArray; // RGBA 0~255
  normal?: Uint8ClampedArray; // RGBA 0~255 (n*0.5+0.5)
  width: number;
  height: number;
}

export class OidnDenoiser {
  private unet: UNet | null = null;
  private loading: Promise<UNet> | null = null;
  private abort: (() => void) | null = null;
  readonly aux: boolean;
  readonly weightsUrl: string;

  /**
   * 타일 크기. 512 는 일부 GPU(Intel Xe 내장 등)에서 tfjs-webgpu 가 조용히 NaN 을 내놓는다(2026-08 실측) —
   * 256 은 모든 테스트 GPU 에서 정상. NaN 이 감지되면 128 로 한 단계 더 내려 재시도한다.
   */
  private tileSize: number;

  constructor(weightsUrl: string, aux = true, tileSize = 256) {
    this.weightsUrl = weightsUrl;
    this.aux = aux;
    this.tileSize = tileSize;
  }

  get ready() {
    return this.unet !== null;
  }

  async load(): Promise<UNet> {
    if (this.unet) return this.unet;
    if (!this.loading) {
      this.loading = import('oidn-web').then(async (mod) => {
        // 큰 타일일수록 빠르지만 일부 GPU 에서 NaN — 기본 256, 실패 시 128 (denoise() 참고)
        const unet = await mod.initUNetFromURL(this.weightsUrl, undefined, { hdr: true, aux: this.aux, maxTileSize: this.tileSize });
        this.unet = unet;
        return unet;
      });
    }
    return this.loading;
  }

  /**
   * 속도 벤치: n×n 합성 버퍼를 두 번 디노이즈해(첫 회는 커널 워밍업) 두 번째 소요 ms 를 돌려준다.
   * 인텔 Arc 140T iGPU 실측 256²: 663 ms(워밍업) → 118~162 ms, 풀프레임 1120×856 은 7~12 s.
   */
  async benchmark(n = 256): Promise<number> {
    await this.load();
    const color = new Float32Array(n * n * 4);
    const alb = new Uint8ClampedArray(n * n * 4);
    const nrm = new Uint8ClampedArray(n * n * 4);
    for (let i = 0; i < n * n; i++) {
      color[i * 4] = Math.random();
      color[i * 4 + 1] = Math.random() * 0.5;
      color[i * 4 + 2] = 0.2;
      color[i * 4 + 3] = 1;
      alb.set([200, 180, 120, 255], i * 4);
      nrm.set([128, 128, 255, 255], i * 4);
    }
    await this.denoiseOnce({ color, albedo: alb, normal: nrm, width: n, height: n });
    const t = performance.now();
    await this.denoiseOnce({ color, albedo: alb, normal: nrm, width: n, height: n });
    return performance.now() - t;
  }

  cancel() {
    if (this.abort) {
      this.abort();
      this.abort = null;
    }
  }

  /** 전체 이미지를 디노이즈해 Float32 RGBA 로 돌려준다. 진행 콜백은 타일 단위. NaN 결과면 타일을 줄여 한 번 재시도. */
  async denoise(input: DenoiseInput, onProgress?: (done: number, total: number) => void): Promise<Float32Array> {
    const out = await this.denoiseOnce(input, onProgress);
    if (!hasNaN(out)) return out;
    if (this.tileSize <= 128) throw new Error('OIDN 결과가 NaN 입니다 (GPU 호환성 문제)');
    console.warn(`[oidn] NaN 결과 — 타일 ${this.tileSize} → ${this.tileSize / 2} 로 재시도`);
    this.tileSize = this.tileSize / 2;
    this.unet?.dispose();
    this.unet = null;
    this.loading = null;
    const retry = await this.denoiseOnce(input, onProgress);
    if (hasNaN(retry)) throw new Error('OIDN 결과가 NaN 입니다 (GPU 호환성 문제)');
    return retry;
  }

  private async denoiseOnce(input: DenoiseInput, onProgress?: (done: number, total: number) => void): Promise<Float32Array> {
    const unet = await this.load();
    this.cancel();
    return new Promise<Float32Array>((resolve, reject) => {
      try {
        const { width, height } = input;
        this.abort = unet.tileExecute({
          color: { data: input.color, width, height },
          albedo: this.aux && input.albedo ? { data: input.albedo as any, width, height } : undefined,
          normal: this.aux && input.normal ? { data: input.normal as any, width, height } : undefined,
          progress: (_out, _tile, _t, cur, total) => onProgress?.(cur + 1, total),
          done: (out) => {
            this.abort = null;
            resolve((out as { data: Float32Array }).data);
          },
        });
      } catch (e) {
        this.abort = null;
        reject(e);
      }
    });
  }

  dispose() {
    this.cancel();
    this.unet?.dispose();
    this.unet = null;
    this.loading = null;
  }
}

function hasNaN(a: Float32Array): boolean {
  // 픽셀 몇 개만 봐도 충분하다 (NaN 은 타일 전체로 번진다)
  const step = Math.max(4, (Math.floor(a.length / 4 / 256) | 0) * 4);
  for (let i = 0; i < a.length; i += step) if (Number.isNaN(a[i])) return true;
  return false;
}

/**
 * OIDN 보조 버퍼(albedo / normal) 를 래스터로 만든다.
 * albedo: 각 재질의 baseColor(×map) 만 — 조명 없이. normal: 뷰공간 노멀(MeshNormalMaterial).
 */
export class AuxBufferRenderer {
  private albedoTarget: WebGLRenderTarget;
  private normalTarget: WebGLRenderTarget;
  private normalMaterial = new MeshNormalMaterial();
  private albedoCache = new WeakMap<Material, MeshBasicMaterial>();

  constructor(private renderer: WebGLRenderer) {
    const opts = { type: UnsignedByteType, format: RGBAFormat, depthBuffer: true, stencilBuffer: false } as const;
    this.albedoTarget = new WebGLRenderTarget(1, 1, { ...opts, colorSpace: SRGBColorSpace });
    this.normalTarget = new WebGLRenderTarget(1, 1, opts);
  }

  private albedoFor(mat: Material): MeshBasicMaterial {
    let m = this.albedoCache.get(mat);
    if (!m) {
      const src = mat as MeshStandardMaterial;
      m = new MeshBasicMaterial({
        color: src.color ?? 0xffffff,
        map: src.map ?? null,
        vertexColors: src.vertexColors,
        side: src.side,
        alphaTest: src.alphaTest,
        alphaMap: src.alphaMap ?? null,
        transparent: false,
      });
      // 금속은 반사색이 곧 albedo 에 가깝다 — OIDN 학습 규약대로 색만 넘긴다
      this.albedoCache.set(mat, m);
    }
    return m;
  }

  render(scene: Scene, camera: Camera, width: number, height: number): { albedo: Uint8ClampedArray; normal: Uint8ClampedArray } {
    const r = this.renderer;
    if (this.albedoTarget.width !== width || this.albedoTarget.height !== height) {
      this.albedoTarget.setSize(width, height);
      this.normalTarget.setSize(width, height);
    }
    const prevTarget = r.getRenderTarget();
    const prevTone = r.toneMapping;
    const prevBg = scene.background;
    const prevEnv = scene.environment;
    const prevOverride = scene.overrideMaterial;
    r.toneMapping = NoToneMapping;
    scene.background = null;
    scene.environment = null;

    // albedo — 메시 재질을 임시 교체
    const swapped: Array<[Mesh, Material | Material[]]> = [];
    scene.traverse((o: Object3D) => {
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
    const albedo = new Uint8ClampedArray(width * height * 4);
    r.readRenderTargetPixels(this.albedoTarget, 0, 0, width, height, albedo as unknown as Uint8Array);

    // normal
    scene.overrideMaterial = this.normalMaterial;
    r.setRenderTarget(this.normalTarget);
    r.setClearColor(0x808080, 1);
    r.clear();
    r.render(scene, camera);
    const normal = new Uint8ClampedArray(width * height * 4);
    r.readRenderTargetPixels(this.normalTarget, 0, 0, width, height, normal as unknown as Uint8Array);

    scene.overrideMaterial = prevOverride;
    scene.background = prevBg;
    scene.environment = prevEnv;
    r.toneMapping = prevTone;
    r.setRenderTarget(prevTarget);
    return { albedo, normal };
  }

  dispose() {
    this.albedoTarget.dispose();
    this.normalTarget.dispose();
    this.normalMaterial.dispose();
  }
}

/** Float32 RGBA 결과를 화면용 텍스처로 */
export function floatToTexture(data: Float32Array, width: number, height: number, existing?: DataTexture | null): DataTexture {
  if (existing && existing.image.width === width && existing.image.height === height) {
    (existing.image as any).data = data;
    existing.needsUpdate = true;
    return existing;
  }
  existing?.dispose();
  const tex = new DataTexture(data, width, height, RGBAFormat, FloatType);
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}
