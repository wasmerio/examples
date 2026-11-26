import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_CONFIG, getConfiguredBasePath } from '../src/config/site.js';
import { memories } from '../src/data/memories.js';
import { renderPlacesMemoryIndex } from '../src/lib/places-index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'src/generated/atlas-memory-index.html');
const basePath = getConfiguredBasePath(process.env.BASE_PATH ?? SITE_CONFIG.basePath);
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, `${renderPlacesMemoryIndex(memories, basePath)}\n`);
