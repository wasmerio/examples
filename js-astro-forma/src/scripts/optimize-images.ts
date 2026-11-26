import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { canReuseImageDerivatives, fingerprintImage, type ImageManifestEntry } from './image-cache';

// The pipeline includes both project source images and media from the CMS.
// The CMS originals stay in public/assets/uploads because the panel and existing ones
// URLs must still work after the derivatives are generated.
const PROJECT_ROOT = process.cwd();
const SOURCES = [
  {
    id: 'raw',
    inputDir: path.join(PROJECT_ROOT, 'src/assets/raw'),
    outputDir: path.join(PROJECT_ROOT, 'public/assets/images'),
  },
  {
    id: 'cms',
    inputDir: path.join(PROJECT_ROOT, 'public/assets/uploads'),
    outputDir: path.join(PROJECT_ROOT, 'public/assets/upload-derivatives'),
  },
] as const;

// WebP is a slight fallback, and AVIF usually gives the smallest file for photos.
// These values ​​are a compromise of quality and size intended for photography.
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 50;

// A denser list of widths allows the browser to select a file closer to the real one
// slot size. No suffix means the base variant is 800 px for existing ones
// danych JSON, dlatego nie zmieniamy tego kontraktu na `@800`.
const SIZES = [
  { name: '@220', width: 220, desc: 'thumbnail' },
  { name: '@480', width: 480, desc: 'small' },
  { name: '@640', width: 640, desc: 'tablet' },
  { name: '', width: 800, desc: 'standard' },
  { name: '@1080', width: 1080, desc: 'large' },
  { name: '@1280', width: 1280, desc: 'desktop' },
  { name: '@1600', width: 1600, desc: 'retina' },
  { name: '@1920', width: 1920, desc: 'wide' },
];

const FORMATS = [
  { extension: 'webp', quality: WEBP_QUALITY },
  { extension: 'avif', quality: AVIF_QUALITY },
] as const;

// The manifest is outside public/ so it is not copied to dist. Content hashes
// detect replacements even when the new source has the same file size.
const MANIFEST_FILE = path.join(PROJECT_ROOT, 'node_modules/.cache/images-manifest.json');

function loadManifest(): Record<string, ImageManifestEntry | number> {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8')) as Record<string, ImageManifestEntry | number>;
  } catch {
    return {};
  }
}

function saveManifest(manifest: Record<string, ImageManifestEntry | number>): void {
  fs.mkdirSync(path.dirname(MANIFEST_FILE), { recursive: true });
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
}

function slugify(text: string): string {
  const chars: Record<string, string> = {
    ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
    Ą: 'a', Ć: 'c', Ę: 'e', Ł: 'l', Ń: 'n', Ó: 'o', Ś: 's', Ź: 'z', Ż: 'z',
  };

  return text
    .split('')
    .map((character) => chars[character] || character)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getOutputPath(
  source: typeof SOURCES[number],
  size: { name: string },
  extension: string,
  relativePath: string,
  baseName: string,
): string {
  return path.join(source.outputDir, relativePath, `${baseName}${size.name}.${extension}`);
}

async function processDirectory(
  source: typeof SOURCES[number],
  directory: string,
  manifest: Record<string, ImageManifestEntry | number>,
): Promise<void> {
  for (const item of fs.readdirSync(directory)) {
    const fullPath = path.join(directory, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      await processDirectory(source, fullPath, manifest);
      continue;
    }

    const ext = path.extname(item).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) continue;

    const relativePath = path.relative(source.inputDir, directory);
    const baseName = slugify(path.basename(item, ext));
    const sourceKey = `${source.id}:${path.join(relativePath, item).replace(/\\/g, '/')}`;
    const fingerprint = await fingerprintImage(fullPath);
    const metadata = await sharp(fullPath).metadata();
    if (!metadata.width || !metadata.height) continue;

    // EXIF orientation can swap width with height. We count the slot for
    // rotated dimensions so that HTML and layout attributes do not have wrong proportions.
    const isRotated = (metadata.orientation ?? 1) >= 5;
    const baseWidth = isRotated ? metadata.height : metadata.width;
    const baseHeight = isRotated ? metadata.width : metadata.height;
    const standardWidth = Math.min(800, baseWidth);
    const neededSizes = SIZES.filter((size) => {
      const actualWidth = Math.min(size.width, baseWidth);
      // The larger variant will not add details that are not present in the original.
      // We omit it to avoid saving several identical files after scaling.
      if (size.width > baseWidth) return false;
      if (size.name === '@220') return actualWidth !== baseWidth;
      return actualWidth !== standardWidth;
    });
    const outputSizes = [{ name: '', width: 800, desc: 'standard' }, ...neededSizes];
    const allTargets = outputSizes.flatMap((size) => FORMATS.map((format) => ({
      ...size,
      ...format,
      filePath: getOutputPath(source, size, format.extension, relativePath, baseName),
    })));

    // We only remove old derivatives of the same source. Original CMS files
    // they are in a different directory and never go to this cleanup branch.
    const expectedPaths = new Set(allTargets.map((target) => target.filePath));
    for (const staleTarget of SIZES.flatMap((size) => FORMATS.map((format) => ({
      ...size,
      ...format,
      filePath: getOutputPath(source, size, format.extension, relativePath, baseName),
    })))) {
      if (!expectedPaths.has(staleTarget.filePath) && fs.existsSync(staleTarget.filePath)) {
        fs.rmSync(staleTarget.filePath);
      }
    }

    const allTargetsExist = allTargets.every((target) => fs.existsSync(target.filePath));
    if (canReuseImageDerivatives(manifest[sourceKey], fingerprint, allTargetsExist)) continue;

    console.log(`\n📸 ${source.id}: ${path.join(relativePath, item)}`);

    // We process variants sequentially so that large photos do not take up the entire image
    // CI or server memory during one build run.
    for (const target of allTargets) {
      fs.mkdirSync(path.dirname(target.filePath), { recursive: true });

      const width = Math.min(target.width, baseWidth);
      const height = Math.round(width * (baseHeight / baseWidth));
      const pipeline = sharp(fullPath)
        .autoOrient()
        .resize({ width, height, fit: 'inside', withoutEnlargement: true });

      if (target.extension === 'avif') {
        await pipeline.avif({ quality: target.quality, effort: 6 }).toFile(target.filePath);
      } else {
        await pipeline.webp({ quality: target.quality, effort: 6 }).toFile(target.filePath);
      }

      const outputBytes = fs.statSync(target.filePath).size;
      const outputSize = outputBytes > 1024 ? `${(outputBytes / 1024).toFixed(0)}KB` : `${outputBytes}B`;
      console.log(`  ${target.desc}: ${width}x${height} ${outputSize}`);
    }

    manifest[sourceKey] = fingerprint;
  }
}

console.log('🚀 Start smart optymalizacji zdjęć...');
for (const source of SOURCES) {
  if (!fs.existsSync(source.inputDir)) {
    fs.mkdirSync(source.inputDir, { recursive: true });
    console.log(`ℹ️ Utworzono pusty katalog źródłowy: ${source.inputDir}`);
  }
}

const manifest = loadManifest();

(async () => {
  for (const source of SOURCES) {
    await processDirectory(source, source.inputDir, manifest);
  }
  saveManifest(manifest);
  console.log('\n✨ Wszystkie zdjęcia zoptymalizowane!');
})().catch((error) => {
  console.error('\n💥 Błąd:', error);
  process.exitCode = 1;
});
