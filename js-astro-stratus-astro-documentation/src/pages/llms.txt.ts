import type { APIRoute } from "astro";
import seo from "@data/seo.json";
import { getDocsNav, type DocsNavPage } from "@utils/docsNav";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const nav = await getDocsNav();
  const hidden = new Set(
    (await getCollection("docs")).filter((doc) => doc.data.noindex).map((doc) => doc.id)
  );
  const absolute = (path: string) => (site ? new URL(path, site).href : path);

  const line = (page: DocsNavPage, markdownTwin: boolean, indent = ""): string[] => {
    if (hidden.has(page.id)) return [];
    const path = markdownTwin ? `${page.href.replace(/\/$/, "")}.md` : page.href;
    const description = page.description ? `: ${page.description}` : "";

    return [
      `${indent}- [${page.title}](${absolute(path)})${description}`,
      ...page.children.flatMap((child) => line(child, true, `${indent}  `)),
    ];
  };

  const sections = [
    `# ${seo.siteName}`,
    "",
    `> ${seo.description}`,
    "",
    "## Pages",
    "",
    ...nav.lead.flatMap((page) => line(page, false)),
    ...nav.groups.flatMap((group) => [
      "",
      `## ${group.name}`,
      "",
      ...group.pages.flatMap((page) => line(page, true)),
    ]),
  ];

  return new Response(`${sections.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
