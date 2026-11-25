import { afterEach, describe, expect, it } from "bun:test";
import { discoverTools } from "../lib/tools.ts";

interface Captured {
    url: string;
    path: string;
    query: Record<string, string>;
}

const originalFetch = globalThis.fetch;

function mockFetch(responseBody: unknown = { ok: true }, status = 200) {
    const calls: Captured[] = [];
    globalThis.fetch = (async (input: any) => {
        const url = new URL(typeof input === "string" ? input : input.url);
        const query: Record<string, string> = {};
        url.searchParams.forEach((v, k) => (query[k] = v));
        calls.push({ url: url.toString(), path: url.pathname, query });
        return new Response(JSON.stringify(responseBody), {
            status,
            headers: { "content-type": "application/json" },
        });
    }) as any;
    return calls;
}

afterEach(() => {
    globalThis.fetch = originalFetch;
});

describe("tool catalog", () => {
    it("every tool has a unique name, description, and object schema", async () => {
        const tools = await discoverTools();
        expect(tools.length).toBeGreaterThan(0);
        const names = new Set<string>();
        for (const tool of tools) {
            const fn = tool.definition.function;
            expect(fn.name).toMatch(/^[a-z_]+$/);
            expect(names.has(fn.name)).toBe(false);
            names.add(fn.name);
            expect((fn.description ?? "").length).toBeGreaterThan(0);
            expect(fn.parameters?.type).toBe("object");
        }
    });
});

describe("request building", () => {
    it("list_tools uses /tools.json for page 1 and /tools/page/n.json otherwise", async () => {
        const tools = await discoverTools();
        const listTools = tools.find((t) => t.definition.function.name === "list_tools")!;

        let calls = mockFetch();
        await listTools.function({ page: 1 });
        expect(calls[0].path).toBe("/api/v1/tools.json");

        calls = mockFetch();
        await listTools.function({ page: 3 });
        expect(calls[0].path).toBe("/api/v1/tools/page/3.json");

        calls = mockFetch();
        await listTools.function({});
        expect(calls[0].path).toBe("/api/v1/tools.json");
    });

    it("get_tool targets the slug route", async () => {
        const tools = await discoverTools();
        const getTool = tools.find((t) => t.definition.function.name === "get_tool")!;
        const calls = mockFetch();
        await getTool.function({ slug: "cursor" });
        expect(calls[0].path).toBe("/api/v1/tools/cursor.json");
    });

    it("list_tools_by_category paginates by id", async () => {
        const tools = await discoverTools();
        const byCat = tools.find((t) => t.definition.function.name === "list_tools_by_category")!;

        let calls = mockFetch();
        await byCat.function({ id: "art" });
        expect(calls[0].path).toBe("/api/v1/tools/category/art.json");

        calls = mockFetch();
        await byCat.function({ id: "art", page: 2 });
        expect(calls[0].path).toBe("/api/v1/tools/category/art/page/2.json");
    });

    it("non-2xx responses throw", async () => {
        const tools = await discoverTools();
        const getTool = tools.find((t) => t.definition.function.name === "get_tool")!;
        mockFetch({ message: "not found" }, 404);
        await expect(getTool.function({ slug: "nope" })).rejects.toThrow(/404/);
    });
});

describe("search_tools", () => {
    it("ranks local index matches and respects limit", async () => {
        const tools = await discoverTools();
        const search = tools.find((t) => t.definition.function.name === "search_tools")!;
        mockFetch([
            { s: "a", t: "Image Upscaler", g: "Free", c: "art", b: "Upscale images", u: "x", d: "2025-01-01" },
            { s: "b", t: "Code Review Bot", g: "Free", c: "dev", b: "Reviews code", u: "y", d: "2025-01-02" },
            { s: "c", t: "Photo Tool", g: "Free", c: "art", b: "Edit an image", u: "z", d: "2025-01-03" },
        ]);
        const out: any = await search.function({ query: "image", limit: 2 });
        expect(out.results.length).toBeLessThanOrEqual(2);
        expect(out.results[0].slug).toBe("a");
    });
});
