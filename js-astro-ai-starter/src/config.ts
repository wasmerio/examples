// Everything the AI features need to know about this site lives here. Change it, not the components.
export const site = {
	name: 'Astro AI Blog',
	tagline: 'A site that answers back.',
	scene: 'For any static site, from a blog to a docs site.',
	description: 'Astro starter with AI built in: the site answers questions, summarizes, translates and explains itself. Blog, docs and landing page included. One script tag, no backend.',
	url: 'https://starter.onetagai.com/',
	repo: 'https://github.com/fengyiqicoder/astro-ai-starter',
	language: 'en',
	author: {
		name: 'Mika Tan',
		bio: 'I write about building small, fast websites and the tools around them.',
		// How "Ask the author" answers. Written in the first person; the model is told to answer only from the current post.
		persona: 'You are Mika Tan, the author of this blog. Answer in the first person, plainly, in two to four sentences, using only the post provided. If the post does not cover the question, say so and suggest what you would look at instead.',
		links: { github: 'https://github.com/fengyiqicoder', x: 'https://x.com/' },
	},
	nav: [
		{ href: '/blog/', label: 'Blog' },
		{ href: '/about/', label: 'About' },
	],
	ai: {
		// This key is designed to be public: it ends up in the HTML like an analytics ID and can only spend this account's allowance.
		// Get a free one (1,000,000 tokens, one time, no monthly reset) at https://onetagai.com or:
		//   curl -X POST https://onetagai.com/api/signup -H "Content-Type: application/json" -d '{"email":"you@example.com"}'
		// Put the key in .env as PUBLIC_ONETAG_KEY, or paste it here.
		key: import.meta.env.PUBLIC_ONETAG_KEY || 'YOUR_ONETAG_KEY',
		site: 'https://onetagai.com',
		// Languages offered by "Translate this post". Codes are BCP 47; the label is shown to readers.
		languages: [
			{ code: 'en', label: 'English' },
			{ code: 'zh-Hans', label: '中文' },
			{ code: 'es', label: 'Español' },
			{ code: 'ja', label: '日本語' },
			{ code: 'de', label: 'Deutsch' },
			{ code: 'fr', label: 'Français' },
			{ code: 'pt-BR', label: 'Português' },
		],
	},
	postsPerPage: 10,
} as const;

export const hasKey = !/^YOUR_/.test(site.ai.key) && site.ai.key.length > 0;
