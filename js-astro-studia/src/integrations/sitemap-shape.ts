import type { AstroIntegration } from 'astro';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Make every sitemap entry name a file that was actually emitted: reshape the
 * ones that are merely the wrong shape, drop the ones with no file at all.
 *
 * Two problems, one answer. @astrojs/sitemap takes the trailing slash from
 * `build.format`, which under URL_POLICY 'preserve' is wrong for most of the
 * site; and a route switched off in src/features.ts was counted as a page
 * before it declined to emit one. Asking the disk answers both, which is why
 * this knows nothing about features. docs/Architecture.md.
 */
export default function sitemapShape(): AstroIntegration {
  let site = '';
  let base = '/';

  return {
    name: 'astro-studia:sitemap-shape',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site ?? '';
        base = config.base;
      },

      'astro:build:done': ({ dir, logger }) => {
        if (!site) {
          logger.warn('no `site` configured; the sitemap has no absolute URLs to check');
          return;
        }
        const root = fileURLToPath(dir);
        const origin = new URL(base, site).href.replace(/\/$/, '');

        let fixed = 0;
        let dropped = 0;
        for (const name of readdirSync(root)) {
          if (!/^sitemap(-\d+|-index)?\.xml$/.test(name)) continue;
          const file = join(root, name);

          /* Whole elements, not bare <loc>s: a dropped URL has to take its
             <lastmod> and siblings with it. `<url>` in a urlset, `<sitemap>`
             in the index. */
          const text = readFileSync(file, 'utf8').replace(
            /[ \t]*<(url|sitemap)>([\s\S]*?)<\/\1>\n?/g,
            (whole, _tag: string, body: string) => {
              const loc = /<loc>([^<]+)<\/loc>/.exec(body)?.[1];
              if (loc === undefined) return whole;
              const shaped = shape(loc, origin, root);
              if (shaped === null) {
                dropped += 1;
                return '';
              }
              if (shaped === loc) return whole;
              fixed += 1;
              return whole.replace(`<loc>${loc}</loc>`, `<loc>${shaped}</loc>`);
            },
          );
          writeFileSync(file, text);
        }

        const notes = [
          fixed > 0 &&
            `reshaped ${fixed} entr${fixed === 1 ? 'y' : 'ies'} to match the files on disk`,
          dropped > 0 && `dropped ${dropped} with no file (a switched-off route)`,
        ].filter(Boolean);
        logger.info(
          notes.length === 0 ? 'every sitemap entry already matches its file' : notes.join('; '),
        );
      },
    },
  };
}

/** The URL an entry should have, given what is on disk, or `null` for one
    with no file behind it. Exported so the rule can be exercised without a
    build. */
export function shape(loc: string, origin: string, root: string): string | null {
  // Somebody else's URL: not ours to check, nor to remove.
  if (!loc.startsWith(origin)) return loc;
  const path = loc.slice(origin.length).replace(/\/+$/, '');
  // The site root: "" after stripping, and its file is index.html.
  if (path === '') return `${origin}/`;
  const rel = path.replace(/^\//, '');
  const isFile = (p: string) => existsSync(p) && statSync(p).isFile();
  if (isFile(join(root, rel, 'index.html'))) return `${origin}${path}/`;
  if (isFile(join(root, `${rel}.html`))) return `${origin}${path}`;
  /* A file named outright: the PDFs astro.config.ts adds through
     `customPages`, and the index's own entries naming sitemap-0.xml. */
  if (isFile(join(root, rel))) return loc;
  return null;
}
