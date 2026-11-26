import type { Config } from 'prettier';

const config: Config = {
  singleQuote: true,
  trailingComma: 'es5',
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
  ],
  tailwindAttributes: ['class:list'],
  tailwindStylesheet: './src/styles/global.css',
  importOrder: [
    '<TYPES>^(node:.*|node$)',
    '^(node:.*|node$)',
    '',
    '<TYPES>^(astro|astro/.*|astro:.*|@astrojs/.*)$',
    '^(astro|astro/.*|astro:.*|@astrojs/.*)$',
    '',
    '<TYPES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@layouts/(.*)$',
    '^@components/(.*)$',
    '',
    '<TYPES>^@data/(.*)$',
    '^@data/(.*)$',
    '<TYPES>^@plugins/(.*)$',
    '^@plugins/(.*)$',
    '<TYPES>^@utils/(.*)$',
    '^@utils/(.*)$',
    '',
    '<TYPES>^\\.\\./(.*)$',
    '^\\.\\./(.*)$',
    '<TYPES>^\\./(.*)$',
    '^\\./(.*)$',
    '',
    '^@styles/(.*)$',
    '\\.css$',
  ],
  importOrderTypeScriptVersion: '5.0.0',
  overrides: [
    {
      files: ['.markdownlint.jsonc'],
      options: { parser: 'jsonc', trailingComma: 'none' },
    },
  ],
};

export default config;
