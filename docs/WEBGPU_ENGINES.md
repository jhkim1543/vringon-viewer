# WebGPU 패스트레이서 3종 심층 분석 → 채택 결정 (2026-08-19)

요청: "노이즈가 사라지는 속도 개선 + 가장 고해상도 + WebGPU 활용" 을 위해
[rayzee-renderer](https://github.com/atul-mourya/rayzee-renderer) · [moonlight](https://github.com/ivanjermakov/moonlight) · [strahl](https://github.com/StuckiSimon/strahl)
을 **소스 수준**으로 분석했다(3개 저장소 클론 → 저장소별 분석 → 교차 분석 → 적대적 검증, 에이전트 7개).
아래 수치·파일 경로는 전부 클론된 코드와 각 저장소의 자체 벤치에서 확인한 것이다.

## 1. 한눈에

| | rayzee 7.22.8 | moonlight (2026-08-17) | strahl 0.1.0 (2025-12-01) |
|---|---|---|---|
| 라이선스 | MIT | MIT | MIT |
| 활동 | 거의 매일 릴리스(단일 저자) | 개인 학습 프로젝트, 169 커밋 | 석사논문 프로젝트, 2024-09 이후 휴면 |
| WebGPU 방식 | **three WebGPURenderer + TSL 컴퓨트**(wavefront, three r185 내부 몽키패치) | raw WGSL 메가커널 | raw WGSL 메가커널 |
| three 요구 | **≥ 0.185** (peer) | 0.182 (수학·로더만) | ^0.180 (소스) / 0.167 인라인(npm) |
| BVH | TLAS/BLAS, SAH, 워커, 리핏 | CPU JS 2단계, 워커 없음 | three-mesh-bvh CPU, 단일 BLAS |
| 샘플링 | Owen-Sobol/STBN, 환경 CDF IS, Light BVH, 전면 MIS, 적응 샘플링+픽셀 프리즈 | PCG, NEE/MIS/IS **없음**, 경로당 단일 파장 | PCG, 태양/하늘 NEE+MIS, 환경맵 IS 없음 |
| 디노이저 | **ASVGF(시간 재투영)·à-trous·OIDN(GPU 버퍼)** | **없음** | 최종 1회 가우시안/OIDN |
| 조명 | Directional/Rect(원·사각·spread)/Point/Spot(IES·고보)/IBL/발광 삼각형 | 발광 메시 + EXR 1장 | 태양+단색 하늘만 |
| 재질 | 분산·이리데선스·시인·클리어코트·이방성·SSS·텍스처 전부 | 기본 PBR 일부, 텍스처 2048² 강제 | OpenPBR 부분집합, **텍스처·투과 없음** |
| 임베딩 | npm `rayzee`, 엔진/앱 분리, `loadObject3D`/`addModelFromObject3D`, 이벤트 | 패키지/API 없음(단일 파일 앱) | npm, 단일 함수 `runPathTracer`(update 없음) |
| 신발·주얼리 적합성 | **적합** | 부적합 | 부적합 |

상세(아키텍처·디노이저 파일·제약·통합 절차)는 워크플로 결과 원문을 요약한 §5 참고.

## 2. 수렴 속도("노이즈가 사라지는 속도")에 대해 배운 것

rayzee 자체 벤치(`bench/baselines/denoise.json`, RMSE denoised/raw):

| spp | ASVGF | EdgeAware(공간 à-trous) | OIDN |
|---|---|---|---|
| 1 | 0.70–0.99 (평균 0.88) | 0.43–0.70 (0.60) | 0.16–0.53 (0.40) |
| 64 | 0.68–2.45 (1.36, 대부분 악화) | 0.70–2.36 | 0.37–0.93 |

→ (a) 실시간 필터는 **저 spp 구간 보조**, 진짜 클린업은 OIDN, (b) 정적 카메라 누적에선 **공간 à-trous 가 시간적 ASVGF 보다 낫고**, (c) spp 가 쌓이면 **필터를 걷어내야** 한다.
이 세 가지를 그대로 우리 WebGL2 코어에 반영한 것이 `src/viewer/atrous.ts` 다(알베도 디모듈레이션 → G-버퍼 에지 보존 à-trous 4회 → 리모듈레이션 → 128 spp 에서 원본으로 페이드). 실측(첨부 `docs/renders/compare_atrous*.png`): 신발 11 spp·링 8 spp 에서 래스터 수준으로 깨끗, 텍스처 디테일 보존.

남은 개선 여지(효과/비용 순, 교차 분석 권고):
1. **카메라 재투영 시간 누적** — rayzee `Stages/ASVGF.js` `_buildTemporalForDirection`(모션벡터 → 2×2 탭, normal¹⁶·exp(−|Δz|/z/0.05) 가중, 히스토리 ≤32) 를 GLSL 로 이식. 궤도 회전 중 "1 spp 블록 노이즈 → 8~16 spp 상당", 정지 직후 노이즈 폭발 제거. 1일.
2. **분산 유도 σ(SVGF)** — `Stages/BilateralFilter.js` 217–277: `sigmaL = φ·√variance/albedoLum`, 반복마다 w² 로 분산도 필터링. 수렴 영역은 즉시 필터가 빠지고 유리/코스틱만 남아 "뭉개짐 vs 잔노이즈" 타협이 사라짐. 반나절.
3. **픽셀 프리즈** — `TSL/FinalWriteKernel.js` 150–215: 휘도 2차 모멘트로 relErr<0.02 가 8프레임 연속이면 동결 → PT 셰이더 앵커 패치로 BVH 순회 생략. 제품샷은 배경·바닥이 대부분이라 벽시계 1.5~3×. 1~2일.
4. **인터랙션 튜닝** — 드래그 중 bounces 2/transmissive 3(유니폼, 재컴파일 없음), lowRes 0.35 — **적용함**.

## 3. 결정

1. **코어는 WebGL2(three-gpu-pathtracer) 유지** — 전 브라우저, VRINGON 스택(0.172)에 드롭인, 우리 그림자 캐처/분산/à-trous 패치 보유. three ≥ r180 에선 0.0.24.
2. **Rayzee 를 옵트인 WebGPU 엔진으로 결합** (`src/viewer/backends/RayzeeBackend.ts`, 패널 렌더링 → 엔진) — 같은 뷰어 API 뒤에서 모델(`addModelFromObject3D`)·환경맵(`environmentManager.setEnvironmentMap`)·조명(RectArea/Spot, W 단위 변환)·카메라·설정(bounces/maxSamples/DOF/배경/톤매핑/디노이즈 전략)·렌더샷(`renderStill`)을 번역한다. 실패 시 WebGL2 로 복귀. 데모 저장소는 이를 위해 **three 0.185.1 + three-gpu-pathtracer 0.0.24 + three-mesh-bvh 0.9.14 + rayzee 7.22.8** 로 올렸다(`package.json.bak` = 0.172 세트).
3. **moonlight·strahl 은 채택하지 않음** — 디노이저/NEE/텍스처/투과가 없어 제품 렌더 요구를 못 채운다. WGSL BVH 순회·스토리지 레이아웃 참고용.
4. 실측(내장 GPU Intel Xe-LPG, Chrome 148): WebGPU 엔진 초기화 1.3 s + 첫 프레임 수 초, 32 프레임에서 edge-aware 디노이즈로 깨끗한 링 렌더(`docs/renders/rayzee_ring_webgpu.png`). **주의**: WebGL+WebGPU 동시 구동 시 내장 GPU 에서 WebGL 컨텍스트 손실이 한 번 발생했다(메모리 압박). 뷰어는 `webglcontextlost/restored` 를 처리하지만, 제품에서는 WebGPU 모드 진입 시 WebGL 렌더링을 멈추고(지금 그렇게 함) 필요하면 WebGL 타깃을 해제하는 것이 안전하다.

## 4. VRINGON 적용 경로

| 단계 | 내용 |
|---|---|
| 0 (지금) | WebGL2 코어 연동(`docs/VRINGON_INTEGRATION.md`). à-trous·그림자 캐처·분산·렌더샷 모두 three 버전 무관. |
| 1 (옵트인, 격리) | VRINGON 의 three 는 0.172 유지. 이 데모를 `VITE_BASE=/pt-webgpu/` 로 빌드해 iframe + postMessage 로 "고품질 렌더" 모드 제공(씬은 GLTFExporter 로 GLB blob 전달 — transmission/clearcoat/sheen/iridescence/dispersion 이 glTF 확장으로 왕복). |
| 2 (인번들) | VRINGON 을 three **0.185.x 고정**으로 올린 뒤(R3F 8 peer ≥0.133·drei 9 ≥0.137 이라 선언상 호환, 회귀 테스트 필요) `import('rayzee')` 지연 로드, 오버레이 캔버스, `resolve.dedupe:['three']`, `optimizeDeps.exclude:['rayzee']`, CSP `worker-src blob:`. PT 활성 중 R3F 는 `frameloop='demand'`. |
| 3 (관찰) | three-gpu-pathtracer 자체 WebGPU 백엔드(PR #713/#796/#800/#803) 머지 시 가장 호환되는 경로 — 그때 Rayzee 와 병행 평가. |

브라우저 지원(2026-08): Chrome/Edge 113+, Chrome Android 121+, Safari 26+, Firefox 141+(Windows). 구형 기업 PC·iOS 25 이하·RDP/VM 은 WebGPU 어댑터가 없으므로 **기본 WebGL2 + WebGPU 토글** 구조는 필수.
번들: rayzee.es 840 KB(gzip 212 KB) + three.webgpu 668 KB(gzip 185 KB) — 전부 지연 로드라 기본 번들 영향 0, WebGPU 모드 진입 시 +~1.2 MB gzip. STBN 아틀라스·OIDN 가중치는 CDN 기본 → 제품은 `configureAssets` 로 자체 호스팅.

## 5. 저장소별 상세(요약)

### rayzee
- 커널: Generate → Extend → (재질 정렬) → Shade → Compact → FinalWrite wavefront(`src/TSL/*Kernel.js`), 1 spp/frame, Blender 식 path-pool 청킹.
- 디노이저: `Stages/ASVGF.js`(알베도 디모듈레이션, 모션벡터 재투영, 그래디언트 적응 α) + `Variance.js` + `BilateralFilter.js`(5×5 à-trous, SVGF 에지 스톱) / `EdgeFilter.js`(공간 전용) / `Passes/OIDNDenoiser.js`(oidn-web, GPUBuffer 직결, fast/balance/high 모델, 수렴 완료 시 1회).
- 제약: WebGPU 전용(폴백 없음), three ≥0.185 + `TSL/patches.js` 몽키패치, 모델 로드마다 WGSL 재컴파일(~20 s M-시리즈), 2048² RGBA32F 스토리지 선할당(4096 은 deviceMemory≥8GB 게이트), 광원 단위 W, 단일 저자 7.x 고속 릴리스.
- 공개 API: `new PathTracerApp(canvas,{container})`, `init/animate/pause/resume/reset/dispose`, `loadModel/loadObject3D/addModelFromObject3D/removeSceneObject`, `loadEnvironment`, `settings.set/setMany`, `cameraManager.{camera,controls}`, `lightManager`, `denoisingManager.{setDenoiserStrategy,setOIDNEnabled,...}`, `setCanvasSize/setReservedRenderResolution`, `screenshot()`, `renderFrames(n)`, `EngineEvents.*`.

### moonlight
- 2.1k 줄(WGSL 794) raw-WebGPU 메가커널, 184 MB 고정 스토리지 버퍼(≈140만 tri 상한), 4096² rgba32float 누적 2장(512 MB).
- NEE/MIS/환경 IS/디노이저 없음, 경로당 단일 파장 스펙트럴 샘플링이 색 노이즈 추가, 카메라 런타임 변경 불가, 패키지/API 없음.

### strahl
- raw WebGPU + WGSL 메가커널 + three-mesh-bvh CPU BVH, OpenPBR 의 diffuse/specular/metal/emission 만. 텍스처·투과·IBL·면광원·그림자캐처 없음. `runPathTracer()` 단일 함수(변경마다 전체 재구성). 논문 벤치 M1 Max 512² 1M tri ≈35 spp/s.

## 6. 검증 메모
- 적대적 검증 에이전트가 라이선스·최근 커밋·three 버전·디노이저 파일 실존·엔진 분리 여부를 파일로 재확인했다. 정정: rayzee npm 최신은 **7.22.9**(2026-08-19 10:27 UTC, 이 데모는 7.22.8 고정 — 거의 매일 릴리스되므로 정확 버전 고정 권장); strahl 은 0.1.0 이후 커밋 7건(의존성 범프 2건) — '휴면' 결론 유지; moonlight 은 three 의 Mesh/Material/Camera 타입도 사용하나 렌더러·TSL 미사용은 그대로.
- 이 데모에서 실제로 실행해 본 것: WebGPU 엔진 전환(에러 0), 32 프레임 렌더(`docs/renders/rayzee_ring_webgpu.png`, UI 스크린샷 `docs/renders/ui_vringon_webgpu.png`), WebGL 복귀, 프로덕션 빌드(`rayzee.es` 1.4 MB 지연 청크).
