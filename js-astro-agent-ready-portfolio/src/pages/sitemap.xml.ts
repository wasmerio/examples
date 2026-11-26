import { site } from "$lib/site";
import { blogPosts } from "$lib/content/blog";
import { projectPages } from "$lib/content/projects";
import { allTags, postsWithTag } from "$lib/content/blog-queries";
import { githubProjects } from "$content/github-projects";


const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const latestProjectDate =
  githubProjects
    .map((project) => project.updated)
    .filter((updated) => updated && /^\d{4}-\d{2}-\d{2}$/.test(updated))
    .sort()
    .at(-1) ?? site.modifiedDate;

const latestSiteDate =
  latestProjectDate > site.modifiedDate ? latestProjectDate : site.modifiedDate;

const routes = [
  {
    path: "/",
    lastmod: latestSiteDate,
    changefreq: "monthly",
    priority: "1.0",
    images: [site.image, site.profileImage],
  },
  ...projectPages.map((page) => ({
    path: `/projects/${page.slug}`,
    lastmod: page.updated,
    changefreq: "monthly",
    priority: "0.7",
    images: [site.image],
  })),
  ...(site.features.blog && blogPosts.length
    ? [
        {
          path: "/blog",
          lastmod: blogPosts[0].updated ?? blogPosts[0].published,
          changefreq: "weekly",
          priority: "0.8",
          images: [site.image],
        },
        ...blogPosts.map((post) => ({
          path: `/blog/${post.slug}`,
          lastmod: post.updated ?? post.published,
          changefreq: "yearly",
          priority: "0.7",
          images: [
            {
              path: `/blog/${post.slug}/og.png`,
              alt: post.title,
            },
          ],
        })),
        // Single-post tag pages are noindex (they repeat /blog), so skip them here.
        ...allTags()
          .filter(({ count }) => count > 1)
          .map(({ slug }) => ({
          path: `/tags/${slug}`,
          lastmod: postsWithTag(slug)[0].updated ?? postsWithTag(slug)[0].published,
          changefreq: "weekly",
          priority: "0.4",
          images: [site.image],
        })),
      ]
    : []),
];

export const GET = () => {
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${escapeXml(`${site.url}${route.path}`)}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
${route.images
  .map(
    (image) => `    <image:image>
      <image:loc>${escapeXml(`${site.url}${image.path}`)}</image:loc>
      <image:caption>${escapeXml(image.alt)}</image:caption>
    </image:image>`,
  )
  .join("\n")}
  </url>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  });
};
