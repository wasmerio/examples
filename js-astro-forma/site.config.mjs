// Public demo defaults are safe to keep in the repository and make the preview
// reproducible without requiring local environment variables.
const DEFAULT_SITE_URL = 'https://example.com/';
const DEFAULT_BASE_PATH = '/';

const configuredSiteUrl = process.env.PUBLIC_SITE_URL?.trim();
const configuredBasePath = process.env.PUBLIC_BASE_PATH?.trim();

// Why: a "Deploy to Vercel" clone gets a correct canonical URL without extra setup.
const vercelSiteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/`
  : '';

export const SITE_URL = configuredSiteUrl || vercelSiteUrl || DEFAULT_SITE_URL;
export const SITE_BASE_PATH =
  configuredBasePath || (process.env.NODE_ENV === 'production' ? DEFAULT_BASE_PATH : '/');
export const ACTIVE_TEMPLATE = 'default';
export const SITE_LOCALE = 'en';

export const TEMPLATE_CONFIG = {
  id: 'forma',
  name: 'FORMA',
  version: '0.1.0',
};

export const BUILD_SCOPE = {
  // Publiczne demo obejmuje gotową stronę Formy, bez przykładowych podstron fundamentu.
  pages: ['/', '/privacy-policy', '/pl/', '/pl/privacy-policy', '/en/', '/en/privacy-policy'],
  forceRemove: ['dev', 'qa'],
  images: true,
};

export const siteConfig = {
  name: 'FORMA',
  description: 'Astro template for construction and renovation service websites.',
  locale: SITE_LOCALE,
};
