// Uploads post videos over media.maxBytes (25 MiB; Cloudflare takes no larger
// files) to the R2 bucket of lemma.config.mjs, records them in
// src/media-r2.json and keeps them out of git.
// Run after adding or changing a large video: bun run media:push
//
// Keys carry a hash of the content, so a changed video gets a new URL and
// old copies in browser caches never show.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VIDEO, isVideo, readManifest } from '../plugins/media.mjs';
import lemma from '../lemma.config.mjs';

const { maxBytes: MAX_BYTES, r2: R2 } = lemma.media;

const root = fileURLToPath(new URL('../src/content/posts/', import.meta.url));
const manifestUrl = new URL('../src/media-r2.json', import.meta.url);
const gitignore = new URL('../.gitignore', import.meta.url);
const R2_LIMIT = 300 * 1024 * 1024; // per upload through the Cloudflare API

const sha256 = (path) =>
  new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    createReadStream(path).on('data', (d) => hash.update(d)).on('end', () => resolve(hash.digest('hex'))).on('error', reject);
  });

function* videos(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* videos(path);
    else if (isVideo(entry.name)) yield path;
  }
}

const manifest = readManifest(manifestUrl);
let failed = false;
for (const path of videos(root)) {
  const { size } = statSync(path);
  const rel = relative(root, path).split('\\').join('/');
  if (size <= MAX_BYTES && !manifest[rel]) continue;
  if (size > R2_LIMIT) {
    console.error(`${rel}: over 300 MB, too large to upload this way; compress it`);
    failed = true;
    continue;
  }
  const hash = await sha256(path);
  if (manifest[rel]?.sha256 === hash) continue;
  const ext = extname(rel);
  const key = `posts/${rel.slice(0, -ext.length)}.${hash.slice(0, 10)}${ext}`;
  console.log(`uploading ${rel} (${(size / 2 ** 20).toFixed(1)} MiB) -> ${R2.origin}/${key}`);
  // On a failure, go on: the uploads that worked are still recorded below.
  try {
    execFileSync('cf', ['r2', 'objects', 'put', key, '--bucket-name', R2.bucket, '--file', path, '--content-type', VIDEO[ext.toLowerCase()], '-q'], { stdio: 'inherit' });
  } catch (e) {
    console.error(e.code === 'ENOENT' ? 'media:push needs the cf CLI: install it and run cf auth login' : `${rel}: upload failed`);
    failed = true;
    if (e.code === 'ENOENT') break;
    continue;
  }
  manifest[rel] = { key, size, sha256: hash };
}
writeFileSync(manifestUrl, JSON.stringify(manifest, null, 2) + '\n');

// Uploaded videos stay out of git; the manifest is enough to build the site.
const HEAD = '# Videos hosted on R2 (bun run media:push)';
const lines = readFileSync(gitignore, 'utf8').split('\n');
const start = lines.indexOf(HEAD);
// The old block is HEAD and the paths under it; rules after it stay.
let end = start + 1;
while (start >= 0 && lines[end]?.startsWith('/src/content/posts/')) end++;
const before = start < 0 ? lines : lines.slice(0, start);
const after = start < 0 ? [] : lines.slice(end);
while (before.at(-1) === '') before.pop();
while (after[0] === '') after.shift();
while (after.at(-1) === '') after.pop();
const listed = Object.keys(manifest).sort().map((rel) => `/src/content/posts/${rel}`);
const block = listed.length ? ['', HEAD, ...listed] : [];
writeFileSync(gitignore, [...before, ...block, ...(after.length ? ['', ...after] : []), ''].join('\n'));
for (const rel of Object.keys(manifest)) {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', join(root, rel)], { stdio: 'ignore' });
    console.log(`${rel} is still tracked by git: git rm --cached ${join('src/content/posts', rel)}`);
  } catch {}
}
if (failed) process.exit(1);
