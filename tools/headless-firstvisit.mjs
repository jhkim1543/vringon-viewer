/** 첫 방문 카드 확인: 캐시 없는 새 프로필로 열어 컴파일 단계의 카드·% 를 스크린샷 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
const profile = path.join(process.env.TEMP ?? '.', `ptfv-${Date.now()}`);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 }, userDataDir: profile, protocolTimeout: 600000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
const t0 = Date.now();
let took = 0;
while (Date.now() - t0 < 90000) {
  await new Promise((r) => setTimeout(r, 3000));
  let s;
  try { s = await page.evaluate(() => { const st = window.viewer?.getStats(); const fv = document.getElementById('first-visit'); return st ? { phase: st.phase, fvHidden: fv.hidden, fvText: fv.hidden ? '' : fv.innerText.replace(/\n/g, ' | ') } : null; }); } catch { continue; }
  if (!s) continue;
  console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(s).slice(0, 240));
  if (s.phase === 'compiling' && !s.fvHidden && Date.now() - t0 > 20000 && !took) { took = 1; await page.screenshot({ path: '.captures/firstvisit_card.png' }); break; }
}
await browser.close();
try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
