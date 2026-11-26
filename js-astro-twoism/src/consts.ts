export const SITE_TITLE = 'Euan Muir';
export const SITE_DESCRIPTION = 'Notes from a beautiful place out in the country';
export const SITE_URL = process.env.SITE_URL || 'https://example.com';

export const PORTRAIT: { light: string; dark?: string } | undefined = {
  light: '/portrait-light.webp',
  dark: '/portrait-dark.webp',
};

export const LINKS = [
  { label: 'Email', href: 'mailto:euan@example.com' },
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'Last.fm', href: 'https://www.last.fm/' },
];
