/**
 * Every shared component, with one plain line on when to use it. The sample
 * sections take their headings from here; the page order is `sampleSections`.
 */
export interface CatalogEntry {
	id: string;
	name: string;
	when: string;
	/** Where it is listed: a component, or a page section. */
	kind: "component" | "section";
	/** The group it is listed under. Tests check it is one of the kind's groups. */
	group: string;
	/** The component file in src/components. Default: `<name>.astro`. */
	file?: string;
	/**
	 * `false`: no sample section of its own on /system: another component's sample shows it, or (the publishing
	 * families) the part has no sample there yet.
	 */
	sample?: false;
	/**
	 * Its layer (decision 0013), apart from `kind`, which only says where a component listing shows it:
	 * - `primitive`: one element or control whose variants are props (Button, Input), and the layout helpers;
	 * - `part`: owns a structure, landmark or behavior that content or other parts fill (a shell like Card or
	 *   Footer, a controller like Navbar, a slot filler like MobileMenu), or a block with fixed markup of its own
	 *   (DescriptionList, Pagination);
	 * - `recipe`: a named arrangement of primitives and parts, shown as a whole. Every page section is one.
	 */
	type: CatalogType;
	/** The shell it belongs to, as a lowercase id (`card`, `footer`): set on the shell and on its parts and recipes. */
	family?: string;
}

export type CatalogType = "primitive" | "part" | "recipe";

/** Every valid `type`, for tests. */
export const CATALOG_TYPES: CatalogType[] = ["primitive", "part", "recipe"];

