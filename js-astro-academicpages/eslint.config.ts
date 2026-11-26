import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import eslintPluginAstro from 'eslint-plugin-astro';
import markdownlint from 'eslint-plugin-markdownlint';
import markdownlintParser from 'eslint-plugin-markdownlint/parser.js';
import tseslint from 'typescript-eslint';

import { compactObjectSingleLineRule } from './src/plugins/eslint-compact-object';

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'test-results/**',
      'playwright-report/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic,
      local: {
        rules: { 'compact-object-single-line': compactObjectSingleLineRule },
      },
    },
    rules: {
      curly: ['error', 'multi-or-nest'],
      'local/compact-object-single-line': ['error', { maxWidth: 80 }],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      '@stylistic/spaced-comment': ['error', 'always', { markers: ['/'] }],
    },
  },
  {
    files: ['**/*.md'],
    plugins: { markdownlint },
    languageOptions: { parser: markdownlintParser },
    rules: { ...markdownlint.configs.recommended.rules },
  },
];
