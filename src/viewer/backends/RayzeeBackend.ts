import { ACESFilmicToneMapping, Mesh, MeshPhysicalMaterial, Object3D, Quaternion, RectAreaLight, SpotLight, Texture, Vector3 } from 'three';
import type { PathTraceViewer, StillOptions, StillProgress, StillResult, ViewerSettings } from '../PathTraceViewer';
import { buildLightGroup, LightRig } from '../lights';

/**
 * WebGPU 백엔드 — Rayzee(atul-mourya/rayzee-renderer, MIT) wavefront 패스트레이서를 같은 뷰어 API 뒤에 붙인다.
 *
 * 분석 결론(docs/RESEARCH.md §2): 후보 3종 중 Rayzee 만이 TLAS/BLAS·Owen-Sobol/STBN·환경 CDF IS·Light BVH·전면 MIS·
 * 적응 샘플링+픽셀 프리즈·ASVGF/à-trous·OIDN(GPU 버퍼)·해석적 섀도캐처·분산/이리데선스/시인/클리어코트를 모두 갖춘다.
 * 조건은 three ≥ 0.185 와 WebGPU 브라우저. 그래서 "옵트인 WebGPU 엔진" 으로 두고, 기본은 WebGL2(three-gpu-pathtracer) 를 유지한다.
 *
 * 엔진은 자체 WebGPU 캔버스·WebGPURenderer·카메라·OrbitControls 를 가지므로 여기서는
 *   - 뷰포트 위에 캔버스를 겹치고(show/hide),
 *   - 뷰어의 모델/환경/조명/설정을 Rayzee 의 settings·managers 로 번역하고,
 *   - 카메라 포즈를 양쪽으로 동기화한다.
 * 실제 경로추적·디노이즈는 전부 Rayzee 안에서 돈다(ASVGF 는 1 spp 부터, OIDN 은 수렴 완료 시).
 */

type RayzeeModule = typeof import('rayzee');

export interface RayzeeStats {
  samples: number;
  complete: boolean;
  denoising: boolean;
  ready: boolean;
  compiling: boolean;
}

export class RayzeeBackend {
  readonly canvas: HTMLCanvasElement;
  private app: any = null;
  private mod: RayzeeModule | null = null;
  private modelUuid: string | null = null;
  private lights: Object3D[] = [];
  private initPromise: Promise<void> | null = null;
  private visible = false;
  private denoising = false;
  private compiling = false;
  private frameCount = 0;
  private complete = false;
  private envTex: Texture | null = null;

