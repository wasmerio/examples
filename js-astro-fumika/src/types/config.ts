import type { InferEntrySchema, RenderedContent } from "astro:content";
import type {
	ALL_LANGUAGES,
	DARK_MODE,
	LIGHT_MODE,
} from "@constants/constants";
import type * as Giscus from "@giscus/svelte";

export type ConfigLang =
	| "en"
	| "zh_CN"
	| "zh_TW"
	| "ja"
	| "ko"
	| "es"
	| "th"
	| "vi"
	| "tr"
	| "id"
	| "fr"
	| "fa";

export type SiteConfig = {
	title: string;
	subtitle: string;

	lang: ConfigLang;
	supportedLangs: ConfigLang[];
	// rtl: boolean;  // TODO make it work without destryoing layouts

	theme: {
		hue: number;
		mode: "light" | "dark";
	};
	banner: {
		enable: boolean;
		src: string;
		position?: "top" | "center" | "bottom";
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};

	favicon: Favicon[];

	ogImage: {
		useDefault: boolean;
		defaultSrc?: string;
	};
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

export type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
};

export type GetSortedPosts = {
	id: string;
	body?: string | undefined;
	collection: "posts";
	data: InferEntrySchema<"posts">;
	rendered?: RenderedContent | undefined;
	filePath?: string;
};

export type GiscusConfig = {
	repo: Giscus.Repo;
	host?: string;
	repoId: string;
	category: string;
	categoryId: string;
	mapping?: Giscus.Mapping;
	term?: string;
	strict?: Giscus.BooleanString;
	reactionsEnabled?: Giscus.BooleanString;
	emitMetadata?: Giscus.BooleanString;
	inputPosition?: Giscus.InputPosition;
	theme?: Giscus.Theme;
	lang?: Giscus.AvailableLanguage;
	loading?: Giscus.Loading;
};

export type CommentConfig = {
	giscus?: GiscusConfig;
	disqus?: null;
	twikoo?: null;
};

export type GoogleAnalytics = {
	id: string;
};

export type AnalyticsConfig = {
	enabled: boolean;
	google?: GoogleAnalytics;
	umami?: null;
};

export type DeployConfig = {
	siteUrl: string;
	baseUrl: string;
};

export type SupportedLang = (typeof ALL_LANGUAGES)[number];
