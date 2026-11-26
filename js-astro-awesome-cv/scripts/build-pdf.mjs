import { preview } from 'astro';
import { chromium } from 'playwright';

const server = await preview({ logLevel: 'error' });
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.port}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: 'dist/cv.pdf', preferCSSPageSize: true, printBackground: true });
} finally {
  await browser.close();
  await server.stop();
}
