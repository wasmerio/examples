// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Terminus";
export const SITE_DESCRIPTION = "Astro template for developers";

export interface NavLink {
  title: string;
  id?: string;
  url?: string;
  redirect?: string;
  tooltip?: string;
}

export const NAV_LINKS: NavLink[] = [
  {
    title: "index.html",
    id: "home",
    url: "/",
    tooltip: "Home",
  },
  {
    title: "blog.sql",
    id: "blog",
    url: "/blog",
    tooltip: "Posts and stuff",
  },
  {
    title: "astro.build",
    redirect: "https://astro.build",
    tooltip: "A very interesting page",
  },
];

export type SocialPlatform = "twitter" | "github" | "instagram" | "linkedin";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "twitter",
    url: "https://twitter.com/ojoanalogo/",
    label: "X",
  },
  {
    platform: "github",
    url: "https://github.com/ojoanalogo/",
    label: "Github",
  },
];