export const catalog: CatalogEntry[] = [
	{ id: "button", name: "Button", when: "For the main action on a page or in a form, and for links that should look like one.", kind: "component", group: "Actions", type: "primitive" },
	{ id: "card", name: "Card", when: "To group a short piece of content, like a service, a plan or a team member.", kind: "component", group: "Data display", type: "part", family: "card" },
	{ id: "cardmedia", name: "CardMedia", when: "For a list of pages with a picture each, like projects or articles: the image on top, then the title and a line.", kind: "component", group: "Data display", type: "recipe", family: "card" },
	{ id: "cardside", name: "CardSide", when: "For one or two featured items with room to spare: the image beside the text, stacked in a narrow column.", kind: "component", group: "Data display", type: "recipe", family: "card" },
	{ id: "cardoverlay", name: "CardOverlay", when: "For a short title on a large picture, like a featured project or a place, with the text on the dimmed image.", kind: "component", group: "Data display", type: "recipe", family: "card" },
	{ id: "media", name: "Media", when: "For a photo or picture in a fixed shape, like a project image, with an optional caption. Round, or with one corner cut.", kind: "component", group: "Data display", type: "primitive" },
	{ id: "videomedia", name: "VideoMedia", when: "For a short silent loop or a showreel still: a video in a fixed shape with its poster, a play button, and no autoplay for readers who ask for less motion.", kind: "component", group: "Data display", type: "primitive" },
	{ id: "lightbox", name: "Lightbox", when: "To open images large over the page, with a caption and prev/next. Works on the image links you already have.", kind: "component", group: "Data display", type: "part", family: "lightbox", sample: false },
	{ id: "lightboxcentered", name: "LightboxCentered", when: "The classic: the image in the middle, prev and next at its sides, the caption under it.", kind: "component", group: "Data display", type: "recipe", family: "lightbox", sample: false },
	{ id: "lightboxbar", name: "LightboxBar", when: "For photo-heavy pages: one bar at the bottom with the caption and every control, in thumb reach on a phone.", kind: "component", group: "Data display", type: "recipe", family: "lightbox", sample: false },
	{ id: "badge", name: "Badge", when: "For a short status next to other content, like whether you are taking new work.", kind: "component", group: "Feedback", type: "primitive" },
	{ id: "eyebrow", name: "Eyebrow", when: "For a short label above a heading, like the topic of a section, with an optional small icon.", kind: "component", group: "Data display", type: "primitive", sample: false },
	{ id: "avatar", name: "Avatar", when: "To show a person next to their name, with initials when there is no photo.", kind: "component", group: "Data display", type: "primitive" },
	{ id: "icon", name: "Icon", when: "For a small icon next to a label or in a list, at one of three sizes, with the same line weight everywhere.", kind: "component", group: "Data display", type: "primitive" },
	{ id: "navbar", name: "Navbar", when: "To build your own navbar layout: the brand, the links, the actions and utilities, with the fold into a menu, sticky and floating. For a ready layout, use NavbarSimple, NavbarCentered, NavbarStacked or NavbarBrandCenter.", kind: "component", group: "Navigation", type: "part", family: "navbar" },
	{ id: "navbarsimple", name: "NavbarSimple", when: "At the top of every page: the brand, the links right after it, and the actions at the end.", kind: "component", group: "Navigation", type: "recipe", family: "navbar" },
	{ id: "navbarcentered", name: "NavbarCentered", when: "At the top of every page, when the links are the point: the brand at the start, the links centered, the actions at the end.", kind: "component", group: "Navigation", type: "recipe", family: "navbar" },
	{ id: "navbarstacked", name: "NavbarStacked", when: "At the top of a site with many sections: the brand and the actions on top, the links on a row of their own under them.", kind: "component", group: "Navigation", type: "recipe", family: "navbar" },
	{ id: "navbarbrandcenter", name: "NavbarBrandCenter", when: "At the top of a brand-led site, such as a shop or a studio: the links at the start, the brand in the middle, the actions at the end.", kind: "component", group: "Navigation", type: "recipe", family: "navbar" },
	{ id: "mobilemenu", name: "MobileMenu", when: "On small screens, for the main links in a panel that slides in. Navbar uses it for you.", kind: "component", group: "Navigation", type: "part", family: "navbar", sample: false },
	{ id: "footer", name: "Footer", when: "At the bottom of every page, for secondary links, contact details and social links.", kind: "component", group: "Navigation", type: "part", family: "footer" },
	{ id: "footercolumns", name: "FooterColumns", when: "For a site with many pages: the brand and contact details beside columns of links under headings.", kind: "component", group: "Navigation", type: "recipe", family: "footer" },
	{ id: "footersimple", name: "FooterSimple", when: "For a small site: the brand, a few links and the copyright line in one row.", kind: "component", group: "Navigation", type: "recipe", family: "footer" },
	{ id: "footercentered", name: "FooterCentered", when: "For a short page or a portfolio: the brand, the links, social links and the copyright line, centered.", kind: "component", group: "Navigation", type: "recipe", family: "footer" },
	{ id: "hero", name: "Hero", when: "To build your own hero layout: the heading, a line on what you offer, actions and media, in a fixed order.", kind: "section", group: "Marketing sections", type: "part", family: "hero" },
	{ id: "herosplit", name: "HeroSplit", when: "At the top of a page, for the main heading, one line on what you offer and one or two actions, with an image beside them.", kind: "section", group: "Marketing sections", type: "recipe", family: "hero" },
	{ id: "herocentered", name: "HeroCentered", when: "At the top of a page, for the main heading, one line on what you offer and one or two actions, centered, with an optional wide image under them.", kind: "section", group: "Marketing sections", type: "recipe", family: "hero" },
	{ id: "herocover", name: "HeroCover", when: "At the top of a page, for the main heading, one line on what you offer and one or two actions, on a full image.", kind: "section", group: "Marketing sections", type: "recipe", family: "hero" },
	{ id: "features", name: "Features", when: "To build your own features layout: a section heading and a list of features, each with a title and a short text. For a ready layout, use FeatureGridCards, FeatureGridIcons, FeatureGridSplit or FeatureRows.", kind: "section", group: "Marketing sections", type: "part", family: "features" },
	{ id: "featureitem", name: "FeatureItem", when: "For one feature in a Features list: its title, a short text, and an icon or image. The feature recipes use it for you.", kind: "component", group: "Data display", type: "part", family: "features", sample: false },
	{ id: "featuregridcards", name: "FeatureGridCards", when: "To show a few strengths or services side by side, each with a title and a short text.", kind: "section", group: "Marketing sections", type: "recipe", family: "features" },
	{ id: "featuregridicons", name: "FeatureGridIcons", when: "To show a few strengths side by side, each with a small icon, a title and a short text, on the open page.", kind: "section", group: "Marketing sections", type: "recipe", family: "features" },
	{ id: "featuregridsplit", name: "FeatureGridSplit", when: "For a section with an intro: the heading and a line at the start, the features in two columns beside it.", kind: "section", group: "Marketing sections", type: "recipe", family: "features" },
	{ id: "featurerows", name: "FeatureRows", when: "To explain a few features in depth, each with a picture, the sides swapping row by row.", kind: "section", group: "Marketing sections", type: "recipe", family: "features" },
	{ id: "logostrip", name: "LogoStrip", when: "To build your own logos layout: client logos or names, with a label or a heading. For a ready layout, use LogoStripRow or LogoStripGrid.", kind: "section", group: "Marketing sections", type: "part", family: "logostrip" },
	{ id: "logostriprow", name: "LogoStripRow", when: "To show the clients you have worked for in one line, such as under a hero, or as a centered row.", kind: "section", group: "Marketing sections", type: "recipe", family: "logostrip" },
	{ id: "logostripgrid", name: "LogoStripGrid", when: "To show many clients in an even grid of cells, with hairlines between them.", kind: "section", group: "Marketing sections", type: "recipe", family: "logostrip" },
	{ id: "marquee", name: "Marquee", when: "To build your own moving row: a set of items that scrolls in a loop under a label or a heading, still for readers who turn motion off. For a ready layout, use MarqueeLogos, MarqueeText or MarqueeTitle.", kind: "section", group: "Marketing sections", type: "part", family: "marquee" },
	{ id: "marqueelogos", name: "MarqueeLogos", when: "For client names or logos that scroll slowly in a row, with a label and the page's pause button.", kind: "section", group: "Marketing sections", type: "recipe", family: "marquee" },
	{ id: "marqueetext", name: "MarqueeText", when: "For a band of short phrases that scroll, such as your services.", kind: "section", group: "Marketing sections", type: "recipe", family: "marquee" },
	{ id: "marqueetitle", name: "MarqueeTitle", when: "For one huge title that scrolls across the page as decoration; a real heading carries the words.", kind: "section", group: "Marketing sections", type: "recipe", family: "marquee" },
	{ id: "steps", name: "Steps", when: "To build your own process layout: numbered steps, each with a title, an optional phase and a line. For a ready layout, use StepsColumns or StepsList.", kind: "section", group: "Marketing sections", type: "part", family: "steps" },
	{ id: "stepitem", name: "StepItem", when: "For one step in a Steps list: its number, title, phase and text. The steps recipes use it for you.", kind: "component", group: "Data display", type: "part", family: "steps", sample: false },
	{ id: "stepscolumns", name: "StepsColumns", when: "To explain a process in order, like how a project runs from start to launch, in columns side by side.", kind: "section", group: "Marketing sections", type: "recipe", family: "steps" },
	{ id: "stepslist", name: "StepsList", when: "To explain a longer process in order, one step under another, along a line.", kind: "section", group: "Marketing sections", type: "recipe", family: "steps" },
	{ id: "indexlist", name: "IndexList", when: "To build your own index: a short list of names, each with a marker and an optional count or note. For a ready layout, use IndexListColumns or IndexListSplit.", kind: "section", group: "Marketing sections", type: "part", family: "indexlist" },
	{ id: "indexlistcolumns", name: "IndexListColumns", when: "For a list of what you cover, like industries, places or services, in two ruled columns under a heading.", kind: "section", group: "Marketing sections", type: "recipe", family: "indexlist" },
	{ id: "indexlistsplit", name: "IndexListSplit", when: "The same list beside its heading, for a section that needs a line of text next to the list.", kind: "section", group: "Marketing sections", type: "recipe", family: "indexlist" },
	{ id: "indextable", name: "IndexTable", when: "To build your own ruled table of short facts, such as awards, press or open roles. For a ready layout, use IndexTableStacked or IndexTableSplit.", kind: "section", group: "Marketing sections", type: "part", family: "indextable" },
	{ id: "indextablestacked", name: "IndexTableStacked", when: "For awards, press mentions or open roles under a heading, one ruled row each.", kind: "section", group: "Marketing sections", type: "recipe", family: "indextable" },
	{ id: "indextablesplit", name: "IndexTableSplit", when: "The same table beside its heading, in the label column.", kind: "section", group: "Marketing sections", type: "recipe", family: "indextable" },
	{ id: "stats", name: "Stats", when: "To build your own stats layout: a few results as large numbers, each with a label and an optional line. For a ready layout, use StatsGrid or StatsCards.", kind: "section", group: "Marketing sections", type: "part", family: "stats" },
	{ id: "statsgrid", name: "StatsGrid", when: "To show a few results as large numbers on the open page, each under a hairline.", kind: "section", group: "Marketing sections", type: "recipe", family: "stats" },
	{ id: "statscards", name: "StatsCards", when: "To show a few results as large numbers, each on its own card.", kind: "section", group: "Marketing sections", type: "recipe", family: "stats" },
	{ id: "descriptionlist", name: "DescriptionList", when: "For short facts as label and value pairs, like client, year and services.", kind: "component", group: "Data display", type: "part" },
	{ id: "testimonials", name: "Testimonials", when: "To build your own testimonials layout: a section heading and one or more quotes, each with the person's name and role. For a ready layout, use TestimonialQuote or TestimonialGrid.", kind: "section", group: "Marketing sections", type: "part", family: "testimonials" },
	{ id: "testimonial", name: "Testimonial", when: "For one quote in a Testimonials section: the words, the person, an avatar and a logo. The testimonial recipes use it for you.", kind: "component", group: "Data display", type: "part", family: "testimonials", sample: false },
	{ id: "testimonialquote", name: "TestimonialQuote", when: "For one strong quote from a client, large on the page, with their name and role.", kind: "section", group: "Marketing sections", type: "recipe", family: "testimonials" },
	{ id: "testimonialgrid", name: "TestimonialGrid", when: "For several short quotes side by side, each on a card.", kind: "section", group: "Marketing sections", type: "recipe", family: "testimonials" },
	{ id: "team", name: "Team", when: "To build your own team layout: a section heading and the people, each with a photo, name and role. For a ready layout, use TeamGrid or TeamSplit.", kind: "section", group: "Marketing sections", type: "part", family: "team" },
	{ id: "teammember", name: "TeamMember", when: "For one person in a Team section: their photo, name, role, a short bio and links. The team recipes use it for you.", kind: "component", group: "Data display", type: "part", family: "team", sample: false },
	{ id: "teamgrid", name: "TeamGrid", when: "To introduce the people behind the work, each with a large photo, name and role.", kind: "section", group: "Marketing sections", type: "recipe", family: "team" },
	{ id: "teamsplit", name: "TeamSplit", when: "To show a small team beside a heading, each person with a small round photo, name and role.", kind: "section", group: "Marketing sections", type: "recipe", family: "team" },
	{ id: "posts", name: "Posts", when: "To build your own blog list: a section heading and posts, each with a title, a date and a link. For a ready layout, use PostGrid or PostList.", kind: "section", group: "Marketing sections", type: "part", family: "posts" },
	{ id: "postcard", name: "PostCard", when: "For one post as a card: its picture, the topic and date, the title, a short excerpt and the author. The post recipes use it for you.", kind: "component", group: "Data display", type: "part", family: "posts", sample: false },
	{ id: "postrow", name: "PostRow", when: "For one post as a row: its date, title, excerpt and topic. PostList uses it for you.", kind: "component", group: "Data display", type: "part", family: "posts", sample: false },
	{ id: "postgrid", name: "PostGrid", when: "To show the latest posts as cards, each with a picture, a date and a short excerpt.", kind: "section", group: "Marketing sections", type: "recipe", family: "posts" },
	{ id: "postlist", name: "PostList", when: "To list posts as rows of text, newest first, with the dates in a column.", kind: "section", group: "Marketing sections", type: "recipe", family: "posts" },
	{ id: "contact", name: "Contact", when: "To build your own contact layout: a section heading and your details, a message form or ways to reach you. For a ready layout, use ContactSplit or ContactChannels.", kind: "section", group: "Marketing sections", type: "part", family: "contact" },
	{ id: "contactinfo", name: "ContactInfo", when: "For your email, phone, address and business hours as a short list of labeled details.", kind: "component", group: "Data display", type: "part", family: "contact", sample: false },
	{ id: "contactsplit", name: "ContactSplit", when: "For a contact page: your details beside a message form.", kind: "section", group: "Marketing sections", type: "recipe", family: "contact" },
	{ id: "contactchannels", name: "ContactChannels", when: "To show the ways to reach you, such as sales, support and press, each on a card with one link, with no form.", kind: "section", group: "Marketing sections", type: "recipe", family: "contact" },
	{ id: "newsletter", name: "Newsletter", when: "To build your own newsletter layout: a section heading and a signup form, on the page or on the band. For a ready layout, use NewsletterInline or NewsletterCentered.", kind: "section", group: "Marketing sections", type: "part", family: "newsletter" },
	{ id: "newsletterinline", name: "NewsletterInline", when: "To ask for email signups beside a short heading, the field and button in one row.", kind: "section", group: "Marketing sections", type: "recipe", family: "newsletter" },
	{ id: "newslettercentered", name: "NewsletterCentered", when: "To ask for email signups in a centered block, such as near the end of a page or on the band.", kind: "section", group: "Marketing sections", type: "recipe", family: "newsletter" },
	{ id: "ctaband", name: "CtaBand", when: "To build your own call-to-action layout: the heading, a line, actions and media on the band, in a fixed order. For a ready layout, use CtaBandSplit, CtaBandCentered, CtaBandImage or CtaBandInline.", kind: "section", group: "Marketing sections", type: "part", family: "ctaband" },
	{ id: "ctabandsplit", name: "CtaBandSplit", when: "Near the end of a page, to ask the reader to get in touch: the heading and a line at the start, the actions at the end.", kind: "section", group: "Marketing sections", type: "recipe", family: "ctaband" },
	{ id: "ctabandcentered", name: "CtaBandCentered", when: "Near the end of a page, for a closing line and the actions, centered on the band.", kind: "section", group: "Marketing sections", type: "recipe", family: "ctaband" },
	{ id: "ctabandimage", name: "CtaBandImage", when: "Near the end of a page, when a photo helps the ask: the text and actions beside an image on the band.", kind: "section", group: "Marketing sections", type: "recipe", family: "ctaband" },
	{ id: "ctabandinline", name: "CtaBandInline", when: "Between sections, for a short line and one action in a slim band.", kind: "section", group: "Marketing sections", type: "recipe", family: "ctaband" },
	// The publishing families: no sample section on /system (sample: false), so the kit's and the themes' system
	// pages stay as they are.
	{ id: "articleheader", name: "ArticleHeader", when: "To build your own post header: the topic, date and reading time, the title, a line under it, a byline and a photo. For a ready layout, use ArticleHeaderPlain or ArticleHeaderCover.", kind: "section", group: "Publishing sections", type: "part", family: "articleheader", sample: false },
	{ id: "articleheaderplain", name: "ArticleHeaderPlain", when: "At the top of a post: the topic, date and reading time, the title, a line under it and the byline, with the photo under them.", kind: "section", group: "Publishing sections", type: "recipe", family: "articleheader", sample: false },
	{ id: "byline", name: "Byline", when: "Under a post's title: who wrote it, with their photo, the date and the reading time.", kind: "component", group: "Data display", type: "part", family: "byline", sample: false },
	{ id: "authorbox", name: "AuthorBox", when: "At the end of a post or on an author page: the writer's photo, name, role, a short bio and their links.", kind: "component", group: "Data display", type: "part", family: "authorbox", sample: false },
	{ id: "seriesnav", name: "SeriesNav", when: "To build your own series navigation: the series name, where this post sits in it, and the other parts. For a ready layout, use SeriesList or SeriesPager.", kind: "component", group: "Navigation", type: "part", family: "seriesnav", sample: false },
	{ id: "serieslist", name: "SeriesList", when: "Beside or under a post in a series: every part in order, with this one marked.", kind: "component", group: "Navigation", type: "recipe", family: "seriesnav", sample: false },
	{ id: "seriespager", name: "SeriesPager", when: "At the end of a post in a series: links to the part before and the part after.", kind: "component", group: "Navigation", type: "recipe", family: "seriesnav", sample: false },
	{ id: "filternav", name: "FilterNav", when: "To switch between groups of a list, like work by service.", kind: "component", group: "Navigation", type: "part" },
	{ id: "modetoggle", name: "ModeToggle", when: "In the navbar, to let a reader switch between light and dark; with nothing chosen the page follows their system.", kind: "component", group: "Actions", type: "primitive", sample: false },
	{ id: "motionpause", name: "MotionPause", when: "For the one Pause motion button a page with moving parts needs: it stops every marquee and autoplaying video for the visit. Put it in the first marquee.", kind: "component", group: "Actions", type: "part", family: "marquee", sample: false },
	{ id: "pagination", name: "Pagination", when: "To move through a long list split over pages, like the journal.", kind: "component", group: "Navigation", type: "part" },
	{ id: "prose", name: "Prose", when: "For long text from the editor, like articles and case studies.", kind: "component", group: "Data display", type: "primitive" },
	{ id: "field", name: "Field", when: "Around every form control, for its label, hint and error message.", kind: "component", group: "Forms", type: "part" },
	{ id: "input", name: "Input", when: "For a single line of text in a form, like a name or an email address.", kind: "component", group: "Forms", type: "primitive" },
	{ id: "textarea", name: "Textarea", when: "For longer answers in a form, like a project brief.", kind: "component", group: "Forms", type: "primitive" },
	{
		id: "form",
		name: "Form",
		when: "To build your own form that posts with no JavaScript: hidden fields, a spam trap, the send button and an optional in-page status. MessageForm and SignupForm are built on it.",
		kind: "component",
		group: "Forms",
		type: "part",
	},
	{
		id: "formstatus",
		name: "FormStatus",
		when: "For the line that says whether a form sent, read out by screen readers. Form uses it for you.",
		kind: "component",
		group: "Forms",
		type: "part",
		sample: false,
	},
	{
		id: "messageform",
		name: "MessageForm",
		when: "For a message form that posts to your endpoint with no JavaScript: name, email and message, plus company, phone or a topic if you ask.",
		kind: "component",
		group: "Forms",
		type: "part",
		family: "contact",
		sample: false,
	},
	{
		id: "signupform",
		name: "SignupForm",
		when: "For an email signup that posts to your newsletter provider with no JavaScript, such as Buttondown or Mailchimp.",
		kind: "component",
		group: "Forms",
		type: "part",
		family: "newsletter",
		sample: false,
	},
	{ id: "container", name: "Container", when: "To keep page content to a readable width with even side padding, centered on the page.", kind: "component", group: "Layout", type: "primitive" },
	{ id: "section", name: "Section", when: "For each band of a page, so every part of the page has the same space above and below, on the page or on a light gray band.", kind: "component", group: "Layout", type: "primitive" },
	{ id: "panel", name: "Panel", when: "To set a block of the page apart: an inset, rounded panel on a light fill, a dark fill, or a photo.", kind: "component", group: "Layout", type: "primitive" },
	{ id: "stack", name: "Stack", when: "To set blocks one under another with even space between them, like a heading, a text and a button.", kind: "component", group: "Layout", type: "primitive" },
	{ id: "grid", name: "Grid", when: "To set items in even columns, like cards or logos, that drop to fewer columns on small screens.", kind: "component", group: "Layout", type: "primitive" },
	{ id: "split", name: "Split", when: "To set two blocks side by side, like a text and an image, stacked when there is no room.", kind: "component", group: "Layout", type: "primitive" },
	// The real estate parts: the listing card, filter, search and map families.
	{
		id: "savebutton",
		name: "SaveButton",
		when: "To let a reader keep a listing in a list in their own browser, with no account, such as Saved homes.",
		kind: "component",
		group: "Actions",
		type: "part",
		family: "listingcard",
		sample: false,
	},
	{
		id: "listingcard",
		name: "ListingCard",
		when: "To build your own card for a listing: a photo with a status and Save, the price, title, address and a strip of facts from your fields list.",
		kind: "component",
		group: "Data display",
		type: "part",
		family: "listingcard",
		sample: false,
	},
	{
		id: "factstrip",
		name: "FactStrip",
		when: "A ruled strip of a listing's facts, such as beds, baths and square feet; a missing fact leaves no empty cell.",
		kind: "component",
		group: "Data display",
		type: "part",
		family: "listingcard",
		sample: false,
	},
	{
		id: "listingcardinset",
		name: "ListingCardInset",
		when: "For homes or places in a grid: the photo inset in a card, with the price and the facts under it.",
		kind: "component",
		group: "Data display",
		type: "recipe",
		family: "listingcard",
		sample: false,
	},
	{
		id: "listingrow",
		name: "ListingRow",
		when: "The same listing as a wide row, for a list beside a map or a short list on a page.",
		kind: "component",
		group: "Data display",
		type: "recipe",
		family: "listingcard",
		sample: false,
	},
	{ id: "select", name: "Select", when: "For one choice from a short list in a form, with the kit's control look.", kind: "component", group: "Forms", type: "primitive" },
	{ id: "filters", name: "Filters", when: "To build your own search filters: a buy or rent switch, a text box, choices and ranges from your fields list, kept in the address bar.", kind: "component", group: "Forms", type: "part", family: "filters", sample: false },
	{ id: "filterbar", name: "FilterBar", when: "For a row of filters over a list of homes or places, that scrolls sideways on a phone.", kind: "component", group: "Forms", type: "recipe", family: "filters", sample: false },
	{ id: "filterswitch", name: "FilterSwitch", when: "For a two-part switch between modes, such as Buy and Rent, at the start of the filters.", kind: "component", group: "Forms", type: "part", family: "filters", sample: false },
	{ id: "filtertext", name: "FilterText", when: "For the filters' text box, such as a street or a neighborhood.", kind: "component", group: "Forms", type: "part", family: "filters", sample: false },
	{ id: "filterchoice", name: "FilterChoice", when: "For a choice filter: one select, or option chips when several may be picked, such as home types.", kind: "component", group: "Forms", type: "part", family: "filters", sample: false },
	{ id: "filterrange", name: "FilterRange", when: "For a range filter, such as a price with Min and Max, or beds with \"3+\".", kind: "component", group: "Forms", type: "part", family: "filters", sample: false },
	{ id: "filterchips", name: "FilterChips", when: "For the active filters under the bar, each a chip that removes it.", kind: "component", group: "Forms", type: "part", family: "filters", sample: false },
	{ id: "resultshead", name: "ResultsHead", when: "For the heading over search results, with the live count and the sort.", kind: "component", group: "Forms", type: "part", family: "filters", sample: false },
	{ id: "popover", name: "Popover", when: "To keep a set of choices one click away, like the home types or a price range in a filter bar: a button that opens a small panel over the page.", kind: "component", group: "Forms", type: "part", family: "popover", sample: false },
	{ id: "popovergroup", name: "PopoverGroup", when: "To name a set of options in a Popover's panel, like Min and Max.", kind: "component", group: "Forms", type: "part", family: "popover", sample: false },
	{ id: "popoveroption", name: "PopoverOption", when: "For one choice in a Popover's panel: a real checkbox or radio, as a full-width row.", kind: "component", group: "Forms", type: "part", family: "popover", sample: false },
	{ id: "search", name: "Search", when: "To build your own search dialog: the search box, type tabs, filters and grouped results over the page, on the search package's index. For a ready layout, use SearchClassic.", kind: "component", group: "Navigation", type: "part", family: "search", sample: false },
	{ id: "searchclassic", name: "SearchClassic", when: "The classic site search: a panel near the top of the screen, results under their type, a page's matching sections under it. Full screen on a phone.", kind: "component", group: "Navigation", type: "recipe", family: "search", sample: false },
	{ id: "searchbutton", name: "SearchButton", when: "To open the search from a header or a page: an icon button, or a field with words and the shortcut. A real link to your search page without JavaScript.", kind: "component", group: "Navigation", type: "part", family: "search", sample: false },
	{ id: "searchpage", name: "SearchPage", when: "For your /search page: a search box, type tabs, filters with counts and every result as a link with its matching sections, the query kept in the address bar.", kind: "component", group: "Navigation", type: "part", family: "search", sample: false },
	// The trades parts: the accent surface and the proof parts.
	{ id: "guaranteestrip", name: "GuaranteeStrip", when: "For a short row of promises with checks and one button, such as fixed price, on time and clean up, on the accent color.", kind: "component", group: "Data display", type: "part" },
	{ id: "emergencybanner", name: "EmergencyBanner", when: "For a 24/7 line: a band with the number large, the arrival time and a call button.", kind: "section", group: "Marketing sections", type: "recipe" },
	{ id: "credentialslist", name: "CredentialsList", when: "To build your own list of licenses, insurance and warranties: each row shows only when it is filled.", kind: "component", group: "Data display", type: "part", family: "credentialslist" },
	{ id: "credentialsstrip", name: "CredentialsStrip", when: "For proof near the top of a page: license, insurance, warranty and years in a row of columns.", kind: "component", group: "Data display", type: "recipe", family: "credentialslist" },
	{ id: "credentialsrows", name: "CredentialsRows", when: "For a full credentials list: ruled rows with a check, for licensed trades.", kind: "component", group: "Data display", type: "recipe", family: "credentialslist" },
	{ id: "areachips", name: "AreaChips", when: "For the towns you serve as a row of links, each to its own page.", kind: "component", group: "Navigation", type: "part" },
	// The trades extensions.
	{ id: "phonelink", name: "PhoneLink", when: "For a phone number people tap to call, such as in the header: the label over the number, or an icon on a phone.", kind: "component", group: "Navigation", type: "part", family: "navbar" },
];

