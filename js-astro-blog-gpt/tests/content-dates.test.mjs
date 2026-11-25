import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dateFields,
  validContentDate,
  parseContentDate,
  validateContentDates,
} from '../src/lib/content-dates.ts';
import { frontmatter } from '../src/lib/content-files.ts';

const frontmatterForms = [
  ['standard', '', '---\n', '---\n'],
  ['leading blank lines', '\n \t\n', '---\n', '---\n'],
  ['delimiter whitespace', '', '--- \t\n', '--- \t\n'],
  ['BOM and CRLF', '\uFEFF', '---\r\n', '--- \t\r\n'],
];

test('frontmatter boundaries follow Astro while preserving original date scalar types', () => {
  for (const [name, prefix, open, close] of frontmatterForms) {
    const data = frontmatter(
      `${prefix}${open}title: Example\ndate: 2026-01-01\nupdated: false\n${close}Body.\n`,
    );
    assert.deepEqual(
      data,
      { title: 'Example', date: '2026-01-01', updated: false },
      name,
    );
    const warnings = [];
    assert.throws(
      () =>
        validateContentDates(data, 'content/tags/example.en.md', (message) =>
          warnings.push(message),
        ),
      /Invalid content dates/,
      name,
    );
    assert.equal(warnings.length, 1, name);
    assert.match(
      warnings[0],
      /Invalid updated in content\/tags\/example.en.md: false/,
    );
  }
  assert.deepEqual(frontmatter('Body without frontmatter.\n'), {});
  assert.deepEqual(frontmatter('Body.\n---\ndate: false\n---\n'), {});
});

test('documented quoted and unquoted date strings retain UTC and offset semantics', () => {
  for (const [source, expected] of [
    ['2026-10-16', '2026-10-16T00:00:00.000Z'],
    ["'2026-10-16'", '2026-10-16T00:00:00.000Z'],
    ['2026-10-16T09:00:00+08:00', '2026-10-16T01:00:00.000Z'],
    ['"2026-10-16T01:00:00Z"', '2026-10-16T01:00:00.000Z'],
  ]) {
    const data = frontmatter(`---\ndate: ${source}\n---\n`);
    validateContentDates(data, 'content/posts/entry.md', assert.fail);
    assert.equal(parseContentDate(data.date).toISOString(), expected);
  }
  validateContentDates({}, 'content/pages/entry.md', assert.fail);
});

test('nested YAML merges retain date strings and honor explicit overrides', () => {
  const data = frontmatter(`---
base: &base
  draft: true
  slug: merged
  date: 2026-01-01
defaults: &defaults
  <<: *base
  hidden: true
updates: &updates
  updated: 2026-01-02T09:00:00+08:00
<<: [*defaults, *updates]
draft: false
title: Merged metadata
---
`);
  assert.equal(data.slug, 'merged');
  assert.equal(data.draft, false);
  assert.equal(data.hidden, true);
  assert.equal(data.date, '2026-01-01');
  assert.equal(data.updated, '2026-01-02T09:00:00+08:00');
  validateContentDates(data, 'content/posts/merged.en.md', assert.fail);
});

test('invalid dates inherited through YAML merges warn before stopping', () => {
  for (const field of dateFields) {
    const data = frontmatter(
      `---\ndefaults: &defaults\n  ${field}: false\n<<: *defaults\ntitle: Inherited invalid date\n---\n`,
    );
    const warnings = [];
    assert.throws(
      () =>
        validateContentDates(data, 'content/tags/merged.ja.mdx', (message) =>
          warnings.push(message),
        ),
      /Invalid content dates/,
    );
    assert.equal(warnings.length, 1);
    assert.ok(
      warnings[0].includes(
        `Invalid ${field} in content/tags/merged.ja.mdx: false`,
      ),
    );
  }
});

test('every supplied date alias rejects coercible non-strings and invalid strings with a source warning', () => {
  for (const field of dateFields)
    for (const value of [
      1767225600000,
      0,
      true,
      false,
      null,
      [],
      ['2026-01-01'],
      {},
      new Date('2026-01-01'),
      '',
      '   ',
      'not-a-date',
      '1767225600000',
    ]) {
      const warnings = [];
      const file = 'content/posts/hidden-draft.ja.mdx';
      assert.equal(validContentDate(value), false);
      assert.throws(() => parseContentDate(value), /Invalid date/);
      assert.throws(
        () =>
          validateContentDates(
            { date: '2026-01-01', updated: '2026-01-02', [field]: value },
            file,
            (message) => warnings.push(message),
          ),
        /Invalid content dates/,
      );
      assert.equal(warnings.length, 1);
      assert.ok(warnings[0].includes(`Invalid ${field} in ${file}:`));
      assert.ok(warnings[0].includes(JSON.stringify(value)));
    }
});
