// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

import astroParser from 'astro-eslint-parser'
import astro from 'eslint-plugin-astro'

import tsParser from '@typescript-eslint/parser'
import tseslint from '@typescript-eslint/eslint-plugin'

import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

import stylistic from '@stylistic/eslint-plugin'

import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  // Disable ESLint rules that conflict with Prettier
  prettier,

  // Global ignores
  globalIgnores([
    'node_modules/**',
    'dist/**',
    'build/**',
    'out/**',
    '.astro/**',
    '.vercel/**',
    '.netlify/**',
    'coverage/**',
    'eslint.config.*'
  ]),

  // =========================
  // JS / TS / React
  // =========================
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      '@stylistic': stylistic
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      // React
      'react/display-name': 'off',
      'react/no-children-prop': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // TypeScript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',

      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // Stylistic rules
      '@stylistic/lines-around-comment': [
        'error',
        {
          beforeBlockComment: true,
          beforeLineComment: true,
          allowBlockStart: true,
          allowObjectStart: true,
          allowArrayStart: true
        }
      ],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'any', prev: 'export', next: 'export' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: '*', next: ['function', 'multiline-const', 'multiline-block-like'] },
        { blankLine: 'always', prev: ['function', 'multiline-const', 'multiline-block-like'], next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' }
      ]
    }
  },

  // =========================
  // Astro files
  // =========================
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      astro,
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      '@stylistic': stylistic
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      // Astro recommended
      ...astro.configs.recommended.rules,

      // Astro preferences
      'astro/no-set-html-directive': 'warn',
      'astro/no-unused-css-selector': 'warn',

      // Keep TS + style consistency in <script>
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',

      '@stylistic/lines-around-comment': [
        'error',
        {
          beforeBlockComment: true,
          beforeLineComment: true,
          allowBlockStart: true,
          allowObjectStart: true,
          allowArrayStart: true
        }
      ]
    }
  },

  // =========================
  // TS-only overrides
  // =========================
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  }
])
