import { href } from './i18n';
import type { Locale, NavigationItem } from '../types/config';
import { pageFor, encodedSlug } from './content';

export async function navigationHref(
  item: NavigationItem,
  lang: Locale,
): Promise<string> {
  if (item.type === 'external') return item.href;
  if (item.type === 'page') {
    const page = await pageFor(item.page, lang);
    if (!page)
      throw new Error(`Missing navigation page: ${item.page} (${lang})`);
    return href(lang, `${encodedSlug(page.data.slug)}/`);
  }
  return href(lang, item.route === 'home' ? '' : `${item.route}/`);
}
