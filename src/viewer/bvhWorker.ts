import { Box3, BufferAttribute, BufferGeometry } from 'three';
import { MeshBVH } from 'three-mesh-bvh';
// vite 의 ?worker 접미사로 three-mesh-bvh 의 워커 스크립트를 번들한다.
// (패키지 안의 `new Worker(new URL(...))` 는 vite 의존성 사전번들 단계에서 경로가 깨져 쓸 수 없다)
import BvhWorkerCtor from 'three-mesh-bvh/src/workers/generateMeshBVH.worker.js?worker';

/**
 * three-mesh-bvh 의 GenerateMeshBVHWorker 와 같은 프로토콜을 쓰는 vite 호환 래퍼.
 * three-gpu-pathtracer 의 setBVHWorker() 에 그대로 넘길 수 있다 (generate(geometry, options) → Promise<MeshBVH>).
 */
export class ViteBVHWorker {
  name = 'ViteBVHWorker';
  running = false;
  worker: Worker | null;

  constructor() {
    this.worker = new BvhWorkerCtor();
    this.worker.onerror = (e) => {
      console.error('[bvh worker]', e.message ?? e);
    };
  }

  generate(geometry: BufferGeometry, options: any = {}): Promise<MeshBVH> {
    if (this.running) throw new Error('ViteBVHWorker: Already running job.');
    if (!this.worker) throw new Error('ViteBVHWorker: Worker has been disposed.');
    this.running = true;
    const promise = this.runTask(this.worker, geometry, options);
    promise.finally(() => (this.running = false));
    return promise;
  }

  private runTask(worker: Worker, geometry: BufferGeometry, options: any): Promise<MeshBVH> {
    return new Promise((resolve, reject) => {
      const posAttr = geometry.getAttribute('position') as BufferAttribute;
      if ((posAttr as any).isInterleavedBufferAttribute || (geometry.index && (geometry.index as any).isInterleavedBufferAttribute)) {
        reject(new Error('ViteBVHWorker: InterleavedBufferAttribute are not supported.'));
        return;
      }
      worker.onerror = (e) => reject(new Error(`ViteBVHWorker: ${e.message}`));
      worker.onmessage = (e) => {
        const { data } = e;
        if (data.error) {
          reject(new Error(data.error));
          worker.onmessage = null;
        } else if (data.serialized) {
          const { serialized, position } = data;
          const bvh = MeshBVH.deserialize(serialized, geometry, { setIndex: false });
          const boundsOptions = Object.assign({ setBoundingBox: true }, options);
          // transfer 로 비워진 배열을 되돌려 놓는다
          (geometry.attributes.position as BufferAttribute).array = position;
          if (serialized.index) {
            if (geometry.index) {
              (geometry.index as BufferAttribute).array = serialized.index;
            } else {
              geometry.setIndex(new BufferAttribute(serialized.index, 1, false));
            }
          }
          if (boundsOptions.setBoundingBox) geometry.boundingBox = bvh.getBoundingBox(new Box3());
          if (options.onProgress) options.onProgress(data.progress);
          resolve(bvh);
          worker.onmessage = null;
        } else if (options.onProgress) {
          options.onProgress(data.progress);
        }
      };

      const index = geometry.index ? (geometry.index.array as ArrayLike<number> & { buffer: ArrayBufferLike }) : null;
      const position = posAttr.array as ArrayLike<number> & { buffer: ArrayBufferLike };
      const transferable: ArrayBufferLike[] = [position.buffer];
      if (index) transferable.push(index.buffer);
      worker.postMessage(
        {
          index,
          position,
          options: { ...options, onProgress: null, includedProgressCallback: Boolean(options.onProgress), groups: [...geometry.groups] },
        },
        transferable.filter((b) => typeof SharedArrayBuffer === 'undefined' || !(b instanceof SharedArrayBuffer)) as Transferable[],
      );
    });
  }

  dispose() {
    this.worker?.terminate();
    this.worker = null;
  }
}
