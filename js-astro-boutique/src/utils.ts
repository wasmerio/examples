/** Resolve a path from /public against the configured `base`; absolute URLs pass through. */
export const asset = (path: string): string => {
  if (/^(https?:)?\/\//.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
};

/** Split "Olive & Pine" around the ampersand so it can be tinted with the accent colour. */
export const splitAmp = (name: string): string[] => name.split('&');
