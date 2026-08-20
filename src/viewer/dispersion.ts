import type { ShaderMaterial } from 'three';

/**
 * 분산(dispersion, 보석의 "파이어") 셰이더 패치.
 *
 * three-gpu-pathtracer 0.0.23/0.0.24 는 투과 재질의 IOR 을 파장과 무관하게 하나만 쓰므로 다이아몬드의
 * 무지개 파이어가 나오지 않는다. 주얼리 뷰어에는 필수라 "hero channel" 방식으로 넣는다:
 *   - 경로(픽셀 샘플)마다 R/G/B 중 하나의 채널을 고르고,
 *   - 투과 재질을 지날 때 그 채널의 IOR(ior ± halfSpread)을 쓰며,
 *   - 실제로 투과를 거친 경로만 마지막에 (해당 채널 ×3, 나머지 0) 마스크를 곱한다.
 * 채널 선택이 균등(1/3)이므로 기대값은 세 채널을 따로 렌더한 것과 같고(불편추정), 색 노이즈는 누적으로 사라진다.
 * halfSpread 는 three.js 래스터 투과의 근사식 (ior-1)·0.025·dispersion 과 같은 스케일 — dispersion=1 이 대략 다이아몬드(nF-nC≈0.044).
 */

const RAY_ANCHOR = 'Ray ray = getCameraRay();';
const SURF_ANCHOR = 'scatterRec = bsdfSample( - ray.direction, surf );';
const TAIL_ANCHOR = 'gl_FragColor.a *= opacity;';

const DECL = /* glsl */ `
	uniform float dispersion;
	int heroChannel = 1;
	bool heroUsed = false;

	void main() {`;

const INIT = /* glsl */ `Ray ray = getCameraRay();
					heroChannel = int( min( rand( 13 ) * 3.0, 2.0 ) );
					heroUsed = false;`;

const APPLY = /* glsl */ `// dispersion: 투과 재질은 채널별 IOR 로 굴절시킨다 (dispersion.ts)
						if ( dispersion > 0.0 && surf.transmission > 0.0 && ! surf.thinFilm ) {

							float halfSpread = ( surf.ior - 1.0 ) * 0.025 * dispersion;
							surf.ior += halfSpread * float( heroChannel - 1 );
							surf.eta = surf.frontFace ? 1.0 / surf.ior : surf.ior;
							surf.f0 = iorRatioToF0( surf.eta );
							heroUsed = true;

						}

						scatterRec = bsdfSample( - ray.direction, surf );`;

const TAIL = /* glsl */ `if ( heroUsed ) {

						gl_FragColor.rgb *= vec3(
							heroChannel == 0 ? 3.0 : 0.0,
							heroChannel == 1 ? 3.0 : 0.0,
							heroChannel == 2 ? 3.0 : 0.0
						);

					}

					gl_FragColor.a *= opacity;`;

export function patchDispersion(material: ShaderMaterial, strength = 1): boolean {
  const src = material.fragmentShader;
  if (src.includes('heroChannel')) return true;
  const mainIdx = src.lastIndexOf('void main() {');
  if (mainIdx < 0 || !src.includes(RAY_ANCHOR) || !src.includes(SURF_ANCHOR) || !src.includes(TAIL_ANCHOR)) {
    console.warn('[dispersion] 셰이더 앵커를 찾지 못해 패치를 건너뜁니다 (three-gpu-pathtracer 버전 확인)');
    return false;
  }
  let out = src.slice(0, mainIdx) + DECL + src.slice(mainIdx + 'void main() {'.length);
  out = out.replace(RAY_ANCHOR, INIT);
  out = out.replace(SURF_ANCHOR, APPLY);
  // 마지막 앵커(경로 루프가 끝난 뒤)만 바꾼다
  const tailIdx = out.lastIndexOf(TAIL_ANCHOR);
  out = out.slice(0, tailIdx) + TAIL + out.slice(tailIdx + TAIL_ANCHOR.length);
  material.fragmentShader = out;
  material.uniforms.dispersion = { value: strength };
  material.needsUpdate = true;
  return true;
}
