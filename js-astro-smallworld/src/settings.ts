type Config = {
  title: string;
  description: string;
  lang: string;
  favicon: string;
  og: {
    image: string;
    imageAlt: string;
    imageType: string;
    imageWidth: string;
    imageHeight: string;
  };
};

export const siteConfig: Config = {
  // Appears in the nav logo, browser title bar, and RSS feed title.
  title: "smallworld",
  // Used as the default meta description and OG description on pages without their own.
  description: "A minimal Astro template styled with Pico CSS",
  // BCP 47 language tag for the HTML lang attribute (e.g. "en", "de", "fr", "zh-TW").
  lang: "en",
  favicon: "/favicon.svg",
  og: {
    // Replace with your own image (1200×630px recommended). Path is relative to /public.
    image: "/ogImage.png",
    imageAlt: "Open Graph image for the smallworld Astro template",
    imageType: "image/png",
    imageWidth: "1200",
    imageHeight: "630",
  },
};
