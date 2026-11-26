// `$…$` and `$$…$$` in a post render to KaTeX HTML at build time, so no math runs in the browser.
// Sätteri parses them (`features.math`); this runs on the mdast so the code highlighter never sees
// a display block as a plain code block. The plugin flags the entry's frontmatter so the note and
// product pages load the KaTeX stylesheet only when they have math.
import katex from 'katex';
// Registers \ce and \pu for chemical equations and units
import 'katex/contrib/mhchem';
import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';

type Entry = NonNullable<SatteriProcessorOptions['mdastPlugins']>[number];
type Plugin = Extract<Entry, { inlineMath?: unknown }>;
type Context = Parameters<NonNullable<Plugin['math']>>[1];

const render = (displayMode: boolean) => (node: { value: string }, ctx: Context) => {
  if (ctx.data.astro) ctx.data.astro.frontmatter.hasMath = true;
  // A typo shows the source in red with KaTeX's message as its title instead of failing the build
  const html = katex.renderToString(node.value, { displayMode, throwOnError: false });
  // MDX parses `raw` into JSX (mdxExpressions: false keeps KaTeX's braces literal). Markdown takes
  // an html node: a `raw` string there is read as Markdown again and lands in its own <p>.
  return ctx.sourceFormat === 'mdx'
    ? { raw: html, mdxExpressions: false }
    : { type: 'html' as const, value: html };
};

export const math: Plugin = {
  name: 'math',
  inlineMath: render(false),
  math: render(true),
};
