import { dirname, join, parse, relative } from 'node:path';
import sharp from 'sharp';

import { dither } from './lib/dither';

const WIDTH = 1200;

const [input] = Bun.argv.slice(2);

if (!input) {
  console.log('Usage: bun run image:dither <image>');
  process.exit(1);
}

try {
  const { data: gray, info: { width, height } } = await sharp(input)
    .rotate()
    .resize(WIDTH, null, { withoutEnlargement: true })
    .flatten({ background: '#fff' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { name } = parse(input);
  const inside = new Uint8Array(width * height).fill(1);
  const paths = await dither({ gray, inside, width, height }, 1, (style) => join(dirname(input), `${name}-${style}.webp`));
  for (const path of paths) console.log(`Created ${relative(process.cwd(), path)}`);
} catch (error) {
  console.error((error as Error).message);
  process.exitCode = 1;
}
