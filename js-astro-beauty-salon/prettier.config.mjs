// prettier.config.mjs
/** @type {import("prettier").Config} */
export default {
  // Configuración base (ajusta a tu gusto)
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,

  // Plugins (El orden importa)
  plugins: [
    'prettier-plugin-astro',
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss', // DEBE ser el último para que ordene clases después de todo
  ],

  // Overrides para Astro
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],

  // Configuración de Sort Imports (@ianvs)
  importOrder: [
    '<BUILTIN_MODULES>', // Node.js modules
    '',
    '<THIRD_PARTY_MODULES>', // React, Astro, etc.
    '',
    '^@layouts/(.*)$',
    '^@components/(.*)$',
    '^@styles/(.*)$',
    '^@assets/(.*)$',
    '',
    '^[./]', // Imports relativos
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
};
