import type { Config } from 'prettier';

export default {
  plugins: ['prettier-plugin-astro'],
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
} satisfies Config;
