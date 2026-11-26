/**
 * Every word the theme writes itself. Menus, settings and all entries are content; everything else is here.
 *
 * Change a word once and every page follows. A site in another language translates this file.
 */

export const strings = {
	/** Dates in meta lines and on the Now page ("October 12, 2026"). */
	locale: "en-US",
	site: {
		/** Accessible name of the main navigation (the floating bar and its menu). */
		navLabel: "Main",
		/** Visible title of the phone menu panel. */
		menuTitle: "Menu",
		/** The first link on every page, for keyboard users. */
		skipLink: "Skip to content",
		/** The light and dark switch in the bar, an icon (its accessible name; pressed: dark mode on). */
		darkMode: "Dark mode",
		/** The same switch in the phone menu, a labeled button (pressed: dark mode on). */
		modeSwitch: "Switch light and dark",
	},
	footer: {
		/** Accessible name of the footer's links. */
		label: "Footer",
		/** Accessible name of the social links (the home intro's and the footer's). */
		elsewhere: "Elsewhere",
		/** The footer's last row: "© 2026 Rowan Ellery." */
		copyright: (year: number, name: string) => `© ${year} ${name}.`,
		/** Beside the copyright while `sampleContent` is on (the demo). */
		sampleContent: "Sample content: the person, companies, projects and talks are invented.",
		/** The link to the theme's home page (`builtWith` in src/theme.config.ts). */
		builtWith: "Built with Astronomic",
		/** The search page's link. */
		search: "Search",
		/** The link the design system pages add, in `astro dev` or a build with ASTRONOMIC_SYSTEM=1. */
		designSystem: "Design system",
	},
	home: {
		/** Accessible name of the collage band. */
		collage: "Recent photographs",
		/** The Now line's chip, before the status. The settings' `nowLabel` ("Status") replaces it. */
		now: "Now",
		/** The heading over the newest posts. */
		latest: "Latest writing",
		/** The link beside that heading. */
		allArticles: "All articles",
		/** The link under the newest posts: "Read all 10 articles". */
		readAll: (n: number) => `Read all ${n} ${n === 1 ? "article" : "articles"}`,
		/** Accessible name of the side cards: "More from Rowan". */
		side: (name: string) => `More from ${name.trim().split(/\s+/)[0] ?? name}`,
	},
	posts: {
		/** Each post row's visible link label (the whole row is the link; the title names it). */
		read: "Read article",
		/** When a list has no posts. */
		empty: "No articles yet.",
	},
	feed: {
		/** The RSS feed's title: "Rowan Ellery: Articles". */
		title: (site: string) => `${site}: Articles`,
		/** The feed's description when the site has no tagline. */
		description: "New articles, newest first.",
	},
	search: {
		title: "Search",
		/** The page title with a query. `{q}` is the query. */
		titleFor: "Search: {q}",
		/** Under the heading before a search, and while the static search loads. */
		intro: "Find an article, a project or a page.",
		/** In place of the intro once there are results. `{n}` is the number shown, `{q}` the query. */
		count: { one: "{n} result for “{q}”", many: "{n} results for “{q}”", more: "{n}+ results for “{q}”" },
		loading: "Searching…",
		failed: "Search could not load. Try again later.",
		devOnly: "Search works in a built site: run astro build, then serve dist.",
		noScript: "Search needs JavaScript. Browse the articles instead.",
		unavailable: "Search is not available on this site.",
		/** The box on the search page. */
		form: { label: "Search articles, projects and pages", placeholder: "Search…", submit: "Search", landmark: "Search the site" },
		/** With no query. */
		empty: "Type a word above, or browse every article.",
		/** With no results. `{q}` is the query. */
		noneFor: "Nothing matches “{q}”.",
		tipsHeading: "A few things to try:",
		tips: ["Check the spelling.", "Use one short word instead of a phrase.", "Search for a place or a tool, such as “film” or “maps”."],
		/** The link under the empty and no-results lines. */
		articles: "Browse all articles",
		home: "Back to the home page",
		/** The small label over each result (and a share card's label), per collection. */
		kinds: { posts: "Article", projects: "Project", pages: "Page" } as Record<string, string>,
	},
	newsletter: {
		heading: "Get new posts by email",
		text: "A short letter when there is a new article. Unsubscribe any time.",
		/** The email field's label (for screen readers; the placeholder shows). */
		emailLabel: "Email address",
		emailPlaceholder: "you@example.com",
		submit: "Subscribe",
		/** On a form that only pretends (a placeholder action on a site that is not live): after Subscribe, and with no script. */
		demoSent: "This is a demo, so nothing was sent.",
		/** With no newsletter form: the card points to the feed. */
		rssHeading: "Follow by RSS",
		rssText: "New articles in your feed reader, as soon as they are out.",
		rssLink: "Subscribe to the feed",
	},
	work: {
		heading: "Work",
		/** A job with no end year: "2022 – Now". */
		now: "Now",
		/** The CV button (cvFile in the settings). */
		cv: "Download CV",
	},
	projects: {
		heading: "Projects",
		all: "All projects",
		/** The /projects page's title and the line under it. */
		title: "Projects",
		lead: "Things I’ve made, for clients and for myself. Most of them are still running.",
		/** A project page: the outside link's button, and the heading over the other projects. */
		visit: "Visit the project",
		/** A project card's line for a project with an outside link (the card itself links to the project's page). */
		hasLink: "Project link",
		more: "More projects",
	},
	speaking: {
		/** The /speaking page's title and the line under it. */
		title: "Speaking",
		lead: "Talks I’ve given, newest first, with the recordings and slides where there are some.",
		/** A talk's links. */
		video: "Watch the video",
		slides: "Slides",
	},
	uses: {
		/** The /uses page's title and the line under it. */
		title: "Uses",
		lead: "The tools and gear I use every day, and what I think of them.",
		/** The accessible name of the row of links to each group, under the head. */
		jump: "Groups on this page",
		/** An item's link with no words of its own (`linkLabel`). */
		visit: "Visit the site",
	},
	now: {
		/**
		 * The /now page's title when the pages collection has no `now` page. The settings' `nowLabel` ("Status")
		 * replaces it, and names the nav's and the footer's links to /now too.
		 */
		title: "Now",
		/** The stamp under the Now page's head: "Updated October 12, 2026, from Bellingham, WA". */
		stamp: (date: string, place?: string) => (place ? `Updated ${date}, from ${place}` : `Updated ${date}`),
	},
	about: {
		/** The about page's short name in the reader map. */
		name: "About",
		/** The heading over the about page's work history. */
		work: "Work",
	},
	sections: {
		/** An optional page that is on but has nothing in it yet. */
		empty: "Nothing here yet.",
	},
	articles: {
		/** The list's title and heading. */
		title: "Articles",
		/** Under the heading. */
		text: "Everything on this site, newest first.",
		/** A later page's title: "Articles, page 2". */
		pageTitle: (n: number) => `Articles, page ${n}`,
		/** A category page: its title and the line under its heading. */
		categoryTitle: (label: string) => `${label} articles`,
		categoryText: (label: string, n: number) => `${n} ${n === 1 ? "article" : "articles"} in ${label}.`,
		/** A tag page. */
		tagTitle: (label: string) => `Articles tagged ${label}`,
		tagText: (label: string, n: number) => `${n} ${n === 1 ? "article" : "articles"} tagged ${label}.`,
		/** A later page of a category or tag: "Design articles, page 2". */
		pageOf: (title: string, n: number) => `${title}, page ${n}`,
		/** The category filter: its accessible name and its first item. */
		filter: "Filter by category",
		all: "All",
		/** The search form above the list. */
		search: { label: "Search articles", placeholder: "Search articles", submit: "Search", landmark: "Search the site" },
		/** Paging. */
		pagination: "Pages",
		previous: "Previous",
		next: "Next",
		page: (n: number) => `Page ${n}`,
	},
	article: {
		/** The link back to the list, over the article. */
		back: "All articles",
		/** "7 min read". */
		minutes: (n: number) => `${n} min read`,
		/** In the meta line, after the date: "Updated October 12, 2026". */
		updated: (date: string) => `Updated ${date}`,
		/** Accessible name of the tag list. */
		tags: "Tags",
		/** The table of contents' label. */
		toc: "On this page",
		/** Over the series links: "Series · Building Ridgeline". */
		series: "Series",
		seriesPosition: "Part {part} of {total}",
		/** The author box's link to the about page. */
		about: "More about me",
		/** The previous and next cards: their accessible name and labels. */
		more: "More articles",
		previous: "Previous",
		next: "Next",
	},
	notFound: {
		/** The 404 page's title and heading. */
		title: "Page not found",
		/** Under the heading. */
		text: "That page isn’t here. It may have moved, or the address may have a typo.",
		/** The link back home, and the one to the articles. */
		home: "Back to the home page",
		articles: "Read the articles",
	},
	/**
	 * The reader map page: one heading per section, in this order. `pages` holds the fixed pages, the list
	 * pages that are on (projects, speaking, uses, now) and the pages at the root (about, privacy).
	 */
	readerMap: { pages: "Pages", posts: "Articles", projects: "Projects", categories: "Categories", tags: "Tags" },
	/** The photo viewer (the kit's LightboxBar) on pages whose photos open large. */
	lightbox: {
		/** The viewer's accessible name. */
		label: "Photo viewer",
		/** The buttons' accessible names. */
		close: "Close",
		prev: "Previous photo",
		next: "Next photo",
		/** The counter, shown and read aloud: "2 of 5". `{n}` is the photo's place, `{total}` the number of photos. */
		counter: "{n} of {total}",
	},
};
