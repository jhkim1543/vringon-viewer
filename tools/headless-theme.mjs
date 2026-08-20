/** 팔레트 확인: 라이트 테마 + 비교 화면 스크린샷 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 }, userDataDir: path.join(process.env.LOCALAPPDATA, 'vringon-pathtracer-headless-profile-d3d11'), protocolTimeout: 600000 });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 200)));
await page.goto('http://127.0.0.1:5230/?model=proc:solitaire-gold', { waitUntil: 'load' });
await page.waitForFunction(() => window.viewer?.getStats().samples >= 8, { timeout: 300000, polling: 1000 });
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: '.captures/palette_light.png' });
console.log('light ok');
await browser.close();
