# VRINGON Path Tracer Viewer

**라이브 데모**: https://jhkim1543.github.io/vringon-viewer/ · A/B 비교: https://jhkim1543.github.io/vringon-viewer/compare.html
(커스텀 도메인 `viewer.vringon.com` 연결 절차는 `docs/DEPLOY.md`)

패스트레이싱 기반 고품질 3D 웹 뷰어. 업로드한 모델(GLB/GLTF/OBJ/STL/FBX)을 원점·바닥에 고정하고
스튜디오 조명·HDR·피사계 심도·그림자 캐처·AI 디노이즈로 제품 사진 품질로 보여준다.
VRINGON 3D 뷰어에 붙이기 위한 프레임워크 무관 코어(`src/viewer/`)와 데모 셸(`src/app/`)로 나뉜다.

```bash
npm install
npm run assets   # 샘플 모델·HDR·OIDN 가중치·디코더 내려받기 (최초 1회, 재배포 가능 라이선스만)
npm run dev      # http://localhost:5230
npm run build    # dist/  (정적 배포)
```

## 무엇을 쓰나

- **렌더 커널(기본)**: three-gpu-pathtracer 0.0.24 on three 0.185 (WebGL2 몬테카를로 경로 추적, SAH BVH, MIS, 면광원/스포트/IES, 물리 재질, 물리 카메라). VRINGON(three 0.172)에는 0.0.23 으로 그대로 붙는다.
- **WebGPU 엔진(옵트인)**: [Rayzee](https://github.com/atul-mourya/rayzee-renderer) 7.22 wavefront 패스트레이서 — ASVGF(시간적 재투영)·픽셀 프리즈·OIDN(GPU 버퍼)·Light BVH. 패널 「렌더링 → 엔진」에서 전환, 실패 시 WebGL2 복귀. 분석·결정 근거: [docs/WEBGPU_ENGINES.md](docs/WEBGPU_ENGINES.md)
- **에지 보존 디노이즈(기본)**: 알베도 디모듈레이션 + 래스터 G-버퍼 à-trous 4회 + 128 spp 페이드 (`src/viewer/atrous.ts`) — 정지 직후 수 spp 에서 깨끗, 누적되면 무편향 원본으로
- **디노이즈**: 양방향 필터(glslSmartDeNoise) / **OIDN**(Intel Open Image Denoise 가중치, WebGPU 실행, albedo+normal 보조버퍼)
- **그림자 캐처**: 투명 바닥에 그림자·접촉 AO 만 남기는 셰이더 패치 (`src/viewer/shadowCatcher.ts`)
- **분산(보석 파이어)**: 투과 재질의 채널별 IOR(hero-channel) 셰이더 패치 (`src/viewer/dispersion.ts`)
- **렌더샷**: 해상도(HD~4K·정사각·세로)·샘플 수·투명 배경·디노이즈를 지정해 고해상도 정지 이미지를 저장, 진행률·취소·갤러리
- **환경**: 절차적 스튜디오 소프트박스 5종(파일 없음) + Poly Haven HDR 5종 + 사용자 .hdr/.exr
- **조명 리그**: 3점 / 탑 소프트박스 / 스트립 악센트 / 스포트 (V-REN 2.0 계획서의 "라이팅룸")
- **디자인**: VRINGON 디자인시스템 ver3 토큰 그대로(인디고 `#444AE8`/`#5D6CFA`), 다만 장식적 쓰임을 절제해 전문 도구 톤을 유지한다(스파클 ✦ 등 AI 시그니처 글리프 제거, 강조색은 상호작용 요소에만).
- **UI**: VRING:ON Create 화면 톤(다크 기본, GNB · 중앙 캔버스 · **우측 패널 = 탭(Tracer/Camera/Light/Material/Render/Info) + 접이식 그룹(Path Tracer/Scene/Denoising/Advanced)** · 하단 플로팅 툴바 · 「✦ 렌더샷 생성」) — VRINGON UI 시스템 ver3 토큰(`src/app/tokens.css`, Pretendard). 필수 조정값만 노출하고 나머지는 Advanced 로.
- **진행률 UX**: 캔버스 상단 칩이 단계(씬 준비 → 셰이더 컴파일 → 실시간 프리뷰 → 패스트레이싱 누적 n% → 완료)와 `n% · spp/목표` 를 항상 보여준다. 기본 목표 **128 spp**(Quality: Draft 32 / Standard 128 / High 512 / Ultra 2048 / Unlimited).
- **빠른 수렴 기본값** (사용자 요구: "한 번 옮기고 5 초 안에 고품질"): 5 바운스(투과 10) · 128 spp · AI 디노이즈(OIDN) 기본 — 4·8·16·32·64·128 spp 기하급수 스케줄. 단, 시작 시 256² 속도 점검으로 풀프레임 예상이 2 s 를 넘는 GPU(인텔 Arc 140T iGPU: 실측 7~12 s/패스)에서는 **à-trous 로 자동 시작**하고 토스트로 알린다(Denoising 에서 다시 고르면 존중). WebGPU 없음/실패도 à-trous 폴백. 아직 느리면 Resolution 75 % (1.8 배). 이 PC 실측: 정지 후 2~3 s 에 보기 좋은 그림, 128 spp 100 % 까지 10~18 s(7~13 spp/s).
- **프리뷰 룩**: 카메라 조작 중엔 50 % 해상도 · 2 바운스 · 선형 필터 + 경량 à-trous 로 "큰 픽셀 블록" 대신 부드러운 저해상 이미지 → 정지 후 풀해상 누적이 점점 선명해진다.
- **실시간 모드 = 권장 조합 (기본 ON)** — Tracer ▸ Path Tracer ▸ `Realtime Mode`. 시간적 재투영 + 하이브리드 래스터 채움 (`src/viewer/temporal.ts`, `render.temporal / hybridFill`): 카메라를 옮기면 직전 결과를 새 시점으로 재투영해(깊이·노멀·재질 클래스 검사) 유효 픽셀은 "이미 n 샘플 쌓인 것" 으로 재사용, 유효 샘플이 8 미만인 픽셀은 래스터(IBL PBR, 선형) 로 메워 생 노이즈를 숨긴다. 클래스별 히스토리 상한 확산 64 · 금속 6 · 투과 2(보석 고스팅 방지). **A/B 비교 화면 `/compare.html`** — 좌: 권장 조합, 우: 기존 패스트레이서, 카메라 동기화, ↻ 15° 회전/자동 테스트로 "이동 후 깨끗(유효 32 spp)까지" 시간을 표로 비교.
- **속도 튜닝(2026-08-20, 실측)**: `tiles` 1(2였음 — 타일 오버헤드가 이 iGPU 에서 지배적, **2.1배**), BVH 순회 스택 60→30 슬롯(`BVH_STACK_DEPTH` + `maxDepth 28`, 레지스터 압박 완화), à-trous 휘도 허용폭을 패스마다 0.7배씩 축소. **128 spp 27 s → 6.4 s (15.5 spp/s)**.
- **기기별 자동 프로파일** (`src/app/deviceProfile.ts`): 첫 방문엔 GPU 문자열로 티어를 추정해 시작 설정을 고르고(고성능 → 256 spp, 저전력 → 내부 해상도 75 % + à-trous), 누적이 완주될 때마다 실측 spp/s 를 localStorage 에 기록해 **재방문부터는 실측 기반**으로 해상도·목표 spp 를 조정한다(수렴 12 s 초과 예상 → 75 %, 3 s 미만 → 256 spp). WebGPU 는 OIDN 디노이저가 활용하며 시작 시 256² 속도 점검으로 이득일 때만 자동 선택된다. Info 탭에서 적용된 프로파일 확인.
- **첫 방문 안내 카드**: 이 기기에 컴파일 기록이 없으면 캔버스에 3단계(리소스 다운로드 → 씬 준비(BVH %) → 셰이더 컴파일 약 n % · 남은 시간) 카드를 띄우고, 누적이 시작되면 자동으로 사라진다.
- **첫 컴파일**: 모델·환경 준비 후 **1회만** 컴파일하도록 디파인을 미리 확정(`prepareShaderOnce()`) — 재컴파일 2회 제거로 첫 샘플 279 s → 176 s. 진행률 칩이 "약 n % · 경과 · 남은 ≈" 를 추정 표시(셰이더 컴파일에는 진행률 API 가 없어 이 기기의 지난 실측값 기준). 셰이더 소스가 바뀌면 전 사용자가 재컴파일하므로 `node tools/shader-hash.mjs` 로 소스 해시를 고정한다.
- **누적 가시화**: 진행률 칩 2행에 `▲ spp/s · 경과 · 남은 ≈ · 잔여 노이즈 ≈ 100/√spp %`, 스테이지 상단 2 px 누적 바. 좌측 **누적 타임라인**(`src/app/timeline.ts`, 1 → 2 → 4 → … spp 마일스톤 프레임 필름스트립, hover A/B · click 분할 비교)은 **기본 숨김** — 단축키 `T` 로 켠다. WebGL2 엔진 전용.
- **첫 방문 컴파일**: 패스트레이서 셰이더는 모델 + 환경맵이 준비된 뒤 **1회만** 컴파일한다(빈 씬으로 먼저 컴파일하던 2중 컴파일 제거). 인텔 Arc 140T(Lunar Lake iGPU) 에서 첫 컴파일 1~2 분 실측, Chrome 의 셰이더 디스크 캐시 덕에 재방문은 수 초. 칩이 경과 시간과 함께 상태를 표시한다.

리서치·기술 선택 근거: [docs/RESEARCH.md](docs/RESEARCH.md) · VRINGON 연동: [docs/VRINGON_INTEGRATION.md](docs/VRINGON_INTEGRATION.md)

## 조작

| 키/동작 | 기능 |
|---|---|
| 드래그 / 휠 | 궤도 회전 / 줌 (모델은 축에 고정) |
| 파일 드롭 | 모델 또는 .hdr/.exr 환경맵 |
| Space | Path tracing ↔ 래스터 |
| R | 누적 초기화 |
| F | 3/4 뷰로 프레이밍 |
| H | 패널 접기 |
| ¾ F L R B T | 뷰 프리셋 |
| 화면 저장 | 현재 누적 결과 그대로(투명 배경 모드면 알파 포함) |
| 렌더샷 | 지정 해상도·샘플로 다시 누적해 저장 (`viewer.renderStill()`), 진행 중 취소 가능 |

URL 파라미터: `?model=samples/xxx.glb` 또는 `?model=proc:solitaire-gold | proc:solitaire-platinum | proc:eternity`

## 폴더

```
src/viewer/            프레임워크 무관 코어
  PathTraceViewer.ts   뷰어 본체(설정·루프·합성·이벤트)
  environments.ts      절차적 스튜디오 HDR 생성 + 프리셋 + 로더
  lights.ts            조명 리그 정의/빌드
  loaders.ts           GLB/OBJ/STL/FBX 로드, 재질 정규화, 축 정렬
  shadowCatcher.ts     그림자 캐처 셰이더 패치
  dispersion.ts        분산(보석 파이어) 셰이더 패치
  atrous.ts            에지 보존 à-trous 디노이저 (G-버퍼·알베도 디모듈레이션)
  backends/RayzeeBackend.ts  WebGPU(Rayzee) 엔진 어댑터
  oidn.ts              OIDN(oidn-web) 래퍼 + albedo/normal 보조버퍼
  bvhWorker.ts         vite 호환 BVH 워커
  procedural/jewelry.ts 솔리테어 링 / 이터니티 밴드 생성
src/app/               데모 셸(UI)
public/                samples/, hdr/, oidn/, libs/ (npm run assets)
docs/                  RESEARCH.md, WEBGPU_ENGINES.md, VRINGON_INTEGRATION.md
scripts/fetch-assets.mjs
```

## 검증 방법 (헤드리스)

dev 서버에는 `/__capture` 엔드포인트가 있어 브라우저에서 `viewer.captureImage()` 결과를 `.captures/` 에 저장할 수 있다.
콘솔에서 `window.viewer` 로 뷰어에 접근한다. 예: `viewer.setLights('three-point'); viewer.setEnvironment({presetId:'studio-dark'})`.

**헤드리스 Chrome 하네스** (`puppeteer-core`, 설치된 Chrome 을 `--use-angle=d3d11` 로 실행 — 실제 GPU, rAF 60fps+ 정상 동작):

```bash
node tools/headless-run.mjs "http://127.0.0.1:5230/?model=proc:solitaire-gold" 300 ring   # 누적 로그 + 마일스톤 스크린샷
node tools/headless-ux.mjs  "http://127.0.0.1:5230/?model=proc:solitaire-gold" 300        # 타임라인 hover/click/드래그 UX 검증
node tools/headless-compare.mjs "http://127.0.0.1:5230/compare.html?model=proc:solitaire-gold" 800 3   # A/B: 15° 회전 3회, 이동 1 s 후 스크린샷 + 표
node tools/headless-verify.mjs "proc:solitaire-gold" verify_ring --warm  # 콜드/누적 속도 + 스크린샷(--warm 은 캐시 재사용)
node tools/headless-coldstart.mjs vulkan 900     # ANGLE 백엔드별 첫 컴파일 비교 (d3d11 176 s vs vulkan 11 s)
node tools/headless-knobs.mjs                    # samplesPerFrame × tiles 스윕 → spp/s
node tools/shader-hash.mjs                       # 셰이더 소스 해시 가드 (--update 로 갱신)
```

`.captures/chrome-profile/` 을 영구 프로필로 써서 셰이더 캐시가 유지된다(첫 실행은 컴파일 1~4 분, 이후 수 초). 숨겨진 브라우저 pane(rAF 정지)에서 `viewer.loop()` 를 수십 번 동기 호출하는 식의 검증은 GPU 과부하 → 컨텍스트 손실로 이어지니 쓰지 말 것.
