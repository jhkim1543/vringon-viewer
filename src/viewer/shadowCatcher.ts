import type { ShaderMaterial } from 'three';

/**
 * 그림자 캐처(shadow catcher) 셰이더 패치.
 *
 * three-gpu-pathtracer 의 `matte` 재질은 원래 "홀드아웃"(첫 광선이 닿으면 vec4(0) 반환) 이라
 * 바닥이 투명해질 뿐 그림자를 받지 못한다. 제품 뷰어에는 "투명한 바닥 + 그림자만" 이 필요하므로
 * 첫 광선이 matte 표면에 닿았을 때:
 *   1) 그 지점에서 광원/환경맵 방향을 K개 중요도 샘플링해
 *   2) 가려짐 여부(shadow ray)를 검사하고
 *   3) 가시성 비율 vis = Σ(w·visible)/Σ(w)  (w = 복사휘도·cosθ / pdf) 를 구해
 *   4) 불투명 배경이면 배경색 × vis, 투명 배경이면 (0,0,0, 1-vis) 를 출력한다.
 * 즉 바닥은 보이지 않고 그림자(와 접촉 AO)만 남는다. 누적은 선형이므로 프레임이 쌓일수록 수렴한다.
 *
 * PhysicalPathTracingMaterial 의 fragmentShader 문자열을 직접 치환하며, 원본 라이브러리는 건드리지 않는다.
 * (three-gpu-pathtracer 0.0.23 기준. 업그레이드 시 아래 두 앵커 문자열이 유지되는지 확인할 것)
 */
export const SHADOW_CATCHER_SAMPLES = 4;

const MATTE_BLOCK = /\/\/ early out if this is a matte material\s*if \( material\.matte && state\.firstRay \) \{\s*gl_FragColor = vec4\( 0\.0 \);\s*break;\s*\}/;

const VISIBILITY_FN = /* glsl */ `
	uniform float shadowCatcherStrength;

	// 그림자 캐처용 가시성 비율. directLightContribution 과 같은 광원/환경 샘플링을 쓰되
	// BSDF 대신 램버시안 cos 가중치만 사용하고, 차폐 여부를 비율로 돌려준다.
	float shadowCatcherVisibility( SurfaceRecord surf, RenderState state, vec3 rayOrigin ) {

		float num = 0.0;
		float den = 0.0;
		RenderState shadowState = state;
		shadowState.isShadowRay = true; // castShadow=false 인 물체(바닥 자신 등)는 통과

		for ( int k = 0; k < ${SHADOW_CATCHER_SAMPLES}; k ++ ) {

			vec4 r = rand4( 9 + k );
			vec3 sampleDir = vec3( 0.0 );
			vec3 emission = vec3( 0.0 );
			float pdf = 0.0;
			float dist = INFINITY;

			if ( lightsDenom != 0.0 && r.x < float( lights.count ) / lightsDenom ) {

				LightRecord lightRec = randomLightSample( lights.tex, iesProfiles, lights.count, rayOrigin, r.yzw );
				sampleDir = lightRec.direction;
				emission = lightRec.emission;
				pdf = lightRec.pdf / lightsDenom;
				dist = lightRec.dist;

			} else if ( envMapInfo.totalSum != 0.0 && environmentIntensity != 0.0 ) {

				vec3 envColor, envDirection;
				float envPdf = sampleEquirectProbability( r.yz, envColor, envDirection );
				sampleDir = invEnvRotation3x3 * envDirection;
				emission = environmentIntensity * envColor;
				pdf = envPdf / lightsDenom;

			}

			float cosTheta = dot( surf.faceNormal, sampleDir );
			if ( pdf <= 0.0 || cosTheta <= 0.0 ) continue;

			float w = luminance( emission ) * cosTheta / pdf;
			if ( ! ( w > 0.0 ) || w > 1e6 ) continue; // NaN/firefly 방지
			den += w;

			Ray shadowRay;
			shadowRay.origin = rayOrigin;
			shadowRay.direction = sampleDir;
			vec3 attenuatedColor;
			if ( ! attenuateHit( shadowState, shadowRay, dist, attenuatedColor ) ) {

				num += w * clamp( luminance( attenuatedColor ), 0.0, 1.0 );

			}

		}

		return den > 0.0 ? clamp( num / den, 0.0, 1.0 ) : 1.0;

	}

	void main() {`;

const CATCHER_BLOCK = /* glsl */ `
						// shadow catcher: 바닥은 투명, 그림자(가시성 비율)만 남긴다
						if ( material.matte && state.firstRay ) {

							SurfaceRecord catcherSurf;
							if (
								shadowCatcherStrength > 0.0 &&
								getSurfaceRecord( material, surfaceHit, attributesArray, state.accumulatedRoughness, catcherSurf ) != SKIP_SURFACE
							) {

								vec3 catcherPoint = stepRayOrigin( ray.origin, ray.direction, catcherSurf.faceNormal, surfaceHit.dist );
								float vis = shadowCatcherVisibility( catcherSurf, state, catcherPoint );
								float shade = 1.0 - shadowCatcherStrength * ( 1.0 - vis );
								if ( backgroundAlpha < 0.5 ) {

									gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 - shade );

								} else {

									gl_FragColor = vec4( sampleBackground( ray.direction, rand2( 2 ) ) * shade, 1.0 );

								}

							} else {

								gl_FragColor = vec4( 0.0 );

							}
							break;

						}`;

export function patchShadowCatcher(material: ShaderMaterial, strength = 1): boolean {
  const src = material.fragmentShader;
  if (src.includes('shadowCatcherVisibility')) return true;
  if (!MATTE_BLOCK.test(src) || !src.includes('void main() {')) {
    console.warn('[shadow-catcher] 셰이더 앵커를 찾지 못해 패치를 건너뜁니다 (three-gpu-pathtracer 버전 확인)');
    return false;
  }
  let out = src.replace(MATTE_BLOCK, CATCHER_BLOCK);
  // 마지막 void main 앞에 함수 삽입 (main 은 파일에 하나뿐)
  const idx = out.lastIndexOf('void main() {');
  out = out.slice(0, idx) + VISIBILITY_FN + out.slice(idx + 'void main() {'.length);
  material.fragmentShader = out;
  material.uniforms.shadowCatcherStrength = { value: strength };
  material.needsUpdate = true;
  return true;
}
