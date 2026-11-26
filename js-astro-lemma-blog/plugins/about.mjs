// The about page (src/components/AboutPage.astro): its folder and the files
// it links to.
//
// Everything on the page comes from one folder: src/content/about/ holds zh.md
// and en.md (frontmatter: name, links, sections, publications included; body:
// a short bio) and any file the frontmatter links to by a relative path, such
// as cv.pdf. LEMMA_ABOUT=sample switches to src/about.sample/, a fictitious
// profile for testing the layout; scripts/deploy.mjs refuses to run with
// LEMMA_ABOUT set.
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import sirv from 'sirv';

const DIRS = { '': './src/content/about', sample: './src/about.sample' };
const mode = process.env.LEMMA_ABOUT ?? '';
if (!Object.hasOwn(DIRS, mode)) throw new Error(`LEMMA_ABOUT=${mode}: use LEMMA_ABOUT=sample, or leave it unset`);

/** The about folder, relative to the project root. */
export const ABOUT_DIR = DIRS[mode];
export const SAMPLE = mode === 'sample';
// Placeholder text in the template carries this marker; filled-in content does not.
export const TEMPLATE = 'ABOUT_TEMPLATE';
// Files linked from the page are served here, for both languages.
const FILES = '/about';

// A relative href (`cv.pdf`, `./cv.pdf`, `cv.pdf#page=2`) names a file in the about folder.
const LOCAL = /^(?![a-z][a-z\d+.-]*:|[/#?])/i;
const local = (href) => (typeof href === 'string' && LOCAL.test(href) ? href.replace(/^\.\//, '') : undefined);

/** A link from the frontmatter as a URL: files in the about folder are served at /about/<file>. @param {string} href */
export const resolveHref = (href) => {
  const file = local(href);
  return file ? `${FILES}/${file}` : href;
};

// The files the frontmatter of zh.md and en.md links to, inside the folder only.
function linkedFiles(dir) {
  const files = new Set();
  for (const lang of ['zh', 'en']) {
    const path = join(dir, `${lang}.md`);
    if (!existsSync(path)) continue;
    let data;
    try {
      data = parseFrontmatter(readFileSync(path, 'utf8')).frontmatter;
    } catch {
      // The content collection reports the YAML error.
      continue;
    }
    const links = (list) => (Array.isArray(list) ? list : []);
    const hrefs = [
      ...links(data.links),
      ...links(data.sections).flatMap((s) => [
        ...links(s?.items).flatMap((item) => [item, ...links(item?.links)]),
        ...links(s?.publications).flatMap((pub) => [{ href: pub?.pdf }, ...links(pub?.links)]),
        ...links(s?.projects).flatMap((p) => [p, ...links(p?.links)]),
        ...links(s?.facts),
      ]),
      ...links(data.sections).flatMap((s) => links(s?.publications).map((pub) => ({ href: pub?.url }))),
    ]
      // The file, without a #fragment or ?query.
      .map((l) => local(l?.href)?.replace(/[?#].*/s, ''));
    // Never the page's own Markdown, and nothing outside the folder.
    for (const file of hrefs) if (file && !/\.md$/i.test(file) && !relative(dir, resolve(dir, file)).startsWith('..')) files.add(file);
  }
  return files;
}

/** Integration that serves (dev) and copies (build) the files the about page links to. */
export function aboutIntegration() {
  let dir;
  return {
    name: 'about-files',
    hooks: {
      'astro:config:setup': ({ config }) => {
        dir = fileURLToPath(new URL(`${ABOUT_DIR}/`, config.root));
      },
      'astro:server:setup': ({ server }) => {
        const serve = sirv(dir, { dev: true });
        // Only linked files: the folder also holds the Markdown.
        server.middlewares.use(FILES, (req, res, next) => {
          let file;
          try {
            file = decodeURIComponent(req.url.split('?')[0].slice(1));
          } catch {
            // A malformed escape (/about/%E0) names no file.
            return next();
          }
          return linkedFiles(dir).has(file) ? serve(req, res, next) : next();
        });
      },
      'astro:build:done': ({ dir: out }) => {
        for (const file of linkedFiles(dir)) {
          const from = join(dir, file);
          if (!existsSync(from)) {
            console.warn(`[about] ${file} is linked but not in ${ABOUT_DIR}/`);
            continue;
          }
          const to = join(fileURLToPath(out), FILES, file);
          mkdirSync(dirname(to), { recursive: true });
          cpSync(from, to);
        }
      },
    },
  };
}
