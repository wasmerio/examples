/** Split "Plain *accent* plain" into parts; text between asterisks is shown in the accent color. */
export function highlightParts(text: string): { text: string; hl: boolean }[] {
  return text
    .split("*")
    .map((part, i) => ({ text: part, hl: i % 2 === 1 }))
    .filter((p) => p.text.length > 0);
}
