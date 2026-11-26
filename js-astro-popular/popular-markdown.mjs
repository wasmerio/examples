/** Popular: markdown body hooks for the template-model site.
 *
 *   import popularMarkdown from './popular-markdown.mjs';
 *   export default defineConfig({ integrations: [mdx(), sitemap(), popularMarkdown()] });
 *
 * Four things, all parity with Hugo's render hooks (PARITY.md):
 *
 *   - loading="lazy" decoding="async" on markdown images (Core Web Vitals,
 *     Hugo's render-image.html).
 *   - site-absolute links and image sources prefixed with the configured
 *     `base`, so `![](/images/x.png)` and `[the handbook](/handbook/)` in
 *     content survive a subpath install (Hugo's render-link/render-image
 *     passing paths through relURL). Everything the templates write is
 *     handled by src/lib/url.ts instead; MDX component props
 *     (<Photo src="/images/x.png">) are JSX, not HAST, so the components
 *     prefix those themselves.
 *   - a hover "#" anchor on every h2-h6, so each section has a copyable URL
 *     (Hugo's render-heading.html).
 *   - a <div class="g-table-scroll"> around every table, so a wide table
 *     scrolls sideways on a phone instead of stretching the page (Hugo's
 *     render-table.html).
 *
 * This is an integration rather than a plain `markdown.rehypePlugins` entry in
 * astro.config.mjs for two reasons. Astro 7's default processor is Sätteri,
 * which does not run remark/rehype plugins at all. And an integration is
 * handed the *resolved* config, so `astro build --base /elsewhere/` is honored;
 * a hook registered from a `const` in the config file would silently keep the
 * old base and leave every markdown link unprefixed.
 *
 * The packaged integration (package/index.mjs) carries the same logic for npm
 * consumers. Keep the two in step.
 */
import Slugger from 'github-slugger';

const prefixPath = (value, prefix) =>
  typeof value === 'string' &&
  prefix &&
  value.startsWith('/') &&
  !value.startsWith('//') &&
  value !== prefix &&
  !value.startsWith(`${prefix}/`)
    ? prefix + value
    : value;

/* Section permalinks: every h2-h6 ends in a "#" anchor linking to its own id
   (parity with Hugo's render-heading.html; styled by .g-anchor in base.css).
   Astro assigns heading ids in its own hast plugin, which runs *after* ours,
   so the heading is slugged here with the same library and the same text
   Astro would use, and the id set from here: Astro keeps an id that is
   already present and reports it in `headings`, which keeps the docs sidebar
   pointing at the same fragments. h1 is slugged too, so the duplicate counter
   matches Astro's ("intro", "intro-1"), but gets no anchor: the page title
   lives in the hero. The anchor is kept out of the accessibility tree and the
   tab order on purpose: a labelled link inside a heading becomes part of the
   heading's accessible name, and the docs sidebar already lists the same
   fragments as real links. It is empty (the glyph comes from CSS) so feeds
   and plain-text excerpts of the body never pick up a stray "#". */
const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const anchorNode = (id) => ({
  type: 'element',
  tagName: 'a',
  /* Attribute spellings, not hast's camelCase: MDX output keeps property
     names as written (`tabIndex` would reach the HTML as-is). */
  properties: { className: ['g-anchor'], href: `#${id}`, 'aria-hidden': 'true', tabindex: '-1' },
  children: [], // the "#" is CSS generated content; see base.css
});

/* Wide tables: every markdown <table> is wrapped in <div class="g-table-scroll">
   (base.css: overflow-x: auto) so a table with more columns than a phone is
   wide scrolls inside the page instead of stretching it. The wrapper scrolls,
   not the table: `display: block; overflow-x: auto` on the table itself would
   drop its table semantics for screen readers. Parity with Hugo's
   render-table.html. A table an earlier hast plugin already wrapped is left
   alone; a wrapper hand-written around a table in markdown or MDX is raw
   HTML or JSX rather than a hast div, so it is not detected and the table
   gets a second, harmless wrapper inside it. */
const TABLE_WRAPPER = 'g-table-scroll';
const tableWrapper = () => ({ type: 'element', tagName: 'div', properties: { className: [TABLE_WRAPPER] }, children: [] });
const isTableWrapper = (node) =>
  node?.type === 'element' && node.tagName === 'div' && [].concat(node.properties?.className ?? []).includes(TABLE_WRAPPER);

/* Heading text the way Astro's own heading-id plugins read it: text nodes,
   plus MDX `{frontmatter.x}` expressions resolved against the frontmatter
   (mirrors collectHastText in @astrojs/markdown-satteri, which is not a
   dependency the package can rely on). Without this a heading written as
   `## {frontmatter.title}` would slug to "frontmattertitle". */
