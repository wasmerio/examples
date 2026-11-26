import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const width = 1200;
const height = 630;
const paper = 251;
const ink = 29;
const radius = 12;
const bars = [
  { x: 432, y: 270, length: 336 },
  { x: 432, y: 315, length: 256 },
  { x: 432, y: 360, length: 176 },
];

const pixels = new Uint8Array(width * height).fill(paper);

for (const bar of bars) {
  const top = Math.floor(bar.y - radius - 1);
  const bottom = Math.ceil(bar.y + radius + 1);
  const left = Math.floor(bar.x - radius - 1);
  const right = Math.ceil(bar.x + bar.length + radius + 1);
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const nearest = Math.min(Math.max(px, bar.x), bar.x + bar.length);
      const distance = Math.hypot(px - nearest, py - bar.y);
      const coverage = Math.min(1, Math.max(0, radius - distance + 0.5));
      if (coverage > 0) {
        const index = y * width + x;
        pixels[index] = Math.round(pixels[index] + (ink - pixels[index]) * coverage);
      }
    }
  }
}

const rows = Buffer.alloc((width + 1) * height);
for (let y = 0; y < height; y++) {
  rows[y * (width + 1)] = 0;
  rows.set(pixels.subarray(y * width, (y + 1) * width), y * (width + 1) + 1);
}

const table = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  table[n] = c >>> 0;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBytes = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])), 0);
  return Buffer.concat([length, typeBytes, data, crc]);
}

const header = Buffer.alloc(13);
header.writeUInt32BE(width, 0);
header.writeUInt32BE(height, 4);
header[8] = 8;
header[9] = 0;
header[10] = 0;
header[11] = 0;
header[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", header),
  chunk("IDAT", deflateSync(rows, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const output = resolve(dirname(fileURLToPath(import.meta.url)), "../public/og.png");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, png);
console.log(`Wrote ${output} (${png.length} bytes)`);
