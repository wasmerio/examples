/** Pagefind's Rust dictionary and browser Intl.Segmenter disagree on CJK words.
 * Explicit character boundaries make both pipelines deterministic. The client
 * verifies contiguous matches against original text, keeping substring semantics.
 */
export function searchTokens(text) {
  return text
    .replace(/\p{Script=Han}/gu, (character) => ` ${character} `)
    .replace(/\s+/g, ' ')
    .trim();
}
