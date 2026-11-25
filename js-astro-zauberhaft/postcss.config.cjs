const purgecss = require("@fullhuman/postcss-purgecss")({
	content: ['./public/**/*',
	'./src/**/*.{astro,js,jsx,ts,tsx,vue}'],
	options: {
		safelist: [/^body/, /^html/, /^dark/, "dark", "html", "body", /^light/, "light"]
	 },
	fontFace: true,
	keyframes: true,
	variables: true,
	rejected: true
});
const cssnano = require("cssnano")({
  preset: [
    "default",
    {
			cssDeclarationSorter: true,
			discardEmpty: true,
			discardOverridden: true,
			discardDuplicates: true,
			discardComments: true,
			mergeIdents: true,
			mergeLonghand: true,
			mergeRules: false,
			minifySelectors: true,
			minifyParams: true,
			minifyGradients: true,
			minifyFontValues: true,
			normalizeWhitespace: true,
			normalizePositions: true,
			normalizeUrl: true,
			normalizeDisplayValues: true,
			reducetransforms: true,
			reduceIdents: true,
			uniqueSelectors: true,
    },
  ],
});
module.exports = {
  plugins: [
    require("postcss-mixins"),
    require("postcss-import"),
    require("postcss-nested"),
    require("autoprefixer"),
		cssnano,
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  ],
};
