// astro check → astro build → pagefind index. Fails the build on a type error.
// Bins are invoked through the current node binary, so this works even when npm
// runs scripts with a PATH that lacks node_modules/.bin.
import { spawnSync } from 'node:child_process';

const run = (args) => {
  const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

run(['node_modules/astro/bin/astro.mjs', 'check']);
run(['node_modules/astro/bin/astro.mjs', 'build']);
run(['node_modules/pagefind/lib/runner/bin.cjs', '--site', 'dist']);
console.log('search index written to dist/pagefind');

// Mirror the sitemap index at /sitemap.xml — crawlers and SEO tools ask for it by name.
try {
  const { copyFileSync } = await import('node:fs');
  copyFileSync('dist/sitemap-index.xml', 'dist/sitemap.xml');
  console.log('sitemap.xml mirrored');
} catch (err) {
  console.warn('sitemap mirror skipped:', err.message);
}

try {
  const { execFileSync } = await import('node:child_process');
  execFileSync('node', ['scripts/seo-check.mjs', 'dist'], { stdio: 'inherit' });
} catch {
  console.warn('seo-check reported problems (see above) — build kept');
}
