# 브라우저 패스트레이싱 — "리얼타임" 은 어디까지 가능한가 (2026-08 조사)

> 질문: "하이엔드 GPU 가 없으면 불가한 거지?", "WebGPU 가 그 정도 성능이 안 되는 거야?"
> 조사 방법: 5 각도 병렬 리서치(스펙/브라우저 소스, 공개 벤치마크, 하드웨어 티어, 게임의 리얼타임 PT 기법, 로컬 문서) → 핵심 주장 14건 적대적 재검증(반박 0건) → 종합. 자체 보고(self-reported) 수치는 그렇게 표기.

## 1. 한 줄 결론

| 질문 | 답 |
|---|---|
| 하이엔드 GPU 없으면 불가? | **"수렴된 품질의 리얼타임"은 어떤 GPU 로도 브라우저에선 불가**(RTX 4090 포함). 가능한 것은 *1 spp/프레임 + 누적 + 디노이즈* 로 "리얼타임처럼 보이는" 프리뷰이고, 이건 **내장 GPU 에서도 된다**(해상도·바운스를 내리면). 하이엔드 GPU 는 같은 사이클을 더 높은 해상도·바운스에서 돌릴 뿐, 원리는 같다. |
| WebGPU 가 성능이 안 되나? | 성능이 아니라 **권한** 문제. WebGPU 스펙에는 하드웨어 레이트레이싱(RT 코어) 접근이 **없다**(2026-08 기준, 3 사 브라우저 모두). 그래서 BVH 순회를 컴퓨트 셰이더로 소프트웨어 처리한다 — RTX 를 꽂아도 브라우저에선 RT 코어가 논다. 게임의 "리얼타임 패스트레이싱"(Cyberpunk Overdrive 등)은 RT 코어 + ReSTIR + DLSS Ray Reconstruction 조합이고, 이 셋 중 브라우저에서 쓸 수 있는 건 ReSTIR(직접 구현 시)뿐이다. |

## 2. WebGPU 의 실제 한계 (검증된 사실)

