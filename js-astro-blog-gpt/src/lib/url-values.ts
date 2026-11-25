/** Match the leading/trailing C0 controls and spaces ignored by URL parsing. */
export function trimUrl(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g, '');
}

/** Locate srcset URLs while preserving descriptors, whitespace and data URL commas. */
export function srcsetCandidates(value: string) {
  const candidates: { url: string; start: number; end: number }[] = [];
  const space = (character: string) => /[\t\n\f\r ]/.test(character);
  let position = 0;
  while (position < value.length) {
    while (
      position < value.length &&
      (space(value[position]) || value[position] === ',')
    )
      position++;
    const start = position;
    while (position < value.length && !space(value[position])) position++;
    let end = position;
    while (end > start && value[end - 1] === ',') end--;
    if (end === start) continue;
    candidates.push({ url: value.slice(start, end), start, end });
    if (end !== position) continue;
    // Descriptor parentheses may contain commas; only an outer comma ends a candidate.
    let parentheses = 0;
    while (position < value.length) {
      const character = value[position++];
      if (character === '(') parentheses++;
      if (character === ')') parentheses = Math.max(0, parentheses - 1);
      if (character === ',' && parentheses === 0) break;
    }
  }
  return candidates;
}
