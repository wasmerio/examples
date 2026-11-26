import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from '../src/config.ts';
import { creatorOf, orderPieces, ownTitle, pieceNameProblem, pieceWords, piecePath, sharedCreator } from '../src/lib/pieces.ts';

test("a fork's words reach every string", () => {
  const words = pieceWords({ label: 'Poem', plural: 'poems', creator: 'A. Poet' });
  const all = [words.piece(3), words.range(1, 20), words.more, words.previousGroup, words.nextGroup, words.pageDescription(1, 20, 40)];
  assert.deepEqual(all, ['Poem 3', 'poems 1–20', 'More poems', 'Previous poems', 'Next poems', "Poems 1 to 20 of A. Poet's 40, one per screen."]);
  for (const s of all) assert.doesNotMatch(s, /sonnet|Shakespeare/i);
});

test('a piece lives under the configured name', () => {
  assert.equal(piecePath(18), `/${siteConfig.pieces.name}/18/`);
  assert.equal(piecePath(3, { name: 'poems' }), '/poems/3/');
});

test('the name is a folder and a URL segment: lowercase, digits, hyphens, and not "page"', () => {
  for (const name of ['sonnets', 'poems', 'short-stories', 'haiku2']) assert.equal(pieceNameProblem(name), undefined, name);
  for (const name of ['', 'Poems', '_x', '1poems', 'poems/x', 'poems x', '.well-known']) assert.match(pieceNameProblem(name) ?? '', /pieces\.name/, name);
  assert.match(pieceNameProblem('page') ?? '', /\/page\/2\//);
});

const entry = (number: number, body = 'A line') => ({ data: { number }, body });

test('pieces come out in number order', () => {
  assert.deepEqual(orderPieces([entry(3), entry(1), entry(2)]).map((p) => p.data.number), [1, 2, 3]);
});

test('no published pieces names the folder, the setting and drafts', () => {
  assert.throws(() => orderPieces([], { name: 'poems', label: 'Poem' }),
    { message: 'No published pieces in src/content/poems/. Set pieces.name in src/config.ts to the name of your content folder, and check that not every piece is a draft.' });
});

test('the name cannot be where the feed lives', () => {
  assert.match(pieceNameProblem('reels', '/reels/') ?? '', /feedBase/);
  assert.equal(pieceNameProblem('poems', '/reels/'), undefined);
  assert.equal(pieceNameProblem('poems', '/'), undefined);
  assert.equal(pieceNameProblem('poems', '/poems-feed/'), undefined);
});

test('name errors end without a full stop, because Astro adds its own', () => {
  for (const name of ['Poems', 'page']) assert.doesNotMatch(pieceNameProblem(name) ?? 'missing', /\.$/, name);
});

test('a gap in the numbers fails, naming the missing piece', () => {
  const poems = { name: 'poems', label: 'Poem' };
  assert.throws(() => orderPieces([entry(1), entry(3)], poems), { message: 'Poem 2 is missing. The feed and the piece pages link pieces 1 to 3 by number, so number them with no gaps, and keep drafts at the end.' });
  assert.throws(() => orderPieces([entry(2), entry(3)], poems), /^Error: Poem 1 is missing\./);
  assert.equal(orderPieces([entry(2), entry(1)], poems).length, 2);
});

test('a duplicate number or an empty body fails, naming the piece', () => {
  assert.throws(() => orderPieces([entry(1), entry(1)], { name: 'poems', label: 'Poem' }), /Poem 1 appears twice/);
  assert.throws(() => orderPieces([entry(1, '  ')], { name: 'poems', label: 'Poem' }), /Poem 1 has an empty body/);
});

test('a title shows only when it says more than the label and number', () => {
  assert.equal(ownTitle('Sonnet 18', 18, { label: 'Sonnet' }), undefined);
  assert.equal(ownTitle('Poem 18', 18, { label: 'Poem' }), undefined);
  assert.equal(ownTitle('The Raven', 18, { label: 'Poem' }), 'The Raven');
});

test("a piece's own creator wins over the config's", () => {
  assert.equal(creatorOf({}), siteConfig.pieces.creator);
  assert.equal(creatorOf({ creator: 'Ann Other' }), 'Ann Other');
});

test('the collection names one creator only when every piece shares it', () => {
  assert.equal(sharedCreator([{}, {}], { creator: 'A. Poet' }), 'A. Poet');
  assert.equal(sharedCreator([{}, { creator: 'A. Poet' }], { creator: 'A. Poet' }), 'A. Poet');
  assert.equal(sharedCreator([{}, { creator: 'B. Guest' }], { creator: 'A. Poet' }), undefined);
});

test('the closing line names the creator only when there is one', () => {
  const words = pieceWords({ label: 'Poem', plural: 'poems', creator: 'A. Poet' });
  assert.equal(words.closing(3, 'A. Poet'), 'All 3 poems, by A. Poet.');
  assert.equal(words.closing(3, undefined), 'All 3 poems.');
});
