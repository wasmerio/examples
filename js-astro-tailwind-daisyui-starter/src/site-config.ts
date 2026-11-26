export const siteConfig = {
  title: "Your Site",
  description: "Minimal Astro site built with Tailwind CSS and DaisyUI.",
  githubRepo: "aholbreich/astro-tailwind-daisyui-starter",
  // Astro validates these public env vars in astro.config.mjs.
  site: import.meta.env.PUBLIC_SITE_URL,
  footerText: "Replace this with your company or site name.",

  // Used in SEOmeta for Twitter card and Open Graph
  seo: {
    twitterHandle: import.meta.env.PUBLIC_TWITTER_HANDLE,
    twitterSite: import.meta.env.PUBLIC_SITE_URL,
  },
};

// Feature flags examples
export const featureFlags = {
  enableImprint: true,
  enableDataprotection: false,
  showAttribution: false, // Show starter attribution in the footer if you want it
};

// Navigation menu items
export const nav = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Blog",
    url: "/blog",
  },
  {
    text: "DaisyUI",
    url: "/daisyui",
  },
];
