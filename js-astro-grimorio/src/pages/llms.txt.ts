import type { APIRoute } from "astro";
import { getPersonalInfo, getSiteInfo } from "../config";
import { categoryLabel } from "../data/post-options";
import { languages, localizePath, translate } from "../i18n";
import { getPostId, getPosts } from "../lib/posts";

// Plain-text site summary for AI search engines (https://llmstxt.org).
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const siteInfo = getSiteInfo("en");
  const sections = await Promise.all(
    languages.map(async (lang) => {
      const posts = (await getPosts(lang)).map(
        (post) =>
          `- [${post.data.title}](${url(localizePath(lang, `/posts/${getPostId(post)}/`))}): ${categoryLabel(lang, post.data.category)}. ${post.data.description}`,
      );
      return [
        `## ${translate(lang, "nav.posts")} (${lang})`,
        "",
        ...posts,
        "",
        `- [${translate(lang, "nav.about")}](${url(localizePath(lang, "/about/"))}): ${translate(lang, "meta.aboutDescription")}`,
        `- [${translate(lang, "nav.projects")}](${url(localizePath(lang, "/projects/"))}): ${translate(lang, "meta.projectsDescription")}`,
        `- [RSS](${url(localizePath(lang, "/rss.xml"))})`,
      ].join("\n");
    }),
  );
  const body = [
    `# ${siteInfo.title}`,
    "",
    `> ${siteInfo.description} ${translate("es", "site.description")}`,
    "",
    `${getPersonalInfo("en").name} · ${getPersonalInfo("en").role} · ${getPersonalInfo("en").github}`,
    "",
    sections.join("\n\n"),
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
