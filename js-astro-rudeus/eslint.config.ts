import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import astro from 'eslint-plugin-astro'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
    {
        ignores: ['dist/**', '.astro/**', 'node_modules/**'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    ...astro.configs['flat/recommended'],
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-wrapper-object-types': 'off',
        },
    },
    eslintConfigPrettier,
]
