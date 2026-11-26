import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const editablePages = (await readdir(new URL('../src/content/pages/', import.meta.url))).filter(file => file.endsWith('.json')).map(file => file.slice(0, -5)).sort();
const currentManifest = JSON.parse(await readFile(join(dist, 'rigel/manifest.json'), 'utf8'));
assert.deepEqual(currentManifest.documents.filter(doc => doc.type === 'page').map(doc => doc.slug).sort(), editablePages, 'every public landing page is declared in the visual editor');
for (const slug of editablePages) {
  const html = await readFile(join(dist, slug === 'home' ? 'index.html' : `${slug}/index.html`), 'utf8');
  assert.ok(html.includes(`data-rigel-doc="page:${slug}"`), `${slug}: document-aware visual bindings`);
  assert.match(html, /data-rigel-section=/, `${slug}: clickable sections`);
}
const routes = ['', 'about', 'services', 'contact', 'blog', 'news', 'getting-started', 'legal/example', 'perspective', ...(currentManifest.documents.some(doc => doc.id === 'demo:fields') ? ['demo/fields'] : []), 'blog/a-different-point-of-view', 'blog/less-but-more-considered', 'blog/typography-check', 'preview/blog', 'preview/news'];
for (const route of routes) {
  const html = await readFile(join(dist, route, 'index.html'), 'utf8');
  assert.match(html, /<main id="main">/, `${route}: main landmark`);
  assert.match(html, /Skip to content/, `${route}: skip link`);
  assert.match(html, /\| Rigel<\/title>/, `${route}: shared layout`);
  assert.match(html, /aria-label="Footer"/, `${route}: footer menu`);
  assert.match(html, /class="copyright"/, `${route}: global copyright`);
  assert.match(html, /href="\/rigel\/"[^>]*>CMS Studio<\/a>/, `${route}: studio navigation`);
  assert.doesNotMatch(html, /Editable demo menu|Edit in Rigel/);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
    const path = match[1];
    if (path === '/about') continue;
    await access(join(dist, path.endsWith('/') ? `${path}index.html` : path));
  }
}
const typography = await readFile(join(dist, 'blog/typography-check/index.html'), 'utf8');
assert.match(typography, /Typography check/);
for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 's', 'u', 'code', 'mark', 'sub', 'sup', 'br', 'blockquote', 'ul', 'ol', 'pre', 'table', 'th', 'td', 'figure', 'figcaption', 'hr']) {
  assert.match(typography, new RegExp(`<${tag}(?:\\s|>)`), `typography specimen: ${tag}`);
}
assert.match(await readFile(join(dist, 'blog/index.html'), 'utf8'), /href="\/blog\/typography-check\/"/);
const about = await readFile(join(dist, 'about/index.html'), 'utf8');
const home = await readFile(join(dist, 'index.html'), 'utf8');
assert.match(home, /Rigel\. The bright star\./);
assert.match(home, /rigelcms-icon[^" ]*\.png/);
assert.doesNotMatch(home, /Forma|Northline|Olio/);
for (const brand of ['solara', 'perihelion', 'lyra', 'cygnus']) {
  assert.ok(home.includes(`/demo/${brand}.svg`), `${brand}: displayed brand`);
  const svg = await readFile(join(dist, `demo/${brand}.svg`), 'utf8');
  assert.match(svg, /<title[^>]*>.+<\/title>/);
  assert.doesNotMatch(svg, /prefers-color-scheme:dark/);
}
assert.match(about, /data-rigel-section="pageIntro"/);
assert.match(about, /data-rigel-key="kaboutintro"/);
assert.match(about, /data-rigel-text="sections\.kaboutintro\.title"/);
assert.match(about, /data-rigel-doc="logoSet:brands"/);
assert.match(about, /data-rigel-doc="callout:studio"/);
assert.match(home, /data-rigel-key="khomehero"/);
const manifest = JSON.parse(await readFile(join(dist, 'rigel/manifest.json'), 'utf8'));
assert.deepEqual(manifest.pages, [], 'schema documents and Site settings replace legacy copy modules');
const settings = manifest.documents.find(doc => doc.id === 'settings:site');
assert.equal(settings.data.copyright, '© 2026 Rigel. All rights reserved.');
assert.ok(home.includes(settings.data.copyright) && about.includes(settings.data.copyright), 'public footers consume Site settings');
assert.equal(manifest.sidebar.find(entry => entry.kind === 'link' && entry.label === 'Site settings').target.id, 'settings:site');
assert.deepEqual(manifest.schema.documents.find(type => type.name === 'settings').fields.map(field => field.key), ['siteName', 'copyright', 'metaDescription']);
const demo = manifest.documents.find(doc => doc.id === 'demo:fields');
if (demo) {
  const fields = manifest.schema.documents.find(type => type.name === 'demo').fields;
  assert.deepEqual([...new Set(fields.map(field => field.type))].sort(), ['string', 'text', 'markdown', 'boolean', 'number', 'date', 'image', 'url', 'color', 'code', 'password', 'object', 'array', 'reference'].sort());
  const html = await readFile(join(dist, 'demo/fields/index.html'), 'utf8');
  assert.ok(html.includes(demo.data.siteName));
  assert.ok(!html.includes(demo.data.mapsApiKey) && !html.includes(demo.data.analyticsSnippet));
} else {
  await assert.rejects(access(join(dist, 'demo/fields/index.html')));
  assert.ok(!manifest.schema.documents.some(type => type.demo));
}
const multilingual = process.env.RIGEL_CONTENT_MULTILANG === 'true';
const sourceIds = [];
for (const type of manifest.schema.documents) {
  for (const file of (await readdir(type.folder)).filter(file => file.endsWith('.json'))) {
    const data = JSON.parse(await readFile(join(type.folder, file), 'utf8'));
    sourceIds.push(data._id);
  }
}
assert.deepEqual(manifest.documents.map(doc => doc.id).sort(), sourceIds.sort());
assert.deepEqual(manifest.schema.documents.map(doc => doc.name), ['settings', ...(demo ? ['demo'] : []), 'author', 'page', 'logoSet', 'callout', ...(multilingual ? ['pageEn', 'pageFr'] : []), 'legalPage', ...(multilingual ? ['legalPageEn', 'legalPageFr'] : [])]);
for (const collection of ['blog', 'news']) {
  for (const file of (await readdir(new URL(`../src/content/${collection}/`, import.meta.url))).filter(file => file.endsWith('.json'))) {
    const article = JSON.parse(await readFile(new URL(`../src/content/${collection}/${file}`, import.meta.url), 'utf8'));
    const output = join(dist, collection, article.frontmatter.slug || file.slice(0, -5), 'index.html');
    if (article.frontmatter.draft) await assert.rejects(access(output), `${collection}/${file}: drafts stay out of production routes`);
    else await access(output);
  }
}
const newsListing = await readFile(join(dist, 'news/index.html'), 'utf8');
for (const slug of ['news-typography', 'studio-notes', 'a-short-update']) {
  assert.ok(newsListing.includes(`href="/news/${slug}/"`), `${slug}: listed news article`);
  const html = await readFile(join(dist, 'news', slug, 'index.html'), 'utf8');
  const article = html.match(/<article\b[\s\S]*?<\/article>/)?.[0];
  assert.ok(article, `${slug}: article rendered`);
  assert.doesNotMatch(article, /<img\b/, `${slug}: text-only news`);
}
assert.match(await readFile(join(dist, 'blog/second-post/index.html'), 'utf8'), /data-rigel-text="author"[^>]*>Alex<\/span>/);
const post = await readFile(join(dist, 'preview/blog/index.html'), 'utf8');
for (const key of ['title', 'date', 'author']) assert.ok(post.includes(`data-rigel-text="${key}"`));
assert.ok(post.includes('data-rigel-richtext="$body"'));
const contact = await readFile(join(dist, 'contact/index.html'), 'utf8');
assert.match(contact, /mailto:hello@rigel.example/);
assert.match(contact, /does not receive mail/);
assert.doesNotMatch(contact, /<form\b/);
console.log(`Verified ${routes.length} built routes, local links/assets, preview anchors, and honest email-only contact.`);
