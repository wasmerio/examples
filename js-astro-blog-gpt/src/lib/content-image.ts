import config from './config';
import { withBase } from './i18n';
import { trimUrl } from './url-values';

/** Resolve bundle images against the content route, including on list pages. */
export function contentImage(image: string | undefined, route: string) {
  if (!image) return undefined;
  image = trimUrl(image);
  if (!image) return undefined;
  if (/^[a-z][a-z\d+.-]*:/i.test(image) || image.startsWith('//')) return image;
  if (image.startsWith('/')) return withBase(image);
  const url = new URL(image, new URL(route, config.site.url));
  return `${url.pathname}${url.search}${url.hash}`;
}
