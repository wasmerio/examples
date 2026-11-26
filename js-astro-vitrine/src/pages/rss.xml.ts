import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../config';
import { cartellino, getPlates, platePath } from '../lib/content';

export async function GET(context: APIContext) {
  const plates = await getPlates();
  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    // A catalogue has no publication dates, so the feed carries the entry itself:
    // the wall label is the description a reader would get standing in front of it.
    items: plates.map((plate) => ({
      title: plate.data.title,
      description: cartellino(plate).join(' · '),
      link: platePath(plate),
      categories: [plate.group.data.title],
    })),
    customData: `<language>${site.locale}</language>`,
  });
}
