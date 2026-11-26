import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routes = [
  ['index.html', '记忆地图', 'A Memory Atlas for Two'],
  ['journey/index.html', '走向彼此', 'Our Journey'],
  ['album/index.html', '完整相册', 'Our Full Album'],
  ['annual/index.html', '年度回顾', 'Year in Review'],
  ['places/index.html', '地图足迹', 'Places Along the Way'],
  ['future/index.html', '以后一起', 'Someday Together'],
];

test('all six routes render the sample debug panel expanded by default', async () => {
  for (const [path, heading, englishTitle] of routes) {
    const html = await readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');
    assert.match(html, /<aside class="debug-panel"[^>]*data-debug-panel/);
    assert.doesNotMatch(html.match(/<aside class="debug-panel"[^>]*>/)?.[0] ?? '', /\shidden(?:\s|>)/);
    assert.match(html, /data-debug-close[^>]*aria-expanded="true"/);
    assert.ok(html.includes(heading), `${path} should render its identifying heading`);
    assert.ok(html.includes(englishTitle), `${path} should include the English title`);
    assert.match(html, /<html[^>]*\slang="en"/);
    assert.match(html, /data-language="en"/);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    assert.match(title, new RegExp(englishTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.doesNotMatch(title, /\p{Script=Han}/u);
    assert.match(html, /property="og:locale" content="en_US"/);
    assert.match(html, /data-language-choice="en"[^>]*aria-pressed="true"/);
    if (path === 'index.html') {
      assert.match(html, /rel="preload" as="image" href="[^"]+\.webp"/);
      assert.doesNotMatch(html, /rel="preload" as="image" href="[^"]+\.jpe?g"/);
    }
    assert.match(html, /data-language-choice="zh"/);
    assert.match(html, /data-language-choice="en"/);
  }
});
