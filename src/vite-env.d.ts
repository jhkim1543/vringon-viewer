/// <reference types="vite/client" />
declare module 'three-mesh-bvh/src/workers/generateMeshBVH.worker.js?worker' {
  const WorkerCtor: new () => Worker;
  export default WorkerCtor;
}
declare module 'rayzee' {
  export const PathTracerApp: any;
  export const EngineEvents: Record<string, string>;
  export function configureAssets(cfg: Record<string, unknown>): void;
  export const ENGINE_DEFAULTS: Record<string, unknown>;
}
