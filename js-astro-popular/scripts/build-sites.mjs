#!/usr/bin/env node
/**
 * Build the published deployment: the neutral starter at the root, the four
 * flavored demos at their subpaths, and the gallery landing page at /demos/.
 *
 *   node scripts/build-sites.mjs <site-origin> <base-prefix> <output-dir>
 *   node scripts/build-sites.mjs https://you.github.io /astro-theme-popular public
 *   node scripts/build-sites.mjs "$DEPLOY_PRIME_URL" "" public
 *
 * Used by .github/workflows/deploy-demo.yml (GitHub Pages, production) and by
 * the Netlify preview build (see AGENTS.md, "Settings that live outside this
 * repo"). One script so a preview cannot quietly differ from production.
 *
 * The starter is at the root deliberately. The root is the URL people are
 * given, including as the Demo link in the Astro theme catalogue, whose
 * reviewers require it to be a live deployment of the repo "exactly as a new
 * user will get". That is the starter, and it is what `npm create
 * popular-site@latest` writes. The root used to be the hand-written gallery,
 * which is not an Astro build at all and fails that check on inspection.
 *
 * Since phase 3 each demo is its own workspace consuming the package, so this
 * builds them where they live. That makes the deployment an integration test:
 * five real consumers, five configs, built from the same package an adopter
 * installs.
 *
 * Each site is built with Astro's own `--base`, which is what makes every
 * link, image, feed and canonical URL land under its own prefix.
 *
 * Set POPULAR_PREVIEW_NOTE to render the preview banner on every page (the
 * env-var switch is meant for exactly this: a build nobody owns).
 *
 * Not part of the theme. Adopters who copy this repo never run it.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [site, basePrefix = '', outDir = 'public'] = process.argv.slice(2);
if (!site) {
  console.error('usage: build-sites.mjs <site-origin> <base-prefix> <output-dir>');
  process.exit(2);
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(process.cwd(), outDir);
const DEMOS = ['aquarium', 'foodie', 'kdrama', 'superfan'];

const buildSite = (slug, base, config) => {
  const cwd = join(ROOT, 'demos', slug);
  const args = ['astro', 'build', '--site', site, '--base', base];
  if (config) args.push('--config', config);
  execFileSync('npx', args, { cwd, stdio: 'inherit', env: process.env });
  return cwd;
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/* The starter lands at the root, so its base is the deployment prefix itself
   (or '/' when there is none: Astro wants a path, not an empty string).

   It builds from astro.deploy.config.mjs, which differs from the starter's own
   config in exactly one way: a notice pointing at the gallery, so someone who
   lands on this URL can find the four flavored demos. That override cannot
   reach an adopter, because the scaffolder templates from popular.config.ts
   and never reads the deploy config. */
const starter = buildSite('starter', basePrefix || '/', 'astro.deploy.config.mjs');
cpSync(join(starter, 'dist'), OUT, { recursive: true });
rmSync(join(starter, 'dist'), { recursive: true, force: true });

for (const slug of DEMOS) {
  const cwd = buildSite(slug, `${basePrefix}/${slug}`);
  cpSync(join(cwd, 'dist'), join(OUT, slug), { recursive: true });
  rmSync(join(cwd, 'dist'), { recursive: true, force: true });
}

/* The gallery is a hand-written landing page, not an Astro build, so it has no
   bundler to resolve its assets. It gets its own copies of the vendored icons
   and fonts rather than reaching for a CDN: the rest of the deployment loads
   no third party, and the landing page should not be the exception. The paths
   below are what its relative hrefs expect, and css/fonts.css resolves
   ../fonts/ against itself, which is why it sits one directory down. */
const gallery = join(OUT, 'demos');
mkdirSync(join(gallery, 'css'), { recursive: true });
cpSync(join(ROOT, 'demos/gallery/index.html'), join(gallery, 'index.html'));
cpSync(join(ROOT, 'package/fontawesome'), join(gallery, 'fontawesome'), { recursive: true });
cpSync(join(ROOT, 'package/src/styles/fonts'), join(gallery, 'fonts'), { recursive: true });
cpSync(join(ROOT, 'package/src/styles/tokens/fonts.css'), join(gallery, 'css/fonts.css'));

console.log(
  `built the starter at the root + ${DEMOS.length} demos + the gallery at /demos/ ` +
  `into ${OUT} (site ${site}, base ${basePrefix || '/'})`
);
