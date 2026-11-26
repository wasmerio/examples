import { describe, expect, it } from "vitest";
import { appRoutes, homeRoutes, normalizePath, routeForPath } from "./routes";

describe("routes", () => {
	it("normalizes trailing slashes", () => {
		expect(normalizePath("/install/")).toBe("/install");
	});

	it("falls back to english home for unknown paths", () => {
		expect(routeForPath("/missing").id).toBe("home:en");
	});

	it("resolves docs pages", () => {
		expect(routeForPath("/learn/book/effects-runtime/effects").kind).toBe(
			"doc",
		);
	});

	it("keeps learn landing separate from chapter slugs", () => {
		expect(routeForPath("/learn").kind).toBe("docs-index");
		expect(routeForPath("/learn/book").kind).toBe("docs-index");
		expect(routeForPath("/learn/book/types/type-annotations").kind).toBe("doc");
		expect(routeForPath("/learn/book/types/type-annotations").kind).toBe("doc");
		expect(routeForPath("/learn/language/types/type-annotations").kind).toBe(
			"doc",
		);
		expect(routeForPath("/learn/guides/rust").kind).toBe("page");
		expect(routeForPath("/learn/guides/rust/mutation").kind).toBe("page");
		expect(routeForPath("/learn/guides/javascript-typescript").kind).toBe(
			"page",
		);
		expect(
			routeForPath("/learn/guides/javascript-typescript/overview").kind,
		).toBe("page");
		expect(routeForPath("/learn/guides/c99").kind).toBe("page");
		expect(routeForPath("/learn/guides/c99/overview").kind).toBe("page");
		expect(routeForPath("/learn/guides/cpp17").kind).toBe("page");
		expect(routeForPath("/learn/guides/cpp17/overview").kind).toBe("page");
		expect(routeForPath("/learn/guides/csharp").kind).toBe("page");
		expect(routeForPath("/learn/guides/csharp/overview").kind).toBe("page");
		expect(routeForPath("/learn/guides/go").kind).toBe("page");
		expect(routeForPath("/learn/guides/go/overview").kind).toBe("page");
		expect(routeForPath("/learn/guides/java").kind).toBe("page");
		expect(routeForPath("/learn/guides/java/overview").kind).toBe("page");
		expect(routeForPath("/learn/guides/lua").kind).toBe("page");
		expect(routeForPath("/learn/guides/lua/overview").kind).toBe("page");
		expect(routeForPath("/learn/guides/python").kind).toBe("page");
		expect(routeForPath("/learn/guides/python/overview").kind).toBe("page");
		expect(routeForPath("/learn/book/developers/rust").kind).toBe("page");
		expect(routeForPath("/learn/book/developers/rust/mutation").kind).toBe(
			"page",
		);
		expect(routeForPath("/learn/language/developers/rust/mutation").kind).toBe(
			"page",
		);
		expect(routeForPath("/docs/guides/rust/mutation").kind).toBe("page");
		expect(routeForPath("/docs/book/start/getting-started").kind).toBe("doc");
		expect(routeForPath("/docs/book/developers/mutation").kind).toBe("page");
	});

	it("canonicalizes docs aliases to nested learn routes", () => {
		expect(routeForPath("/docs/book/start/getting-started").canonicalPath).toBe(
			"/learn/book/start/getting-started",
		);
		expect(
			routeForPath("/learn/book/developers/rust").canonicalPath,
		).toBeUndefined();
		expect(
			routeForPath("/learn/book/developers/rust/mutation").canonicalPath,
		).toBeUndefined();
		expect(
			routeForPath("/docs/book/developers/mutation").canonicalPath,
		).toBeUndefined();
		expect(
			routeForPath("/learn/guides/javascript-typescript/overview")
				.canonicalPath,
		).toBeUndefined();
		expect(routeForPath("/learn").canonicalPath).toBe("/learn/book");
	});

	it("uses full browser title", () => {
		expect(homeRoutes[0]?.title).toBe("The Musi Programming Language");
		expect(routeForPath("/learn/book").title).toBe(
			"Musi Book | The Musi Programming Language",
		);
		expect(routeForPath("/learn/book/start/getting-started").title).toBe(
			"Getting started | The Musi Programming Language",
		);
	});

	it("does not expose blog or ja routes", () => {
		expect(appRoutes.some((route) => route.path === "/blog")).toBe(false);
		expect(appRoutes.some((route) => route.path.startsWith("/ja"))).toBe(false);
	});
});