  constructor(
    private viewer: PathTraceViewer,
    private container: HTMLElement,
  ) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:none;outline:none;';
    this.canvas.setAttribute('data-engine', 'rayzee-webgpu');
    container.appendChild(this.canvas);
  }

  static supported(): boolean {
    return typeof navigator !== 'undefined' && !!(navigator as any).gpu;
  }

  get ready() {
    return !!this.app?.isInitialized;
  }

  /** 엔진 로드(지연 import) + 초기화. 첫 호출에서만 비용이 든다 (번들 ~3 MB, 셰이더 컴파일 수십 초). */
  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      this.compiling = true;
      const mod = await import('rayzee');
      this.mod = mod;
      const { PathTracerApp, EngineEvents } = mod as any;
      const app = new PathTracerApp(this.canvas, { container: this.container, autoResize: true });
      this.app = app;
      await app.init();
      app.configureForMode('interactive', { canvasWidth: this.container.clientWidth, canvasHeight: this.container.clientHeight });
      app.addEventListener(EngineEvents.FRAME, () => {
        this.frameCount = app.getFrameCount?.() ?? this.frameCount + 1;
        this.compiling = false;
      });
      app.addEventListener(EngineEvents.RENDER_COMPLETE, () => (this.complete = true));
      app.addEventListener(EngineEvents.RENDER_RESET, () => {
        this.complete = false;
        this.frameCount = 0;
      });
      app.addEventListener(EngineEvents.DENOISING_START, () => (this.denoising = true));
      app.addEventListener(EngineEvents.DENOISING_END, () => (this.denoising = false));
      app.addEventListener(EngineEvents.DEVICE_LOST, () => console.error('[rayzee] WebGPU device lost'));
      // 뷰어 기본값과 맞춘다
      app.settings.setMany({ enableAccumulation: true, useAdaptiveSampling: false, usePixelFreeze: true, saturation: 1.0 }, { silent: true });
      app.animate();
      if (!this.visible) app.pause();
    })();
    return this.initPromise;
  }

  /* ------------------------------ 표시 ------------------------------ */

  show() {
    this.visible = true;
    this.canvas.style.display = 'block';
    if (this.app?.isInitialized) {
      this.app.onResize?.();
      this.app.resume?.();
      this.app.wake?.();
    }
  }

  hide() {
    this.visible = false;
    this.canvas.style.display = 'none';
    this.app?.pause?.();
  }

  /* ------------------------------ 모델 ------------------------------ */

  async setModel(root: Object3D | null, name = 'model') {
    await this.init();
    const app = this.app;
    if (this.modelUuid) {
      try {
        await app.removeSceneObject(this.modelUuid);
      } catch (e) {
        console.warn('[rayzee] removeSceneObject', e);
      }
      this.modelUuid = null;
    }
    if (!root) return;
    const clone = root.clone(true);
    // 분산: Rayzee 는 재질별 dispersion 을 읽는다 (three ≥ r163 MeshPhysicalMaterial.dispersion)
    const disp = this.viewer.settings.render.dispersion;
    clone.traverse((o) => {
      const m = (o as Mesh).material as MeshPhysicalMaterial | MeshPhysicalMaterial[] | undefined;
      if (!m) return;
      for (const mat of Array.isArray(m) ? m : [m]) {
        if ((mat as any).isMeshPhysicalMaterial && mat.transmission > 0) mat.dispersion = disp;
      }
    });
    this.compiling = true;
    this.modelUuid = await app.addModelFromObject3D(clone, { name });
    this.syncFromViewer();
  }

  /* ------------------------------ 카메라 ------------------------------ */

  /** 뷰어(WebGL) 카메라 → Rayzee 카메라 */
  syncFromViewer() {
    const app = this.app;
    if (!app?.isInitialized) return;
    const cam = app.cameraManager.camera;
    const controls = app.cameraManager.controls;
    cam.position.copy(this.viewer.camera.position);
    cam.quaternion.copy(this.viewer.camera.quaternion);
    cam.fov = this.viewer.settings.camera.fov;
    cam.near = this.viewer.camera.near;
    cam.far = this.viewer.camera.far;
    cam.updateProjectionMatrix();
    if (controls) {
      controls.target.copy(this.viewer.controls.target);
      controls.minDistance = this.viewer.controls.minDistance;
      controls.maxDistance = this.viewer.controls.maxDistance;
      controls.maxPolarAngle = this.viewer.controls.maxPolarAngle;
      controls.autoRotate = this.viewer.settings.camera.autoRotate;
      controls.autoRotateSpeed = this.viewer.settings.camera.autoRotateSpeed;
      controls.update();
    }
    app.reset?.();
  }

  /** Rayzee 카메라 → 뷰어 카메라 (엔진을 WebGL 로 되돌릴 때) */
  syncToViewer() {
    const app = this.app;
    if (!app?.isInitialized) return;
    const cam = app.cameraManager.camera;
    this.viewer.camera.position.copy(cam.position);
    this.viewer.camera.quaternion.copy(cam.quaternion);
    if (app.cameraManager.controls) this.viewer.controls.target.copy(app.cameraManager.controls.target);
    this.viewer.controls.update();
  }

  /* ------------------------------ 설정 번역 ------------------------------ */

  applyRender(s: ViewerSettings['render']) {
    const app = this.app;
    if (!app?.isInitialized) return;
    app.settings.setMany({
      bounces: s.bounces,
      transmissiveBounces: s.transmissiveBounces,
      maxSamples: s.maxSamples > 0 ? s.maxSamples : 100000,
      enablePathTracer: s.pathTracing,
    });
    this.applyScale(s.renderScale);
  }

  private applyScale(scale: number) {
    const app = this.app;
    if (!app?.isInitialized) return;
    const w = Math.max(16, Math.floor(this.container.clientWidth * scale));
    const h = Math.max(16, Math.floor(this.container.clientHeight * scale));
    try {
      app.setCanvasSize(w, h);
    } catch (e) {
      console.warn('[rayzee] setCanvasSize', e);
    }
  }

  async applyEnvironment(tex: Texture | null, s: ViewerSettings['environment']) {
    const app = this.app;
    if (!app?.isInitialized) return;
    if (tex && tex !== this.envTex) {
      this.envTex = tex;
      try {
        await app.environmentManager.setEnvironmentMap(tex);
      } catch (e) {
        console.warn('[rayzee] setEnvironmentMap', e);
      }
    }
    const bg = s.background;
    app.settings.setMany({
      environmentIntensity: s.intensity,
      environmentRotation: s.rotation,
      backgroundIntensity: s.backgroundIntensity,
      showBackground: bg === 'environment' || bg === 'blurred',
      backgroundBlurriness: bg === 'blurred' ? s.blur : 0,
      transparentBackground: bg === 'transparent',
      backgroundColor: bg === 'color' ? s.backgroundColor : '#000000',
    });
  }

  applyLights(rig: LightRig, modelRadius: number, center: Vector3) {
    const app = this.app;
    if (!app?.isInitialized) return;
    for (const l of this.lights) {
      app.scene.remove(l);
      (l as any).target && app.scene.remove((l as any).target);
    }
    this.lights = [];
    const group = buildLightGroup(rig, modelRadius, center);
    const toAdd: Object3D[] = [];
    group.traverse((o) => {
      if ((o as RectAreaLight).isRectAreaLight) {
        const src = o as RectAreaLight & { isCircular?: boolean };
        const w = src.width;
        const h = src.height;
        const area = src.isCircular ? Math.PI * (w / 2) * (h / 2) : w * h;
        const light = new RectAreaLight(src.color.clone(), src.intensity * area * Math.PI, w, h); // nits → W (램버시안 방사도 πL × 면적)
        src.updateMatrixWorld();
        light.position.setFromMatrixPosition(src.matrixWorld);
        light.quaternion.copy(src.getWorldQuaternion(new Quaternion()));
        light.userData.shape = src.isCircular ? 'disk' : 'rectangle';
        light.userData.normalize = true;
        light.userData.spread = Math.PI;
        light.userData.temperature = 6500;
        light.userData.useTemperature = false;
        light.userData.exposure = 0;
        light.name = src.name;
        toAdd.push(light);
      } else if ((o as SpotLight).isSpotLight) {
        const src = o as SpotLight;
        const light = new SpotLight(src.color.clone(), src.intensity * 2 * Math.PI); // cd → W 근사
        light.angle = src.angle;
        light.penumbra = src.penumbra;
        light.decay = 2;
        src.updateMatrixWorld();
        light.position.setFromMatrixPosition(src.matrixWorld);
        light.target = new Object3D();
        light.target.position.copy(src.target.position);
        light.userData.temperature = 6500;
        light.userData.useTemperature = false;
        light.userData.exposure = 0;
        light.name = src.name;
        toAdd.push(light);
      }
    });
    for (const l of toAdd) {
      app.scene.add(l);
      if ((l as SpotLight).isSpotLight) app.scene.add((l as SpotLight).target);
      this.lights.push(l);
    }
    app.lightManager.updateLights?.();
    app.reset?.();
  }

  applyFloor(s: ViewerSettings['floor']) {
    const app = this.app;
    if (!app?.isInitialized) return;
    app.settings.setMany({ enableGroundCatcher: s.enabled, groundCatcherHeight: 0 });
  }

  applyCamera(s: ViewerSettings['camera']) {
    const app = this.app;
    if (!app?.isInitialized) return;
    const cam = app.cameraManager.camera;
    if (cam.fov !== s.fov) {
      cam.fov = s.fov;
      cam.updateProjectionMatrix();
    }
    app.settings.setMany({
      enableDOF: s.dof,
      aperture: s.fStop,
      focusDistance: s.focusDistance,
      autoFocusMode: s.autoFocus ? 'auto' : 'manual',
    });
    const controls = app.cameraManager.controls;
    if (controls) {
      controls.autoRotate = s.autoRotate;
      controls.autoRotateSpeed = s.autoRotateSpeed;
    }
  }

  applyPost(s: ViewerSettings['post'], toneMapping: number) {
    const app = this.app;
    if (!app?.isInitialized) return;
    app.settings.setMany({ exposure: s.exposure, toneMapping: toneMapping ?? ACESFilmicToneMapping });
    const dm = app.denoisingManager;
    try {
      if (s.denoise === 'off') {
        dm.setDenoiserStrategy('none');
        dm.setOIDNEnabled(false);
      } else if (s.denoise === 'oidn') {
        dm.setDenoiserStrategy('asvgf', 'medium');
        dm.setOIDNEnabled(true);
      } else {
        // bilateral / atrous → Rayzee 의 공간 SVGF(edge-aware)
        dm.setDenoiserStrategy('edgeaware');
        dm.setOIDNEnabled(false);
      }
    } catch (e) {
      console.warn('[rayzee] denoise', e);
    }
  }

  applyAll() {
    const v = this.viewer;
    const s = v.settings;
    this.applyRender(s.render);
    this.applyCamera(s.camera);
    this.applyFloor(s.floor);
    this.applyPost(s.post, v.renderer.toneMapping);
  }

  /* ------------------------------ 캡처 / 렌더샷 ------------------------------ */

  async captureBlob(type: 'image/png' | 'image/jpeg' = 'image/png', quality = 0.95): Promise<Blob> {
    const app = this.app;
    const r = app.screenshot({ type, quality });
    const blob: Blob = r instanceof Promise ? await r : r;
    if (blob instanceof Blob) return blob;
    // dataURL 문자열일 수도 있다
    return await (await fetch(String(blob))).blob();
  }

  async renderStill(opts: StillOptions, onProgress: (p: StillProgress) => void, isCancelled: () => boolean): Promise<StillResult | null> {
    const app = this.app;
    if (!app?.isInitialized) throw new Error('WebGPU 엔진이 준비되지 않았습니다');
    const { EngineEvents } = this.mod as any;
    const width = Math.floor(opts.width);
    const height = Math.floor(opts.height);
    const target = Math.max(1, Math.floor(opts.samples));
    const t0 = performance.now();
    const prevMax = app.settings.get('maxSamples');
    const prevTransparent = app.settings.get('transparentBackground');
    const prevAdaptive = app.settings.get('useAdaptiveSampling');
    try {
      app.setReservedRenderResolution?.(Math.max(width, height), { allowLower: true });
      app.setCanvasSize(width, height);
      app.settings.setMany({ maxSamples: target, useAdaptiveSampling: false });
      if (opts.background === 'transparent') app.settings.set('transparentBackground', true);
      app.reset();
      app.resume?.();
      app.wake?.();
      // 완료 대기
      await new Promise<void>((resolve) => {
        const tick = () => {
          if (isCancelled()) return resolve();
          const n = app.getFrameCount?.() ?? 0;
          const elapsed = performance.now() - t0;
          const ratio = Math.min(1, n / target);
          onProgress({ samples: n, target, ratio, elapsedMs: elapsed, etaMs: ratio > 0.02 ? (elapsed / ratio) * (1 - ratio) : 0, phase: this.denoising ? 'denoising' : 'rendering' });
          if (app.isComplete?.() && !this.denoising) return resolve();
          setTimeout(tick, 100);
        };
        tick();
      });
      if (isCancelled()) return null;
      // OIDN 이 켜져 있으면 DENOISING_END 를 잠시 기다린다
      const t1 = performance.now();
      while (this.denoising && performance.now() - t1 < 60000) await new Promise((r) => setTimeout(r, 100));
      onProgress({ samples: target, target, ratio: 1, elapsedMs: performance.now() - t0, etaMs: 0, phase: 'encoding' });
      const blob = await this.captureBlob(opts.format ?? 'image/png', opts.quality);
      const dataUrl = await new Promise<string>((res) => {
        const fr = new FileReader();
        fr.onload = () => res(String(fr.result));
        fr.readAsDataURL(blob);
      });
      void EngineEvents;
      return { blob, dataUrl, width, height, samples: app.getFrameCount?.() ?? target, elapsedMs: performance.now() - t0, options: { ...opts, width, height, samples: target } };
    } finally {
      app.settings.setMany({ maxSamples: prevMax, transparentBackground: prevTransparent, useAdaptiveSampling: prevAdaptive });
      this.applyScale(this.viewer.settings.render.renderScale);
      app.reset();
    }
  }

  getStats(): RayzeeStats {
    return { samples: this.frameCount, complete: this.complete, denoising: this.denoising, ready: this.ready, compiling: this.compiling && this.frameCount === 0 };
  }

  resetAccumulation() {
    this.app?.reset?.();
  }

  resize() {
    if (!this.app?.isInitialized) return;
    this.applyScale(this.viewer.settings.render.renderScale);
  }

  dispose() {
    try {
      this.app?.dispose?.();
    } catch (e) {
      console.warn('[rayzee] dispose', e);
    }
    this.canvas.remove();
    this.app = null;
  }
}

