import type { SiteConfig } from "./types";

export const siteConfig: SiteConfig = {
    title: "Serene Ink",
    description: "Notes from someone still figuring it out — shipped anyway.",
    siteUrl: "https://serene-ink.pages.dev",
    author: {
        name: "Jiseeeh",
        bio: "Somewhere between a junior and someone who knows what they're doing..",
    },
    nav: [
        { label: "Writing", href: "/" },
        { label: "Tags", href: "/tags" },
        { label: "About", href: "/about" },
    ],
    socials: {
        github: "https://github.com/jiseeeh",
        twitter: "https://x.com/username",
        linkedin: "https://ph.linkedin.com/in/name",
    },
    postsPerPage: 5,
    analytics: {
        umami: {
            websiteId: "",
            src: "",
        },
    },
    rss: {
        title: "Jiseeeh's Blog",
        description: "Notes from someone still figuring it out — shipped anyway.",
    },
};
