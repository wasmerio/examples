import type { AstroIntegration } from 'astro';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const themeSrc = fileURLToPath(new URL('./', import.meta.url));

export function loneSrc(root: string = process.cwd()): string {
  const rel = path.relative(root, themeSrc);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
    return path.join('node_modules', 'lone', 'src');
  }
  return rel;
}

export default function lone(): AstroIntegration {
  return {
    name: 'lone',
    hooks: {
      'astro:config:setup': ({ updateConfig, config }) => {
        const root = fileURLToPath(config.root);
        const configFile = path.join(root, 'lone.config.ts');
        updateConfig({
          markdown: {
            shikiConfig: {
              themes: {
                light: 'min-light',
                dark: 'min-dark',
              },
              defaultColor: false,
              wrap: false,
            },
          },
          vite: {
            plugins: [
              {
                name: 'lone-config',
                enforce: 'pre',
                resolveId(id) {
                  if (id === 'lone/config') return configFile;
                },
              },
            ],
          },
        });
      },
    },
  };
}
