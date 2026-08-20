import type { ShaderMaterial } from 'three';

/**
 * BVH 순회의 텍셀 주소 계산에서 정수 나눗셈/나머지를 없앤다.
 *
 * three-mesh-bvh 의 `common_functions`(node_modules/three-mesh-bvh/src/webgl/glsl/common_functions.glsl.js)에는
 * 본문이 글자 그대로 같은 세 함수 `uTexelFetch1D` / `iTexelFetch1D` / `texelFetch1D` 가 있고,
 * 모두 페치마다 `index % width` 와 `index / width` 를 돈다.
 * GPU 에는 정수 나눗셈 명령이 없어 드라이버가 float 역수 시퀀스로 낮추는데,
 * 텍스처 폭이 컴파일 타임 상수가 아니라(MeshBVHUniformStruct / VertexAttributeTexture 가 모두 ceil(sqrt(n)) 계열이라
 * 2의 거듭제곱이 아니다) shift/mask 로의 강도 감소도 불가능하다.
 * BVH 순회는 내부 노드당 3회, 잎당 그 이상 호출되는 크리티컬 패스다.
 *
 * 이 패치는 **읽는 텍셀이 비트 단위로 동일**하다 — 주소를 더 싸게 계산할 뿐이라 이미지가 바뀌지 않는다.
 *
 * 정확성 조건: 요소 수 < 2^24. float(idx) 가 무손실이고 몫이 텍스처 한 변(현재 최대 수백)을 넘지 않아
 * 반올림 오차가 1 보다 훨씬 작으므로 ±1 보정으로 항상 정확한 텍셀을 읽는다.
 * 그보다 큰 지오메트리를 지원하게 되면 이 패치를 되돌릴 것(현재 샘플 최대 39.9k 삼각형).
 *
 * three-gpu-pathtracer 의 sampler2DArray 오버로드는 말미가 `texelFetch( tex, ivec3( uv, layer ), 0 )` 라
 * 아래 정규식에 걸리지 않는다 — 의도된 것이다(정확히 3개만 치환).
 */
const TEXEL_FETCH_1D =
  /uint width = uint\( textureSize\( tex, 0 \)\.x \);\s*uvec2 uv;\s*uv\.x = index % width;\s*uv\.y = index \/ width;\s*return texelFetch\( tex, ivec2\( uv \), 0 \);/g;

const FAST_BODY = /* glsl */ `int w = textureSize( tex, 0 ).x;
	float invW = 1.0 / float( w ); // 루프 불변 — 순회 루프 밖으로 호이스트된다
	int idx = int( index );
	int y = int( float( idx ) * invW );
	int x = idx - y * w;
	if ( x < 0 ) { x += w; y -= 1; }
	else if ( x >= w ) { x -= w; y += 1; }

	return texelFetch( tex, ivec2( x, y ), 0 );`;

/** 적용됨 = true. 앵커를 못 찾으면 셰이더를 건드리지 않고 false (앱은 그대로 동작). */
export function patchTexelFetch1D(material: ShaderMaterial): boolean {
  const src = material.fragmentShader;
  if (src.includes('float invW = 1.0 / float( w );')) return true;
  const matches = src.match(TEXEL_FETCH_1D);
  if (!matches || matches.length !== 3) {
    console.warn(`[texel-fetch] 앵커 ${matches?.length ?? 0}/3 개만 찾아 패치를 건너뜁니다 (three-mesh-bvh 버전 확인)`);
    return false;
  }
  material.fragmentShader = src.replace(TEXEL_FETCH_1D, FAST_BODY);
  material.needsUpdate = true;
  return true;
}
