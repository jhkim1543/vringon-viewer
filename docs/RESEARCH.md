# 패스트레이싱 웹 뷰어 — 리서치 & 기술 선택 근거

작성 2026-08-19. 이 문서는 (1) 사내 자료(Notion·GitHub)에서 확인한 RebuilderAI 의 패스트레이싱 연구,
(2) 2024~2026 오픈소스/논문 동향, (3) 그 위에서 이번 뷰어가 내린 기술 결정을 정리한다.

---

## 1. 사내 자료에서 확인한 것 (Notion · GitHub)

| 출처 | 내용 | 이번 뷰어에 반영 |
|---|---|---|
| Notion **V-REN / VRen 1.0·2.0** (2024-07) | WebGPU 패스트레이서 계획서. 0.1: BRDF 샘플링·IBL·Lambert/플라스틱/메탈·톤매핑. 2.0 목표: Disney BRDF, MIS, envmap importance sampling, denoising, 편집(배치·재질·카메라샷), **라이팅룸** | 2.0 목표 항목 전부 충족(§4). 라이팅룸 → 조명 리그 5종 + 절차적 스튜디오 환경맵 5종 |
| GitHub **RebuilderAI/WebRTX** `renderer_3` (2025-01, phg) | WebGPU + Vulkan식 WebRTX API(wasm glslang/naga/bvh). RayPayload, 3종 재질, MIS 모드(0/1/2), envmap CDF 중요도 샘플링, RIS(10샘플), thin-lens DOF, 배경 모드(색/이미지/envmap), ToneMapper | 알고리즘 계승: envmap IS·MIS·thin-lens DOF·배경 모드. 코드는 아래 §3 이유로 재사용하지 않음 |
| GitHub WebRTX `feature_gpu_denoiser_server` (LeeJeongChan) | Puppeteer 헤드리스 렌더 + `denoiser`(tfjs+OIDN) 서버, RabbitMQ/Redis/S3 | 같은 OIDN 가중치를 **클라이언트(WebGPU)** 에서 실행 (`oidn-web`) |
| Notion **Denoising Research** / **Path tracer denoising**(김건호) | NFOR, KPCN, G-PT, AFGSA, WSKPN, Joint Self-Attention 서베이 + OIDN/OptiX/NNEDenoiser 도입 비교 | 실전 선택은 OIDN(rt_hdr_alb_nrm, albedo+normal 보조버퍼) + 양방향 필터 폴백 |
| Notion **Lightings in real-time rendering** | 실시간 렌더러의 한계(그림자·GI) 와 Path tracer 비교, 환경맵 특성, "그림자를 위한 fake light" | 절차적 소프트박스 환경맵 설계 근거, 그림자 캐처 필요성 |
| Notion **렌더러 온보딩** (2024-10) | WebGPU/WebRTX/DXR 학습 경로, 배포는 개인 Vercel | 통합 문서(`VRINGON_INTEGRATION.md`)로 대체 |
| LinkedIn 박한길 | "약 3개월간 WebGPU 패스트레이서, BVH·MC 경로샘플링·BRDF 샘플링 직접 구현. 목표는 브라우저 노이즈 없는 실시간 렌더링" / 이후 "최종 목표까지는 못 갔지만 종료, Advanced Rendering 강의 제작" | 미완 목표(노이즈 없는 실시간)를 **디노이저 + 저해상도 프리뷰 + 누적**으로 실용화 |

## 2. 오픈소스 · 최신 기술 동향 (2024–2026)

