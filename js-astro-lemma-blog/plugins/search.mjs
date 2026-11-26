// Site search (src/components/Search.astro): Pagefind indexes the built posts
// after a build and writes dist/pagefind/, which the search panel loads on
// first open. The npm package runs pagefind_extended, which splits Chinese
// text into words; each <html lang> gets an index of its own.
//
// Only post pages are given to Pagefind. Within them, the article marked
// data-pagefind-body is indexed (PostPage.astro). With no page marked,
// Pagefind would index every page whole, so a build whose posts are all
// drafts must not hand it the home page, tags or the about page either.
//
// The dev server has no build output of its own: it serves the index of the
// last build, if there is one.
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as pagefind from 'pagefind';
import sirv from 'sirv';

const BASE = '/pagefind';
// Post pages of both languages, relative to the build output.
const POSTS = /^(en\/)?posts\/.+\.html$/;
// Inline math (SVG, \eqref and \ref included) becomes "…": formulas are not
// searchable, and excerpts read "设 … 是群" rather than "设 是群". Its TeX
// would put junk in the index: single letters that match any query through
// Pagefind's prefix fallback, and TeX in excerpts. Display math has no text
// and stands alone, so it is left out.
const INLINE_MATH = /<mjx-container(?![^>]*display="true")[^>]*>[\s\S]*?<\/mjx-container>/g;
// Pagefind's own search UIs and highlighter: the site has its own panel.
const UNUSED = /^pagefind-(.+-)?ui\.(js|css)$|^pagefind-highlight\.js$/;

/** Integration that builds (build) and serves (dev) the search index. */
export function searchIntegration() {
  let outDir;
  return {
    name: 'search-index',
    hooks: {
      'astro:config:setup': ({ config }) => {
        outDir = fileURLToPath(config.outDir);
      },
      'astro:server:setup': ({ server }) => {
        // dev: true looks for files on every request, so an index built
        // after the server started is served too.
        server.middlewares.use(BASE, sirv(join(outDir, BASE), { dev: true }));
      },
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        try {
          const { index, errors } = await pagefind.createIndex();
          if (!index) throw new Error(errors.join('; '));
          const pages = existsSync(out) ? readdirSync(out, { recursive: true }).filter((f) => POSTS.test(f.replaceAll('\\', '/'))) : [];
          const added = { page_count: 0, errors: [] };
          for (const f of pages) {
            const content = readFileSync(join(out, f), 'utf8').replace(INLINE_MATH, '…');
            const { errors: e } = await index.addHTMLFile({ sourcePath: f, content });
            added.errors.push(...e);
            added.page_count++;
          }
          const written = await index.writeFiles({ outputPath: join(out, BASE) });
          for (const f of readdirSync(join(out, BASE))) if (UNUSED.test(f)) rmSync(join(out, BASE, f));
          for (const e of [...added.errors, ...written.errors]) logger.warn(e);
          logger.info(`indexed ${added.page_count} post pages`);
        } finally {
          // The index is built by a separate process; stop it, or the build never exits.
          await pagefind.close();
        }
      },
    },
  };
}
