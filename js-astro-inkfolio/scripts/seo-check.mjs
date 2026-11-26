// Post-build GEO/SEO self-check. Prints a short report and exits non-zero when
// something structural is broken, so it can gate a release.
//   node scripts/seo-check.mjs [dist]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] || 'dist';
const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (name.endsWith('.html')) pages.push(p);
  }
})(dist);

const problems = { missingCanonical: [], missingJsonLd: [], brokenJsonLd: [], hreflang: [], duplicate: {} };
const seen = new Map();

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const route = '/' + relative(dist, file).replace(/index\.html$/, '').replace(/\.html$/, '');
  if (/noindex/i.test(html)) continue;

  if (!/<link rel="canonical"/.test(html)) problems.missingCanonical.push(route);

  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  if (!blocks.length) problems.missingJsonLd.push(route);
  for (const [, body] of blocks) {
    try {
      JSON.parse(body);
    } catch {
      problems.brokenJsonLd.push(route);
      break;
    }
  }

  // hreflang must be reciprocal: an alternates set of one language is a bug.
  const langs = [...html.matchAll(/<link[^>]+hreflang="([^"]+)"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  if (langs.length === 1) problems.hreflang.push(route);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  seen.set(title, (seen.get(title) ?? 0) + 1);
}

for (const [title, n] of seen) if (n > 1 && title) problems.duplicate[title] = n;

const llms = existsSync(join(dist, 'llms.txt'));
const sitemap = existsSync(join(dist, 'sitemap.xml')) || existsSync(join(dist, 'sitemap-index.xml'));

const rows = [
  ['pages checked', pages.length],
  ['llms.txt', llms ? 'ok' : 'MISSING'],
  ['sitemap', sitemap ? 'ok' : 'MISSING'],
  ['missing canonical', problems.missingCanonical.length],
  ['missing JSON-LD', problems.missingJsonLd.length],
  ['invalid JSON-LD', problems.brokenJsonLd.length],
  ['hreflang not reciprocal', problems.hreflang.length],
  ['duplicate titles', Object.keys(problems.duplicate).length],
];

for (const [k, v] of rows) console.log(`${String(v).padEnd(6)} ${k}`);
if (problems.hreflang.length) console.log('hreflang:', problems.hreflang.slice(0, 6).join(', '));
if (Object.keys(problems.duplicate).length) console.log('dup titles:', Object.keys(problems.duplicate).slice(0, 4));

const failed =
  !llms ||
  !sitemap ||
  problems.brokenJsonLd.length > 0 ||
  problems.hreflang.length > 0 ||
  problems.missingCanonical.length > 0;
process.exit(failed ? 1 : 0);
