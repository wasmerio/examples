import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const outputDir = fileURLToPath(new URL('../dist/', import.meta.url));
rmSync(outputDir, { recursive: true, force: true });
