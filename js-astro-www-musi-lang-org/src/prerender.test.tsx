import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { appRoutes } from "./routes";
import { App } from "./site-app";

describe("prerender", () => {
	it("renders each public route", () => {
		for (const route of appRoutes) {
			const html = renderToString(<App route={route} />);
			expect(html).toContain("MUSI");
		}
	});
});
