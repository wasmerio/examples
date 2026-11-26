import { describe, expect, it } from "vitest";
import { docForPath, docGroups, docNeighbors, docsPages } from "./docs";

describe("docs", () => {
	it("loads english book chapters", () => {
		expect(docsPages[0]?.id).toBe("getting-started");
		expect(docsPages.length).toBeGreaterThanOrEqual(40);
	});

	it("returns neighbors through tree order", () => {
		const readingNeighbors = docNeighbors("reading-musi-code");
		expect(readingNeighbors.previous?.id).toBe("first-program");
		expect(readingNeighbors.next?.id).toBe("comments");

		const commentNeighbors = docNeighbors("comments");
		expect(commentNeighbors.previous?.id).toBe("reading-musi-code");
		expect(commentNeighbors.next?.id).toBe("values-and-let");

		const neighbors = docNeighbors("values-and-let");
		expect(neighbors.previous?.id).toBe("comments");
		expect(neighbors.next?.id).toBe("blocks-and-expressions");
	});

	it("finds docs by current route path", () => {
		expect(docForPath("/learn/book/types/foundations")).toBeUndefined();
		expect(docForPath("/learn/book/start/comments")?.title).toBe("Comments");
		expect(docForPath("/learn/book/start/blocks-and-expressions")?.kind).toBe(
			"chapter",
		);
		expect(docForPath("/learn/book/types/type-annotations")?.kind).toBe(
			"chapter",
		);
		expect(docForPath("/learn/book/types/type-annotations")?.title).toBe(
			"Type annotations",
		);
		expect(docForPath("/learn/language/core/methods")?.title).toBe("Dot-calls");
		for (const path of [
			"/learn/book/core/assignment-and-equality",
			"/learn/book/core/math-and-comparison",
			"/learn/book/core/logic-and-bits",
			"/learn/book/core/pipelines-and-access",
			"/learn/book/core/type-operators",
			"/learn/book/core/callable-arrows",
		]) {
			expect(docForPath(path)?.kind, path).toBe("chapter");
		}
		expect(docForPath("/learn/book/developers/rust")).toBeUndefined();
		expect(docForPath("/learn/guides/rust")).toBeUndefined();
		expect(docForPath("/learn/guides/rust/overview")).toBeUndefined();
		expect(docForPath("/learn/book/developers/rust/overview")).toBeUndefined();
		expect(docForPath("/learn/book/developers/rust/mutation")).toBeUndefined();
		expect(docForPath("/docs/book/developers/mutation")).toBeUndefined();
		expect(docForPath("/learn/guides/rust/mutation")).toBeUndefined();
		expect(docForPath("/docs/guides/rust/mutation")).toBeUndefined();
		expect(docForPath("/learn/guides/javascript-typescript")).toBeUndefined();
		expect(
			docForPath("/learn/guides/javascript-typescript/overview"),
		).toBeUndefined();
		expect(docForPath("/learn/guides/c99")).toBeUndefined();
		expect(docForPath("/learn/guides/c99/overview")).toBeUndefined();
		expect(docForPath("/learn/guides/cpp17")).toBeUndefined();
		expect(docForPath("/learn/guides/cpp17/overview")).toBeUndefined();
		expect(
			docForPath("/learn/book/developers/c/null-option-result"),
		).toBeUndefined();
		expect(docForPath("/learn/guides/c/null-option-result")).toBeUndefined();
		expect(docForPath("/learn/guides/csharp")).toBeUndefined();
		expect(docForPath("/learn/guides/csharp/overview")).toBeUndefined();
		expect(
			docForPath("/learn/book/developers/csharp/null-option-result"),
		).toBeUndefined();
		expect(docForPath("/learn/guides/go")).toBeUndefined();
		expect(docForPath("/learn/guides/go/overview")).toBeUndefined();
		expect(
			docForPath("/learn/book/developers/go/nil-option-result"),
		).toBeUndefined();
		expect(docForPath("/learn/guides/java")).toBeUndefined();
		expect(docForPath("/learn/guides/java/overview")).toBeUndefined();
		expect(
			docForPath("/learn/book/developers/java/null-option-result"),
		).toBeUndefined();
		expect(docForPath("/learn/guides/lua")).toBeUndefined();
		expect(docForPath("/learn/guides/lua/overview")).toBeUndefined();
		expect(
			docForPath("/learn/book/developers/lua/nil-option-result"),
		).toBeUndefined();
		expect(docForPath("/learn/guides/python")).toBeUndefined();
		expect(docForPath("/learn/guides/python/overview")).toBeUndefined();
		expect(
			docForPath("/learn/book/developers/python/none-option-result"),
		).toBeUndefined();
		expect(docForPath("/learn/book/developers/javascript")).toBeUndefined();
		expect(docForPath("/learn/book/developers/typescript")).toBeUndefined();
	});

	it("groups docs for the sidebar and index", () => {
		expect(docGroups[0]?.group).toBe("Start");
		expect(docGroups.some((group) => group.group === "Advanced forms")).toBe(
			true,
		);
		expect(
			docGroups.some((group) => group.group === "Musi for Developers"),
		).toBe(false);
	});

	it("extracts headings for page toc", () => {
		expect(
			docForPath("/learn/book/effects-runtime/effects")?.headings.length,
		).toBeGreaterThan(0);
	});
});
