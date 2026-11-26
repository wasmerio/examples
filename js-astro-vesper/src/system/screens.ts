/**
 * Every screen Vesper provides, for the design system overview (/system). Each one shows as a live preview of the
 * real page. Paths use the demo content (every page switch on, the default); change a slug here if you rename or
 * remove that entry, and drop a screen whose page you turn off in src/theme.config.ts.
 */
import type { Screen } from "virtual:astronomic-system";

export const screens: Screen[] = [
	{ name: "Home", path: "/", description: "The intro with the Now line and social links, the collage band, the newest posts and the side cards." },
	{ name: "Articles", path: "/articles", description: "Every post, newest first, with the category filter, the search box and paging." },
	{ name: "Category", path: "/articles/category/design", description: "One category's posts, the filter set to it." },
	{ name: "Tag", path: "/tags/film", description: "One tag's posts." },
	{ name: "Article", path: "/articles/designing-for-people-who-are-offline-on-purpose", description: "A long post: the cut hero photo, the contents, the series and the author card." },
	{ name: "Projects", path: "/projects", description: "Every project as a card with a cut photo." },
	{ name: "Project", path: "/projects/ridgeline", description: "One project: the photo, the text, the year and link, then the other projects." },
	{ name: "Speaking", path: "/speaking", description: "Talks by year, with their recordings and slides." },
	{ name: "Uses", path: "/uses", description: "Tools and gear, by group." },
	{ name: "Now", path: "/now", description: "What the person is doing now, with the updated stamp and a photo." },
	{ name: "About", path: "/about", description: "The about text beside the cut portrait, then the work history and the CV button." },
	{ name: "Search", path: "/search", description: "Site search." },
	{ name: "Privacy", path: "/privacy", description: "A plain page from the pages collection." },
	{ name: "Not found", path: "/no-such-page", description: "The 404 page for any address that does not exist.", status: 404 },
];
