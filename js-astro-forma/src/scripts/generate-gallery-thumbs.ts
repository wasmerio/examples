// Kopia skryptu z projektu przemyslaw-stalanowski (1:1).
// Generuje miniatury do public/assets/image-derivatives/thumbs/
// based on photos from public/assets/images. Run: npm run assets:thumbs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import fg from 'fast-glob';

const INPUT_DIRS = [
  'public/assets/images/sauna',
  'public/assets/images/portfolio',
];
const OUTPUT_BASE = 'public/assets/image-derivatives/thumbs';
const WIDTH = 220;
const QUALITY = 60;

function toThumbPath(relativePath: string): string {
  return path.join(OUTPUT_BASE, relativePath);
}

function ensureDir(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

async function processFile(inputDir: string, relativePath: string): Promise<void> {
  const inputPath = path.join(inputDir, relativePath);
  const outputPath = toThumbPath(path.join(path.basename(inputDir), relativePath));
  const inputStat = fs.statSync(inputPath);

  // Why: We skip regeneration if the thumbnail is younger than the source
  if (fs.existsSync(outputPath)) {
    const outputStat = fs.statSync(outputPath);
    if (outputStat.mtimeMs >= inputStat.mtimeMs) return;
  }

  ensureDir(outputPath);

  // Why: without enlargement (withoutEnlargement) and with fit 'inside',
  // so that the proportions of the photo are preserved and the file is light
  const image = sharp(inputPath).resize({ width: WIDTH, withoutEnlargement: true, fit: 'inside' });
  await image.webp({ quality: QUALITY, effort: 4 }).toFile(outputPath);
}

async function main(): Promise<void> {
  let total = 0;

  for (const inputDir of INPUT_DIRS) {
    const fullPath = path.join(process.cwd(), inputDir);
    if (!fs.existsSync(fullPath)) {
      console.log(`Pomijam ${inputDir} — katalog nie istnieje`);
      continue;
    }

    const files = fg.sync('**/*.{jpg,jpeg,png,webp,avif}', { cwd: fullPath, onlyFiles: true });
    for (const file of files) {
      await processFile(inputDir, file);
    }
    total += files.length;
    console.log(`  ${inputDir}: ${files.length} zdjęć`);
  }

  console.log(`Wygenerowano ${total} miniaturek w ${OUTPUT_BASE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
