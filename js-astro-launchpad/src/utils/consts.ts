// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import { getEntry } from 'astro:content';

export async function getSite() {
	// Try to read the `site` entry and fallback to constants
	const entry = await getEntry('site', 'site');
	return {
		title: entry?.data.title,
		description: entry?.data.description,
		based: entry?.data.based,
		timezone: entry?.data.timezone,
		locale: entry?.data.locale,
	};
}