| 프로젝트 / 기술 | 백엔드 | 상태 (2026-08) | 평가 |
|---|---|---|---|
| **three-gpu-pathtracer** (gkjohnson) 0.0.23 / 0.0.24 | WebGL2 프래그먼트 셰이더, three-mesh-bvh | 0.0.24 = 2026-02, three ≥ r180. 0.0.23 = three ≥ r151 | 웹에서 가장 성숙한 패스트레이서. MIS·면광원·스포트(IES)·Disney계 물리재질·투과·박막·시인·DOF·EquirectCamera·매트(홀드아웃). **선택** |
| three-gpu-pathtracer **WebGPUPathTracer** (main 브랜치, TSL·wavefront) | WebGPU compute | PR #713 "WebGPU Support" **미머지**, #796 NEE/MIS·#800 조명·#803 IES **open**. 2026-08 에도 활발히 커밋 중(#815~#824) | 방향성은 맞으나 조명·MIS 미완 → 아직 제품용 아님. r180+ 필요. **차기 백엔드 후보** |
| WebRTX (codedhead) / RebuilderAI 포크 | WebGPU + wasm 레이트레이싱 API 에뮬레이션 | 원본 2022 정체, 사내 포크 2025-01 정지 | DXR 스타일 API 학습 가치는 크나, 유지보수·재현성 부담 |
| Strahl (StuckiSimon, Web3D 2024 논문) | WebGPU, OpenPBR | 연구용, 조명 모델 제한 | OpenPBR 셰이딩 참고 |
| ReSTIR (DI/GI/PT) | — | 실시간 PT 의 핵심 알고리즘, 웹 구현은 실험 단계 | 다음 단계 연구 항목 (많은 광원 씬) |
| Intel OIDN 2.x 웹 포팅 — `oidn-web`(pissang), `denoiser`(DennisSmolek) | WebGPU(tfjs) | oidn-web 0.3.5, three-gpu-pathtracer 예제 있음 | **선택: oidn-web + rt_hdr_alb_nrm** |
| three.js WebGPURenderer + TSL | WebGPU/WebGL2 폴백 | r17x 이후 안정화 중, `webgpu_pathtracer` 예제(간단) | VRINGON 이 WebGPURenderer 로 넘어가면 TSL 재작성 경로 |

### 왜 WebGL2(three-gpu-pathtracer)를 골랐나 — "WebGPU 기반 패스트레이싱" 에 대한 솔직한 분석

이번 뷰어의 **패스트레이싱 커널은 WebGL2** 이고, **WebGPU 는 OIDN 디노이저에만** 쓴다. 근거:

1. **VRINGON-WEB 스택과 일치** — VRINGON-WEB(core/package.json)은 `three@^0.172`, `three-mesh-bvh@^0.9.7`, `@react-three/fiber@8`. three-gpu-pathtracer 0.0.23 은 그 위에 npm 한 줄로 얹힌다. WebGPU 패스트레이서는 별도 렌더 경로(WebGPURenderer 또는 자체 컨텍스트)를 하나 더 두어야 한다.
2. **기능 완성도** — 오늘 시점의 WebGPU 웹 패스트레이서 중 면광원+스포트+MIS+투과+박막+DOF+IES 를 모두 갖춘 것이 없다(three-gpu-pathtracer WebGPU 백엔드도 조명·MIS 가 미완). "가장 높은 품질" 을 지금 내려면 WebGL2 백엔드가 유일하다.
3. **호환성** — WebGPU 는 Chrome/Edge/Safari 26/Firefox 141+ 에서 켜졌지만 기업 PC 의 구형 Chrome·일부 Android·iOS 구버전에서 아직 빠진다. WebGL2 는 사실상 100%.
4. **성능 차이는 커널 구조가 아니라 샘플 효율에서 온다** — 같은 spp 라면 WebGPU compute wavefront 가 1.5~3배 빠를 수 있으나, 뷰어 체감 품질은 MIS·중요도 샘플링·디노이저가 좌우한다. 이번 구현은 그 세 가지에 투자했다.

WebGPU 가 더 나은 지점(정직하게): 대규모 씬의 BVH 순회 효율, 텍스처 수 제한 해제(WebGL2 는 texture array 로 우회), compute 기반 ReSTIR·디노이저 통합, 그리고 **OIDN 을 GPU 버퍼로 직접 잇는 zero-copy 파이프라인**(지금은 readPixels 왕복). 이 항목들은 §5 로드맵에 넣었다.

