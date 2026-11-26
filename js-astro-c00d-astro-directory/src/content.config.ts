import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';

/*
 * Two ways to get content, chosen by whether DIRECTORY_API is set.
 *
 *   unset  →  the JSON files in src/content/ — edit them, commit, redeploy.
 *   set    →  fetched from a running c00d Directory at build time.
 *
 * The second is why this exists: a directory is inherently dynamic (people
 * submit listings, clicks get counted), and a static site cannot do that on its
 * own. Point this at an installation that can, and you get a fast static front
 * end over a live dataset. Rebuild to publish changes.
 */

const listingSchema = z.object({
  name: z.string(),
  slug: z.string(),
  url: z.string().url(),
  description: z.string().default(''),
  category: z.string().optional(),
  rating: z.number().min(0).max(10).nullable().default(null),
  featured: z.boolean().default(false),
  favicon: z.string().default(''),
});

const categorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().default(''),
  icon: z.string().default(''),
  order: z.number().default(0),
});

/* Editable pages — about, privacy, terms. Body is trusted HTML from the
 * directory's own admin, the same content the PHP site renders. */
const pageSchema = z.object({
  title: z.string(),
  slug: z.string(),
  body: z.string().default(''),
  inFooter: z.boolean().default(true),
  order: z.number().default(0),
});

/** Trailing slashes and a missing scheme are the two easy ways to mistype this. */
function apiBase(): string | null {
  const raw = import.meta.env.DIRECTORY_API ?? process.env.DIRECTORY_API;
  if (!raw) return null;

  const trimmed = String(raw).trim().replace(/\/+$/, '');
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/**
 * Pull every page of a c00d Directory collection endpoint.
 *
 * The API caps per_page at 100, so a directory larger than that needs paging —
 * getting this wrong silently truncates the site to its first hundred entries.
 */
async function fetchAll(base: string, path: string): Promise<any[]> {
  const out: any[] = [];
  let page = 1;

  for (;;) {
    const res = await fetch(`${base}${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    if (!res.ok) {
      throw new Error(`${path} returned ${res.status}`);
    }

    const body = await res.json();
    const rows = Array.isArray(body.data) ? body.data : [];
    out.push(...rows);

    const pages = body.meta?.pages ?? 1;
    if (page >= pages || rows.length === 0) break;
    page++;
  }

  return out;
}

function directoryLoader(kind: 'listings' | 'categories' | 'pages'): Loader {
  return {
    name: `c00d-directory-${kind}`,
    load: async ({ store, logger, parseData, generateDigest }) => {
      const base = apiBase();

      if (!base) {
        logger.info(`${kind}: using local JSON (set DIRECTORY_API to fetch instead)`);
        return;
      }

      logger.info(`${kind}: fetching from ${base}`);
      store.clear();

      const rows = await fetchAll(base, `/api/v1/${kind}`);

      for (const row of rows) {
        let mapped: Record<string, unknown>;

        if (kind === 'listings') {
          mapped = {
            name: row.name,
            slug: row.slug,
            url: row.url,
            description: row.description ?? '',
            category: row.category?.slug ?? undefined,
            rating: row.rating ?? null,
            featured: Boolean(row.featured),
            favicon: row.favicon ?? '',
          };
        } else if (kind === 'categories') {
          mapped = {
            name: row.name,
            slug: row.slug,
            description: row.description ?? '',
            icon: row.icon ?? '',
            order: 0,
          };
        } else {
          // The collection endpoint omits body — it would bloat a list nobody
          // reads in full — so each page is fetched individually for its HTML.
          const res = await fetch(`${base}/api/v1/pages/${row.slug}`);
          if (!res.ok) {
            logger.warn(`pages: skipping ${row.slug} (${res.status})`);
            continue;
          }
          const full = (await res.json()).data ?? {};
          mapped = {
            title: full.title ?? row.title,
            slug: row.slug,
            body: full.body ?? '',
            inFooter: Boolean(full.in_footer ?? row.in_footer),
            order: Number(full.order ?? row.order ?? 0),
          };
        }

        const data = await parseData({ id: row.slug, data: mapped });
        store.set({ id: row.slug, data, digest: generateDigest(data) });
      }

      logger.info(`${kind}: ${rows.length} loaded`);
    },
  };
}

const listings = defineCollection({
  loader: apiBase()
    ? directoryLoader('listings')
    : glob({ pattern: '**/*.json', base: './src/content/listings' }),
  schema: listingSchema,
});

const categories = defineCollection({
  loader: apiBase()
    ? directoryLoader('categories')
    : glob({ pattern: '**/*.json', base: './src/content/categories' }),
  schema: categorySchema,
});

const pages = defineCollection({
  loader: apiBase()
    ? directoryLoader('pages')
    : glob({ pattern: '**/*.json', base: './src/content/pages' }),
  schema: pageSchema,
});

export const collections = { listings, categories, pages };
