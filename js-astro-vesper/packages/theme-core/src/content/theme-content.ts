/**
 * The theme's `useContent`, bound once to the selected source. The theme's
 * `src/content/index.ts` does:
 *
 *   import source from "astronomic:content/source";
 *   export const useContent = createThemeContent<Model, Settings>(source, DEFAULT_SETTINGS, {
 *   	output: import.meta.env.CONTENT_OUTPUT,
 *   });
 *
 * A theme with member access names its source model too and passes `access`: the source then becomes an adapter
 * of the public model through `withAccess` (see post-access.ts):
 *
 *   createThemeContent<Model, Settings, SourceModel>(source, DEFAULT_SETTINGS, {
 *   	output: import.meta.env.CONTENT_OUTPUT,
 *   	access: { canRead, collections: { posts: postAccess() } },
 *   });
 *
 * The only file in the package that imports @astronomic/content at run time.
 */
import {
	type AccessRules,
	type CanRead,
	type ContentAdapter,
	createUseContent,
	type ModelSpec,
	type SiteSettings,
	withAccess,
} from "@astronomic/content";

export type ThemeAccess<SM extends ModelSpec, M extends ModelSpec> = {
	canRead?: CanRead;
	collections: AccessRules<SM, M>;
	/** The source's search names for model collections, when they differ (see withAccess). */
	searchAliases?: Record<string, string>;
};

export function createThemeContent<M extends ModelSpec, S extends SiteSettings = SiteSettings, SM extends ModelSpec = M>(
	source: unknown,
	defaults: S,
	{ output, access }: { output: string | undefined; access?: ThemeAccess<SM, M> },
): ReturnType<typeof createUseContent<M, S>> {
	const adapter = access
		? withAccess<SM, M, S>()(source as ContentAdapter<SM, S>, {
				output,
				canRead: access.canRead,
				collections: access.collections,
				searchAliases: access.searchAliases,
			})
		: (source as ContentAdapter<M, S>);
	// Search needs a request. In a static build, hide it so no page offers a
	// search box that cannot work.
	const searchable = output === "server";
	return createUseContent<M, S>(searchable ? adapter : { ...adapter, search: undefined }, defaults);
}
