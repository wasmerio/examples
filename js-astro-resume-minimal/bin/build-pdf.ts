import { promisify } from 'node:util';
import child_process from 'node:child_process';

import { chromium } from 'playwright';

const exec = promisify(child_process.exec);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });

  const commit = (await exec('git rev-parse --short HEAD')).stdout.trim();

  await page.pdf({
    // example: resume-2026-05-06-b7ffaa8.pdf
    path: `pdf-exports/resume-${new Date().toISOString().replace(/T.*/, '')}-${commit}.pdf`,
    printBackground: true,
    tagged: true, // accessible PDFs
  });

  await browser.close();
})();
