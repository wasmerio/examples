// `$…$` and `$$…$$` in a post render to KaTeX HTML at build time, so no math runs in the browser.
// Sätteri parses them (`features.math`); this runs on the mdast so the code highlighter never sees
// a display block as a plain code block. The plugin flags the note's frontmatter so the note page
// loads the KaTeX stylesheet only when it has math.
//
// A display formula sits in a <div data-md="$$"> for the source gutter (monoline.css): the marker
// hangs outside its box, so the wrapper must not clip, and the formula scrolls inside it instead.
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
  const formula = katex.renderToString(node.value, { displayMode, throwOnError: false });
  const html = displayMode ? `<div class="math-display" data-md="$$">${formula}</div>` : formula;
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
