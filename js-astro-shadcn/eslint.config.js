import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import astroPlugin from 'eslint-plugin-astro';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';

export default [
  // JavaScript/TypeScriptファイル用の基本設定
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        localStorage: 'readonly',
        document: 'readonly',
        window: 'readonly',
        URL: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,

      // TypeScript関連のルール調整
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',

      // React関連のルール調整
      'react/react-in-jsx-scope': 'off', // React 17+では不要
      'react/prop-types': 'off', // TypeScriptを使用している場合は不要
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',

      // 一般的なルール
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Astroファイル用の設定
  ...astroPlugin.configs['flat/recommended'],

  // src/types/ ディレクトリの型定義専用ルール
  {
    files: ['src/types/**/*.ts'],
    rules: {
      // 型定義のみ許可
      '@typescript-eslint/no-unused-vars': 'off', // 型定義では使用されていない型も許可
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Default exports are not allowed in type definition files. Use named exports only.',
        },
        {
          selector: 'FunctionDeclaration',
          message: 'Functions are not allowed in type definition files. This directory is for types only.',
        },
        {
          selector: 'ClassDeclaration',
          message: 'Classes are not allowed in type definition files. This directory is for types only.',
        },
        {
          selector: 'VariableDeclaration',
          message: 'Runtime variables are not allowed in type definition files. This directory is for types only.',
        },
        {
          selector: 'ExportNamedDeclaration > VariableDeclaration',
          message: 'Exported variables are not allowed in type definition files. Use type exports only.',
        },
        {
          selector: 'ExportNamedDeclaration > FunctionDeclaration',
          message: 'Exported functions are not allowed in type definition files. Use type exports only.',
        },
        {
          selector: 'ExportNamedDeclaration > ClassDeclaration',
          message: 'Exported classes are not allowed in type definition files. Use type exports only.',
        },
      ],
    },
  },

  // 設定ファイル用のルール緩和
  {
    files: ['**/*.config.{js,mjs,ts}', '**/vite.config.ts', '**/astro.config.mjs'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
    },
  },

  // 除外するディレクトリとファイル
  {
    ignores: ['node_modules/**', 'dist/**', '.astro/**', '**/*.d.ts', 'public/**'],
  },

  // Prettierとの競合を避ける設定（最後に配置）
  prettierConfig,
];
