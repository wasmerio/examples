import { alternate } from './urls';

export function pageMetadata(origin: string, base: string, pathname: string, title: string, description: string) {
  const canonicalPath = pathname.replace(/\/$/, '') || '/';
  const prefix = '/' + base.split('/').filter(Boolean).join('/');
  return {
    title,
    description,
    canonical: new URL(canonicalPath, origin).href,
    alternates: {
      en: new URL(alternate(pathname, 'en', base), origin).href,
      'pt-br': new URL(alternate(pathname, 'pt-br', base), origin).href,
    },
    image: new URL(`${prefix === '/' ? '' : prefix}/og-image.svg`, origin).href,
  };
}

export function robotsBody(origin: string, base: string): string {
  const prefix = '/' + base.split('/').filter(Boolean).join('/');
  const path = `${prefix === '/' ? '' : prefix}/sitemap-index.xml`;
  return `User-agent: *\nAllow: /\nSitemap: ${new URL(path, origin).href}\n`;
}
