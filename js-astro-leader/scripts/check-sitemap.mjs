// Every <loc> in the built sitemap has to be a page a search engine may index: a real HTML
// file in dist/, without a robots noindex, not a redirect source, not an agent file (.md,
// llms.txt). A sitemap that lists anything else asks a crawler for what the site refuses.
// Run after `pnpm build`: node scripts/check-sitemap.mjs [dist]
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const read = (path) => readFileSync(join(dist, path), 'utf8');
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

const root = ['sitemap-index.xml', 'sitemap.xml'].find((file) => existsSync(join(dist, file)));
if (!root) {
  console.error(`No sitemap-index.xml or sitemap.xml in ${dist}/`);
  process.exit(1);
}

const first = read(root);
const urls = first.includes('<sitemapindex')
  ? locs(first).flatMap((url) => locs(read(new URL(url).pathname)))
  : locs(first);

const redirects = existsSync(join(dist, '_redirects'))
  ? read('_redirects')
      .split('\n')
      .map((line) => line.trim().split(/\s+/)[0])
      .filter((from) => from && !from.startsWith('#'))
  : [];
const redirected = (path) =>
  redirects.some((from) =>
    from.endsWith('*')
      ? path.startsWith(from.slice(0, -1))
      : from.replace(/\/$/, '') === path.replace(/\/$/, ''),
  );

const problems = [];
for (const url of urls) {
  const path = decodeURIComponent(new URL(url).pathname);
  if (/\.md$|\/llms(-full)?\.txt$/.test(path)) problems.push(`agent file: ${url}`);
  if (redirected(path)) problems.push(`redirect source: ${url}`);

  const base = path.replace(/\/$/, '');
  const file = [`${base}/index.html`, `${base}.html`, path === '/' ? 'index.html' : null]
    .filter(Boolean)
    .find((candidate) => existsSync(join(dist, candidate)));
  if (!file) problems.push(`no HTML file: ${url}`);
  else if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(read(file)))
    problems.push(`noindex page: ${url}`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} of ${urls.length} sitemap URLs should not be there.`);
  process.exit(1);
}
console.log(`sitemap: ${urls.length} URLs, every one an indexable HTML page.`);
