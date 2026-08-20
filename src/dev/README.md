개발용 진단 모듈. 앱 번들에 포함되지 않으며 브라우저 콘솔에서 동적 임포트해 쓴다:

```js
const m = await import('/src/dev/tftest.ts');
await m.tfSanity();                                  // tfjs webgpu-oidn 커널 NaN 점검
await m.tzaSanity('/oidn/rt_hdr.tza');               // 가중치 파싱 점검
await m.unetSanity('/oidn/rt_hdr.tza', 128, 256);    // 합성 입력으로 UNet 실행 (타일 크기별)
```
