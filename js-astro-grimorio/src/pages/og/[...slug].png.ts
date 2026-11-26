import type { APIRoute } from "astro";
import { getSiteInfo, getPersonalInfo } from "../../config";
import { categoryLabel } from "../../data/post-options";
import { languages } from "../../i18n";
import { getPostId, getPosts } from "../../lib/posts";
import { renderOgImage, type OgContent } from "../../lib/og";

export async function getStaticPaths() {
  const paths = await Promise.all(
    languages.map(async (lang) => {
      const siteInfo = getSiteInfo(lang);
      const personalInfo = getPersonalInfo(lang);
      const author = { author: personalInfo.name, role: personalInfo.role };
      const posts = (await getPosts(lang)).map((post) => ({
        params: { slug: `${lang}/${getPostId(post)}` },
        props: {
          ...author,
          eyebrow: categoryLabel(lang, post.data.category),
          title: post.data.title,
          description: post.data.description,
        },
      }));
      return [
        {
          params: { slug: `${lang}/default` },
          props: {
            ...author,
            eyebrow: siteInfo.title,
            title: siteInfo.titleSuffix,
            description: siteInfo.description,
          },
        },
        ...posts,
      ];
    }),
  );
  return paths.flat();
}

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderOgImage(props as OgContent)), {
    headers: { "Content-Type": "image/png" },
  });
