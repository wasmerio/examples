import { profile } from "$content/profile";
import { site } from "$lib/site";


// Built from content/ so the app name and colours have one source.
export const GET = () =>
  new Response(
    JSON.stringify(
      {
        name: site.name,
        short_name: profile.givenName,
        description: site.description,
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: site.themeColor,
        theme_color: site.themeColor,
        icons: [
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/manifest+json" } },
  );