## 3. WebRTX(V-REN) 코드를 왜 그대로 쓰지 않았나

- 빌드체인: `wasm-pack` 으로 glslang·naga·bvh 세 크레이트를 빌드해야 하고(README 의 prebuild), 2025-01 이후 커밋이 없다. VRINGON 프론트 CI(Vite/TS) 에 Rust 툴체인을 요구하게 된다.
- 기능: 재질 3종(Lambertian/GGX/MetallicRoughness), 조명은 envmap 만(면광원 없음), 텍스처 지원 제한. 신발·주얼리(투과 스톤, 클리어코트, 시인 직물) 를 제대로 그리려면 재질 모델부터 다시 써야 한다.
- 대신 계승한 것: 렌더러 구조(경로 샘플링 방식 3모드 → MIS 토글), envmap CDF 중요도 샘플링, thin-lens DOF(f-stop·초점거리), 배경 모드(색/환경/투명), 톤매퍼, OIDN 디노이징, 라이팅룸(조명 템플릿).

## 4. 이번 뷰어가 실제로 쓰는 렌더링 기술 (검증됨)

| 기술 | 구현 | 위치 |
|---|---|---|
| 몬테카를로 경로 추적, 러시안 룰렛, 최대 8+10(투과) 바운스 | three-gpu-pathtracer WebGLPathTracer | `PathTraceViewer.ts` |
| SAH BVH (워커 빌드) | three-mesh-bvh, vite 워커 래퍼 | `bvhWorker.ts` |
| MIS: BRDF ↔ 면광원/스포트/환경맵 NEE | `multipleImportanceSampling` | 설정 패널 |
| 환경맵 중요도 샘플링(CDF) | 라이브러리 내장 (V-REN 과 동일 아이디어) | — |
| 물리 재질: metal/rough/clearcoat/sheen/transmission/IOR/iridescence/emissive/alpha | MeshPhysicalMaterial → 텍스처 어레이 | `loaders.ts` 정규화 |
| 면광원(ShapedAreaLight 원/사각), 스포트(PhysicalSpotLight, 반경·IES) | 조명 리그 5종 | `lights.ts` |
| 절차적 스튜디오 HDR(소프트박스 합성) 5종 + Poly Haven HDR 5종 + 사용자 .hdr/.exr | float equirect 생성 | `environments.ts` |
| 물리 카메라 DOF(f-stop, 조리개 날, 자동초점) | PhysicalCamera | 카메라 패널 |
| **그림자 캐처**(투명 바닥 + 그림자·접촉 AO) | 셰이더 패치: 광원/환경 4샘플 가시성 비율 | `shadowCatcher.ts` |
| **분산(보석 파이어)** — 라이브러리엔 없는 기능 | 셰이더 패치: 경로별 hero channel 로 채널별 IOR 굴절, 불편추정 | `dispersion.ts` |
| **렌더샷** HD~4K, 목표 spp, 투명, 디노이즈, 진행률/취소 | 캔버스를 잠시 목표 해상도로 바꿔 재누적 | `PathTraceViewer.renderStill` |
| 톤매핑 ACES/AgX/Neutral/… + 노출 | 표시 셰이더 | `PathTraceViewer.ts` DisplayMaterial |
| 디노이즈: 양방향(glslSmartDeNoise) / **OIDN AI**(albedo+normal 보조버퍼, WebGPU) | oidn-web | `oidn.ts` |
| 이동 중 저해상도 PT 프리뷰 → 정지 시 누적 | dynamicLowRes | 렌더 루프 |
| 투명 배경 PNG(합성용), 뷰 프리셋, 턴테이블 | — | 앱 |

