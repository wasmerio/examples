import sharp from 'sharp';

export type Bitmap = { gray: Uint8Array; inside: Uint8Array; width: number; height: number };

const NEIGHBORS = [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]];

const STYLES = [
  { name: 'light', ink: [82, 96, 119], amount: (brightness: number) => 0.08 + 0.92 * (1 - brightness) ** 0.8 },
  { name: 'dark', ink: [159, 176, 224], amount: (brightness: number) => 0.08 + 0.55 * brightness },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function brightness({ gray, inside }: Bitmap): Float32Array {
  const tones = gray.filter((_, i) => inside[i]).sort();
  const low = tones[Math.floor(tones.length * 0.02)];
  const high = tones[Math.floor(tones.length * 0.98)];
  return Float32Array.from(gray, (value) => clamp((value - low) / Math.max(high - low, 1), 0, 1));
}

function atkinson(amounts: Float32Array, { inside, width, height }: Bitmap): Uint8Array {
  const values = amounts.slice();
  const ink = new Uint8Array(values.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (!inside[i]) continue;
      ink[i] = values[i] >= 0.5 ? 1 : 0;
      const error = (values[i] - ink[i]) / 8;
      for (const [dx, dy] of NEIGHBORS) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny < height) values[ny * width + nx] += error;
      }
    }
  }
  return ink;
}

export async function dither(bitmap: Bitmap, scale: number, path: (style: string) => string): Promise<string[]> {
  const { width, height } = bitmap;
  const levels = brightness(bitmap);

  return Promise.all(STYLES.map(async ({ name, ink: [r, g, b], amount }) => {
    const pixels = new Uint8Array(width * height * 4);
    atkinson(levels.map(amount), bitmap).forEach((on, i) => on && pixels.set([r, g, b, 255], i * 4));
    await sharp(pixels, { raw: { width, height, channels: 4 } })
      .resize(width * scale, height * scale, { kernel: 'nearest' })
      .webp({ lossless: true })
      .toFile(path(name));
    return path(name);
  }));
}
