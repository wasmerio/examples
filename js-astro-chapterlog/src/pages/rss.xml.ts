import type { APIRoute } from "astro";
import { books, getAllChapters } from "../data/books";
import { site } from "../data/site";

export const GET: APIRoute = () => {
  const items = books.flatMap((book) =>
    getAllChapters(book).map((ch) => ({
      title: `${book.title} — ${ch.number}. ${ch.title}`,
      link: `${site.url}/${book.slug}/${ch.slug}`,
      bookTitle: book.title,
    }))
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.name}</title>
    <description>${site.description}</description>
    <link>${site.url}</link>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid>${item.link}</guid>
      <category>${escapeXml(item.bookTitle)}</category>
    </item>`
      )
      .join("\n    ")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
