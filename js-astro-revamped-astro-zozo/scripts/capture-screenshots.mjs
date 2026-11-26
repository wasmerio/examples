import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = 'http://127.0.0.1:4321';
const outDir = 'docs/screenshots';

const pages = [
	{ path: '/', file: 'home.png' },
	{ path: '/about', file: 'about.png' },
	{ path: '/posts/template-overview', file: 'post.png' },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const target of pages) {
	const url = `${baseUrl}${target.path}`;
	await page.goto(url, { waitUntil: 'networkidle' });
	await page.waitForTimeout(500);
	await page.screenshot({ path: `${outDir}/${target.file}`, fullPage: true });
	console.log('screenshot', target.file);
}

await browser.close();
