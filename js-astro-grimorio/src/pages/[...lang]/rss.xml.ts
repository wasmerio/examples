import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getPosts, getPostId } from "../../lib/posts";
import { categoryLabel } from "../../data/post-options";
import { getSiteInfo } from "../../config";
import { getLanguage, languagePaths, localizePath } from "../../i18n";

export const getStaticPaths = languagePaths;
export const GET: APIRoute = async ({ site, params }) => {
  const lang = getLanguage(params.lang);
  const siteInfo = getSiteInfo(lang);
  const self = new URL(localizePath(lang, "/rss.xml"), site).href;
  return rss({
    title: `${siteInfo.title} · ${siteInfo.titleSuffix}`,
    description: siteInfo.description,
    site: site!,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    items: (await getPosts(lang)).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: localizePath(lang, `/posts/${getPostId(post)}/`),
      categories: [categoryLabel(lang, post.data.category), ...post.data.tags],
      // Full post HTML so feed readers can show the whole article.
      content: post.rendered?.html,
    })),
    customData: [
      `<language>${siteInfo.language}</language>`,
      `<atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
    ].join(""),
  });
};
