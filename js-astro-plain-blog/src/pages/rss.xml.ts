import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { site } from "../config";
import { sitePath } from "../lib/paths";
import { selectPublished } from "../lib/publication.mjs";

const escapeXml = (value: string) =>
  value.replace(
    /[&<>"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!,
  );

const baseUrl = import.meta.env.BASE_URL;

// Absolute URL for a root-relative path. Paths rendered from Markdown may already
// carry the base path (Astro rewrites the URLs it generates, but not links written
// by hand), so the base is added only when missing; the site URL is what turns the
// result into an absolute URL. Keeping the base out of SITE_URL is what lets both
// parts compose instead of overwriting each other.
const toAbsolute = (rootPath: string, siteUrl: string) => {
  const path = rootPath.startsWith("/") ? rootPath : `/${rootPath}`;
  const withBase = path.startsWith(baseUrl) ? path : sitePath(path);
  return siteUrl ? new URL(withBase, siteUrl).href : withBase;
};

const absolutizeHtml = (html: string, siteUrl: string) =>
  siteUrl
    ? html.replace(
        /\b(href|src)="\/([^"]*)"/g,
        (_, attr: string, rest: string) =>
          `${attr}="${toAbsolute(rest, siteUrl)}"`,
      )
    : html;

export async function GET({ site: configured }: { site?: URL }) {
  const siteUrl = configured?.href ?? "";
  const posts = selectPublished(await getCollection("posts"));
  const container = await AstroContainer.create();
  const items = [];
  for (const post of posts) {
    const { Content } = await render(post);
    const html = absolutizeHtml(
      await container.renderToString(Content),
      siteUrl,
    );
    const path = `blog/${post.id}/`;
    const link = toAbsolute(path, siteUrl);
    const text = html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    items.push(`    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="${siteUrl ? "true" : "false"}">${escapeXml(link)}</guid>
      <pubDate>${new Date(`${post.data.date}T00:00:00.000Z`).toUTCString()}</pubDate>
      <description>${escapeXml(text.slice(0, 180))}</description>
      <content:encoded><![CDATA[${html.replaceAll("]]>", "]]]]><![CDATA[>")}]]></content:encoded>
    </item>`);
  }
  const self = toAbsolute("rss.xml", siteUrl);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <description>${escapeXml(site.description)}</description>
    <link>${escapeXml(toAbsolute("/", siteUrl))}</link>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(self)}" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
