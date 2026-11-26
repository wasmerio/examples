import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDir = fileURLToPath(new URL('../dist/', import.meta.url));
const postsDir = fileURLToPath(new URL('../src/content/posts/', import.meta.url));

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

if (!existsSync(join(outputDir, 'index.html'))) {
  throw new Error('dist/index.html is missing. Run the build first.');
}

const indexHtml = readFileSync(join(outputDir, 'index.html'), 'utf8');
const canonical = indexHtml.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
if (!canonical) throw new Error('The home page has no canonical URL.');
const siteUrl = new URL(canonical);
const basePath = siteUrl.pathname.replace(/\/$/, '');
const expectedSitemapUrl = `${siteUrl.origin}${basePath}/sitemap-index.xml`;

function localTarget(pathname) {
  let path = decodeURIComponent(pathname);
  if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length);
  path = path.replace(/^\/+/, '');
  if (!path || path.endsWith('/')) path += 'index.html';
  if (!extname(path)) path += '/index.html';
  return join(outputDir, path);
}

const htmlFiles = walk(outputDir).filter(file => file.endsWith('.html'));
const postFiles = walk(postsDir).filter(file => file.endsWith('.md'));
const missing = [];
let localLinks = 0;

const robots = readFileSync(join(outputDir, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${expectedSitemapUrl}`)) {
  missing.push(`robots.txt -> expected sitemap URL ${expectedSitemapUrl}`);
}

const rss = readFileSync(join(outputDir, 'rss.xml'), 'utf8');
const rssHome = rss.match(/<channel>[\s\S]*?<link>([^<]+)<\/link>/)?.[1];
if (rssHome !== canonical) missing.push(`rss.xml -> expected channel link ${canonical}, found ${rssHome ?? 'none'}`);

const sitemap = readFileSync(join(outputDir, 'sitemap-0.xml'), 'utf8');
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const pathname = new URL(match[1]).pathname;
  if (/\/page\/\d+\/$/.test(pathname)) missing.push(`sitemap-0.xml -> pagination URL should be excluded: ${pathname}`);
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes('content="Astro v')) missing.push(`${relative(outputDir, file)} -> missing Astro generator metadata`);
  if (!html.includes('<link rel="canonical"')) missing.push(`${relative(outputDir, file)} -> missing canonical URL`);
  const currentPath = relative(outputDir, file).replace(/index\.html$/, '');
  const pageUrl = new URL(`${basePath}/${currentPath}`.replace(/\/{2,}/g, '/'), siteUrl.origin);
  for (const match of html.matchAll(/\shref=(["'])(.*?)\1/gi)) {
    const href = match[2].replaceAll('&amp;', '&');
    if (!href || href.startsWith('#') || /^(?:mailto|tel|javascript|data):/i.test(href)) continue;
    let url;
    try {
      url = new URL(href, pageUrl);
    } catch {
      missing.push(`${relative(outputDir, file)} -> invalid URL: ${href}`);
      continue;
    }
    if (url.origin !== siteUrl.origin) continue;
    localLinks += 1;
    if (!existsSync(localTarget(url.pathname))) missing.push(`${relative(outputDir, file)} -> ${url.pathname}`);
  }
}

for (const file of postFiles) {
  const path = relative(postsDir, file).replace(/\.md$/, '');
  if (!existsSync(join(outputDir, path, 'index.html'))) missing.push(`Post URL was not generated: /${path}/`);
  const source = readFileSync(file, 'utf8');
  if (/^---[\s\S]*?^noindex:\s*true\s*$/m.test(source) && sitemap.includes(`/${path}/`)) {
    missing.push(`sitemap-0.xml -> noindex post should be excluded: /${path}/`);
  }
}

if (missing.length) {
  console.error(missing.slice(0, 30).join('\n'));
  throw new Error(`Found ${missing.length} broken internal references.`);
}

console.log(`Site check passed: ${postFiles.length} posts, ${htmlFiles.length} HTML files, ${localLinks} internal links.`);
