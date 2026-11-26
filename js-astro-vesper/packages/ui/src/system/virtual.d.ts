declare module "virtual:astronomic-system" {
	type Component = (props: Record<string, unknown>) => unknown;
	/** One page of the theme, shown as a live preview on the start page. */
	export interface Screen {
		/** Short name, e.g. "Case study". */
		name: string;
		/** Root-relative path with a real demo slug, e.g. "/work/northwind-rebrand". BASE_URL is added. */
		path: string;
		/** One line on what the page is. */
		description: string;
		/** Optional caveat, e.g. that a page works only in a server build. */
		note?: string;
		/** The HTTP status the page answers with. Default 200; 404 for the not-found screen. */
		status?: number;
	}
	/** The theme's layout. Takes `title` and wraps the page. */
	export const Layout: Component;
	/** The theme's own blocks, or a stub line. */
	export const Sections: Component;
	/** Theme items for the foundations page, or a stub line. */
	export const Extras: Component;
	/** The theme's screens, or `null` when it sets no `screens` file. */
	export const screens: Screen[] | null;
	export const settings: { name: string; route: string; tokens: string[] };
}