검증 스냅샷: `.captures/`(dev 서버 `/__capture`) — 신발 128spp, 솔리테어 링 256spp(골드/다크 3점/HDR), 이터니티 밴드, 주얼리 에이전트 후프, 시인 체어 raw/양방향/OIDN, 투명 배경.

**OIDN 실측 메모(2026-08-19, Intel Xe-LPG iGPU · Chrome 148)**: oidn-web 의 tfjs-webgpu 커널 자체는 정상이나 `maxTileSize: 512` 로 초기화하면 결과 전체가 NaN 이 된다(256/128 은 정상). 뷰어는 기본 256 으로 초기화하고 NaN 검출 시 128 로 자동 재시도, 그래도 실패하면 양방향 필터로 폴백한다(`src/viewer/oidn.ts`). 또 oidn-web 은 타일 간 스케줄링에 `requestAnimationFrame` 을 쓰므로 **숨겨진 탭에서는 진행되지 않는다** — 서버사이드/헤드리스 렌더에서는 rAF 폴리필이 필요하다(WebRTX 의 Puppeteer 렌더서버 구조를 재활용할 때 주의).

## 4b. 2026-08-19 추가 — WebGPU 엔진 3종 심층 분석과 à-trous 디노이저

[docs/WEBGPU_ENGINES.md](WEBGPU_ENGINES.md) 에 rayzee / moonlight / strahl 소스 분석, 수렴 속도 벤치, 채택 결정(WebGL2 기본 + Rayzee 옵트인), VRINGON 적용 3단계, 리스크를 정리했다.
그 결과로 (1) `atrous.ts` 에지 보존 디노이저를 기본값으로, (2) `backends/RayzeeBackend.ts` WebGPU 엔진을, (3) 인터랙션 중 바운스 절감·lowRes 0.35 를 넣었고, 데모 스택을 three 0.185 로 올렸다.

## 5. 로드맵 (WebGPU 전환 포함)

1. **VRINGON 뷰어 연동**(즉시): `PathTraceViewer` 를 R3F 캔버스 옆 오버레이 또는 "고품질 렌더" 탭으로. 문서 `VRINGON_INTEGRATION.md`.
2. **three r180+ 업그레이드 시** three-gpu-pathtracer 0.0.24 로 올리고(HDRLoader), WebGPUPathTracer 가 조명·MIS 를 머지하면 `backend: 'webgl' | 'webgpu'` 스위치 추가 — 이 뷰어의 설정/조명/환경/재질 API 는 백엔드 무관하게 설계돼 있다.
3. **OIDN zero-copy**: WebGPU 백엔드에서는 컬러/알베도/노멀을 GPUBuffer 로 바로 넘겨 readPixels 제거.
4. **ReSTIR DI**: 조명 리그가 수십 개 광원으로 늘면 도입.
5. **서버 렌더 팜 재활용**: WebRTX `Node-Render-Server-release-v2`(Puppeteer+RabbitMQ+S3) 의 구조는 그대로 두고 렌더러만 이 뷰어의 헤드리스 모드(`/__capture` 와 같은 원리)로 교체 가능.

## 참고 링크

- three-gpu-pathtracer: https://github.com/gkjohnson/three-gpu-pathtracer (WebGPU 진행: PR #713, #796, #800, #803)
- three-mesh-bvh: https://github.com/gkjohnson/three-mesh-bvh
- oidn-web: https://github.com/pissang/oidn-web · OIDN 가중치: https://github.com/RenderKit/oidn-weights
- Physically-based Path Tracer using WebGPU and OpenPBR (Web3D 2024): https://arxiv.org/abs/2407.19977
- glslSmartDeNoise (BrutPitt) — 양방향 필터 원본
- 사내: Notion V-REN(1b3ab9f4…), Denoising Research(69887842…), Path tracer denoising(94d38138…), 렌더러 온보딩(aae8a076…), GitHub RebuilderAI/WebRTX
