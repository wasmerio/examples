// A wide table in a post scrolls inside a wrapper on a narrow screen. The table keeps its own
// display: `display: block` on a <table> makes WebKit's screen reader stop announcing it as a
// table, so the scrolling belongs to a <div class="table-scroll"> around it (global.css).
import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';

type Entry = NonNullable<SatteriProcessorOptions['hastPlugins']>[number];

export const tableScroll: Extract<Entry, { name: string }> = {
  name: 'table-scroll',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      const wrap = { type: 'element', tagName: 'div', properties: { className: ['table-scroll'] } };
      ctx.wrapNode(node, { ...wrap, children: [] } as never);
    },
  },
};
