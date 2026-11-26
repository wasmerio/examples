import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('public/assets/images');
const OUTPUT_DIR = path.resolve('public/assets/images-responsive');
const WIDTHS = [320, 480, 640, 800, 1080];

function collectWebpFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectWebpFiles(fullPath);
    return entry.name.endsWith('.webp') ? [fullPath] : [];
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const expected = new Set();

  for (const sourcePath of collectWebpFiles(SOURCE_DIR)) {
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || metadata.width < WIDTHS[0]) continue;

    const relativeName = path.relative(SOURCE_DIR, sourcePath);
    const baseName = relativeName.slice(0, -'.webp'.length);
    for (const width of WIDTHS) {
      if (width >= metadata.width) continue;

      const outputPath = path.join(OUTPUT_DIR, `${baseName}-${width}.webp`);
      expected.add(path.resolve(outputPath));
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      const sourceMtime = fs.statSync(sourcePath).mtimeMs;
      if (fs.existsSync(outputPath) && fs.statSync(outputPath).mtimeMs >= sourceMtime) continue;

      // Warianty zmieniają tylko wymiary. Oryginał pozostaje nietknięty.
      await sharp(sourcePath)
        .resize({ width, withoutEnlargement: true })
        // Jakość 85 jest przy wyświetlanych rozmiarach nie do odróżnienia od 90, a pliki są wyraźnie lżejsze.
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
    }
  }

  for (const file of collectWebpFiles(OUTPUT_DIR)) {
    if (!expected.has(path.resolve(file))) fs.rmSync(file);
  }

  console.log(`responsive-images: wygenerowano ${expected.size} wariantów`);
}

main().catch((error) => {
  console.error('responsive-images: błąd generowania wariantów', error);
  process.exitCode = 1;
});
