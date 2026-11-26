module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ],
  printWidth: 120,
  semi: false,
  singleQuote: true,
  trailingComma: 'none'
}
