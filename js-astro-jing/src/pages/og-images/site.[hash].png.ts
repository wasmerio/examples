import type { APIRoute, GetStaticPaths } from "astro";
import { SITE } from "@/config";
import { OG_COLORS, OG_FONT_FAMILY, renderOgImage, SITE_OG_HASH } from "@/utils/ogImage";

export const getStaticPaths: GetStaticPaths = () => [
  {
    params: { hash: SITE_OG_HASH },
  },
];

export const GET: APIRoute = async ({ url }) => {
  return renderOgImage(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: OG_COLORS.bg,
          fontFamily: OG_FONT_FAMILY,
          gap: "0px",
        },
        children: [
          // Site name
          {
            type: "div",
            props: {
              style: {
                fontSize: 72,
                fontWeight: 400,
                color: OG_COLORS.text,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              },
              children: SITE.title,
            },
          },
          // Rule
          {
            type: "div",
            props: {
              style: {
                width: "64px",
                height: "1px",
                backgroundColor: OG_COLORS.faint,
                margin: "42px 0",
              },
            },
          },
          // Tagline
          {
            type: "div",
            props: {
              style: {
                fontSize: 24,
                fontWeight: 400,
                color: OG_COLORS.muted,
                letterSpacing: "0.06em",
              },
              children: SITE.description,
            },
          },
        ],
      },
    },
    url,
  );
};
