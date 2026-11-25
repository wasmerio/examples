import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { articleDisplay } from '../src/lib/article-options.ts';
import { shareTemplate, shareHref } from '../src/lib/sharing.ts';
import {
  statisticsOptions,
  blogStatistics,
  dayKey,
} from '../src/lib/statistics.ts';
import { contextSnippets } from '../src/lib/search-context.ts';
import { visibleSections } from '../src/lib/visible-sections.ts';
import { searchRecords } from '../scripts/lib/search-records.mjs';

test('all eight display switches default on and per-entry values override global values in both directions', () => {
  const defaults = articleDisplay({});
  assert.equal(Object.keys(defaults).length, 8);
  assert.ok(Object.values(defaults).every(Boolean));
  for (const key of Object.keys(defaults)) {
    assert.equal(articleDisplay({}, { [key]: false })[key], false);
    assert.equal(
      articleDisplay({ display: { [key]: true } }, { [key]: false })[key],
      true,
    );
    assert.equal(
      articleDisplay({ display: { [key]: false } }, { [key]: true })[key],
      false,
    );
  }
});

test('copy templates preserve text while share links encode each placeholder exactly once', () => {
  const values = {
    title: '你好 & "BlogGPT"',
    description: 'Two lines\nSecond',
    author: 'Alex',
    blog: 'BlogGPT',
    url: 'https://example.com/你好/?a=1&b=2',
    image: '',
    text: 'Share me',
  };
  assert.equal(
    shareTemplate('{title}\n{description}\n{author} · {blog}\n{url}', values),
    `${values.title}\n${values.description}\nAlex · BlogGPT\n${values.url}`,
  );
  const url = new URL(
    shareHref('https://example.com/share?title={title}&url={url}', values),
  );
  assert.equal(url.searchParams.get('title'), values.title);
  assert.equal(url.searchParams.get('url'), values.url);
  assert.ok(shareHref('mailto:?subject={title}', values).includes('%20'));
  assert.throws(() => shareHref('javascript:alert({title})', values));
});

test('outline visibility includes partial section bodies and excludes sections touching only the boundary', () => {
  assert.deepEqual(visibleSections([100, 300, 600], 1200, 350, 700), [1, 2]);
  assert.deepEqual(visibleSections([100, 300, 600], 1200, 300, 600), [1]);
  assert.deepEqual(visibleSections([100, 300, 600], 1200, 0, 100), []);
  assert.deepEqual(visibleSections([100, 300, 600], 1200, 1200, 1400), []);
});

test('statistics aggregate real characters and timezone days, handle empty and single-post sites, and expose independent switches', () => {
  const post = (title, date, body) => ({
    data: { title, date: new Date(date) },
    body,
  });
  const stats = blogStatistics(
    [
      post('A', '2024-02-28T16:30:00Z', '你好'),
      post('B', '2024-03-01T16:30:00Z', 'test'),
    ],
    'Asia/Shanghai',
    new Date('2024-03-02T01:00:00Z'),
  );
  assert.equal(stats.heatmap.length, 365);
  assert.equal(new Set(stats.heatmap.map((day) => day.date)).size, 365);
  assert.equal(stats.heatmap.find((day) => day.date === '2024-02-29').count, 1);
  assert.equal(stats.heatmap.at(-1).date, '2024-03-02');
  assert.equal(stats.averageWords, 3);
  assert.equal(stats.intervalDays, 2);
  assert.equal(
    dayKey(new Date('2024-03-01T16:30:00Z'), 'Asia/Shanghai'),
    '2024-03-02',
  );
  assert.equal(blogStatistics([], 'UTC').averageWords, 0);
  assert.equal(blogStatistics([], 'UTC').intervalDays, undefined);
  assert.equal(
    blogStatistics([post('A', '2024-03-01', 'a')], 'UTC').intervalDays,
    undefined,
  );
  assert.equal(statisticsOptions({ enabled: false }).enabled, false);
  assert.equal(statisticsOptions({ heatmap: false }).recentWords, true);
  assert.equal(statisticsOptions({ heatmap: false }).heatmap, false);
  assert.equal(
    stats.firstPublication.toISOString(),
    '2024-02-28T16:30:00.000Z',
  );
  assert.equal(stats.lastUpdate.toISOString(), '2024-03-01T16:30:00.000Z');
  assert.equal(
    stats.heatmap.find((day) => day.date === '2024-02-29').entries[0].post.data
      .title,
    'A',
  );
  const updated = post('Old', '2024-02-01', 'a');
  updated.data.updated = new Date('2024-03-02');
  assert.equal(
    blogStatistics([updated], 'UTC').lastUpdate.toISOString(),
    '2024-03-02T00:00:00.000Z',
  );
  assert.equal(blogStatistics([], 'UTC').lastUpdate, undefined);
  assert.equal(statisticsOptions({ firstPublication: false }).lastUpdate, true);
});

test('context windows merge adjacent hits, retain separated matches, and escape query syntax', () => {
  const sections = [
    {
      heading: 'Code',
      id: 'code',
      text: `Start ${'a'.repeat(60)} C++ and C++ ${'b'.repeat(120)} end C++ tail`,
    },
  ];
  const snippets = contextSnippets(sections, 'C++', 12);
  assert.equal(snippets.length, 1);
  assert.equal((snippets[0].text.match(/C\+\+/g) ?? []).length, 3);
  assert.ok(snippets[0].text.length < sections[0].text.length);
  assert.equal(snippets[0].id, 'code');
  assert.deepEqual(contextSnippets(sections, 'absent'), []);
});

test('display guides keep normal article controls and pages expose configured publication/update dates', async () => {
  for (const lang of ['zh', 'en']) {
    const demo = await readFile(
      `dist/${lang}/posts/display-options/index.html`,
      'utf8',
    );
    for (const control of [
      'class="article-title-block"',
      'class="article-meta"',
      'class="article-end"',
      'class="article-neighbors"',
      'data-share-trigger',
    ])
      assert.equal(demo.includes(control), true, control);
    assert.equal(searchRecords(demo)[0].title.length > 0, true);
    const about = await readFile(`dist/${lang}/about/index.html`, 'utf8');
    assert.ok(about.includes('datetime="2026-10-01T00:00:00.000Z"'));
    assert.ok(about.includes('datetime="2026-10-17T00:00:00.000Z"'));
    const enhanced = await readFile(
      `dist/${lang}/posts/article-enhancements/index.html`,
      'utf8',
    );
    const records = searchRecords(enhanced);
    assert.ok(
      records[0].sections.some((section) => section.id && section.heading),
    );
  }
});
