import { interfaceMessages, contentLocales } from '../lib/translations.ts';
import { fileIdentity } from '../lib/content-variants.ts';
import type { Messages } from '../lib/translations.ts';
import type { Root, Blockquote, Paragraph, Text } from 'mdast';
import { markdownFeature, type MarkdownFile } from '../lib/article-options.ts';

const names: Record<string, keyof Messages> = {
  NOTE: 'calloutNote',
  TIP: 'calloutTip',
  IMPORTANT: 'calloutImportant',
  WARNING: 'calloutWarning',
  CAUTION: 'calloutCaution',
  INFO: 'calloutInfo',
  SUCCESS: 'calloutSuccess',
  QUESTION: 'calloutQuestion',
  DANGER: 'calloutDanger',
};
export default function remarkCallouts({
  defaultLocale = 'zh',
  enabled = true,
  locales = [defaultLocale],
}: { defaultLocale?: string; enabled?: boolean; locales?: string[] } = {}) {
  return (tree: Root, file: MarkdownFile) => {
    if (!markdownFeature(file, 'callouts', enabled)) return;
    const locale =
      fileIdentity(file.path ?? '', contentLocales(locales)).locale ??
      defaultLocale;
    const ui = interfaceMessages(locale, defaultLocale);
    function visit(node: Root | Blockquote | { children?: unknown[] }) {
      if ('type' in node && node.type === 'blockquote') {
        const quote = node as Blockquote;
        const first = quote.children[0];
        const text =
          first?.type === 'paragraph' && first.children[0]?.type === 'text'
            ? (first.children[0] as Text)
            : undefined;
        const match = text?.value.match(
          /^\[!([A-Z]+)\](?:[ \t]+([^\r\n]+))?(?:\r?\n|$)/i,
        );
        const kind = match?.[1].toUpperCase();
        if (
          match &&
          kind &&
          names[kind] &&
          text &&
          first?.type === 'paragraph'
        ) {
          text.value = text.value.slice(match[0].length);
          if (!text.value) first.children.shift();
          if (!first.children.length) quote.children.shift();
          const title: Paragraph = {
            type: 'paragraph',
            data: {
              hName: 'div',
              hProperties: { className: ['callout-title'] },
            },
            children: [{ type: 'text', value: match[2] ?? ui[names[kind]] }],
          };
          quote.data = {
            ...quote.data,
            hName: 'aside',
            hProperties: {
              className: ['callout', `callout-${kind.toLowerCase()}`],
              'data-callout': kind.toLowerCase(),
            },
          };
          quote.children.unshift(title);
        }
      }
      if (node.children)
        for (const child of node.children)
          if (child && typeof child === 'object')
            visit(child as { children?: unknown[] });
    }
    visit(tree);
  };
}
