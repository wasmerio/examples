/**
 * Lets plain Node load the workspace packages' TypeScript for the unit tests (`pnpm test:units`): a relative
 * import written without its extension (as a bundler allows, e.g. `./types`) resolves to the `.ts` file beside it.
 */
import { registerHooks } from "node:module";

registerHooks({
	resolve(specifier, context, next) {
		try {
			return next(specifier, context);
		} catch (error) {
			if (error?.code !== "ERR_MODULE_NOT_FOUND" || !/^\.{1,2}\//.test(specifier) || /\.[cm]?[jt]s$/.test(specifier)) throw error;
			return next(`${specifier}.ts`, context);
		}
	},
});