/** The component's file name in src/components. */
export function componentFile(entry: CatalogEntry): string {
	return entry.file ?? `${entry.name}.astro`;
}

const byId = new Map(catalog.map((entry) => [entry.id, entry]));

/** The catalog entry for an id. Throws on a typo. */
export function entry(id: string): CatalogEntry {
	const found = byId.get(id);
	if (!found) throw new Error(`Unknown component sample: ${id}`);
	return found;
}

/** Extra attributes for a sample section's parts: the section, its head, its heading and its body. */
export interface SampleAttrs {
	section?: Record<string, string>;
	head?: Record<string, string>;
	title?: Record<string, string>;
	body?: Record<string, string>;
}

export interface SampleSection {
	/** Anchor, used as `sys-<id>`. */
	id: string;
	/** Catalog ids shown in this section. */
	ids: string[];
	/** A variant of a component shown above: its own heading, no `when` lines. */
	variant?: { title: string; note: string };
}

/** The sample sections, in page order. Every catalog id has one main section, except entries with `sample: false`. */
export const sampleSections: SampleSection[] = [
	{ id: "navbar", ids: ["navbar"] },
	{ id: "navbar-recipes", ids: ["navbarsimple", "navbarcentered", "navbarstacked", "navbarbrandcenter"] },
	{
		id: "navbarsimple-actions",
		ids: ["navbarsimple"],
		variant: { title: "NavbarSimple with the actions slot", note: "The same NavbarSimple with your own actions in place of the buttons." },
	},
	{ id: "hero", ids: ["hero"] },
	{ id: "hero-recipes", ids: ["herosplit", "herocentered", "herocover"] },
	{ id: "button", ids: ["button"] },
	{ id: "card", ids: ["card"] },
	{ id: "card-recipes", ids: ["cardmedia", "cardside", "cardoverlay"] },
	{ id: "media", ids: ["media", "videomedia"] },
	{ id: "features", ids: ["features"] },
	{ id: "features-recipes", ids: ["featuregridcards", "featuregridicons", "featuregridsplit", "featurerows"] },
	{ id: "badge-avatar", ids: ["badge", "avatar"] },
	{ id: "icon", ids: ["icon"] },
	{ id: "logostrip", ids: ["logostrip"] },
	{ id: "logostrip-recipes", ids: ["logostriprow", "logostripgrid"] },
	{ id: "marquee", ids: ["marquee"] },
	{ id: "marquee-recipes", ids: ["marqueelogos", "marqueetext", "marqueetitle"] },
	{ id: "steps", ids: ["steps"] },
	{ id: "steps-recipes", ids: ["stepscolumns", "stepslist"] },
	{ id: "indexlist", ids: ["indexlist"] },
	{ id: "indexlist-recipes", ids: ["indexlistcolumns", "indexlistsplit"] },
	{ id: "indextable", ids: ["indextable"] },
	{ id: "indextable-recipes", ids: ["indextablestacked", "indextablesplit"] },
	{ id: "testimonials", ids: ["testimonials"] },
	{ id: "testimonials-recipes", ids: ["testimonialquote", "testimonialgrid"] },
	{ id: "team", ids: ["team"] },
	{ id: "team-recipes", ids: ["teamgrid", "teamsplit"] },
	{ id: "posts", ids: ["posts"] },
	{ id: "posts-recipes", ids: ["postgrid", "postlist"] },
	{ id: "contact", ids: ["contact"] },
	{ id: "contact-recipes", ids: ["contactsplit", "contactchannels"] },
	{ id: "newsletter", ids: ["newsletter"] },
	{ id: "newsletter-recipes", ids: ["newsletterinline", "newslettercentered"] },
	{ id: "descriptionlist", ids: ["descriptionlist"] },
	{ id: "stats", ids: ["stats"] },
	{ id: "stats-recipes", ids: ["statsgrid", "statscards"] },
	{ id: "filternav-pagination", ids: ["filternav", "pagination"] },
	{ id: "prose", ids: ["prose"] },
	{ id: "form", ids: ["field", "input", "textarea", "form"] },
	{ id: "ctaband", ids: ["ctaband"] },
	{ id: "ctaband-recipes", ids: ["ctabandsplit", "ctabandcentered", "ctabandimage", "ctabandinline"] },
	{ id: "layout", ids: ["container", "section", "panel", "stack", "grid", "split"] },
	{ id: "footer", ids: ["footer"] },
	{ id: "footer-recipes", ids: ["footercolumns", "footersimple", "footercentered"] },
	// The real estate parts: the listing card, filter, search and map families.
	{ id: "select", ids: ["select"] },
	// The trades parts.
	{ id: "guaranteestrip", ids: ["guaranteestrip"] },
	{ id: "emergencybanner", ids: ["emergencybanner"] },
	{ id: "credentials", ids: ["credentialslist"] },
	{ id: "credentials-recipes", ids: ["credentialsstrip", "credentialsrows"] },
	{ id: "areachips", ids: ["areachips"] },
	{ id: "phonelink", ids: ["phonelink"] },
];

/** "A", "A and B", "A, B and C". */
export function joinNames(names: string[]): string {
	return names.length < 2 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

/** Contents of the samples in page order: one link per component, to its section. */
export const contents = sampleSections
	.filter((section) => !section.variant)
	.flatMap((section) => section.ids.map((id) => ({ ...entry(id), href: `#sys-${section.id}` })));
