import { type Config } from 'prettier';

const config: Config = {
  arrowParens: 'avoid',
  printWidth: 120,
  singleQuote: true,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};

export default config;
