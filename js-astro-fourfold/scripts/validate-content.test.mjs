import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { frontmatter } from './validate-content.mjs';

const fixtureDir = path.join(import.meta.dirname, 'fixtures');

function assertFields(file, expected) {
  const { data } = frontmatter(path.join(fixtureDir, file));
  assert.equal(data.title, expected.title);
  assert.equal(data.description, expected.description);
  assert.equal(data.locale, expected.locale);
}

describe('content frontmatter line endings', () => {
  it('reads title, description, and locale from an LF file', () => {
    const bytes = fs.readFileSync(path.join(fixtureDir, 'lf-entry.md'));
    assert.equal(bytes.includes(13), false);
    assertFields('lf-entry.md', {
      title: 'LF title',
      description: 'An entry saved with LF line endings.',
      locale: 'en',
    });
  });

  it('reads title, description, and locale from a CRLF file', () => {
    const bytes = fs.readFileSync(path.join(fixtureDir, 'crlf-entry.md'));
    assert.ok(bytes.includes(Buffer.from('\r\n')));
    assert.equal(bytes.toString('utf8').replaceAll('\r\n', '').includes('\n'), false);
    assertFields('crlf-entry.md', {
      title: 'CRLF title',
      description: 'An entry saved with CRLF line endings.',
      locale: 'zh-cn',
    });
  });
});
