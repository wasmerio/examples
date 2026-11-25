export const validSlug = (value) =>
  typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(value);

export const slugRule =
  'Use only lowercase ASCII letters (a-z), digits (0-9), and hyphens (-), starting with a letter or digit.';
