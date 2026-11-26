// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightOnetag from 'starlight-onetag';
import starlightOnetagSearch from 'starlight-onetag/search';
import starlightOnetagTranslate from 'starlight-onetag/translate';
import starlightOnetagExplain from 'starlight-onetag/explain';
import starlightOnetagSummary from 'starlight-onetag/summary';
import starlightOnetagSelection from 'starlight-onetag/selection';

// Set BASE_PATH when the site is served from a sub-path, e.g. /astro-ai-docs on a GitHub project page.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
	site: process.env.SITE_URL || 'https://fengyiqicoder.github.io',
	base,
	integrations: [
		starlight({
			title: 'Astro AI Docs',
			description: 'A free Astro docs template with built-in AI Q&A that answers from your own pages.',
			logo: { src: './src/assets/ai-docs.svg' },
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/fengyiqicoder/astro-ai-docs' }],
			customCss: ['./src/styles/custom.css'],
			components: {
				// Starlight's footer plus a Powered by OneTag AI line.
				Footer: './src/components/Footer.astro',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Getting started', slug: 'guides/getting-started' },
						{ label: 'How Ask AI works', slug: 'guides/ask-ai' },
						{ label: 'AI features', slug: 'guides/ai-features' },
						{ label: 'Writing content', slug: 'guides/writing-content' },
						{ label: 'Deploy', slug: 'guides/deploy' },
						{ label: 'Customize', slug: 'guides/customize' },
					],
				},
				{ label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
			],
			plugins: [
				// The Ask AI button and dialog next to the search box. The key comes from PUBLIC_ONETAG_KEY.
				starlightOnetag({
					placeholder: 'How do I deploy this to GitHub Pages?',
					site: process.env.PUBLIC_ONETAG_SITE,
				}),
				// AI answer inside the search dialog, above the Pagefind results.
				starlightOnetagSearch({ site: process.env.PUBLIC_ONETAG_SITE }),
				// "Read in <your language>": AI translation of the page for the reader.
				starlightOnetagTranslate({ site: process.env.PUBLIC_ONETAG_SITE }),
				// "Summarize this page" on long pages.
				starlightOnetagSummary({ site: process.env.PUBLIC_ONETAG_SITE }),
				// "Explain this code" under every code block.
				starlightOnetagExplain({ site: process.env.PUBLIC_ONETAG_SITE }),
				// Select text, click Ask AI, get it explained in context.
				starlightOnetagSelection({ site: process.env.PUBLIC_ONETAG_SITE }),
				starlightLlmsTxt(),
			],
		}),
	],
});
