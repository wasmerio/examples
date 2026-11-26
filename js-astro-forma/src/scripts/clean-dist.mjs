// clean-dist.mjs is the final safeguard. It removes dev-only files from dist/
// that could appear despite scope-pages, plus server files not needed by clients.
//
// IMPORTANT: pages outside the configured scope are not removed here because
// they are never built. scope-pages.mjs moves them to _disabled/ before Astro.
// This script never touches assets/ (CSS/JS), so required assets remain safe.
import fs from 'fs';
import path from 'path';
import { BUILD_SCOPE } from '../../site.config.mjs';

const dist = path.resolve('dist');

if (process.argv.includes('--before-build')) {
  // Start from an empty directory so stale pages cannot appear in the current build.
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
  console.log('clean-dist: wyczyszczono dist przed buildem.');
  process.exit(0);
}

// The deny list matches the first path segment, so 'dev' also covers /dev/.
function matchesForceRemove(pathname) {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return BUILD_SCOPE.forceRemove.includes(firstSegment);
}

// Normalizes a relative page path to a URL pathname with a trailing slash.
function toPathname(relativePath) {
  const parts = relativePath.split(path.sep);
  if (parts.at(-1) === 'index.html') parts.pop();
  else if (parts.at(-1) === '404.html') parts[parts.length - 1] = '404';
  const joined = parts.filter(Boolean).join('/');
  return '/' + (joined ? joined + '/' : '');
}

if (!fs.existsSync(dist)) {
  console.log('clean-dist: brak dist/, nic do zrobienia');
  process.exit(0);
}

const toRemove = [];

// Server and deployment files from public that clients do not need in dist.
const publicFiles = ['deploy-turbo.php'];
for (const f of publicFiles) {
  if (fs.existsSync(path.join(dist, f))) toRemove.push(f);
}

// Opis katalogu obrazów służy pracy nad źródłami i nie należy do publicznej strony.
const placeholderReadme = path.join(dist, 'assets', 'placeholders', 'README.md');
if (fs.existsSync(placeholderReadme)) toRemove.push(placeholderReadme);

// Directories and pages from the deny list, if scope-pages produced any.
const walkDist = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const pathname = toPathname(path.relative(dist, full) + path.sep);
      if (matchesForceRemove(pathname)) {
        toRemove.push(full);
        continue;
      }
      walkDist(full);
    } else if (entry.name.endsWith('.html')) {
      const pathname = toPathname(path.relative(dist, full));
      if (matchesForceRemove(pathname)) toRemove.push(full);
    }
  }
};
walkDist(dist);

let removed = 0;
for (const item of toRemove) {
  if (fs.existsSync(item)) {
    fs.rmSync(item, { recursive: true, force: true });
    removed++;
  }
}

// Remove empty directories without touching assets/.
const pruneEmptyDirs = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    pruneEmptyDirs(full);
    if (fs.readdirSync(full).length === 0) fs.rmSync(full, { recursive: true, force: true });
  }
};
pruneEmptyDirs(dist);

console.log(`clean-dist: usunieto ${removed} elementow deny listy/pliki public z dist/`);
