import type { APIRoute } from "astro";
import seo from "@data/seo.json";
import { renderMarkdown, renderMarkdownInline } from "@component-utils/markdown";
import { slugifyLabel } from "@component-utils/slugify";
import { getReleases } from "@utils/releases";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(seo.url);
  const changelogUrl = new URL("/changelog/", base).href;
  const releases = await getReleases();

  const items = releases.map(({ data }) => {
    const link = `${changelogUrl}#${slugifyLabel(data.version)}`;
    const changes = data.changes
      .map(
        (change) =>
          `<li>${change.tag ? `<strong>${escapeXml(change.tag)}:</strong> ` : ""}${renderMarkdownInline(change.text)}</li>`
      )
      .join("");
    const description = `${renderMarkdown(data.summary)}${changes ? `<ul>${changes}</ul>` : ""}`;

    return [
      "<item>",
      `<title>${escapeXml(data.version)}</title>`,
      `<link>${escapeXml(link)}</link>`,
      `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
      `<pubDate>${data.date.toUTCString()}</pubDate>`,
      `<description>${escapeXml(description)}</description>`,
      "</item>",
    ].join("");
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(`${seo.siteName} changelog`)}</title>`,
    `<link>${escapeXml(changelogUrl)}</link>`,
    `<description>${escapeXml(`Release notes for ${seo.siteName}.`)}</description>`,
    `<atom:link href="${escapeXml(new URL("/changelog.xml", base).href)}" rel="self" type="application/rss+xml" />`,
    ...items,
    "</channel>",
    "</rss>",
  ].join("\n");

  return new Response(`${xml}\n`, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
