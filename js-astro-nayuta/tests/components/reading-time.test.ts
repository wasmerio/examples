import { describe, expect, test } from 'bun:test';
import {
  isUnifiedProcessor,
  unified,
  type RemarkPlugin,
} from '@astrojs/markdown-remark';
import { compile } from '@mdx-js/mdx';
import config from '../../astro.config.ts';

const processor = config.markdown?.processor ?? unified();
if (!isUnifiedProcessor(processor)) {
  throw new Error(
    'Reading-time tests require the configured unified processor.',
  );
}
// Astro's MDX integration inherits imported plugins, excluding string specifiers.
const remarkPlugins = processor.options.remarkPlugins.filter(
  (plugin): plugin is RemarkPlugin | [RemarkPlugin, unknown] =>
    typeof plugin !== 'string' &&
    !(Array.isArray(plugin) && typeof plugin[0] === 'string'),
);
const markdown = await processor.createRenderer({ syntaxHighlight: false });
const words = (count: number) => 'word '.repeat(count).trim();

async function markdownMinutes(
  body: string,
  frontmatter: Record<string, unknown> = {},
) {
  const result = await markdown.render(body, { frontmatter });
  return result.metadata.frontmatter.readingTimeMinutes;
}

async function mdxMinutes(
  body: string,
  frontmatter: Record<string, unknown> = {},
) {
  const result = await compile(
    { value: body, data: { astro: { frontmatter } } },
    { remarkPlugins },
  );
  return result.data.astro?.frontmatter?.readingTimeMinutes;
}

describe('reading time through the configured Markdown processor', () => {
  test.each([
    ['empty body', '', 1],
    ['punctuation and emoji', '……！ 🎉 — !!!', 1],
    ['200 English words', words(200), 1],
    ['201 English words', words(201), 2],
    ['400 Chinese characters', '文'.repeat(400), 1],
    ['401 Chinese characters', '文'.repeat(401), 2],
    ['mixed languages', '文'.repeat(800) + words(400), 4],
    ['mixed exact boundary', words(199) + '中文', 1],
    ['CJK between Latin words', 'word中word '.repeat(100), 2],
    ['supplementary Han characters', '𠮷'.repeat(401), 2],
    ['Japanese kana and Korean', 'あア한'.repeat(134), 2],
    ['accented words', 'cafe\u0301 '.repeat(201), 2],
    ['contractions', "don't writer’s ".repeat(100), 1],
  ])('%s', async (_name, body, expected) => {
    expect(await markdownMinutes(body)).toBe(expected);
  });

  test.each([
    ['heading', `# ${words(201)}`],
    ['list', `- ${words(201)}`],
    ['blockquote', `> ${words(201)}`],
    ['table', `| Column |\n| --- |\n| ${words(201)} |`],
    ['inline code', '`' + words(201) + '`'],
    ['code block', '```text\n' + words(201) + '\n```'],
  ])('includes %s text', async (_name, body) => {
    expect(await markdownMinutes(body)).toBe(2);
  });

  test('formatting inside a word does not split it', async () => {
    expect(await markdownMinutes('read**ing** '.repeat(200))).toBe(1);
  });

  test('adjacent blocks remain separate words', async () => {
    expect(await markdownMinutes('word\n\n'.repeat(201))).toBe(2);
  });

  test('formatting within table cells does not split words', async () => {
    expect(
      await markdownMinutes(
        `| Heading |\n| --- |\n| ${'read**ing** '.repeat(199)} |`,
      ),
    ).toBe(1);
  });

  test('frontmatter cannot override the calculated value', async () => {
    const result = await markdown.render('Short article.', {
      frontmatter: {
        title: words(600),
        readingTime: '99 mins',
        readingTimeMinutes: 99,
      },
    });
    expect(result.metadata.frontmatter.readingTimeMinutes).toBe(1);
    expect(result.metadata.frontmatter.title).toBe(words(600));
  });

  test('counts link labels but excludes destinations and definitions', async () => {
    const destination = 'https://example.com/' + 'segment/'.repeat(600);
    expect(await markdownMinutes(`[${words(200)}](${destination})`)).toBe(1);
    expect(
      await markdownMinutes(`[${words(200)}][ref]\n\n[ref]: ${destination}`),
    ).toBe(1);
  });

  test('images and raw HTML blocks do not add time', async () => {
    expect(
      await markdownMinutes(
        `![${words(600)}](/image.png)\n\n<div>${words(600)}</div>\n\nShort article.`,
      ),
    ).toBe(1);
  });
});

describe('reading time through the MDX compiler', () => {
  test('counts static children inside nested components', async () => {
    expect(
      await mdxMinutes(
        `<Callout>\n\n<Inner>${words(201)}</Inner>\n\n</Callout>`,
      ),
    ).toBe(2);
  });

  test('excludes imports, exports, attributes, expressions, and comments', async () => {
    const noise = words(600);
    const body = [
      `import Widget from '${noise}';`,
      `export const generated = '${noise}';`,
      `<Widget title="${noise}" value={'${noise}'}>Short article.</Widget>`,
      `{generated}`,
      `{/* ${noise} */}`,
    ].join('\n\n');
    expect(await mdxMinutes(body)).toBe(1);
  });

  test('inline components preserve word boundaries', async () => {
    expect(await mdxMinutes('read<Em>ing</Em> '.repeat(200))).toBe(1);
  });

  test('flow components preserve their inline text and paragraph boundaries', async () => {
    expect(
      await mdxMinutes(`<Callout>${'read<Em>ing</Em> '.repeat(200)}</Callout>`),
    ).toBe(1);
    expect(
      await mdxMinutes(`<Callout>\n\n${'word\n\n'.repeat(201)}</Callout>`),
    ).toBe(2);
  });

  test('calculates fresh metadata when the body changes', async () => {
    expect(await mdxMinutes(words(200), { readingTime: '99 mins' })).toBe(1);
    expect(await mdxMinutes(words(201), { readingTime: '99 mins' })).toBe(2);
  });
});
