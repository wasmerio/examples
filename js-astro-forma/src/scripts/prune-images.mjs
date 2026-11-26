// Removes media and fonts from dist/ that are not used by the generated pages.
// The sources in public/ remain untouched so development keeps its source assets
// assets during development. The cleanup only applies to the final build.
// Executed PO clean-dist.mjs to ignore dev-only pages.
import fs from 'node:fs';
import path from 'node:path';
import { BUILD_SCOPE } from '../../site.config.mjs';

const dist = path.resolve('dist');
const PRUNABLE_DIRS = [
  'images',
  'images-webp',
  'videos',
  'assets/images',
  'assets/images-webp',
  'assets/videos',
  'assets/image-derivatives',
  'assets/upload-derivatives',
  'assets/placeholders',
  'fonts',
];
const SCANNABLE_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.xml', '.txt', '.svg']);
const MEDIA_EXTENSIONS = new Set([
  '.avif', '.gif', '.jpeg', '.jpg', '.m4v', '.mov', '.mp4', '.png', '.svg', '.webm', '.webp',
]);
const FONT_EXTENSIONS = new Set(['.otf', '.ttf', '.woff', '.woff2']);

if (!fs.existsSync(dist)) {
  console.log('prune-assets: brak dist/, nic do zrobienia');
  process.exit(0);
}

if (BUILD_SCOPE.images === false) {
  console.log('prune-assets: wyłączone (BUILD_SCOPE.images = false)');
  process.exit(0);
}

function toReference(fullPath) {
  return path.relative(dist, fullPath).split(path.sep).join('/').toLowerCase();
}

function collectFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function collectReferencedAssets() {
  const referenced = new Set();
  // We support absolute and relative paths, and we cut off the query string before comparison.
  const assetUrl = /(?:^|["'`()=\s])((?:\/)?(?:assets|images|images-webp|videos|fonts)\/[^"'`()\s<>?#,]+)/g;

  for (const file of collectFiles(dist)) {
    if (!SCANNABLE_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;

    const content = fs.readFileSync(file, 'utf8');
    for (const match of content.matchAll(assetUrl)) {
      const reference = match[1].replace(/^\/+/, '').replace(/\\/g, '/').toLowerCase();
      if (reference) referenced.add(reference);
    }
  }

  return referenced;
}

function isPrunableFile(file) {
  const extension = path.extname(file).toLowerCase();
  const relative = toReference(file);
  const insidePrunableDir = PRUNABLE_DIRS.some((dir) => relative === dir || relative.startsWith(`${dir}/`));
  if (!insidePrunableDir) return false;
  if (relative.startsWith('fonts/')) return FONT_EXTENSIONS.has(extension);
  return MEDIA_EXTENSIONS.has(extension);
}

const referenced = collectReferencedAssets();
let keptCount = 0;
let keptBytes = 0;
let removedCount = 0;
let removedBytes = 0;

for (const file of collectFiles(dist)) {
  if (!isPrunableFile(file)) continue;

  const relative = toReference(file);
  const size = fs.statSync(file).size;
  if (referenced.has(relative)) {
    keptCount += 1;
    keptBytes += size;
  } else {
    fs.rmSync(file, { force: true });
    removedCount += 1;
    removedBytes += size;
  }
}

function pruneEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    pruneEmptyDirs(fullPath);
    if (fs.existsSync(fullPath) && fs.readdirSync(fullPath).length === 0) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  }
}

for (const dir of PRUNABLE_DIRS) {
  pruneEmptyDirs(path.join(dist, ...dir.split('/')));
}

const formatMiB = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
console.log(
  `prune-assets: zostawiono ${keptCount} plików (${formatMiB(keptBytes)}), ` +
  `usunięto ${removedCount} nieużywanych (${formatMiB(removedBytes)}) z dist/`,
);