- WebGPU 스펙 `GPUFeatureName` 23 개 중 RT 항목 0, `proposals/` 에 RT 제안 0 — [spec](https://github.com/gpuweb/gpuweb/blob/main/spec/index.bs), [proposals](https://github.com/gpuweb/gpuweb/tree/main/proposals).
- RT 확장 요청 [gpuweb#535](https://github.com/gpuweb/gpuweb/issues/535) 는 2020-01 오픈, 'Milestone 4+'(기한 없음). WG 공식 입장(2026-07-22 SIGGRAPH 슬라이드): bindless 가 선결, 아직 "mid-design", RT 는 "very soon 아님" — [Khronos 슬라이드](https://www.khronos.org/assets/uploads/developers/presentations/WebGL%2BWebGPU_-_SIGGRAPH_Jul26.pdf).
- Chrome/Dawn([dawn.json](https://github.com/google/dawn/blob/main/src/dawn/dawn.json), Tint [wgsl.def](https://github.com/google/dawn/blob/main/src/tint/lang/wgsl/wgsl.def)) RT 0(플래그 뒤에도 없음). Firefox 는 wgpu 의 네이티브 전용 `EXPERIMENTAL_RAY_QUERY` 가 있으나 [Adapter.cpp](https://github.com/mozilla-firefox/firefox/blob/main/dom/webgpu/Adapter.cpp) 는 노출 안 함. Safari 26 [GPUFeatureName.idl](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/WebGPU/GPUFeatureName.idl) 도 없음.
- 유일한 브라우저 HW-RT 는 2020 년 [dawn-ray-tracing 포크](https://github.com/maierfelix/dawn-ray-tracing)(사멸). 제3자 로드맵 분석: HW RT 는 "빨라야 2027" — [kaelan.fyi](https://kaelan.fyi/research/webgpu-future-roadmap/).
- WebGPU 컴퓨트 자체는 네이티브 대비 71~80 % 처리량(WebLLM, M3 Max — [arXiv 2412.15803](https://arxiv.org/html/2412.15803v2)). 즉 "WebGPU 가 느리다" 가 아니라 "RT 코어를 못 쓴다" 가 정확하다. 소프트웨어 BVH 는 네이티브 RTX 대비 약 4~8 배 느리다는 개발자 보고([#535 댓글](https://github.com/gpuweb/gpuweb/issues/535), 자체 보고).
- WebGL2 → WebGPU 로 바꾸면 빨라지나? 공개된 동일 알고리즘 비교는 거의 없다. three-gpu-pathtracer 의 WebGPU 포트는 초기엔 WebGL 보다 느렸고 최적화 후 "Sponza 에서 ~15 % 빠름"([PR #770](https://github.com/gkjohnson/three-gpu-pathtracer/pull/770), 자체 보고). 널리 인용되는 "20 배" 는 근거 없는 주장([issue #547](https://github.com/gkjohnson/three-gpu-pathtracer/issues/547)). Rayzee 도 WebGL 백엔드를 제거(v3.0.0)하면서 비교치를 내지 않았다. **이득은 웨이브프론트·공유메모리·컴퓨트 구조에서 오는 1.1~2 배 수준으로 보는 게 안전**하다.

## 3. 하드웨어 티어 (1 spp 당 GPU 시간 — 공개 측정치 기반)

| 티어 | 공개 측정치 | 1080p 외삽 (1 spp) | 현실적 "리얼타임" 모드 |
|---|---|---|---|
| 내장 GPU (Intel Arc 140T — 이 PC) | WebGL2 코어 13.5 spp/s @ 1120×856·8 바운스 (§4 실측) | ≈ 75 ms (8 바운스) · ≈ 55 ms (5 바운스) | 0.5 스케일 · 1 spp · 2 바운스 + 에지 보존 디노이즈(현재 기본). 정지 후 128 spp 까지 ≈ 7 s |
| Apple M1 Pro~M3 | Rayzee 1024²/8b ≈ 27~50 ms/spp, 512²/3b ≈ 13~33 ms/spp(자체 보고, [spec](https://raw.githubusercontent.com/atul-mourya/rayzee-renderer/f70902d6da6ee6ae67b327d83e0ff7cc0706c45b/docs/specs/wavefront-v2-proper-architecture.md)); strahl 논문 M1 Max 512²/depth5 ≈ 20~23 ms/spp([arXiv 2407.19977](https://arxiv.org/abs/2407.19977)); three-gpu-pathtracer WebGPU 브랜치 M1 Pro 27~45 fps(메가커널)/35~120 fps(웨이브프론트)([PR #770](https://github.com/gkjohnson/three-gpu-pathtracer/pull/770)) | ≈ 55~100 ms | 0.5~0.75 스케일 1 spp + 시간적 디노이즈 → 10~20 fps 급 |
| 노트북 RTX (3050~4060) | 브라우저 측정 공개치 없음. RT 코어 미사용 | ≈ 20~40 ms (추정) | 0.75 스케일 1 spp 인터랙티브 |
| 데스크톱 RTX 3080+ | strahl 논문 RTX 3080 512²/depth5 ≈ 7.9~10.6 ms/spp(Chrome 126) | ≈ 30~40 ms (8 배 픽셀) → 4 바운스면 ≈ 15~20 ms | 1080p 1 spp 30~60 fps + ASVGF → "리얼타임처럼" 가능 |
| (비교) 네이티브 RTX + RT 코어 | Cyberpunk Overdrive: 2 paths/px · 2 바운스, PT 패스만 1080p 에서 RTX 4070 ≈ 26 ms([chipsandcheese](https://chipsandcheese.com/p/cyberpunk-2077s-path-tracing-update)) + ReSTIR + DLSS RR 업스케일 | — | 게임이 "리얼타임 PT" 라 부르는 것도 **1~2 spp + AI 디노이즈 + 업스케일** 이다 |

핵심 레버는 **해상도**: 같은 Rayzee 엔진이 256² 에서는 0.85~4.4 ms/spp(Apple M, [bench](https://github.com/atul-mourya/rayzee-renderer/blob/main/bench/README.md)). 1080p 는 256² 의 32 배 픽셀이다.

## 4. 이 PC 실측 (Intel Arc 140T, Lunar Lake iGPU, Chrome 헤드리스 ANGLE/D3D11, 2026-08-19 밤)

| 항목 | 측정값 | 비고 |
|---|---|---|
| WebGL2 코어 누적 속도 | **13.5 spp/s** @ 1120×856, 8 바운스, à-trous (진행률 칩 `▲ spp/s`) | 5 바운스(새 기본)면 약 18 spp/s 추정 → 128 spp ≈ 7 s |
| 첫 방문 PT 셰이더 컴파일 | 헤드리스 새 프로필 **약 7 분**(378~421 s); 일반 Chrome(보이는 탭)에서는 앞선 세션 실측 1~2 분 | ANGLE 이 GLSL→HLSL→fxc 로 컴파일하는 Windows 특유의 비용. 캐시가 있어도 첫 드로우 때 D3D11 변형(variant) 컴파일로 60~90 s 정지가 남는다 |
| OIDN(oidn-web, WebGPU) 1 패스 | **7.3~11.8 s** @ 1120×856 (tile 256) | "정지 후 수 초" 목표에 쓸 수 없음 → 뷰어가 첫 패스 뒤 자동으로 à-trous 로 전환(1 Mpx 당 3 s 초과 시). Apple M/dGPU 에서는 0.1~0.5 s 급이라 그대로 OIDN 유지 |
| WebGPU 엔진(Rayzee 7.22.8) | 첫 샘플까지 **63 s**, 이후 **0.49 spp/s** @ 1120×856 | 같은 iGPU 에서 WebGL2 의 1/27. 어댑터 `intel xe-lpg`(D3D12). 이 PC 에서는 WebGPU 가 답이 아니다 — 옵트인 유지 |
| à-trous(에지 보존, G-버퍼) | < 10 ms/프레임 | 22 spp 스크린샷(`.captures/diag_d3d11.png`)이 이미 매끈 — 이 PC 의 실전 디노이저 |

측정 스크립트: `tools/headless-run.mjs`, `tools/headless-engines.mjs`, `tools/headless-oidn.mjs`, `tools/headless-diag.mjs` (결과 `.captures/`). 헤드리스는 Chrome 의 셰이더 디스크 캐시를 재사용하지 않는 듯해 매 실행 풀 컴파일이 든다.

## 5. 무엇이 "리얼타임처럼" 보이게 하는가

1. 프레임당 **1 spp** 만 쏜다(해상도 0.5~0.75).
2. **시간적 재투영 + 분산 가이드 필터**(SVGF/ASVGF — 2017 년 Titan X 에서 1080p 1 spp 를 ~10 ms 에 복원, [NVIDIA](https://research.nvidia.com/publication/2017-07_spatiotemporal-variance-guided-filtering-real-time-reconstruction-path-traced-global)) 로 노이즈를 가린다. Rayzee 의 ASVGF 가 이 계열이고, 우리 WebGL2 코어는 공간 à-trous 만 있다(시간적 재투영 없음 → 움직일 때 더 거칠다).
3. 멈추면 누적해 수백~수천 spp 로 수렴(= 지금의 "패스트레이싱 누적 n %").
4. 게임은 여기에 ReSTIR(유효 spp 수십~수만 배)와 RT 코어, DLSS Ray Reconstruction 을 얹는다 — 브라우저엔 RT 코어·DLSS 가 없다.

## 6. 권장 (우리 데모 / VRINGON)

- 기본 엔진 WebGL2 유지, Rayzee WebGPU 옵트인 유지 — iGPU 에서 20 s+ WGSL 컴파일과 세션 편차를 감수할 공개 이득이 없다.
- 인터랙션: 스케일 0.5, 1 spp, 2 바운스, à-trous ON(현재 기본). 정지: 스케일 1, 5 바운스(투과 10), **128 spp 기본**(High 512 / Ultra 2048).
- "몇 % 짜리 화면인지"는 진행률 칩(%, spp, spp/s, 남은 시간, 잔여 노이즈 ≈ 100/√spp) + 상단 누적 바로 항상 노출(누적 타임라인은 T 키, 기본 숨김).
- 리얼타임 체감을 더 올리려면 다음 단계는 **시간적 재투영(ASVGF)** 을 WebGL2 코어에 추가하는 것(모션 벡터 = 래스터 G-buffer 에서 얻을 수 있음) — RT 코어 없이 얻을 수 있는 가장 큰 체감 개선.
- 고객 안내 문구: "브라우저에서는 RTX 도 RT 코어를 쓰지 못한다 — 그래서 조작 중엔 근사 프리뷰, 멈추면 수렴 렌더."

## 7. "더 빨라질 방법은 없나 / 패스트레이싱 말고 다른 방법은?" (2026-08-19 추가)

목표: **한 번 카메라를 옮긴 뒤 ~5 초 안에 고품질**. 이 PC(iGPU) 기준 레버를 효과 순으로:

| # | 방법 | 기대 효과 (이 PC) | 상태 |
|---|---|---|---|
| 1 | 기본값 조정 — 5 바운스 · 128 spp · 프리뷰 0.5 스케일 | 100 % 까지 50 s → **~7 s**, 2~3 s 에 "보기 좋은" 그림(à-trous) | **적용됨** |
| 2 | Resolution 75 % | 1.8 배 (128 spp ≈ 4 s). 노트북 DPR 1 에선 차이 거의 안 보임 | UI 선택지 |
| 3 | **시간적 재투영(ASVGF 류 히스토리 재사용)** — 카메라를 옮겨도 이전 수렴 결과를 모션벡터로 끌어와 재사용, 새로 드러난 부분만 누적 | 궤도 회전·줌 같은 "작은 이동" 에서 체감 대기 **거의 0**(수십 ms 뒤 80~90 % 품질). 유리/보석의 시점 의존 반사는 고스트가 남아 분산·스펙큘러 채널은 분리 처리 필요 | 다음 단계(WebGL2 코어 ~1 주). RT 코어 없이 얻을 수 있는 가장 큰 개선 |
| 4 | 적응형 샘플링(분산이 큰 픽셀에만 샘플 집중) | 같은 시간에 1.5~2 배 체감 품질 | three-gpu-pathtracer 에 없음, 타일 가중치로 구현 가능 |
| 5 | 분산(dispersion) 을 초반엔 끄고 32 spp 이후에 켜기 | 초반 무지개 점묘 제거(보석 노이즈의 절반) | 간단, 다만 32 spp 전후로 룩이 바뀜 |
| 6 | AI 디노이즈(OIDN) | dGPU/Apple M: 16~32 spp 에서 "완성" 룩 (1~2 s). **이 iGPU 는 7~12 s/패스라 무의미** → 자동 전환 | 적용됨(적응형) |
| 7 | **하이브리드**: 조작 중·직후는 래스터 PBR(IBL + 화면공간 굴절 + 베이크 소프트섀도) 로 PT 와 최대한 같은 룩, PT 는 정지 후 "리파인" 레이어로만 | 대기 0, 60 fps. 보석의 진짜 굴절·분산·코스틱은 래스터로 안 됨 → 정지 후 PT 가 채움 | 설계 제안 — 래스터 룩을 PT 룩에 맞추는 튜닝이 핵심 |
| 8 | **서버 렌더(클라우드 RTX)**: RTX 4090 + OptiX(또는 헤드리스 Chrome + 이 뷰어)가 1080p 수백 spp 를 2~5 s 에 렌더해 이미지 스트림 | 클라이언트 GPU 무관 "5 초 고품질" 을 확실히 달성하는 유일한 길. 인프라·비용 | VRINGON 렌더샷/공유 링크용으로 먼저 도입 권장 |
| 9 | 사전 계산: 제품별 턴테이블 프레임(예: 72 각도×3 조명) 을 미리 렌더, 뷰어는 이미지 시퀀스 + 자유시점만 래스터 | 카탈로그 뷰는 대기 0 | 고정 카메라 경로에만 |
| 10 | 셰이더 컴파일(첫 방문 1~7 분, Windows/Intel): 모델+환경 준비 뒤 1 회만 컴파일(적용됨), 진행 표시(적용됨) | 재방문 캐시. 근본 해결은 셰이더 축소/WebGPU 이동인데 이 iGPU 의 WebGPU 는 27 배 느림 | 문서화 |

"패스트레이싱 말고" 의 솔직한 답: 보석·금속·패브릭의 **정확한** 룩(굴절·분산·코스틱·GI)을 브라우저에서 내는 방법은 패스트레이싱뿐이다. 대안들은 (a) 기다림을 숨기는 것(3·7), (b) 계산을 다른 곳으로 옮기는 것(8·9)이다. 권장 조합: **3(재투영) + 7(래스터 룩 맞추기) 를 클라이언트에, 8 을 렌더샷/공유에**.

## 8. 구현: 권장 조합 A/B (2026-08-20)

`/compare.html` — 좌 **A = 권장 조합**(시간적 재투영 + 하이브리드 채움 + à-trous), 우 **B = 기존**(리셋 후 재누적 + à-trous). 같은 모델·조명, 카메라 동기화, 디노이저 양쪽 à-trous 고정. ↻ 15° 회전 / 자동 ×6 으로 "이동 후 깨끗(유효 spp ≥ 32)까지" 를 표로.

### 시간적 재투영 (`src/viewer/temporal.ts`)
- G-버퍼(재질 교체 패스): 월드 노멀(옥타헤드럴) · 선형 깊이 · 재질 클래스(0 확산 / 1 광택 금속 / 2 투과 / 3 바닥).
- 카메라가 바뀐 프레임: 픽셀 → 월드 → 이전 화면 재투영, 유효성 = 화면 안 · 깊이 오차 < 2 % · 노멀 내적 > 0.9 · 같은 클래스. 배경은 재사용 안 함(1 spp 로 정확).
- 클래스별 히스토리 상한: 확산·바닥 64 · 금속 6 · 투과 2 — 보석·하이라이트는 시점이 바뀌면 값이 달라져 오래 믿지 않는다(고스팅 방지).
- 합성 `out = (hist·w_h + new·N + raster·w_r)/(w_h+N+w_r)` — new 는 three-gpu-pathtracer 의 리셋 이후 누적(정지: 풀해상 N, 이동 중: 0.5 스케일 1 spp = 0.5), raster 는 유효 샘플 < 8 인 확산·금속 픽셀만(보석 제외: 래스터 굴절 룩이 PT 와 너무 다름).
- 표시용 present 패스(알파 1). **함정(실측 재발)**: 재투영 가중치에 프레임마다 ×0.9 감쇠를 걸면 드래그 중 60~144 fps 로 반복돼 0.9^N 으로 히스토리가 증발 — 상한만 두고 감쇠는 두지 않는다.
- 뷰어 설정 `render.temporal / hybridFill` (기본 꺼짐, Tracer ▸ Advanced 토글). `effectiveSamples` = 새 N + 제품 픽셀 평균 히스토리 가중치(바닥 제외) 가 stats/frame 이벤트로 나간다.

### A/B 실측 (이 PC, 헤드리스, 15° 회전 ×3, 디노이저 양쪽 à-trous)

| 모델 | A 이동 후 깨끗(유효 ≥ 32 spp)까지 | B | 배율 | 메모 |
|---|---|---|---|---|
| 스니커즈(패브릭·고무, 확산) — 묵은 hist 수정 후 최종 | **88~95 ms** | 3.1~3.2 s | **33~37×** | 확산 표면은 히스토리 40~60 spp 를 그대로 재사용 — 이동 직후 바로 "깨끗". `docs/renders/ab_shoe_1s_after_fixed.png` |
| 다이아 솔리테어 링(골드) — 수정 후 최종 | 3.1~3.4 s | 3.8~3.9 s | **1.1~1.3×** | 제품 픽셀이 광택 금속(상한 6)·보석(상한 2)뿐이라 수치상 이득이 작다. 대신 **이동 직후 프레임**은 A 가 매끈(히스토리 + 래스터 채움 + à-trous), B 는 저해상 생 노이즈 — `docs/renders/ab_ring_during_move.png` |

발견·수정(실측 재발 방지):
- 재투영 가중치에 프레임마다 ×0.9 감쇠 → 드래그 중 히스토리 증발(제거).
- 표 행 추가 → 푸터 높이 변화 → 뷰포트 리사이즈 → 히스토리 소실 → 푸터 높이 고정 + `TemporalReprojector` 가 리사이즈에서도 히스토리를 유지하도록 변경(이전 크기 텍스처를 uv 로 샘플).
- 이동 중 저해상 1 spp 샘플(선형 업샘플·바운스 축소)을 히스토리에 저장하면 실루엣 주변에 어두운 헤일로가 굳는다(신발 실측) → 이동 중 샘플은 **표시에만** 쓰고 저장하지 않는다(정지·풀해상 샘플만 저장).
- **패스스루의 묵은 hist(2026-08-20 심야, 트레이스로 확정)**: `beginInteraction` 직후 카메라가 아직 안 움직인 1 프레임(easeInOut 첫 스텝 ≈ 0)이 storeNew=false 로 "hist 패스스루" 를 저장하는데, 정적 구간의 hist 는 마지막 재투영(심하면 씬 로드 때 클리어된 0) 그대로인 묵은 값 → 0 을 저장해 체인 파괴(신발 20× → 1.0× 로 퇴행). 수정: 패스스루 소스를 "이번 프레임에 reproject 실행됨 ? hist : blend[직전]" 으로. storeNew=true(정지 누적)는 항상 hist — blend[직전]을 쓰면 리셋 이후 샘플이 이중 계산된다.

## 9. 첫 컴파일 대기 — 원인 규명과 개선 (2026-08-20)

"셰이더 컴파일 중" 이 왜 몇 분씩 걸리는지 계측으로 분해했다. 커널은 **GLSL 4,061줄 / 105 KB 단일 프래그먼트 셰이더** 하나다(`node tools/shader-hash.mjs`).

### 9.1 낭비되던 중복 컴파일 (수정 완료)
새 프로필 계측 로그(`tools/headless-compile-probe.mjs`):
- t=2.9 s: `FEATURE_BACKGROUND_MAP:0, FEATURE_FOG:1` **잠정값**으로 1차 컴파일 시작
- t=128 s: 1차 완료 → `onBeforeRender` 가 최종값 `(1, 0)` 으로 뒤집음 → **재컴파일 2회**
- 첫 샘플까지 **279 s**

원인은 `PhysicalPathTracingMaterial.onBeforeRender` 가 매 프레임 디파인을 재계산하는데 기본값과 최종값이 다르다는 것. 추가로 저해상 프리뷰 트레이서가 **패치 전 셰이더 소스**를 가진 자기 재질을 써서 또 다른 변형을 만들었다.
→ `PathTraceViewer.prepareShaderOnce()`: 컴파일 전에 최종 디파인을 박아넣고, `onBeforeRender` 가 되돌리지 못하게 감싸고, 저해상 트레이서가 같은 재질을 쓰게 했다.

| | 첫 샘플까지 | 재컴파일 |
|---|---|---|
| 수정 전 | 279 s | 2회 |
| **수정 후** | **176 s** | **0회** |

### 9.2 진짜 병목은 fxc — ANGLE 백엔드 실측 (같은 PC·같은 빌드)
| ANGLE 백엔드 | 첫 샘플까지 | 누적 속도 |
|---|---|---|
| **D3D11** (Chrome Windows 기본) | **176.5 s** | ~7 spp/s |
| **Vulkan** (`--use-angle=vulkan`) | **11 s** | ~7.3 spp/s |

**16배 차이이고 런타임 성능 손해는 없다.** Windows WebGL 은 GLSL→ANGLE→HLSL→**fxc(D3DCompile)**→드라이버 경로를 타는데, 이 fxc 최적화가 큰 셰이더에서 초선형으로 폭발한다(ANGLE 이슈에 "D3DCompile 이 ANGLE 자체 컴파일러보다 한 자릿수 느리다" 는 프로파일 보고가 있다). Vulkan 백엔드는 SPIR-V 를 최적화 없이 내보내고 드라이버가 컴파일해 fxc 를 통째로 우회한다.
→ **웹 페이지에서는 이 스위치를 바꿀 수 없다.** 데모·키오스크·Electron 래핑에서는 `--use-angle=vulkan` 으로 띄우면 즉시 16배 이득.

### 9.3 캐시가 유지되는 조건 (배포 시 중요)
브라우저 컴파일 캐시 키는 **셰이더 소스 해시 + ANGLE 버전 + GPU 문자열**이다(Chromium `MemoryProgramCache::ComputeHash`). URL·빌드 해시·오리진과 **무관**하다.
- 셰이더 문자열이 그대로면 **새 빌드를 배포해도 캐시가 유지**된다 → `tools/shader-hash.mjs` 로 해시를 고정하고 CI 에서 검사한다(`--update` 로 의도한 변경만 갱신).
- 반대로 three.js 버전 업이나 패치 문자열 한 글자 변경도 전 사용자 재컴파일을 부른다.
- Chrome 업데이트(≈4주마다 ANGLE 갱신)는 불가피한 재컴파일이다. GPU 드라이버 업데이트는 WebGL 경로에선 렌더러 문자열에 드라이버 버전이 없어 **캐시가 살아남는다**.
- 디스크 캐시는 프로필당 기본 **6 MB LRU 공유** — 다른 3D 사이트를 많이 쓰면 밀려날 수 있다.
- Firefox 는 WebGL 프로그램 디스크 캐시가 **아예 없다**([Bugzilla 918941](https://bugzilla.mozilla.org/show_bug.cgi?id=918941), 13년째 미해결) → 매 방문 전체 컴파일. Safari 도 영속 캐시가 없다. **"두 번째 방문은 수 초" 는 Chrome/Edge 한정 보장**이다.

### 9.4 진행률 표시
셰이더 컴파일에는 **진짜 진행률 API 가 없다** — `KHR_parallel_shader_compile` 은 완료 여부 boolean(`COMPLETION_STATUS_KHR`) 뿐이다. 그래서 진행률 칩은 **이 기기의 지난 컴파일 실측값(localStorage, 키 = GPU 문자열 + 셰이더 길이)** 대비 경과로 추정치를 보여주고, 첫 방문에는 기기 종류(ANGLE-D3D + 내장 GPU 여부)로 기본 추정한다. 추정을 넘어서면 95 % 에서 멈춰 기다리고 실제 완료 시 100 % 로 스냅한다(거짓 완료 금지). 문구에 "추정" 근거를 함께 적는다.

## 10. 실시간화 적용 결과 (2026-08-20, 권장 조합 기본 ON)

딥리서치 3건(브라우저 셰이더 캐시 / 컴파일 시간 단축 / 실시간 패스트레이싱 기법)을 실측으로 검증해 적용한 것들.

### 10.1 적용 — 누적 속도 2.2배
| 항목 | 근거 | 효과(이 PC, 1120×856) |
|---|---|---|
| **`tiles` 2 → 1** | 타일마다 고정 오버헤드(시저·상태·유니폼). 스윕 실측 tiles 1/2/3 = **17.3 / 8.2 / 4.4 spp/s** | **2.1배** |
| **BVH 순회 스택 60 → 30 슬롯** (`BVH_STACK_DEPTH` 디파인 + `maxDepth 28`) | 프래그먼트마다 240 B 사설 배열이 레지스터를 스크래치로 흘린다. three-mesh-bvh 업스트림 측정 macOS +43 % / Android +275 % | 위 수치에 포함 |
| **패스별 à-trous 휘도 허용폭 감쇠(0.7^i)** | 커널 간격이 2배씩 넓어지는데 허용폭이 고정이면 앞 패스의 뭉갬을 다시 뭉갠다 | 디테일 보존(속도 무관) |
| 결과 | | **128 spp 27 s → 7.7 s** (7.2 → **15.9 spp/s**) |

`samplesPerFrame` 은 1 유지(2·4 로 올려도 throughput 동일, 응답성만 나빠짐).

### 10.2 이미 최적이라 손댈 필요 없던 것 (리서치로 확인)
- **BVH 빌드**: 라이브러리가 이미 `strategy: SAH, targetLeafSize 1, indirect` — 최고 품질 설정.
- **샘플링**: `RANDOM_TYPE 2` = 계층화 + **픽셀별 블루노이즈 오프셋**(Cranley–Patterson 회전, void-and-cluster 생성) — 이미 Arnold 식 블루노이즈 디더링이다. "블루노이즈 도입" 작업은 불필요.
- **러시안 룰렛·파이어플라이 클램프**: `FEATURE_RUSSIAN_ROULETTE` 안에 `min(1/rrProb, 20)` 로 융합되어 이미 동작. **RR 을 끄면 클램프도 같이 사라진다**(끄지 말 것).
- **경로 정규화**: `filterGlossyFactor 0.5` 로 이미 켜져 있음.

### 10.3 남은 후보 (효과 순, 미적용)
1. **적응형 해상도(DRS)** — 조작 중에만. 해상도를 바꾸면 누적 버퍼가 리셋되므로 정지 중에는 쓸 수 없다. Unreal 값 참고: 예산의 90 % 목표, 16프레임 중앙값, 8프레임 잠금, 0.5 하한.
2. **픽셀 프리즈/적응형 종료** — 수렴한 픽셀을 건너뛴다(제품 샷은 배경·바닥이 대부분이라 이득이 크다).
3. **SVGF 모멘트(시간적 분산)** — 우리 재투영이 이미 절반을 해놨다. 단, 금속 6 / 보석 2 spp 상한 때문에 그 클래스는 히스토리가 짧아 이득이 확산 표면에 한정된다.
4. **불투명 전용 any-hit 그림자 레이** — 라이브러리에 `bvhIntersectAnyHit` 가 들어 있으나 **호출되지 않는 죽은 코드**. 신발·패브릭에서 이득.
5. **환경맵 CDF 의 sin(θ) 가중 누락** — 업스트림 TODO. 극점을 과대표집한다(편향은 없고 분산만 손해). 스튜디오 HDRI 에서 이득.
