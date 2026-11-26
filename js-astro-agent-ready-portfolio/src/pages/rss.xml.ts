import { site } from "$lib/site";
import { feedPosts } from "$lib/content/feed";


const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

// CDATA cannot contain its own terminator.
const cdata = (html: string) => `<![CDATA[${html.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;

export const GET = async () => {
  const posts = await feedPosts();
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${post.url}</link>
      <guid isPermaLink="true">${post.url}</guid>
      <pubDate>${new Date(post.published).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
      <content:encoded>${cdata(post.html)}</content:encoded>
    </item>`,
    )
    .join("\n");

  const lastBuild = posts[0]?.updated ?? posts[0]?.published;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}: blog</title>
    <link>${site.url}/blog</link>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(site.shortDescription)}</description>
    <language>${site.language}</language>${lastBuild ? `\n    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
};
