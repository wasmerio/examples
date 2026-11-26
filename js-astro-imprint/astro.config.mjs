import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { SITE } from './src/config.ts';

const postsRoot = new URL('./src/content/posts/', import.meta.url);
const noindexPaths = new Set(
  readdirSync(postsRoot, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => join(entry.parentPath, entry.name))
    .filter(file => /^---[\s\S]*?^noindex:\s*true\s*$/m.test(readFileSync(file, 'utf8')))
    .map(file => `/${relative(postsRoot.pathname, file).replace(/\.md$/, '')}/`),
);

export default defineConfig({
  site: SITE.url,
  base: SITE.basePath,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: page => {
        const pathname = decodeURIComponent(new URL(page).pathname);
        const withoutBase = SITE.basePath !== '/' && pathname.startsWith(SITE.basePath)
          ? pathname.slice(SITE.basePath.length)
          : pathname;
        const isPagination = /\/page\/\d+\/$/.test(withoutBase);
        return !isPagination && !noindexPaths.has(withoutBase);
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
