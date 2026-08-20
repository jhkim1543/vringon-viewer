import { defineConfig, type Plugin } from 'vite';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// 개발 전용: 브라우저가 렌더 결과(PNG dataURL)를 POST /__capture 로 보내면 .captures/ 에 저장한다.
// 헤드리스 검증·회귀 스냅샷용이며 프로덕션 빌드에는 포함되지 않는다.
function capturePlugin(): Plugin {
  return {
    name: 'vringon-capture',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__capture', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          try {
            const { name, dataUrl } = JSON.parse(body) as { name: string; dataUrl: string };
            const m = /^data:image\/(png|jpeg);base64,(.+)$/.exec(dataUrl);
            if (!m) throw new Error('bad dataUrl');
            const dir = join(process.cwd(), '.captures');
            mkdirSync(dir, { recursive: true });
            const file = join(dir, `${(name || 'capture').replace(/[^\w.-]/g, '_')}.${m[1] === 'png' ? 'png' : 'jpg'}`);
            writeFileSync(file, Buffer.from(m[2], 'base64'));
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ ok: true, file }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, error: String(e) }));
          }
        });
      });
    },
  };
}

// GitHub Pages 등 하위 경로 배포 시 VITE_BASE=/repo-name/ 로 지정
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [capturePlugin()],
  // .captures/ 는 헤드리스 하네스의 스크린샷·Chrome 프로필(잠긴 파일) 이 쌓이는 곳 — 감시하면 EBUSY 로 dev 서버가 죽는다
  server: { host: true, watch: { ignored: ['**/.captures/**', '**/dist/**'] } },
  build: {
    target: 'es2022',
    outDir: 'dist',
    rollupOptions: { input: { main: 'index.html', compare: 'compare.html' } },
    sourcemap: false,
    chunkSizeWarningLimit: 4000,
  },
  optimizeDeps: {
    include: ['three', 'three-mesh-bvh', 'three-gpu-pathtracer'],
  },
});
