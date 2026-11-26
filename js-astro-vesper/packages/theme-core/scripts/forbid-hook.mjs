/**
 * Node resolve hook for the no-emdash runner, loaded with
 * `NODE_OPTIONS=--import <this file>`. Catches what Node imports at build
 * time (astro.config.mjs, source setup files, integrations).
 */
import { registerHooks } from "node:module";
import { isForbidden, isForbiddenPath, violation } from "./forbid.mjs";

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (isForbidden(specifier)) throw violation(specifier, context.parentURL);
		const result = nextResolve(specifier, context);
		if (isForbiddenPath(result.url)) throw violation(result.url, context.parentURL);
		return result;
	},
});
