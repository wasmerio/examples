import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSonnets, romanToInt, toMarkdown } from '../../scripts/sonnets-parser.mjs';
import { skip } from './demo.ts';

const fixture = (count: number) => {
  const roman = ['I', 'II', 'III'];
  let text = 'Header\r\n*** START OF THE PROJECT GUTENBERG EBOOK SHAKESPEARE\'S SONNETS ***\r\nTHE SONNETS\r\n\r\nby William Shakespeare\r\n\r\n';
  for (let i = 0; i < count; i++) {
    text += `${roman[i]}\r\n\r\nFirst line of ${i + 1}, "quoted"\r\nSecond line\r\n    An indented couplet line\r\n    And its partner\r\n\r\n`;
  }
  return text + '*** END OF THE PROJECT GUTENBERG EBOOK SHAKESPEARE\'S SONNETS ***\r\nFooter\r\n';
};

test('roman numerals convert', { skip }, () => {
  assert.equal(romanToInt('XVIII'), 18);
  assert.equal(romanToInt('XCIX'), 99);
  assert.equal(romanToInt('CXLV'), 145);
  assert.equal(romanToInt('CLIV'), 154);
});

test('sonnets parse between the markers, keeping indentation and ignoring the front matter', { skip }, () => {
  const sonnets = parseSonnets(fixture(3), 3, 4);
  assert.equal(sonnets.length, 3);
  assert.deepEqual(sonnets[1], {
    number: 2,
    lines: [
      { text: 'First line of 2, "quoted"', indent: false },
      { text: 'Second line', indent: false },
      { text: 'An indented couplet line', indent: true },
      { text: 'And its partner', indent: true },
    ],
  });
});

test('a wrong count or order fails loudly', { skip }, () => {
  assert.throws(() => parseSonnets(fixture(2), 3, 4), /expected 3 sonnets, found 2/);
  assert.throws(() => parseSonnets(fixture(3), 3), /sonnet 1 has only 4 lines/);
});

test('markdown keeps lines and marks indentation with em spaces', { skip }, () => {
  const [sonnet] = parseSonnets(fixture(1), 1, 4);
  assert.equal(toMarkdown(sonnet!),
    '---\nnumber: 1\ntitle: "Sonnet 1"\ndescription: "First line of 1, \\"quoted\\""\n---\n\n' +
    'First line of 1, "quoted"\nSecond line\n\u2003\u2003An indented couplet line\n\u2003\u2003And its partner\n');
});
