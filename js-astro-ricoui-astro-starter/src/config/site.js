const SITE_URL = import.meta.env.PUBLIC_SITE_URL || "https://ricoui-astro-starter.vercel.app";

export const siteConfig = {
	title: "Design-led Astro Starter",
	author: "",
	url: SITE_URL,
	utm: {
		source: SITE_URL,
		medium: "referral",
		campaign: "navigation",
	},
	meta: {
		title: "Design-led Astro Starter - Astro 7 template",
		description:
			"A generic Astro 7 starter for design-driven sites, with Blog, DESIGN.md, Elements, Tailwind CSS v4, MDX, and a reusable theme system.",
		keywords:
			"astro starter, astro 7 template, design system, tailwind css, mdx blog, website theme",
		image: `${SITE_URL}/assets/preview.jpg`,
		twitterHandle: "",
	},
	social: {
		github: "https://github.com/ricocc/ricoui-astro-starter",
	},
};
