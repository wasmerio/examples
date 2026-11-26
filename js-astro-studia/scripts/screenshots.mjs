/**
 * Regenerate the README screenshots in .github/media/:
 *
 *   npm run screenshots [-- http://localhost:4321/astro-studia]
 *
 * Needs a Chromium-family browser; set CHROME to pick one. The base URL
 * defaults to the live demo.
 */
import sharp from 'sharp';
import { execFile, spawnSync } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = promisify(execFile);
const OUT = join(process.cwd(), '.github', 'media');
const base = (process.argv[2] ?? 'https://dfuchss.github.io/astro-studia').replace(/\/+$/, '');

const pages = [
  ['home', '/'],
  ['project', '/demo/project/'],
  ['publications', '/publications/'],
  ['paper', '/papers/de-officiis/'],
  ['cv', '/cv/'],
];

const macApps = ['Google Chrome', 'Chromium', 'Microsoft Edge'];
const linuxBins = ['google-chrome', 'chromium', 'chromium-browser'];

function findBrowser() {
  if (process.env.CHROME) return process.env.CHROME;
  for (const app of macApps) {
    const path = `/Applications/${app}.app/Contents/MacOS/${app}`;
    if (existsSync(path)) return path;
  }
  for (const bin of linuxBins) {
    if (spawnSync(bin, ['--version'], { stdio: 'ignore' }).status === 0) return bin;
  }
  return null;
}

const browser = findBrowser();
if (!browser) {
  console.error('No Chromium-family browser found; set CHROME to its executable path.');
  process.exit(1);
}

const tmp = await mkdtemp(join(tmpdir(), 'screenshots-'));
try {
  for (const [name, path] of pages) {
    const png = join(tmp, `${name}.png`);
    const url = base + path;
    try {
      await run(
        browser,
        [
          '--headless=new',
          '--disable-gpu',
          '--hide-scrollbars',
          '--force-device-scale-factor=2',
          '--window-size=1280,900',
          `--screenshot=${png}`,
          url,
        ],
        { timeout: 60_000 },
      );
      await stat(png);
    } catch (error) {
      console.error(`✗ ${name} (${url}): no screenshot produced: ${error.message}`);
      process.exit(1);
    }
    const dest = join(OUT, `${name}.webp`);
    await sharp(png).resize({ width: 1600 }).webp({ quality: 82 }).toFile(dest);
    const { size } = await stat(dest);
    console.log(`✓ ${name}.webp (${(size / 1024).toFixed(0)} KB)`);
  }
} finally {
  await rm(tmp, { recursive: true, force: true });
}
