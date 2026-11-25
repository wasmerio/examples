import type { RemarkPlugin } from '@astrojs/markdown-remark';

const CJK_CHARACTERS_PER_MINUTE = 400;
const WORDS_PER_MINUTE = 200;

const cjkCharacters =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
const words =
  /[\p{L}\p{N}][\p{L}\p{N}\p{M}]*(?:['’][\p{L}\p{N}][\p{L}\p{N}\p{M}]*)*/gu;

function calculateReadingTime(text: string): number {
  const normalized = text.normalize('NFC');
  const characterCount = normalized.match(cjkCharacters)?.length ?? 0;
  // Spaces keep Latin words on either side of a CJK character separate.
  const wordCount =
    normalized.replace(cjkCharacters, ' ').match(words)?.length ?? 0;

  // Use a common denominator so exact minute boundaries round reliably.
  const minutes =
    (characterCount * WORDS_PER_MINUTE +
      wordCount * CJK_CHARACTERS_PER_MINUTE) /
    (CJK_CHARACTERS_PER_MINUTE * WORDS_PER_MINUTE);
  return Math.max(1, Math.ceil(minutes));
}

export function formatReadingTime(minutes: unknown): string {
  if (
    typeof minutes !== 'number' ||
    !Number.isSafeInteger(minutes) ||
    minutes < 1
  ) {
    throw new Error(
      'Missing or invalid readingTimeMinutes. Check the remark reading-time plugin configuration.',
    );
  }
  return `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
}

// Structural typing also accepts MDX nodes, whose static children follow mdast.
interface TextNode {
  type: string;
  value?: string;
  children?: TextNode[];
}

const blockContainers = new Set([
  'paragraph',
  'heading',
  'blockquote',
  'list',
  'listItem',
  'table',
  'tableRow',
  'tableCell',
  'footnoteDefinition',
  'mdxJsxFlowElement',
]);

function extractText(node: TextNode): string {
  switch (node.type) {
    case 'text':
    case 'inlineCode':
      return node.value ?? '';
    case 'code':
      return `\n${node.value ?? ''}\n`;
    case 'break':
      return '\n';
    default:
      // Only selected text values and static children contribute. In particular,
      // imports, expressions, raw HTML, attributes, URLs, and image alt text do not.
      const text = (node.children ?? []).map(extractText).join('');
      return blockContainers.has(node.type) ? `\n${text}\n` : text;
  }
}

export const remarkReadingTime: RemarkPlugin = () => (tree, file) => {
  const astro = (file.data.astro ??= {});
  const frontmatter = (astro.frontmatter ??= {});
  frontmatter.readingTimeMinutes = calculateReadingTime(extractText(tree));
};
