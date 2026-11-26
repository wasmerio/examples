// After `pnpm build`: the members part of every issue must be absent from dist/, including the
// search index. For each issue with a cut, takes the first prose line after it, reduces both that
// line and every built file to bare lowercase words (so markup, entities and smart quotes don't
// hide a match), and searches for 8 consecutive words. Pictures after the cut must not be emitted
// or linked either. Exits 1 on a leak.
import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { gunzipSync } from 'node:zlib';

const issuesDir = new URL('../src/content/issues/', import.meta.url).pathname;
const distDir = new URL('../dist/', import.meta.url).pathname;
const CUT_LINE = /^[ \t]*(?:<!-- cut -->|\{\/\* cut \*\/\})[ \t]*$/m; // same as src/lib/cut.ts

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
const words = (s) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[#\w]+;/g, ' ')
    .replace(/\]\([^)]*\)/g, ' ') // Markdown link targets
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
const read = (f) =>
  f.endsWith('.pf_fragment') // Pagefind fragments: gzip with a signature prefix
    ? gunzipSync(readFileSync(f)).toString('utf8')
    : readFileSync(f, 'utf8');
const files = walk(distDir);
// Markup escapes & once, the feed twice; undo it so a URL with a query string still matches.
const unescape = (s) => s.replace(/&(?:amp;)+/g, '&');
const raw = files
  .filter((f) => /\.(html|xml)$/.test(f))
  .map((f) => [f, unescape(readFileSync(f, 'utf8'))]);
const built = files
  .filter((f) => /\.(html|xml|json|txt|js|pf_fragment)$/.test(f))
  .map((f) => [f, ` ${words(read(f))} `]);
if (!built.some(([f]) => f.endsWith('.pf_fragment')))
  console.log('note: no search index in dist/, checked pages and feeds only');

let checked = 0;
let leaks = 0;
for (const file of walk(issuesDir).filter((f) => /\.mdx?$/.test(f))) {
  const src = readFileSync(file, 'utf8');
  const at = src.search(CUT_LINE);
  if (at === -1) continue;
  // First prose line after the cut (skip headings, lists, tables, quotes; HTML bodies from an
  // import count), 8 words of it.
  const line = src
    .slice(at)
    .split('\n')
    .slice(1)
    .find((l) => /^[\p{L}<]/u.test(l) && words(l).split(' ').length >= 8);
  // Pictures in the members part: a local file must not be emitted (Astro names it
  // <name>.<hash>.webp), a remote one must not be linked from any built page.
  const pictures = [
    ...src.slice(at).matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)|<img[^>]*\ssrc=["']([^"']+)/g),
  ].map((m) => m[1] ?? m[2]);
  // MDX: a picture imported at the top and used after the cut is built anyway (the import is
  // above the cut).
  for (const [, id, path] of src.matchAll(
    /^import\s+(\w+)\s+from\s+['"]([^'"]+\.(?:avif|gif|jpe?g|png|svg|webp))['"]/gm,
  ))
    if (new RegExp(`\\b${id}\\b`).test(src.slice(at))) pictures.push(path);
  if (!line && !pictures.length) {
    // Nothing to search for (a members part of tables, lists or components only). Say so rather
    // than pass it quietly.
    console.log(
      `? ${file.replace(issuesDir, '')}: no prose line or picture after the cut, not checked`,
    );
    continue;
  }
  checked++;
  const probe = line && ` ${words(line).split(' ').slice(0, 8).join(' ')} `;
  const hit = probe && built.find(([, text]) => text.includes(probe));
  if (hit) {
    leaks++;
    console.log(
      `✗ ${file.replace(issuesDir, '')}: members text found in ${hit[0].replace(distDir, 'dist/')}`,
    );
  }
  for (const pic of pictures) {
    const remote = /^https?:/.test(pic);
    const name = basename(pic).replace(/\.[^.]+$/, '');
    const found = remote
      ? raw.find(([, text]) => text.includes(unescape(pic)))?.[0]
      : files.find((f) => basename(f).startsWith(`${name}.`));
    if (found) {
      leaks++;
      console.log(
        `✗ ${file.replace(issuesDir, '')}: members picture ${pic} found as ${found.replace(distDir, 'dist/')}`,
      );
    }
  }
}
console.log(`${checked} members issues checked, ${leaks} leak(s).`);
process.exit(leaks || !checked ? 1 : 0);
