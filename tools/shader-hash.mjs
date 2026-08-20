/**
 * 패스트레이서 최종 GLSL 해시 가드.
 *
 * 브라우저의 컴파일 캐시 키는 **셰이더 소스 해시 + ANGLE 버전 + GPU 문자열** 이다
 * (URL·빌드 해시와 무관 — Chromium `MemoryProgramCache::ComputeHash`).
 * 즉 셰이더 문자열이 한 글자라도 바뀌면 전 사용자가 첫 컴파일을 다시 치른다
 * (이 PC 실측: ANGLE/D3D11 경로에서 약 3분).
 * 그래서 셰이더 소스를 빌드 산출물처럼 취급해 해시를 고정하고, 의도치 않은 변경을 잡는다.
 *
 *   node tools/shader-hash.mjs           # 현재 해시 + 기준값 비교 (다르면 exit 1)
 *   node tools/shader-hash.mjs --update  # 의도한 변경일 때 기준값 갱신
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const BASELINE = path.resolve('tools/shader-hash.json');
const NL = String.fromCharCode(10);

const ENTRY = [
  "import { PhysicalPathTracingMaterial } from 'three-gpu-pathtracer';",
  "import { patchShadowCatcher } from './src/viewer/shadowCatcher';",
  "import { patchDispersion } from './src/viewer/dispersion';",
  "import { patchTexelFetch1D } from './src/viewer/texelFetch';",
  'const mat = new PhysicalPathTracingMaterial();',
  'patchShadowCatcher(mat, 0.85);',
  'patchDispersion(mat, 1);',
  'patchTexelFetch1D(mat);',
  'globalThis.__SRC = mat.fragmentShader;',
].join(NL);

const out = await build({
  stdin: { contents: ENTRY, resolveDir: process.cwd(), loader: 'ts' },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  logLevel: 'silent',
});
const dataUrl = 'data:text/javascript;base64,' + Buffer.from(out.outputFiles[0].text).toString('base64');
await import(dataUrl);

const src = globalThis.__SRC;
const info = {
  hash: createHash('sha256').update(src).digest('hex').slice(0, 16),
  lines: src.split(NL).length,
  bytes: src.length,
};
console.log(JSON.stringify(info));

if (process.argv.includes('--update')) {
  fs.writeFileSync(BASELINE, JSON.stringify(info, null, 1) + NL);
  console.log('기준값 갱신:', BASELINE);
  process.exit(0);
}
if (!fs.existsSync(BASELINE)) {
  console.log('기준값 없음 — --update 로 생성하세요.');
  process.exit(0);
}
const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
if (base.hash !== info.hash) {
  console.error(`${NL}셰이더 소스가 바뀌었습니다: ${base.hash} → ${info.hash}`);
  console.error('의도한 변경이면 `node tools/shader-hash.mjs --update`. 아니면 되돌리세요 —');
  console.error('배포하면 모든 사용자가 첫 컴파일(D3D11 경로에서 수 분)을 다시 치릅니다.');
  process.exit(1);
}
console.log('셰이더 소스 동일 — 사용자 컴파일 캐시 유지됨.');
