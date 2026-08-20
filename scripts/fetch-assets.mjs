// 데모용 공개 에셋(모델·HDR·디노이저 가중치·디코더)을 public/ 아래로 내려받는다.
// 모두 재배포 가능한 라이선스(CC0 / CC BY 4.0 / Apache-2.0)이며, 출처는 public/ASSETS.md 참고.
import { mkdir, writeFile, copyFile, stat, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const GLTF = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models';
const PH = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k';
// oidn-weights 는 Git LFS 라 raw.githubusercontent 가 아니라 media 도메인에서 받아야 실제 바이너리가 온다
const OIDN = 'https://media.githubusercontent.com/media/RenderKit/oidn-weights/master';

const files = [
  // 샘플 모델 (glTF-Sample-Assets, CC BY 4.0 / CC0)
  { url: `${GLTF}/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb`, out: 'samples/MaterialsVariantsShoe.glb' },
  { url: `${GLTF}/DamagedHelmet/glTF-Binary/DamagedHelmet.glb`, out: 'samples/DamagedHelmet.glb' },
  { url: `${GLTF}/SheenChair/glTF-Binary/SheenChair.glb`, out: 'samples/SheenChair.glb' },
  { url: `${GLTF}/IridescenceLamp/glTF-Binary/IridescenceLamp.glb`, out: 'samples/IridescenceLamp.glb' },
  { url: `${GLTF}/ToyCar/glTF-Binary/ToyCar.glb`, out: 'samples/ToyCar.glb' },
  // HDRI (Poly Haven, CC0)
  { url: `${PH}/studio_small_09_1k.hdr`, out: 'hdr/studio_small_09_1k.hdr' },
  { url: `${PH}/brown_photostudio_02_1k.hdr`, out: 'hdr/brown_photostudio_02_1k.hdr' },
  { url: `${PH}/lebombo_1k.hdr`, out: 'hdr/lebombo_1k.hdr' },
  { url: `${PH}/kloofendal_48d_partly_cloudy_puresky_1k.hdr`, out: 'hdr/kloofendal_48d_partly_cloudy_puresky_1k.hdr' },
  { url: `${PH}/moonless_golf_1k.hdr`, out: 'hdr/moonless_golf_1k.hdr' },
  // OIDN 가중치 (Apache-2.0)
  { url: `${OIDN}/rt_hdr.tza`, out: 'oidn/rt_hdr.tza' },
  { url: `${OIDN}/rt_hdr_alb_nrm.tza`, out: 'oidn/rt_hdr_alb_nrm.tza' },
];

async function download({ url, out }) {
  const dest = join(pub, out);
  if (existsSync(dest) && (await stat(dest)).size > 0) {
    console.log('skip  ', out);
    return;
  }
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log('saved ', out, (buf.length / 1e6).toFixed(2), 'MB');
}

async function copyDir(src, dst) {
  await mkdir(dst, { recursive: true });
  for (const f of await readdir(src, { withFileTypes: true })) {
    const s = join(src, f.name), d = join(dst, f.name);
    if (f.isDirectory()) await copyDir(s, d); else await copyFile(s, d);
  }
}

for (const f of files) {
  try { await download(f); } catch (e) { console.error('FAIL  ', f.out, e.message); }
}
// three.js 디코더(Draco / Basis) 복사 — GLB 압축 텍스처·지오메트리 지원
await copyDir(join(root, 'node_modules/three/examples/jsm/libs/draco/gltf'), join(pub, 'libs/draco'));
await copyDir(join(root, 'node_modules/three/examples/jsm/libs/basis'), join(pub, 'libs/basis'));
console.log('decoders copied');
