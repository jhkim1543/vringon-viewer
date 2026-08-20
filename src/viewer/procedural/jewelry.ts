import {
  BufferGeometry,
  Color,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  TorusGeometry,
  Vector2,
} from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * 절차적 주얼리 — 파일 없이 만드는 다이아몬드 솔리테어 링.
 * 금속(gold/platinum/rose) 밴드 + 4프롱 세팅 + 라운드 브릴리언트 컷 다이아(투과 IOR 2.42).
 * 패스트레이싱의 강점(굴절·내부 전반사·금속 상호반사·바닥 그림자)을 한 장면에서 보여주기 위한 샘플이며,
 * VRINGON 주얼리 에이전트가 만드는 GLB 와 함께 "주얼리 샘플" 로 제공한다.
 */

export type MetalKind = 'gold' | 'rose' | 'platinum';

export const METALS: Record<MetalKind, { color: number; roughness: number }> = {
  gold: { color: 0xffc766, roughness: 0.18 },
  rose: { color: 0xf0a58f, roughness: 0.2 },
  platinum: { color: 0xe6e8ea, roughness: 0.14 },
};

export function makeMetalMaterial(kind: MetalKind = 'gold') {
  const m = METALS[kind];
  const mat = new MeshPhysicalMaterial({ color: m.color, metalness: 1, roughness: m.roughness });
  mat.name = `metal_${kind}`;
  return mat;
}

export function makeDiamondMaterial(color = 0xffffff) {
  const mat = new MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness: 0.0,
    transmission: 1,
    ior: 2.42,
    thickness: 0.6,
    attenuationColor: new Color(0xffffff),
    attenuationDistance: 10,
    specularIntensity: 1,
  });
  mat.name = 'diamond';
  return mat;
}

/**
 * 라운드 브릴리언트 컷 근사: 테이블 – 크라운(8각) – 거들 – 파빌리온(뾰족) 을 회전체로 만들고
 * 낮은 세그먼트로 두어 면(facet)이 살아 있게 한다. flat shading 을 위해 정점을 공유하지 않는다.
 */
export function makeBrilliantGeometry(radius = 1, segments = 16): BufferGeometry {
  const table = 0.55 * radius; // 테이블 반경
  const crownH = 0.35 * radius;
  const girdleH = 0.06 * radius;
  const pavilionH = 0.85 * radius;
  const pts = [
    new Vector2(0, crownH + girdleH), // 테이블 중심(정점)
    new Vector2(table, crownH + girdleH),
    new Vector2(radius * 0.86, girdleH + crownH * 0.35), // 크라운 중간 (bezel)
    new Vector2(radius, girdleH),
    new Vector2(radius, 0), // 거들
    new Vector2(radius * 0.55, -pavilionH * 0.55), // 파빌리온 중간
    new Vector2(0, -pavilionH), // 큘릿
  ];
  // LatheGeometry 는 프로파일을 아래→위 순서로 줘야 법선이 바깥을 향한다 (반대면 안팎이 뒤집혀 투과가 검게 나온다)
  pts.reverse();
  const lathe = new LatheGeometry(pts, segments);
  // 면을 살리기 위해 인덱스를 풀어 flat normal 계산
  const flat = lathe.toNonIndexed();
  flat.computeVertexNormals();
  return flat;
}

export interface RingOptions {
  metal?: MetalKind;
  bandRadius?: number; // 링 안지름 반경 (m) — 실제 크기 ~8.5mm
  bandThickness?: number; // 밴드 단면 반경
  gemRadius?: number;
  gemColor?: number;
}

export function buildSolitaireRing(opts: RingOptions = {}): Group {
  const metal = makeMetalMaterial(opts.metal ?? 'gold');
  const bandR = opts.bandRadius ?? 0.0085;
  const bandT = opts.bandThickness ?? 0.0011;
  const gemR = opts.gemRadius ?? 0.0032;
  const g = new Group();
  g.name = 'VRINGON Solitaire Ring';

  // 밴드: XY 평면 토러스 → 링이 서 있는 자세 (보석이 +Y)
  const band = new Mesh(new TorusGeometry(bandR, bandT, 32, 128), metal);
  band.name = 'band';
  g.add(band);

  // 헤드(보석 받침): 밴드 위 얇은 원통 + 4 프롱
  const headY = bandR + bandT * 0.4;
  const seatGeo = new CylinderGeometry(gemR * 0.75, gemR * 0.55, gemR * 0.35, 24);
  const seat = new Mesh(seatGeo, metal);
  seat.position.set(0, headY + gemR * 0.15, 0);
  seat.name = 'seat';
  g.add(seat);

  // 다이아: 파빌리온 끝이 받침 안에 살짝 잠기게
  const gemY = headY + gemR * 0.95;
  const gem = new Mesh(makeBrilliantGeometry(gemR, 16), makeDiamondMaterial(opts.gemColor ?? 0xffffff));
  gem.position.set(0, gemY, 0);
  gem.name = 'diamond';
  g.add(gem);

  // 4 프롱: 받침에서 올라와 거들 위 크라운 초입(거들+0.18r)에서 안쪽으로 살짝 굽어 스톤을 잡는다
  const prongTop = gemY + gemR * 0.18;
  const prongH = prongTop - headY;
  const prongGeos: BufferGeometry[] = [];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const pg = new CylinderGeometry(bandT * 0.34, bandT * 0.42, prongH, 12);
    // 위로 갈수록 스톤 쪽으로 기울여 물리는 느낌
    pg.translate(0, prongH / 2, 0);
    pg.rotateZ(0.14);
    pg.rotateY(-a);
    pg.translate(Math.cos(a) * gemR * 1.02, headY, Math.sin(a) * gemR * 1.02);
    prongGeos.push(pg);
  }
  const prongs = new Mesh(mergeVertices(mergeGeometries(prongGeos)), metal);
  prongs.name = 'prongs';
  g.add(prongs);
  return g;
}

/** 이터니티 밴드: 밴드 둘레에 작은 스톤을 파베 세팅 */
export function buildEternityBand(opts: { metal?: MetalKind; stones?: number } = {}): Group {
  const metal = makeMetalMaterial(opts.metal ?? 'platinum');
  const bandR = 0.0085;
  const bandT = 0.0012;
  const g = new Group();
  g.name = 'VRINGON Eternity Band';
  const band = new Mesh(new TorusGeometry(bandR, bandT, 32, 160), metal);
  g.add(band);
  const n = opts.stones ?? 24;
  const stoneR = 0.0009;
  const stoneGeo = makeBrilliantGeometry(stoneR, 12);
  const gemMat = makeDiamondMaterial();
  const stones = new Group();
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const m = new Mesh(stoneGeo, gemMat);
    // 링 바깥면 위, 방사 방향으로 세운다
    const r = bandR + bandT * 0.75;
    m.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
    m.lookAt(0, 0, 0);
    m.rotateX(-Math.PI / 2);
    stones.add(m);
  }
  stones.name = 'pave';
  g.add(stones);
  return g;
}

/** 검증용: 지오메트리에 position 이 있는지 등 간단 체크 */
export function countTriangles(g: Group): number {
  let n = 0;
  g.traverse((o) => {
    const m = o as Mesh;
    if (!m.isMesh) return;
    const geo = m.geometry;
    n += Math.floor((geo.index ? geo.index.count : (geo.getAttribute('position') as Float32BufferAttribute).count) / 3);
  });
  return n;
}
