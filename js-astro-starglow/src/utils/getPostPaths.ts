import { getRelativeLocaleUrl } from "astro:i18n";
import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";
import config from "@/config";

function getPostPathSegments(filePath: string | undefined): string[] {
  return (
    filePath
      ?.replace(BLOG_PATH, "")
      .split("/")
      .filter(path => path !== "")
      .filter(path => !path.startsWith("_"))
      .slice(0, -1)
      .map(segment => slugifyStr(segment)) ?? []
  );
}

function getIdSlug(id: string): string {
  const postId = id.split("/");
  return postId.length > 0 ? String(postId[postId.length - 1]) : id;
}

function getPostSlugPath(id: string, filePath: string | undefined): string {
  const pathSegments = getPostPathSegments(filePath);
  const slug = getIdSlug(id);
  return pathSegments.length > 0
    ? [...pathSegments, slug].join("/")
    : String(slug);
}

/** Route param for `getStaticPaths`, without base or locale: `/2026/my-post`. */
export function getPostSlug(id: string, filePath: string | undefined): string {
  return `/${getPostSlugPath(id, filePath)}`;
}

/** Link URL with locale and base applied: `/blog/2026/my-post`. */
export function getPostUrl(
  id: string,
  filePath: string | undefined,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(locale, `blog/${getPostSlugPath(id, filePath)}`);
}
