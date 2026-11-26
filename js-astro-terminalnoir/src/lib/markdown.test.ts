import { expect, it } from 'vitest';
import { renderMarkdown } from './markdown';

it('removes executable HTML and dangerous protocols', async () => {
  const html = await renderMarkdown(
    '<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n[bad](javascript:alert%281%29)',
  );
  expect(html).not.toMatch(/<script|onerror|href="javascript:/i);
});

it('escapes link attributes and preserves highlighted code', async () => {
  const html = await renderMarkdown('[safe](https://example.com "hello & world")\n\n```ts\nconst safe = true;\n```');
  expect(html).toContain('https://example.com');
  expect(html).toContain('shiki');
  expect(html).not.toContain('title="hello & world"');
});

it('drops svg and event payloads', async () => {
  const html = await renderMarkdown('<svg onload="alert(1)"><script>alert(1)</script></svg>');
  expect(html).not.toMatch(/<svg|onload|alert/i);
});

it('keeps a relative link and a supported language', async () => {
  const html = await renderMarkdown('[guide](/docs)\n\n```json\n{"ok":true}\n```');
  expect(html).toContain('href="/docs"');
  expect(html).toContain('shiki');
});

it('rejects a protocol-relative link and an encoded script scheme', async () => {
  const html = await renderMarkdown('[a](//evil.example/x)\n\n[b](javascript&#58;alert(1))');
  expect(html).not.toMatch(/\/\/evil\.example|href="javascript/i);
});

it('drops a leading title, markdown images and still highlights an unknown language', async () => {
  const html = await renderMarkdown('# Title\n\n![shot](./local.png)\n\n```not-a-language\nplain\n```', {
    dropTitle: true,
  });
  expect(html).not.toContain('<h1');
  expect(html).not.toContain('<img');
  expect(html).not.toContain('Title');
  expect(html).toContain('shiki');
  expect(html).toContain('plain');
});
