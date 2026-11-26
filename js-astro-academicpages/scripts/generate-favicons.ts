import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = resolve(import.meta.dirname, '..');
const svgPath = resolve(rootDir, 'public/favicon.svg');

if (!existsSync(svgPath)) {
  console.error(`Error: Source SVG not found at ${svgPath}`);
  process.exit(1);
}

try {
  execFileSync('resvg', ['--version'], { stdio: 'pipe' });
} catch {
  console.error(
    'Error: "resvg" CLI tool is not installed or not found on PATH.\n' +
      'Please install resvg:\n' +
      '  - Cargo: cargo install resvg\n' +
      '  - Arch Linux: pacman -S resvg\n' +
      '  - macOS: brew install resvg\n' +
      '  - Binaries: https://github.com/linebender/resvg/releases'
  );
  process.exit(1);
}

function renderPng(size: number): Buffer {
  return execFileSync(
    'resvg',
    [
      '-w',
      String(size),
      '-h',
      String(size),
      '--shape-rendering',
      'geometricPrecision',
      '--text-rendering',
      'optimizeLegibility',
      '--image-rendering',
      'optimizeQuality',
      svgPath,
      '-c',
    ],
    { maxBuffer: 10 * 1024 * 1024 }
  );
}

interface IcoImage {
  width: number;
  height: number;
  buffer: Buffer;
}

function createIco(images: IcoImage[]): Buffer {
  const headerSize = 6;
  const directorySize = 16 * images.length;
  let offset = headerSize + directorySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: 1 = ICO
  header.writeUInt16LE(images.length, 4); // Number of images

  const directories: Buffer[] = [];
  const imageBuffers: Buffer[] = [];

  for (const img of images) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    dir.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    dir.writeUInt8(0, 2); // Palette colors
    dir.writeUInt8(0, 3); // Reserved
    dir.writeUInt16LE(1, 4); // Color planes
    dir.writeUInt16LE(32, 6); // Bits per pixel
    dir.writeUInt32LE(img.buffer.length, 8); // Image size in bytes
    dir.writeUInt32LE(offset, 12); // Image data offset

    directories.push(dir);
    imageBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...directories, ...imageBuffers]);
}

const pngTargets: { filename: string; size: number }[] = [
  { filename: 'favicon-32x32.png', size: 32 },
  { filename: 'apple-touch-icon.png', size: 180 },
  { filename: 'icon-192.png', size: 192 },
  { filename: 'icon-512.png', size: 512 },
];

console.log(
  'Generating favicon assets from public/favicon.svg using resvg CLI...\n'
);

for (const target of pngTargets) {
  const outPath = resolve(rootDir, 'public', target.filename);
  const png = renderPng(target.size);
  writeFileSync(outPath, png);
  console.log(
    `✓ public/${target.filename} (${target.size}×${target.size}) - ${png.length} bytes`
  );
}

const icoImages: IcoImage[] = [
  { width: 16, height: 16, buffer: renderPng(16) },
  { width: 32, height: 32, buffer: renderPng(32) },
  { width: 48, height: 48, buffer: renderPng(48) },
];

const icoBuffer = createIco(icoImages);
const icoPath = resolve(rootDir, 'public/favicon.ico');
writeFileSync(icoPath, icoBuffer);
console.log(
  `✓ public/favicon.ico (16×16, 32×32, 48×48) - ${icoBuffer.length} bytes\n`
);

console.log('Favicon generation completed successfully');