const resolveFrontmatter = (expr, frontmatter) => {
  if (!expr.startsWith('frontmatter.') && !expr.startsWith('frontmatter[')) return undefined;
  const parts = [];
  const re = /\.(\w+)|\[(\d+)\]|\["([^"]+)"\]|\['([^']+)'\]/g;
  let m;
  while ((m = re.exec(expr.slice('frontmatter'.length))) !== null) parts.push(m[1] ?? m[2] ?? m[3] ?? m[4]);
  let value = frontmatter;
  for (const key of parts) {
    if (value == null || typeof value !== 'object') return undefined;
    value = value[key];
  }
  return parts.length && typeof value === 'string' ? value : undefined;
};
const headingText = (node, frontmatter) => {
  let text = '';
  if (node.type === 'mdxTextExpression' || node.type === 'mdxFlowExpression') {
    if (node.value != null) text += resolveFrontmatter(node.value.trim(), frontmatter ?? {}) ?? node.value;
  } else if (node.type === 'text' && node.value != null) {
    text += node.value;
  }
  for (const child of node.children || []) text += headingText(child, frontmatter);
  return text;
};

/* Sätteri shape: filtered visitors, mutations through ctx.setProperty. */
function satteriMarkdownHooks(prefix) {
  return {
    name: 'popular-markdown-hooks',
    element: [
      {
        filter: ['img'],
        visit(node, ctx) {
          const props = node.properties ?? {};
          if (!('loading' in props)) ctx.setProperty(node, 'loading', 'lazy');
          if (!('decoding' in props)) ctx.setProperty(node, 'decoding', 'async');
          const src = prefixPath(props.src, prefix);
          if (src !== props.src) ctx.setProperty(node, 'src', src);
        },
      },
      {
        filter: ['a'],
        visit(node, ctx) {
          const props = node.properties ?? {};
          const href = prefixPath(props.href, prefix);
          if (href !== props.href) ctx.setProperty(node, 'href', href);
        },
      },
      {
        filter: ['table'],
        visit(node, ctx) {
          if (!isTableWrapper(ctx.parent(node))) ctx.wrapNode(node, tableWrapper());
        },
      },
      {
        filter: HEADINGS,
        visit(node, ctx) {
          let id = node.properties?.id;
          if (typeof id !== 'string') {
            /* ctx.data is per document, so the duplicate counter resets per page. */
            const slugger = (ctx.data.popularSlugger ??= new Slugger());
            const raw = ctx.textContent(node);
            id = slugger.slug(raw.includes('frontmatter') ? headingText(node, ctx.data.astro?.frontmatter) : raw);
            ctx.setProperty(node, 'id', id);
          }
          /* No anchor on h1 (the page title lives in the hero) or on a heading
             with no text to slug: href="#" would scroll to the top. Hugo's
             hook guards both the same way. */
          if (node.tagName !== 'h1' && id) ctx.appendChild(node, anchorNode(id));
        },
      },
    ],
  };
}

/* unified/rehype shape, for a site that opted into `markdown.processor:
   unified({...})`. A plain recursive walk, no unist-util-visit. */
function rehypeMarkdownHooks(prefix) {
  return () => (tree, file) => {
    /* One slugger per document, like Astro's own rehypeHeadingIds (which runs
       after user plugins and keeps an id that is already set). */
    const slugger = new Slugger();
    const frontmatter = file?.data?.astro?.frontmatter;
    const walk = (node) => {
      const props = node.properties;
      if (props) {
        if (node.tagName === 'img') {
          if (!('loading' in props)) props.loading = 'lazy';
          if (!('decoding' in props)) props.decoding = 'async';
          props.src = prefixPath(props.src, prefix);
        }
        if (node.tagName === 'a') props.href = prefixPath(props.href, prefix);
        if (HEADINGS.includes(node.tagName)) {
          if (typeof props.id !== 'string') props.id = slugger.slug(headingText(node, frontmatter));
          if (node.tagName !== 'h1' && props.id) (node.children ??= []).push(anchorNode(props.id));
        }
      }
      if (node.children && !isTableWrapper(node)) {
        node.children = node.children.map((child) =>
          child.type === 'element' && child.tagName === 'table' ? { ...tableWrapper(), children: [child] } : child,
        );
      }
      (node.children || []).forEach(walk);
    };
    walk(tree);
  };
}

export default function popularMarkdown() {
  return {
    name: 'popular-markdown',
    hooks: {
      'astro:config:setup': ({ config, logger }) => {
        /* config.base is '/' with no base configured, '/my-community' with one. */
        const prefix = (config.base ?? '/').replace(/\/+$/, '');
        const processor = config.markdown?.processor;
        if (Array.isArray(processor?.options?.hastPlugins)) {
          processor.options.hastPlugins.push(satteriMarkdownHooks(prefix));
        } else if (Array.isArray(processor?.options?.rehypePlugins)) {
          processor.options.rehypePlugins.push(rehypeMarkdownHooks(prefix));
        } else {
          logger.warn(
            `markdown.processor "${processor?.name ?? 'unknown'}" takes neither hastPlugins nor rehypePlugins: ` +
              'markdown images will not get loading="lazy", headings no "#" anchor, tables no scroll wrapper' +
              (prefix ? ', and site-absolute links in content will not carry the base' : ''),
          );
        }
      },
    },
  };
}
