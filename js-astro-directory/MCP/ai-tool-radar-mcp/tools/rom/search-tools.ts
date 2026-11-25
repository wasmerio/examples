import { type ApiTool, romRequest } from "../../lib/tools.ts";

// Compact search index record (see /api/v1/search-index.json).
interface IndexEntry {
    s: string; // slug
    t: string; // title
    g: string; // tag (pricing)
    c: string; // category
    b: string; // body / description
    u: string; // url
    d: string; // date added
}

let cached: IndexEntry[] | null = null;
let cachedAt = 0;
const INDEX_TTL_MS = 5 * 60 * 1000;

async function loadIndex(): Promise<IndexEntry[]> {
    if (!cached || Date.now() - cachedAt > INDEX_TTL_MS) {
        cached = (await romRequest("/search-index.json")) as IndexEntry[];
        cachedAt = Date.now();
    }
    return cached;
}

// Dependency-free Fuse-lite scorer: token overlap over title + description,
// with a title match and whole-query substring weighted higher.
function score(entry: IndexEntry, query: string, tokens: string[]): number {
    const title = entry.t.toLowerCase();
    const body = (entry.b ?? "").toLowerCase();
    const haystack = `${title} ${body}`;
    let s = 0;
    if (title.includes(query)) s += 10;
    if (body.includes(query)) s += 4;
    for (const token of tokens) {
        if (title.includes(token)) s += 3;
        else if (haystack.includes(token)) s += 1;
    }
    return s;
}

const executeFunction = async ({ query, limit }: any) => {
    const q = String(query ?? "").trim().toLowerCase();
    const max = Math.max(1, Math.min(Number(limit) || 10, 50));
    if (!q) return { query: "", results: [] };

    const tokens = [...new Set(q.split(/\s+/).filter(Boolean))];
    const index = await loadIndex();

    const results = index
        .map((entry) => ({ entry, s: score(entry, q, tokens) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s || b.entry.d.localeCompare(a.entry.d))
        .slice(0, max)
        .map(({ entry }) => ({
            slug: entry.s,
            title: entry.t,
            description: entry.b,
            category: entry.c,
            tag: entry.g,
            url: entry.u,
            dateAdded: entry.d,
            siteUrl: `https://riseofmachine.com/tools/${entry.s}`,
        }));

    return { query: q, count: results.length, results };
};

const apiTool: ApiTool = {
    function: executeFunction,
    definition: {
        type: "function",
        function: {
            name: "search_tools",
            description:
                "Fuzzy-search the Rise of Machine AI tools directory by name or feature. Returns the best-matching tools with slug, description, category, and links. Use get_tool for a slug's full record.",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "What to search for, e.g. \"image upscaler\" or \"code review\".",
                    },
                    limit: {
                        type: "integer",
                        description: "Max results to return (1–50). Defaults to 10.",
                        minimum: 1,
                        maximum: 50,
                    },
                },
                required: ["query"],
            },
        },
    },
};

export { apiTool };
