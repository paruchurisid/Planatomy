import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const browser = await chromium.launch({ executablePath: process.env.VIEWER_BROWSER, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
const buttons = page.locator('.livery-toolbar button');
if (await buttons.count() !== 4) throw new Error(`Expected 4 livery buttons, found ${await buttons.count()}`);
for (const name of ['American', 'United', 'Alaska', 'Delta']) {
  await buttons.filter({ hasText: name }).click();
  await page.waitForTimeout(180);
  const heading = await page.locator('.left-panel h1 .aircraft-subtitle').textContent();
  if (!heading?.includes(name)) throw new Error(`Livery did not switch to ${name}: ${heading}`);
}
const pixels = await page.locator('canvas').screenshot({ type: 'png' });
if (pixels.length < 10000) throw new Error('Viewer canvas screenshot is unexpectedly empty');
console.log(`livery smoke test passed (${await buttons.count()} variants)`);
await browser.close();
