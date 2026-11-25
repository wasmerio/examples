import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { readContentFiles } from '../src/lib/content-files.ts';

const markdownText = (text) =>
  text
    .replace(/(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2[ \t]*(?=\n|$)/g, '$1')
    .replace(/(`+)[\s\S]*?\1/g, '');
const bodyLinks = (text) =>
  [...markdownText(text).matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)]
    .map((match) =>
      match[1]
        .replaceAll('/zh/', '/en/')
        .replace(
          'https://bloggpt.reincarnatey.net/en/',
          'https://bloggpt.reincarnatey.net/',
        ),
    )
    .sort();
const headings = (text) =>
  (markdownText(text).match(/^#{2,6}\s/gm) ?? []).length;
const tableFields = (text) =>
  [...text.matchAll(/^\|\s*`([^`]+)`\s*\|/gm)].map((match) => match[1]).sort();

test('demo translations retain the same publication settings, section coverage and destinations', async () => {
  const groups = new Map();
  for (const entry of await readContentFiles(process.cwd(), ['zh', 'en'])) {
    const key = `${entry.kind}/${entry.identity.key}`;
    const group = groups.get(key) ?? {};
    group[entry.identity.locale] = entry;
    groups.set(key, group);
  }
  assert.ok(groups.size >= 27);
  for (const [key, group] of groups) {
    assert.ok(group.zh && group.en, `${key}: both languages required`);
    const settings = (entry) =>
      Object.fromEntries(
        Object.entries(entry.data).filter(
          ([name]) => !['title', 'description'].includes(name),
        ),
      );
    assert.deepEqual(
      settings(group.en),
      settings(group.zh),
      `${key}: metadata`,
    );
    const zh = await readFile(group.zh.absolute, 'utf8');
    const en = await readFile(group.en.absolute, 'utf8');
    assert.equal(headings(en), headings(zh), `${key}: section coverage`);
    assert.deepEqual(bodyLinks(en), bodyLinks(zh), `${key}: links and images`);
  }
});

test('every primary documentation page has an English peer with matching sections and reference fields', async () => {
  const root = 'apps/docs';
  const primary = [];
  for (const directory of ['guide', 'config', 'content', 'customization'])
    for (const file of await readdir(path.join(root, directory)))
      if (file.endsWith('.md')) primary.push(`${directory}/${file}`);
  primary.push('index.md');
  const translated = (await readdir(path.join(root, 'en'), { recursive: true }))
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replaceAll('\\', '/'));
  assert.deepEqual(translated.sort(), primary.sort());
  for (const file of primary) {
    const zh = await readFile(path.join(root, file), 'utf8');
    const en = await readFile(path.join(root, 'en', file), 'utf8');
    assert.equal(headings(en), headings(zh), `${file}: section coverage`);
    if (file === 'config/reference.md' || file === 'content/frontmatter.md')
      assert.deepEqual(
        tableFields(en),
        tableFields(zh),
        `${file}: field coverage`,
      );
  }
});

test('both README languages share screenshots, feature coverage and executable commands', async () => {
  const en = await readFile('README.md', 'utf8');
  const zh = await readFile('README.zh-CN.md', 'utf8');
  const commands = (text) =>
    [...text.matchAll(/```sh\n([\s\S]*?)```/g)].map((match) => match[1]);
  assert.deepEqual(commands(en), commands(zh));
  const images = (text) =>
    [...text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]);
  assert.deepEqual(images(en), images(zh));
  const screenshots = (text) =>
    images(text).filter((image) => image.startsWith('.github/assets/readme/'));
  assert.equal(screenshots(en).length, 8);
  for (const text of [en, zh]) {
    const folded = text.match(
      /<details>\s*<summary>[^<]+<\/summary>([\s\S]*?)<\/details>/,
    );
    assert.ok(folded, 'Additional previews are collapsible');
    assert.equal(screenshots(folded[1]).length, 6);
    assert.deepEqual(screenshots(text.replace(folded[0], '')), [
      '.github/assets/readme/home.webp',
      '.github/assets/readme/article-light.webp',
    ]);
  }
  for (const image of screenshots(en)) await access(image);
  assert.match(en, /\*\*English\*\*.*README\.zh-CN\.md/);
  assert.match(zh, /\[English\]\(README\.md\)/);
});
