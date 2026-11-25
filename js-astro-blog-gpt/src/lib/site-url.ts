/** Public baseUrl includes both the production origin and deployment directory. */
export function siteAddress(baseUrl: string) {
  let parsed: URL;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error('site.baseUrl must be an absolute HTTP or HTTPS URL.');
  }
  if (
    !['https:', 'http:'].includes(parsed.protocol) ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    /[\\\s]/.test(baseUrl)
  )
    throw new Error(
      'site.baseUrl must be an HTTP or HTTPS URL without credentials, query or fragment.',
    );
  const base = `${parsed.pathname.replace(/\/+$/, '')}/`;
  return { baseUrl: `${parsed.origin}${base}`, url: parsed.origin, base };
}
