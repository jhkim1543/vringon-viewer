/** 컴파일 진행률 칩 UI 확인: 새 프로필(캐시 없음)로 열고 컴파일 도중 스크린샷 + 칩 텍스트를 찍는다. */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
const angle = process.argv[2] ?? 'd3d11';
const profile = path.join(process.env.TEMP ?? '.', `ptui-${angle}-${Date.now()}`);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', `--use-angle=${angle}`, '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 }, userDataDir: profile, protocolTimeout: 600000 });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
const t0 = Date.now();
let shots = 0;
while (Date.now() - t0 < 600000) {
  await new Promise((r) => setTimeout(r, 3000));
  let s;
  try { s = await page.evaluate(() => { const st = window.viewer?.getStats(); return st ? { phase: st.phase, chip: document.getElementById('progress-chip').innerText.replace(/\n/g, ' | '), fill: document.getElementById('progress-fill').style.width } : null; }); } catch { continue; }
  if (!s) continue;
  console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(s));
  if (s.phase === 'compiling' && shots < 2 && Date.now() - t0 > 12000) { shots++; await page.screenshot({ path: `.captures/compile_ui_${shots}.png` }); }
  if (s.phase === 'tracing' || s.phase === 'done') { await page.screenshot({ path: '.captures/compile_ui_done.png' }); break; }
}
await browser.close();
try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
