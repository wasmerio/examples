// pnpm test: the source gutter plugin on a small document. Fails loudly, no framework.
import assert from 'node:assert/strict';
import { markdownToHtml, mdxToJs, type MarkdownToHtmlResult } from 'satteri';
import { sourceGutter } from './monoline-plugin.ts';

const doc = `Plain paragraph.[^why]

## Heading

### Smaller

> Quoted.

* star bullet
  1. nested ordered

3. third
4. fourth

---

\`\`\`js
let a;
\`\`\`

Second reference.[^a]

| a | b |
| - | - |
| 1 | 2 |

![A sketch](pic.png)

Text with ![x](inline.png) inside.

[^a]: Defined first, referenced second.
[^why]: Referenced first.
`;
const html = (markdownToHtml(doc, { hastPlugins: [sourceGutter] }) as MarkdownToHtmlResult).html;

// Paragraphs carry nothing; every structural block carries its source.
assert.match(html, /<p>Plain paragraph/);
assert.match(html, /<h2 data-md="##">/);
assert.match(html, /<h3 data-md="###">/);
assert.match(html, /<blockquote data-md=">">/);
assert.match(html, /<hr data-md="---">/);
assert.match(html, /<pre data-md="&#x60;&#x60;&#x60;">/);
// Any bullet reads as `-`; ordered items keep their real number, nested ones too.
assert.match(html, /<li data-md="-">star bullet/);
assert.match(html, /<li data-md="1.">nested ordered/);
assert.match(html, /<li data-md="3.">third<\/li>\s*<li data-md="4.">fourth/);
// Footnotes by the number the reader sees, in reference order, not by label.
assert.match(html, /<li id="user-content-fn-why" data-md="\[\^1\]">/);
assert.match(html, /<li id="user-content-fn-a" data-md="\[\^2\]">/);
assert.match(html, /<h2 class="sr-only" id="footnote-label">/);
// Tables scroll in a wrapper and stay tables.
assert.match(html, /<div class="table-block" data-md="\|"><div class="table-scroll"><table>/);
assert.match(html, /<p data-md="!\[\]"><img src="pic.png" alt="A sketch"><\/p>/);
assert.match(html, /<p>Text with <img src="inline.png" alt="x"> inside.<\/p>/);

// MDX notes go through the same plugin.
const mdx = String((await mdxToJs(doc, { hastPlugins: [sourceGutter] })).code);
assert.match(mdx, /"data-md": "##"/);

console.log('monoline: ok');

// Math: KaTeX at build time. Inline stays in its paragraph (a raw string in Markdown would be
// read again and land in its own <p>); a display formula carries the `$$` gutter marker.
const { math } = await import('./math.ts');
const opts = { features: { math: true }, mdastPlugins: [math] };
const withMath = (markdownToHtml('A gap $g$ here.\n\n$$\nx\n$$\n', opts) as MarkdownToHtmlResult)
  .html;
assert.match(withMath, /<p>A gap <span class="katex">/);
assert.match(withMath, /<div class="math-display" data-md="\$\$"><span class="katex-display">/);
assert.match(String((await mdxToJs('A gap $g$ here.', opts)).code), /"katex"/);
console.log('math: ok');

// Links between notes as an editor writes them: ./file.md and [[wikilinks]].
const { noteIds, noteLinks, linkedIds, resolveFileLink } = await import('./note-links.ts');
const ids = new Map([
  ['design-review-rules', 'Design review rules'],
  ['work/kickoff', undefined],
]);
const linked = (
  markdownToHtml(
    'See [the rules](./design-review-rules.md#who), [[Design review rules]], [[design-review-rules|them]], ' +
      '[[work/kickoff#The Agenda]], [[not written yet]], [gone](gone.md), `[[code]]` and [web](https://x.com/a.md).',
    { mdastPlugins: [noteLinks(ids)] },
  ) as MarkdownToHtmlResult
).html;
assert.match(linked, /<a href="\/notes\/design-review-rules#who">the rules<\/a>/);
assert.match(linked, /<a href="\/notes\/design-review-rules">Design review rules<\/a>/);
assert.equal(noteIds('src/content/notes').get('last-week'), 'Last week');
assert.match(linked, /<a href="\/notes\/design-review-rules">them<\/a>/);
assert.match(linked, /<a href="\/notes\/work\/kickoff#the-agenda">work\/kickoff<\/a>/);
assert.match(linked, /, not written yet, gone, <code>\[\[code\]\]<\/code>/);
assert.match(linked, /<a href="https:\/\/x.com\/a.md">web<\/a>/);
assert.equal(resolveFileLink('../notes/A Note.md'), '/notes/a-note');
assert.equal(resolveFileLink('/notes/a'), null);
assert.deepEqual(linkedIds('[a](/notes/a) [b](./b.md) [[C note]] [[a]]'), ['a', 'b', 'c-note']);
console.log('note links: ok');

// Text helpers.
const { countWords, excerpt, isoDate, readingMinutes } = await import('./text.ts');
assert.equal(countWords('Two words.\n\n```\nnot these\n```\n\n[link](/x) here[^1]\n'), 4);
assert.equal(isoDate(new Date('2026-09-02')), '2026-09-02');
// Chinese/Japanese by character, Korean (escaped: two words) by word.
assert.equal(countWords('今日は晴れ。 Then English. \uC624\uB298\uC740 \uB9D1\uC74C'), 5 + 2 + 2);
assert.equal(readingMinutes(800, 800), 2);
assert.equal(
  excerpt('## Heading\n\n- list\n\nThe *first* [real](/x) paragraph.[^1]\n\nSecond.'),
  'The first real paragraph.',
);
assert.match(excerpt('word '.repeat(60), 40), /^(word ){6}word…$/);
console.log('text: ok');
