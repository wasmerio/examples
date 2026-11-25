import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'apps/docs/.vitepress/dist/**',
      'apps/docs/.vitepress/cache/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
);
