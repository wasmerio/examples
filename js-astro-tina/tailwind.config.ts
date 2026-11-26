/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Config } from "tailwindcss";

import plugin from "tailwindcss/plugin";

import { clampGenerator, tokensToTailwind } from "./src/css-utils";
// Design Tokens
import colorTokens from "./src/design-tokens/colors.json";
import fontTokens from "./src/design-tokens/fonts.json";
import spacingTokens from "./src/design-tokens/spacing.json";
import textLeadingTokens from "./src/design-tokens/text-leading.json";
import textSizeTokens from "./src/design-tokens/text-sizes.json";
import textWeightTokens from "./src/design-tokens/text-weights.json";
import viewportTokens from "./src/design-tokens/viewports.json";

// Process design tokens
const colors = tokensToTailwind(colorTokens.items);
const fontFamily = tokensToTailwind(fontTokens.items);
const fontWeight = tokensToTailwind(textWeightTokens.items);
const fontSize = tokensToTailwind(clampGenerator(textSizeTokens.items));
const lineHeight = tokensToTailwind(textLeadingTokens.items);
const spacing = tokensToTailwind(clampGenerator(spacingTokens.items));

export default {
	// Prevents Tailwind's core components
	blocklist: ["container"],
	content: [
		"./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}",
		"!./src/pages/og-image/[slug].png.ts",
	],
	corePlugins: {
		backgroundOpacity: false,
		borderOpacity: false,
		preflight: false,
		textOpacity: false,
	},
	// Prevents Tailwind from generating that wall of empty custom properties
	experimental: {
		optimizeUniversalDefaults: true,
	},
	plugins: [
		// Generates custom property values from tailwind config
		plugin(function ({ addBase, config }) {
			const currentConfig = config();
			const groups = [
				{ key: "colors", prefix: "color" },
				{ key: "spacing", prefix: "space" },
				{ key: "fontSize", prefix: "size" },
				{ key: "lineHeight", prefix: "leading" },
				{ key: "fontFamily", prefix: "font" },
				{ key: "fontWeight", prefix: "font" },
			];

			const cssVars: Record<string, string> = {};

			groups.forEach(({ key, prefix }) => {
				if (currentConfig.theme) {
					const group = currentConfig.theme[key];

					if (!group) {
						return;
					}

					Object.keys(group).forEach((key) => {
						if (Array.isArray(group[key])) {
							// If the value is an array, join its elements into a comma-separated string
							cssVars[`--${prefix}-${key}`] = group[key].join(", ");
						} else {
							// Otherwise, assign the value
							cssVars[`--${prefix}-${key}`] = String(group[key]);
						}
					});
				}
			});

			addBase({
				":root": cssVars,
			});
		}),

		// Generates custom utility classes
		plugin(function ({ addUtilities, config }) {
			const currentConfig = config();
			const customUtilities = [
				{ key: "spacing", prefix: "flow-space", property: "--flow-space" },
				{ key: "spacing", prefix: "region-space", property: "--region-space" },
				{ key: "spacing", prefix: "gutter", property: "--gutter" },
			];

			const utilities: Record<string, Record<string, string>> = {};

			customUtilities.forEach(({ key, prefix, property }) => {
				if (currentConfig.theme) {
					const group = currentConfig.theme[key];

					if (!group) {
						return;
					}

					Object.keys(group).forEach((key) => {
						utilities[`.${prefix}-${key}`] = { [property]: group[key] };
					});
				}
			});
			// console.log(utilities);
			addUtilities(utilities);
		}),
	],
	theme: {
		backgroundColor: ({ theme }) => theme("colors"),
		colors,
		fontFamily,
		fontSize,
		fontWeight,
		lineHeight,
		margin: ({ theme }) => ({
			auto: "auto",
			...theme("spacing"),
		}),
		padding: ({ theme }) => theme("spacing"),
		screens: {
			lg: `${viewportTokens.max.toString()}px`,
			md: `${viewportTokens.mid.toString()}px`,
			sm: `${viewportTokens.min.toString()}px`,
		},
		spacing,
		textColor: ({ theme }) => theme("colors"),
	},
} satisfies Config;
