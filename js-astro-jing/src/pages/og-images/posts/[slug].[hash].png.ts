import type { APIRoute, GetStaticPaths } from "astro";
import { _t, SITE } from "@/config";
import getPosts from "@/utils/getPosts";
import { getPostOgHash, OG_COLORS, OG_FONT_FAMILY, renderOgImage } from "@/utils/ogImage";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  return posts.map((post) => ({
    params: {
      slug: post.id,
      hash: getPostOgHash(post.data.title, post.data.date, post.data.tags),
    },
    props: {
      title: post.data.title,
      tags: post.data.tags ?? [],
      pubDate: post.data.date,
    },
  }));
};

export const GET: APIRoute = async ({ props, url }) => {
  const { title, tags, pubDate } = props as {
    title: string;
    tags: string[];
    pubDate: Date;
  };

  return renderOgImage(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: OG_COLORS.bg,
          padding: "80px 100px",
          fontFamily: OG_FONT_FAMILY,
        },
        children: [
          // Top: tags + title
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              },
              children: [
                // Tags row
                tags.length > 0 && {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 24,
                      fontWeight: 400,
                      color: OG_COLORS.faint,
                      letterSpacing: "0.1em",
                    },
                    children: tags.slice(0, 3).join("  ·  "),
                  },
                },
                // Title
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 64,
                      fontWeight: 400,
                      color: OG_COLORS.text,
                      lineHeight: 1.3,
                      letterSpacing: "-0.02em",
                      maxWidth: 1000,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    },
                    children: title,
                  },
                },
              ].filter(Boolean),
            },
          },
          // Bottom: site name + date
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                width: "100%",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 24,
                      fontWeight: 400,
                      color: OG_COLORS.muted,
                      letterSpacing: "0.04em",
                    },
                    children: SITE.title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 24,
                      fontWeight: 400,
                      color: OG_COLORS.faint,
                    },
                    children: _t.date.shortFormat(pubDate),
                  },
                },
              ],
            },
          },
        ],
      },
    },
    url,
  );
};
