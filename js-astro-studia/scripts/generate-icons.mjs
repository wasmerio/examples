/**
 * Write the three site icons into public/ from one source image:
 *
 *   npm run icons -- path/to/square.png
 *
 * The PNGs are committed so the build needs no image processing; rerun this
 * when you change the logo. A source that is not square is center-cropped, and
 * one under 512px on its short side makes icon-512.png a blurry upscale, so
 * start from a larger image if you have one.
 */
import sharp from 'sharp';
import { join } from 'node:path';

const PUBLIC = join(process.cwd(), 'public');
const sourcePath = process.argv[2];

const targets = [
  [32, 'favicon-32.png'],
  [180, 'apple-touch-icon.png'],
  [512, 'icon-512.png'],
];

if (!sourcePath) {
  console.error('Usage: npm run icons -- <path/to/image>');
  process.exit(1);
}

let metadata;
try {
  metadata = await sharp(sourcePath).metadata();
} catch (error) {
  console.error(`Cannot read ${sourcePath}: ${error.message}`);
  console.error('Usage: npm run icons -- <path/to/image>');
  process.exit(1);
}

const { width, height } = metadata;
const shortSide = Math.min(width, height);
if (width !== height) {
  console.log(
    `Note: source is ${width}×${height}, not square; center-cropping to ${shortSide}×${shortSide}.`,
  );
}
if (shortSide < 512) {
  console.warn(
    `Warning: source is only ${shortSide}px on its shorter side; icon-512.png is upscaled.`,
  );
}

for (const [size, name] of targets) {
  await sharp(sourcePath)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC, name));
  console.log(`✓ ${name} (${size}×${size})`);
}
