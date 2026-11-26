// eslint.config.mjs
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Ignorar archivos globales
  {
    ignores: ['dist', '.astro', 'node_modules', '.vercel', 'public'],
  },

  // 2. Configuración Base JS/TS (Browser por defecto)
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Por defecto, asumimos navegador
      },
    },
  },

  // 3. EXCEPCIÓN: Archivos que corren en Node.js (Scripts y Configs)
  {
    files: ['scripts/**/*.mjs', '*.config.mjs', '*.config.js'],
    languageOptions: {
      globals: {
        ...globals.node, // Habilita 'console', 'process', etc.
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // Permite require() en configs si es necesario
      'no-undef': 'off', // Evita falsos positivos con globales de Node
    },
  },

  // 4. Configuración para Archivos ASTRO
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-strict'],
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },
    },
  },

  // 5. Configuración para React (JSX/TSX)
  {
    files: ['**/*.{jsx,tsx}'],
    ...reactPlugin.configs.flat.recommended,
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // 6. Prettier (siempre al final)
  eslintConfigPrettier
);
