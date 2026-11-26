// Everything you are likely to change lives here and in src/content.
// Colors are CSS variables at the top of src/styles/global.css.

export interface Link {
  label: string;
  href: string;
}

export interface SiteConfig {
  // Language of the site, used on the html element and for date formatting (for example "en", "en-GB", "cs")
  lang: string;
  // Site title, shown in the header and appended to every page title
  title: string;
  // One line shown under the header on the front page and used as the default meta description
  description: string;
  // Production URL without a trailing slash, used for canonical links, the sitemap and the RSS feed
  url: string;
  // Author name, used in the feed and in article metadata
  author: string;
  // Header navigation, three or four short links look best
  nav: Link[];
  // Footer links, shown next to the RSS link
  social: Link[];
  // Name shown in the footer after the copyright sign and the current year
  copyright: string;
  // Posts per page on the front page; further pages live at /page/2, /page/3 and so on
  postsPerPage: number;
  // Shows "Made with Plain by Tessera" in the footer. Thank you for leaving it on.
  credit: boolean;
}

export const config: SiteConfig = {
  lang: "en",
  title: "Mara Lindqvist",
  description: "Notes on writing, editing and paying attention.",
  url: "https://plain-demo.hevislav.workers.dev",
  author: "Mara Lindqvist",
  nav: [
    { label: "Blog", href: "/" },
    { label: "Tags", href: "/tags/" },
    { label: "About", href: "/about/" },
  ],
  social: [
    { label: "Mastodon", href: "https://mastodon.example/@mara" },
    { label: "Email", href: "mailto:mara@example.com" },
  ],
  copyright: "Mara Lindqvist",
  postsPerPage: 10,
  credit: true,
};
