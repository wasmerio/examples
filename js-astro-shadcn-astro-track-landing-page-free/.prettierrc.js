module.exports = {
  // Basic Prettier settings
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  printWidth: 100,

  // Plugin settings
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss' // Must be last
  ],

  // Astro-specific overrides
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    },
    {
      files: ['*.json', '*.jsonc'],
      options: {
        trailingComma: 'none'
      }
    }
  ],

  // Tailwind CSS plugin settings
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['cn', 'cva', 'cx']
}
