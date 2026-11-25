import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettierConfig from 'eslint-config-prettier'

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	...astro.configs.recommended,
	prettierConfig,
	{
		// Apply jsx-a11y only to JSX/TSX files, not Astro
		files: ['**/*.jsx', '**/*.tsx'],
		...jsxA11y.flatConfigs.recommended,
	},
	{
		rules: {
			// Astro specific rules
			'astro/no-conflict-set-directives': 'error',
			'astro/no-unused-define-vars-in-style': 'error',
			'astro/no-unused-css-selector': 'warn',
			'astro/prefer-class-list-directive': 'error',
			'astro/prefer-object-class-list': 'error',
			'astro/prefer-split-class-list': 'error',

			// TypeScript rules (strict)
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/explicit-function-return-type': 'off', // Can be enabled for stricter typing
			'@typescript-eslint/explicit-module-boundary-types': 'off',

			// General rules (strict)
			'no-console': 'error', // Changed from warn to error
			'prefer-const': 'error',
			'no-var': 'error',
			eqeqeq: ['error', 'always'],
			curly: ['error', 'all'],
			'no-eval': 'error',
			'no-implied-eval': 'error',
			'no-new-func': 'error',
			'no-script-url': 'error',
			'no-alert': 'error',
			'no-debugger': 'error',
			'no-duplicate-imports': 'error',
			'prefer-template': 'error',
			'prefer-arrow-callback': 'error',
			'arrow-body-style': ['error', 'as-needed'],
		},
	},
	{
		files: ['**/*.astro'],
		languageOptions: {
			parser: astro.parser,
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
		},
	},
	{
		files: ['**/*.d.ts'],
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'no-var': 'off',
		},
	},
	{
		ignores: [
			'dist/',
			'node_modules/',
			'.astro/',
			'public/',
			'*.config.js',
			'*.config.mjs',
			'*.config.ts',
		],
	},
]
