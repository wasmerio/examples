/**
 * Checks that a finished build actually produced a usable site.
 *
 * Exit codes are not enough on their own. Both Cloudflare bugs behind #600
 * reported a successful build: the favicon endpoints wrote error text into
 * files named like images, and `nodejs_compat` made every page prerender to
 * the string "[object Object]" while the build logged nothing but success.
 * Anything that only watches for a non-zero exit misses both.
 *
 * Run after `astro build`, or via `pnpm verify:<target>`. Finds the output
 * directory itself, since it differs per adapter: Vercel and Cloudflare write
 * to `dist/client`, Netlify to `dist`.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();

/** Smallest plausible size for each generated binary, in bytes. */
const REQUIRED_ASSETS = {
  'favicon.svg': 200,
  'favicon.ico': 1000,
  'favicon-32x32.png': 200,
  'apple-touch-icon.png': 1000,
  'pwa-192x192.png': 1000,
  'pwa-512x512.png': 2000,
};

/** Strings that mean a value was rendered instead of its contents. */
const STRINGIFIED = ['[object Object]', '[object Module]', '[object Promise]'];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function findOutputDir() {
  for (const candidate of ['dist/client', 'dist']) {
    const path = join(ROOT, candidate);
    if (await exists(join(path, 'index.html'))) return path;
  }
  return null;
}

async function walk(directory, match) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(path, match)));
    else if (match(entry.name)) found.push(path);
  }
  return found;
}

const failures = [];
const note = (message) => console.log(`  ${message}`);

const out = await findOutputDir();
if (!out) {
  console.error('verify-build: no build output found — expected dist/client/index.html or dist/index.html');
  process.exit(1);
}
note(`output directory: ${out.replace(ROOT + '/', '')}`);

// --- pages -----------------------------------------------------------------
const pages = await walk(out, (name) => name.endsWith('.html'));
if (pages.length === 0) failures.push('no HTML pages were emitted');

const stringified = [];
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  if (STRINGIFIED.some((s) => html.includes(s))) stringified.push(page);
}
if (stringified.length > 0) {
  failures.push(
    `${stringified.length} of ${pages.length} pages contain a stringified object ` +
      `(e.g. "[object Object]") — the page rendered to a value instead of HTML.\n` +
      stringified.slice(0, 5).map((p) => `      ${p.replace(out + '/', '')}`).join('\n'),
  );
} else {
  note(`pages: ${pages.length}, none stringified`);
}

// --- generated binaries ----------------------------------------------------
for (const [name, minBytes] of Object.entries(REQUIRED_ASSETS)) {
  const path = join(out, name);
  if (!(await exists(path))) {
    failures.push(`${name} is missing`);
    continue;
  }
  const { size } = await stat(path);
  if (size < minBytes) failures.push(`${name} is only ${size} bytes (expected at least ${minBytes})`);
}

// A favicon route that fails inside workerd still writes a file — of error
// text. Check the magic bytes rather than trusting the extension.
const png = await readFile(join(out, 'favicon-32x32.png')).catch(() => null);
if (png && !(png[0] === 0x89 && png[1] === 0x50 && png[2] === 0x4e && png[3] === 0x47)) {
  failures.push('favicon-32x32.png is not a PNG — first bytes are not the PNG signature');
}
if (failures.length === 0) note(`assets: ${Object.keys(REQUIRED_ASSETS).length} favicon files, all valid`);

// --- OG cards --------------------------------------------------------------
const ogDir = join(out, 'og');
if (await exists(ogDir)) {
  const cards = await walk(ogDir, (name) => name.endsWith('.png'));
  if (cards.length === 0) failures.push('the og/ directory exists but contains no cards');
  else note(`og cards: ${cards.length}`);
} else {
  failures.push('no og/ directory — share cards were not generated');
}

// --- result ----------------------------------------------------------------
if (failures.length > 0) {
  console.error('\nverify-build FAILED:');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('verify-build: output looks good');
