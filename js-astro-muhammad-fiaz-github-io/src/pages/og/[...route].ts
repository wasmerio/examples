// Dynamic OpenGraph Image Generator
import { OGImageRoute } from "astro-og-canvas";
import { siteConfig } from "@/site.config";

// Define pages for OG image generation
const staticPages = {
  index: {
    title: siteConfig.name,
    description: siteConfig.description,
  },
  works: {
    title: "Works",
    description: "Featured projects and contributions",
  },
  projects: {
    title: "Projects",
    description: "All GitHub repositories and open source work",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "Privacy policy for Muhammad Fiaz portfolio",
  },
  "terms-of-service": {
    title: "Terms of Service",
    description: "Terms of service for Muhammad Fiaz portfolio",
  },
  "cookie-policy": {
    title: "Cookie Policy",
    description: "Cookie policy for Muhammad Fiaz portfolio",
  },
};

const route = await OGImageRoute({
  param: "route",
  pages: staticPages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[23, 23, 23]],
    border: {
      color: [99, 102, 241],
      width: 20,
      side: "block-start",
    },
    font: {
      title: {
        size: 72,
        weight: "Bold",
        color: [255, 255, 255],
      },
      description: {
        size: 32,
        color: [180, 180, 180],
      },
    },
    fonts: [
      "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff2",
      "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2",
    ],
    padding: 80,
  }),
});

export function getStaticPaths() {
  return route.getStaticPaths();
}
export const GET = route.GET;
