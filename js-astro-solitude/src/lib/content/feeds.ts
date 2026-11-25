import { config, absolute, url } from '@/lib/site';
import { contentPath, plainText, type Post } from '@/lib/content';
export const xml = (s: unknown) =>
  String(s ?? '').replace(
    /[<>&"']/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[c]!,
  );
export function rss(posts: Post[], title = config.title) {
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${xml(title)}</title><link>${xml(absolute('/'))}</link><description>${xml(config.description)}</description>${posts.map((p) => `<item><title>${xml(p.data.title)}</title><link>${xml(absolute(contentPath(p)))}</link><guid isPermaLink="true">${xml(absolute(contentPath(p)))}</guid><pubDate>${p.data.date.toUTCString()}</pubDate><description>${xml(p.data.description ?? plainText(p.body ?? '').slice(0, 300))}</description></item>`).join('')}</channel></rss>`;
}
export function searchXml(posts: Post[]) {
  return `<?xml version="1.0" encoding="UTF-8"?><search>${posts.map((p) => `<entry><title>${xml(p.data.title)}</title><url>${xml(url(contentPath(p)))}</url><content>${xml(plainText(p.body ?? ''))}</content></entry>`).join('')}</search>`;
}
