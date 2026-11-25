import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Open Graph lookup for bookmark cards, at build time.
 *
 * No dependency: Node's own `fetch` gets the page and a regex reads the meta
 * tags. A parser would be more correct in general, but `<meta>` is a void tag
 * with no nesting, which is the one shape a regex handles safely.
 *
 * Three things this is careful about, because a build should never hang or
 * fail on somebody else's server:
 *
 * - every lookup is cached on disk, so one build fetches a URL once and later
 *   builds are free;
 * - every request times out;
 * - every failure degrades to an empty result, which renders the plain card.
 */

const CACHE = ".astro/open-graph.json";
const TIMEOUT = 6000;

export interface OpenGraph {
  image?: string;
  title?: string;
  description?: string;
  siteName?: string;
}

type Cache = Record<string, OpenGraph>;

let cache: Cache | undefined;

const readCache = (): Cache => {
  if (cache) return cache;
  try {
    cache = JSON.parse(readFileSync(CACHE, "utf8")) as Cache;
  } catch {
    cache = {};
  }
  return cache;
};

const writeCache = () => {
  try {
    mkdirSync(dirname(CACHE), { recursive: true });
    writeFileSync(CACHE, JSON.stringify(cache ?? {}, null, 2));
  } catch {
    /* A cache that cannot be written only costs the next build a refetch. */
  }
};

/** The five named entities that actually turn up in OG titles. */
const decode = (value: string) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/** Matches either attribute order, which real pages use about equally. */
const meta = (html: string, name: string): string | undefined => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]*\\scontent=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${escaped}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const found = html.match(pattern);
    if (found?.[1]) return decode(found[1].trim());
  }
  return undefined;
};

export const lookupOpenGraph = async (url: string): Promise<OpenGraph> => {
  const store = readCache();
  if (url in store) return store[url];

  let result: OpenGraph = {};
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT),
      redirect: "follow",
      headers: {
        /* Some sites serve OG tags only to something that looks like a crawler. */
        "user-agent": "Mozilla/5.0 (compatible; MailerBookmarks/1.0)",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (response.ok && (response.headers.get("content-type") ?? "").includes("text/html")) {
      /* The tags live in <head>; no need to hold a whole article in memory. */
      const html = (await response.text()).slice(0, 200_000);
      const image = meta(html, "og:image") ?? meta(html, "twitter:image");
      result = {
        /* og:image is allowed to be relative, and a fair number of sites use that. */
        image: image ? new URL(image, response.url).toString() : undefined,
        title: meta(html, "og:title") ?? meta(html, "twitter:title"),
        description: meta(html, "og:description") ?? meta(html, "twitter:description"),
        siteName: meta(html, "og:site_name"),
      };
    }
  } catch {
    /* Offline, timed out, DNS, TLS, a 500 — all the same answer: the plain card. */
  }

  store[url] = result;
  writeCache();
  return result;
};
