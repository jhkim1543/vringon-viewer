# VRINGON 3D 뷰어 연동 가이드

`src/viewer/` 는 프레임워크 무관(TypeScript + three.js)이며, `src/app/` 은 데모 셸이다.
VRINGON-WEB(`core/`: three ^0.172, three-mesh-bvh ^0.9.7, @react-three/fiber 8, MUI/emotion)에는
`src/viewer/` 만 가져가면 된다.

## 0. 의존성

```bash
# VRINGON(three 0.172) 에 WebGL2 코어만
npm i three-gpu-pathtracer@0.0.23 oidn-web@0.3.5
# three 0.185 로 올린 뒤 WebGPU(Rayzee) 엔진까지
npm i three@0.185.1 three-mesh-bvh@0.9.14 three-gpu-pathtracer@0.0.24 rayzee@7.22.8 oidn-web@0.3.5
```

- `three-gpu-pathtracer@0.0.23` 은 three ≥ r151 이므로 VRINGON 의 r172 와 그대로 맞는다(이 저장소의 `package.json.bak` 이 그 세트).
  three 를 r180+ 로 올리면 `0.0.24`(API 동일). 이 데모는 현재 **three 0.185.1** 기준이며 그림자 캐처/분산 셰이더 패치 앵커가 0.0.24 에서도 유효함을 확인했다.
- **WebGPU 엔진(Rayzee)** 은 three ≥ 0.185 하드 의존(three 내부 패치) — VRINGON 스택 업그레이드 전에는 `docs/WEBGPU_ENGINES.md` §4 의 1단계(iframe 격리)로만 제공한다. `RayzeeBackend.ts` 는 `import('rayzee')` 지연 로드라 WebGL2 만 쓰면 번들에 들어오지 않는다.
- `oidn-web` 은 선택. AI 디노이즈를 안 쓰면 설치하지 않아도 되고, 코드에서 `import('oidn-web')` 는 지연 로드라 번들에 강제 포함되지 않는다.
- Vite 워커: `three-mesh-bvh/src/workers/generateMeshBVH.worker.js?worker` 를 쓰는 `bvhWorker.ts` 를 그대로 복사한다 (`vite-env.d.ts` 의 모듈 선언 포함).
- 정적 에셋: `public/libs/draco`, `public/libs/basis`(GLB 디코더), `public/oidn/rt_hdr_alb_nrm.tza`(1.8MB), 프리셋 HDR(선택). `PathTraceViewer({ assetBase })` 로 경로를 준다.

## 1. 가장 단순한 연동 — 이미 로드된 three 씬을 그대로 넘긴다

VRINGON 뷰어가 R3F 로 `gltf.scene` 을 갖고 있다면 파일을 다시 로드할 필요가 없다:

```ts
import { PathTraceViewer } from '@/viewer/PathTraceViewer'; // src/viewer 복사 위치

const viewer = new PathTraceViewer({ container: el, assetBase: '/pt-assets/' });
await viewer.loadObject(gltf.scene.clone(true), item.name);   // 재질 정규화·축 정렬·BVH 빌드까지 자동
viewer.setEnvironment({ presetId: 'studio-soft' });
viewer.setLights('three-point');
```

`loadObject` 는 원본을 수정하므로 R3F 씬과 공유하려면 `clone(true)` 로 넘긴다(지오메트리는 공유되고 재질은
Standard/Physical 이 아니면 변환된다). 모델은 XZ 중심 0, 바닥 y=0, 가장 긴 변 1m 로 정규화된다
(`normalizeSize` 옵션). 원본 크기는 `LoadedModel.originalSize` 에 남는다.

## 2. React 래핑 예시

```tsx
import { useEffect, useRef } from 'react';
import { PathTraceViewer, ViewerSettings } from '@/viewer/PathTraceViewer';

export function PathTracedView({ object, settings }: { object: THREE.Object3D; settings?: Partial<ViewerSettings> }) {
  const ref = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PathTraceViewer>();
  useEffect(() => {
    const v = new PathTraceViewer({ container: ref.current!, assetBase: '/pt-assets/', settings });
    viewerRef.current = v;
    return () => v.dispose();
  }, []);
  useEffect(() => { void viewerRef.current?.loadObject(object.clone(true)); }, [object]);
  return <div ref={ref} style={{ position: 'absolute', inset: 0 }} />;
}
```

R3F `<Canvas>` 와 같은 컨테이너에 두지 말고(WebGL 컨텍스트 2개), "고품질 렌더" 모드에서 R3F 캔버스를
`display:none` 하거나 언마운트한 뒤 이 컴포넌트를 올리는 것이 안전하다. 두 컨텍스트를 동시에 띄우면
모바일에서 컨텍스트 손실이 잦다.

## 3. API 요약

