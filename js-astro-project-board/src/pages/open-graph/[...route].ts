import { OGImageRoute } from "astro-og-canvas";
import { config } from "src/config";
export const prerender = true;

const updateTemplateString = (str: string) => str.replace(/{{org}}/g, config.organization);

export const { GET, getStaticPaths } = await OGImageRoute({
  param: "route",
  pages: {
    "index": {
        title: updateTemplateString(config.openGraph.index.titleTemplate),
        description: updateTemplateString(config.openGraph.index.descriptionTemplate)
    },
    "roadmap": {
        title: updateTemplateString(config.openGraph.roadmap.titleTemplate),
        description: updateTemplateString(config.openGraph.roadmap.descriptionTemplate)
    },
  },
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: "./src/assets/logo.png",
      size: [120, 120],
    },
    fonts: [
      "./src/assets/Onest-Regular.ttf",
      "./src/assets/Onest-Bold.ttf",
    ],
    font: {
      title: {
        size: 44,
        lineHeight: 1.3,
        families: ["Onest"],
        weight: "Bold",
        color: [255, 255, 255],
      },
      description: {
        size: 30,
        lineHeight: 1.6,
        families: ["Onest"],
        weight: "Normal",
        color: [200, 200, 200]
      },
    },
    bgImage: {
      path: "./src/assets/og-bg.png",
      fit: "contain",
    },
    padding: 60,
    quality: 100,
  }),
});