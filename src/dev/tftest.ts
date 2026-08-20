// 개발용: 이 GPU/브라우저에서 oidn-web 이 쓰는 tfjs WebGPU 백엔드('webgpu-oidn')의 커널이 정상 동작하는지 점검
import * as tf from '@tensorflow/tfjs-core';
import { initWebGPUBackend } from 'oidn-web/lib/backend';

function arr(n: number, f: (i: number) => number) {
  const a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = f(i);
  return a;
}
const rnd = (s: number) => () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

export async function tfSanity() {
  const be = await initWebGPUBackend();
  const cnt = (a: ArrayLike<number>) => Array.from(a).filter((v) => Number.isNaN(v)).length;
  const r = rnd(7);
  const x = tf.tensor4d(arr(64 * 64 * 3, () => 1), [1, 64, 64, 3]);
  const k = tf.tensor4d(arr(3 * 3 * 3 * 8, () => 1 / 27), [3, 3, 3, 8]);
  const bias = tf.tensor1d(arr(8, () => 0.1));
  const y = tf.fused.conv2d({ x, filter: k, strides: 1, pad: 'same', bias, activation: 'relu' });
  const d = await y.data();
  const pool = tf.maxPool(y, 2, 2, 'same');
  const pd = await pool.data();
  const up = tf.image.resizeNearestNeighbor(pool, [64, 64]);
  const ud = await up.data();
  const cc = tf.concat([y, up], 3);
  const cd = await cc.data();
  const bx = tf.tensor4d(arr(128 * 128 * 48, () => r()), [1, 128, 128, 48]);
  const bk = tf.tensor4d(arr(3 * 3 * 48 * 64, () => (r() - 0.5) * 0.1), [3, 3, 48, 64]);
  const bb = tf.tensor1d(arr(64, () => 0.01));
  const by = tf.fused.conv2d({ x: bx, filter: bk, strides: 1, pad: 'same', bias: bb, activation: 'relu' });
  const bd = await by.data();
  const b2 = tf.fused.conv2d({ x: by, filter: tf.tensor4d(arr(3 * 3 * 64 * 64, () => (r() - 0.5) * 0.1), [3, 3, 64, 64]), strides: 1, pad: 'same', bias: bb, activation: 'relu' });
  const b2d = await b2.data();
  return { backend: tf.getBackend(), hasBackend: !!be, convNaN: cnt(d), conv0: d[0], poolNaN: cnt(pd), upNaN: cnt(ud), concatNaN: cnt(cd), bigConvNaN: cnt(bd), big0: bd[0], big2NaN: cnt(b2d), big2_0: b2d[0], bigLen: bd.length };
}
(window as any).tfSanity = tfSanity;

export async function tzaSanity(url = '/oidn/rt_hdr.tza') {
  const { parseTZA } = await import('oidn-web');
  const buf = await (await fetch(url)).arrayBuffer();
  const tensors = parseTZA(buf) as Map<string, { desc: { dims: number[]; dataType: string; layout: string }; data: Uint8Array }>;
  const out: any[] = [];
  let totalNaN = 0;
  const half = (h: number) => {
    const s = (h & 0x8000) ? -1 : 1, e = (h >> 10) & 0x1f, f = h & 0x3ff;
    if (e === 0) return s * Math.pow(2, -14) * (f / 1024);
    if (e === 31) return f ? NaN : s * Infinity;
    return s * Math.pow(2, e - 15) * (1 + f / 1024);
  };
  for (const [name, t] of tensors) {
    const bytes = t.data;
    let vals: number[] = [];
    if (t.desc.dataType === 'Float16') {
      const u16 = new Uint16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2);
      for (let i = 0; i < Math.min(u16.length, 200000); i++) vals.push(half(u16[i]));
    } else {
      const f32 = new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4);
      vals = Array.from(f32.slice(0, 200000));
    }
    let nan = 0, mx = 0;
    for (const v of vals) { if (Number.isNaN(v)) nan++; else if (Math.abs(v) > mx) mx = Math.abs(v); }
    totalNaN += nan;
    if (out.length < 5) out.push({ name, dims: t.desc.dims, type: t.desc.dataType, layout: t.desc.layout, bytes: bytes.byteLength, nan, mx, first: vals.slice(0, 4) });
  }
  return { count: tensors.size, totalNaN, sample: out };
}
(window as any).tzaSanity = tzaSanity;

/** 합성 입력으로 UNet 실행 → NaN 여부 (타일 크기별) */
export async function unetSanity(url = '/oidn/rt_hdr.tza', size = 128, maxTileSize = 512) {
  const { initUNetFromURL } = await import('oidn-web');
  const unet = await initUNetFromURL(url, undefined, { hdr: true, aux: false, maxTileSize });
  const w = size, h = size;
  const color = new Float32Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const x = i % w, y = Math.floor(i / w);
    const v = 0.2 + 0.6 * ((x >> 4) + (y >> 4)) % 2 + (Math.random() - 0.5) * 0.2;
    color[i * 4] = v; color[i * 4 + 1] = v * 0.8; color[i * 4 + 2] = v * 0.6; color[i * 4 + 3] = 1;
  }
  const t0 = performance.now();
  const out = await new Promise<Float32Array>((resolve, reject) => {
    try {
      unet.tileExecute({ color: { data: color, width: w, height: h }, done: (o: any) => resolve(o.data) });
    } catch (e) { reject(e); }
  });
  let nan = 0; for (let i = 0; i < out.length; i += 4) if (Number.isNaN(out[i])) nan++;
  unet.dispose();
  return { size, maxTileSize, ms: Math.round(performance.now() - t0), nan, px: w * h, sample: Array.from(out.slice(0, 4)), src: Array.from(color.slice(0, 4)) };
}
(window as any).unetSanity = unetSanity;
