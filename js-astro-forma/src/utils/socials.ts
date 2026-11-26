import type { CompanyConfig } from '@/types/config';

/**
 * Helper for social media links.
 * company.json stores social media as a simple object of URLs without toggles.
 * The component renders only profiles with a non-empty URL other than "#".
 */

export type SocialEntry = {
  key: string;
  label: string;
  icon: string;
  href: string;
};

export const SOCIAL_META: Record<string, { label: string; icon: string }> = {
  facebook: { label: 'Facebook', icon: 'ph-facebook-logo' },
  instagram: { label: 'Instagram', icon: 'ph-instagram-logo' },
  youtube: { label: 'YouTube', icon: 'ph-youtube-logo' },
  twitter: { label: 'X (Twitter)', icon: 'ph-x-logo' },
};

/** Returns social media entries with a usable URL. */
export function getEnabledSocialLinks(company: CompanyConfig | Record<string, unknown>): SocialEntry[] {
  const socials = (company as any)?.socials;
  if (!socials || typeof socials !== 'object') return [];

  return Object.entries(socials as Record<string, string>)
    .filter(([, href]) => href && href.trim() !== '' && href.trim() !== '#')
    .map(([key, href]) => {
      const meta = SOCIAL_META[key] ?? { label: key, icon: 'ph-globe' };
      return { key, label: meta.label, icon: meta.icon, href: href.trim() };
    });
}

/** Returns the sameAs URL list used by Schema.org. */
export function getSocialUrls(company: CompanyConfig | Record<string, unknown>): string[] {
  return getEnabledSocialLinks(company).map((s) => s.href);
}
