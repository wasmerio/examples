import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Astro's directory output wraps extension-bearing page routes in index.html.
// Flatten these generated files so static hosts serve the original Hugo URLs.
export default function outputLayout(): import('astro').AstroIntegration {
  return {
    name: 'solitude-output-layout',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        async function visit(directory: string): Promise<void> {
          for (const entry of await fs.readdir(directory, {
            withFileTypes: true,
          })) {
            if (!entry.isDirectory()) continue;
            const full = path.join(directory, entry.name);
            if (entry.name.endsWith('.html')) {
              const children = await fs.readdir(full);
              if (children.length !== 1 || children[0] !== 'index.html')
                throw new Error(`Cannot flatten legacy route safely: ${full}`);
              const html = await fs.readFile(path.join(full, 'index.html'));
              await fs.rm(full, { recursive: true });
              await fs.writeFile(full, html, { flag: 'wx' });
            } else await visit(full);
          }
        }
        await visit(fileURLToPath(dir));
      },
    },
  };
}
