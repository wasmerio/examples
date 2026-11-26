// Pure parsing of Project Gutenberg eBook #1041 ("Shakespeare's Sonnets").
const VALUES = { I: 1, V: 5, X: 10, L: 50, C: 100 };
const NUMERAL = /^\s*([IVXLC]+)\s*$/;
const INDENT = '\u2003\u2003'; // two em spaces: kept by pre-line, invisible to CommonMark

export function romanToInt(roman) {
  let total = 0;
  for (let i = 0; i < roman.length; i++) {
    const value = VALUES[roman[i]];
    const next = VALUES[roman[i + 1]] ?? 0;
    total += value < next ? -value : value;
  }
  return total;
}

export function parseSonnets(text, expected = 154, minLines = 12) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const start = lines.findIndex((line) => line.startsWith('*** START OF'));
  const end = lines.findIndex((line) => line.startsWith('*** END OF'));
  if (start < 0 || end < 0) throw new Error('Project Gutenberg start or end marker not found.');
  const sonnets = [];
  for (const line of lines.slice(start + 1, end)) {
    const numeral = line.match(NUMERAL);
    if (numeral) { sonnets.push({ number: romanToInt(numeral[1]), lines: [] }); continue; }
    if (!sonnets.length || !line.trim()) continue;
    sonnets.at(-1).lines.push({ text: line.trim(), indent: /^\s{2,}\S/.test(line) });
  }
  if (sonnets.length !== expected) throw new Error(`expected ${expected} sonnets, found ${sonnets.length}`);
  sonnets.forEach((sonnet, i) => {
    if (sonnet.number !== i + 1) throw new Error(`sonnet ${i + 1} is numbered ${sonnet.number}`);
    if (sonnet.lines.length < minLines) throw new Error(`sonnet ${sonnet.number} has only ${sonnet.lines.length} lines`);
  });
  return sonnets;
}

export function toMarkdown(sonnet) {
  const description = sonnet.lines[0].text;
  if (description.length > 160) throw new Error(`sonnet ${sonnet.number}: first line over 160 characters`);
  const body = sonnet.lines.map((line) => (line.indent ? INDENT : '') + line.text).join('\n');
  return `---\nnumber: ${sonnet.number}\ntitle: ${JSON.stringify(`Sonnet ${sonnet.number}`)}\ndescription: ${JSON.stringify(description)}\n---\n\n${body}\n`;
}
