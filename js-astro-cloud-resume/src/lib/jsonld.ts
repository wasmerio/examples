import type { Resume } from './schema';
import { assetUrl } from './format';

/** schema.org `Person` description of the resume, for search engines. */
export function personJsonLd(resume: Resume, site: URL | undefined, base: string): Record<string, unknown> {
  const b = resume.basics;
  const abs = (value: string) => (site ? new URL(assetUrl(value, base), site).href : assetUrl(value, base));
  const current = resume.experiences?.find((e) => !e.end);
  const sameAs = [b.website, ...b.profiles.map((p) => p.url)].filter(Boolean);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: b.name,
    jobTitle: b.title,
    description: b.summary?.replace(/\s+/g, ' ').trim(),
    url: site ? new URL(base, site).href : undefined,
    image: b.photo ? abs(b.photo) : undefined,
    email: b.email ? `mailto:${b.email}` : undefined,
    telephone: b.phone,
    address: b.location ? { '@type': 'PostalAddress', addressLocality: b.location } : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    worksFor: current
      ? { '@type': 'Organization', name: current.company, url: current.companyUrl }
      : undefined,
    alumniOf: resume.education?.map((e) => ({ '@type': 'EducationalOrganization', name: e.institution, url: e.url })),
    knowsLanguage: resume.languages?.map((l) => l.name),
    knowsAbout: resume.skills?.flatMap((g) => g.items.map((i) => i.name)),
    hasCredential: resume.certifications?.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.name,
      credentialCategory: 'certification',
      recognizedBy: { '@type': 'Organization', name: c.issuer },
      dateCreated: c.issued,
      expires: c.expires,
      identifier: c.credentialId,
      url: c.url,
    })),
  };
  // JSON.stringify drops `undefined` values, keeping the output clean.
  return JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
}
