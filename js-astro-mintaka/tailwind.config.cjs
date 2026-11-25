/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		screens: {
			sm: "540px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			borderRadius: {
				"4xl": "2rem",
				"5xl": "3rem",
				"6xl": "4rem",
				"7xl": "5rem",
			},
			colors: {
				black: "#131313",
				primary: {
					50: "#f3ffe4",
					100: "#e4ffc5",
					200: "#c9ff92",
					300: "#a4ff54",
					400: "#82fb20",
					500: "#6cf901",
					600: "#49b400",
					700: "#388902",
					800: "#2f6b09",
					900: "#2a5a0d",
					950: "#113300",
				},
				lime: {
					50: "hsl(64, 100%, 95%)",
					100: "hsl(66, 100%, 89%)",
					200: "hsl(68, 100%, 79%)",
					300: "hsl(70, 100%, 66%)",
					400: "hsl(71, 96%, 55%)",
					500: "hsl(72, 99%, 49%)",
					600: "hsl(74, 100%, 35%)",
					700: "hsl(74, 97%, 27%)",
					800: "hsl(75, 84%, 23%)",
					900: "hsl(76, 75%, 20%)",
					950: "hsl(78, 100%, 10%)",
				},
				blue: {
					50: "hsl(240, 100%, 97%)",
					100: "hsl(245, 100%, 95%)",
					200: "hsl(244, 100%, 90%)",
					300: "hsl(247, 100%, 83%)",
					400: "hsl(249, 100%, 73%)",
					500: "hsl(252, 100%, 62%)",
					600: "hsl(256, 100%, 54%)",
					700: "hsl(255, 98%, 50%)",
					800: "hsl(255, 97%, 42%)",
					900: "hsl(256, 95%, 37%)",
					950: "hsl(253, 100%, 23%)",
				},
				trinidad: {
					50: "hsl(27, 100%, 96%)",
					100: "hsl(28, 100%, 92%)",
					200: "hsl(26, 100%, 83%)",
					300: "hsl(24, 100%, 72%)",
					400: "hsl(20, 100%, 61%)",
					500: "hsl(18, 100%, 53%)",
					600: "hsl(14, 95%, 47%)",
					700: "hsl(11, 93%, 40%)",
					800: "hsl(8, 84%, 34%)",
					900: "hsl(9, 79%, 28%)",
					950: "hsl(7, 86%, 15%)",
				},
			},
			fontFamily: {
				display: ["Midnight", ...defaultTheme.fontFamily.sans],
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
				mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
			},
		},
	},
	safelist: [
		{
			pattern: /row-start-\d+/,
			variants: ["md"],
		},
	],
	plugins: [
		require.resolve("prettier-plugin-astro"),
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/aspect-ratio"),
	],
	overrides: [
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
};
