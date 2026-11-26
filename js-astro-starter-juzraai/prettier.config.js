/** @type {import("prettier").Config} */
const config = {
	plugins: ['prettier-plugin-astro'],
	printWidth: 100,
	semi: true,
	singleAttributePerLine: true,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'all',
};

export default config;
