module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:astro/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // ここに.astroファイル向けのルールを書くことも可能
      },
    },
  ],
};
