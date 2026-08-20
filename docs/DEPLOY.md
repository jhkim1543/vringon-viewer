# 배포 — GitHub Pages + viewer.vringon.com

## 현재 상태
- 저장소: https://github.com/jhkim1543/vringon-viewer (main = 소스, gh-pages = 빌드)
- 라이브: **https://jhkim1543.github.io/vringon-viewer/** (index + /compare.html)
- 빌드는 `VITE_BASE=./`(상대 경로)라 어느 도메인/하위경로에 붙여도 그대로 동작한다.

## 재배포 절차
```bash
VITE_BASE=./ npm run build
cd dist && git init -b gh-pages && git add -A && git commit -m deploy \
  && git push -f https://jhkim1543@github.com/jhkim1543/vringon-viewer.git gh-pages && rm -rf .git
```

## viewer.vringon.com 연결 (도메인 관리자 작업 필요)
1. **DNS**: vringon.com 의 DNS 에서 `viewer` CNAME 레코드를 `jhkim1543.github.io` 로 추가.
2. **Pages 설정**: 저장소 Settings → Pages → Custom domain 에 `viewer.vringon.com` 입력
   (또는 API: `PUT /repos/jhkim1543/vringon-viewer/pages` body `{"cname":"viewer.vringon.com"}`).
   이때 gh-pages 브랜치 루트에 `CNAME` 파일이 자동 커밋된다 — 이후 재배포 시 `dist/CNAME` 에
   `viewer.vringon.com` 한 줄을 넣어 함께 push 해야 설정이 유지된다.
3. 인증서 발급(수 분~1시간) 후 **Enforce HTTPS** 체크.
4. 주의: 커스텀 도메인을 설정하면 jhkim1543.github.io/vringon-viewer 는 새 도메인으로 리다이렉트된다.
   DNS 가 준비되기 전에 설정하면 접속이 깨지므로 **DNS 먼저**.

## 첫 방문 비용 (사용자 안내용)
- Chrome/Edge + Windows: 첫 방문 1회 GPU 셰이더 컴파일 수십 초~수 분(기기별) — 화면에 단계·% 카드 표시. 이후 방문은 수 초(브라우저 셰이더 캐시).
- Firefox/Safari: 셰이더 캐시가 없어 매 방문 컴파일 비용을 치른다.
- 배포 시 셰이더 소스가 바뀌면 전 사용자 재컴파일 → `node tools/shader-hash.mjs` 로 가드.
