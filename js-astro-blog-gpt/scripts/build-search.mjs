import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as pagefind from 'pagefind';
import { searchRecords } from './lib/search-records.mjs';
import { searchTokens } from './lib/search-tokens.mjs';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? walk(join(directory, entry.name))
        : [join(directory, entry.name)],
    ),
  );
  return files.flat();
}
// HTML attachments are documents, not generated blog routes or search candidates.
const attachments = new Set(
  JSON.parse(await readFile('.astro/bloggpt-bundle-assets.json', 'utf8')),
);
const files = (await walk('dist')).filter(
  (file) => !attachments.has(file.replaceAll('\\', '/').replace(/^dist\//, '')),
);
const excluded = new Set();
const canonicalPattern = /<link\s+[^>]*rel="canonical"[^>]*href="([^"]+)"/;
for (const file of files.filter((file) => file.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  if (/<meta\s+[^>]*name="robots"[^>]*content="noindex/.test(html)) {
    if (/<meta\s+[^>]*http-equiv="refresh"/i.test(html)) continue;
    const canonical = html.match(canonicalPattern)?.[1];
    if (canonical) excluded.add(canonical.replaceAll('&amp;', '&'));
  }
}
// @astrojs/sitemap cannot read rendered page-level robots metadata. Remove unlisted pages
// after rendering, using canonical URLs so base paths and non-ASCII slugs remain correct.
for (const file of files.filter((file) => /sitemap-\d+\.xml$/.test(file))) {
  const xml = await readFile(file, 'utf8');
  const filtered = xml.replace(/<url>[\s\S]*?<\/url>/g, (entry) => {
    const url = entry
      .match(/<loc>([\s\S]*?)<\/loc>/)?.[1]
      ?.replaceAll('&amp;', '&');
    return excluded.has(url) ? '' : entry;
  });
  await writeFile(file, filtered);
}
const records = [];
for (const file of files.filter((file) => file.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  const canonical = html.match(canonicalPattern)?.[1]?.replaceAll('&amp;', '&');
  if (!canonical || excluded.has(canonical)) continue;
  records.push(...searchRecords(html));
}
for (const scope of ['all', 'title', 'body']) {
  const { index, errors } = await pagefind.createIndex();
  if (errors.length || !index)
    throw new Error(`Pagefind initialization failed: ${errors.join(', ')}`);
  // Multiple introductions on a route share a single result; never duplicate a URL.
  const grouped = new Map();
  for (const record of records) {
    if (scope !== 'all' && record.kind !== 'posts') continue;
    const key = `${record.language}:${record.url}`;
    const prior = grouped.get(key);
    grouped.set(
      key,
      prior
        ? {
            ...prior,
            body: `${prior.body} ${record.body}`,
            sections: [...prior.sections, ...record.sections],
          }
        : record,
    );
  }
  for (const record of grouped.values()) {
    const content =
      scope === 'title'
        ? `${record.title} ${record.description}`
        : scope === 'body'
          ? record.body
          : `${record.title} ${record.description} ${record.body}`;
    const result = await index.addCustomRecord({
      url: record.url,
      content: searchTokens(content),
      // Pagefind's browser API lowercases HTML lang before choosing an index.
      // BCP 47 matching is case-insensitive; preserve the region, normalize case.
      language: record.language.toLowerCase(),
      meta: {
        title: record.title,
        description: record.description,
        sections: JSON.stringify(record.sections),
      },
      // Pagefind falls back to another language when an index is absent.
      // An exact locale filter keeps that fallback from exposing other versions.
      filters: { kind: [record.kind], locale: [record.language.toLowerCase()] },
    });
    if (result.errors.length) throw new Error(result.errors.join(', '));
  }
  const saved = await index.writeFiles({
    outputPath: scope === 'all' ? 'dist/pagefind' : `dist/pagefind-${scope}`,
  });
  if (saved.errors.length) throw new Error(saved.errors.join(', '));
  console.log(`Pagefind ${scope}: ${grouped.size} content pages.`);
  await index.deleteIndex();
}
console.log(
  `Excluded ${excluded.size} non-discoverable URLs from Sitemap and search.`,
);
await pagefind.close();