| 메서드 | 설명 |
|---|---|
| `loadModel(url \| File)` | GLB/GLTF/OBJ/STL/FBX 로드(Draco/KTX2/Meshopt 지원) |
| `loadObject(obj, name?)` | 메모리 Object3D 사용 |
| `setRender / setEnvironment / setCamera / setFloor / setPost` | 부분 설정 병합. 카메라·재질 변경은 자동 reset |
| `setEnvironmentFromFile(File \| url)` | 사용자 .hdr/.exr |
| `setLights(rigId \| LightRig)`, `updateLight(id, patch)` | 조명 템플릿/개별 조명 |
| `getMaterials()` → 수정 → `commitMaterials()` | 재질 편집 |
| `applyMaterialOverride('clay' \| 'metal' \| 'glass' \| 'plastic' \| 'original')` | 룩 프리셋 |
| `setView('front' \| 'quarter' \| …)`, `frameModel(az, el)` | 카메라 프리셋 |
| `captureImage('image/png')` | 현재 누적 결과 PNG(투명 배경 모드면 알파 포함) |
| `renderStill({ width, height, samples, background?, denoise?, format? })` | 고해상도 렌더샷. `still-progress` 이벤트로 진행률, `cancelStill()` 로 취소, 결과는 `{ blob, dataUrl, … }` |
| `setEngine('webgl' \| 'webgpu')`, `currentEngine`, `PathTraceViewer.webgpuSupported()` | 엔진 전환(WebGPU 는 지연 로드·실패 시 WebGL2 유지) |
| `captureBlob()` | 엔진 무관 비동기 캡처 |
| `on('stats' \| 'status' \| 'model-loaded' \| 'materials' \| 'settings' \| 'error', fn)` | 이벤트. `stats` 는 0.5 s 마다 `{phase, progress, samples, maxSamples, elapsedMs, …}` — 진행률 칩/퍼센트 UI 는 이걸로 |
| `on('frame', (f: FrameInfo) => …)` | **매 프레임**(합성 직후, 동기) `{samples, accumulating, maxSamples, elapsedMs}`. 드로잉 버퍼가 살아있는 구간이라 `viewer.renderer.domElement` 를 바로 `drawImage` 할 수 있다 — 누적 타임라인(`src/app/timeline.ts`)이 이걸로 마일스톤 프레임을 저장한다. WebGL2 엔진에서만 발행 |
| `resetAccumulation()`, `dispose()` | |

`ViewerSettings` 는 JSON 직렬화 가능하므로 VRINGON 의 "렌더 프리셋" 으로 저장·공유하면 된다.

## 4. 성능·품질 운영값

- 첫 셰이더 컴파일이 수 초(고사양) ~ **1~2 분**(내장 GPU — 인텔 Arc 140T 실측) 걸린다. 그 동안은 래스터 프리뷰가 보이며 진행률 칩이 "셰이더 컴파일 중 · n s 경과" 를 보여준다. 뷰어는 **모델 + 환경맵이 모두 준비된 뒤에만** PT 셰이더를 컴파일한다(디파인이 확정된 뒤 1회 — 빈 씬으로 먼저 컴파일하던 2중 컴파일 제거). Chrome 의 셰이더 디스크 캐시 덕에 같은 빌드의 재방문은 수 초. 컴파일을 다시 일으키는 조작은 **MIS 토글** 뿐이다(투명 배경·색 배경·DOF 는 재컴파일 없이 처리하도록 우회해 두었다). VRINGON 에 붙일 때는 **빌드 해시가 바뀌면 모든 사용자가 한 번 더 컴파일**한다는 점을 릴리스 노트에 적어 두자.
- 기본값(2026-08-19 갱신, "정지 후 수 초 안에 깨끗하게"): `bounces 5`(`transmissiveBounces 10`), `maxSamples 128`, `renderScale 1`, 디노이즈 `oidn`(WebGPU 필요 — 없으면 `atrous` 자동 폴백) + 기하급수 스케줄(4·8·16·32·64·128 spp). 인텔 Arc 140T iGPU 실측 1120×856: 8 바운스 ≈ 13.5 spp/s → 5 바운스 ≈ 18 spp/s → 128 spp ≈ 7 s, OIDN 첫 패스 4 spp(<1 s)·32 spp(~2 s).
- 모바일/저사양: `renderScale 0.5~0.75`, `bounces 4`, `tiles 3`, `maxSamples 64`, 디노이즈 `atrous`.
- 고품질 정지 렌더: Quality High(512)/Ultra(2048) 또는 `renderStill()`.
- 텍스처가 많은 GLB: `pathTracer.textureSize` 가 2048² 텍스처 어레이라 4K 텍스처는 축소된다. 필요하면 4096 으로 올리되 VRAM 을 확인.
- 스킨/애니메이션 메시는 정지 자세로 굽는다(정적 BVH).

## 5. 정적 배포

`npm run build` → `dist/` 는 순수 정적 파일. GitHub Pages 등 하위 경로면 `VITE_BASE=/repo/ npm run build`.
샘플 에셋(25MB)·HDR(7.5MB)·OIDN 가중치(3.6MB)는 `public/` 에 있으므로 배포 용량이 부담되면 샘플만 빼면 된다.
