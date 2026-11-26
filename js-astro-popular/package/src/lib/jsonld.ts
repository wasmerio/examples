/** Shared JSON-LD helpers for Organization and BlogPosting, mirroring
 *  partials/jsonld-org.html and jsonld-blogpost.html. Keys are recursively
 *  sorted so the emitted markup byte-matches Hugo's jsonify. */
function sortKeys(v: any): any {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]));
  }
  return v;
}
export function jsonld(obj: Record<string, any>): string {
  return JSON.stringify(sortKeys(obj));
}

export function buildOrgLd(i: {
  name: string; url: string; logo?: string; description?: string; sameAs?: string[];
}): Record<string, any> {
  const ld: Record<string, any> = {
    '@context': 'https://schema.org', '@type': 'Organization', name: i.name, url: i.url,
  };
  if (i.logo) ld.logo = i.logo;
  if (i.description) ld.description = i.description;
  if (i.sameAs && i.sameAs.length) ld.sameAs = i.sameAs;
  return ld;
}

export function buildBlogPostingLd(i: {
  title: string; datePublished: string; dateModified: string;
  authors: string[]; image?: string; url: string; description?: string;
  siteTitle: string; siteUrl: string;
}): Record<string, any> {
  const publisher = { '@type': 'Organization', name: i.siteTitle, url: i.siteUrl };
  const author = i.authors.length
    ? i.authors.map((name) => ({ '@type': 'Person', name }))
    : [publisher];
  const headline = i.title.length > 110 ? i.title.slice(0, 109) + '…' : i.title;
  const ld: Record<string, any> = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline,
    datePublished: i.datePublished, dateModified: i.dateModified, author,
    url: i.url, publisher,
  };
  if (i.image) ld.image = i.image;
  if (i.description) {
    const d = i.description.trim();
    ld.description = d.length > 300 ? d.slice(0, 299) + '…' : d;
  }
  return ld;
}
