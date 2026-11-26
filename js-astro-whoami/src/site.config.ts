export const siteConfig = {
  name: "Jane Developer",
  title: "Jane Developer",
  description:
    "Software engineer building at the intersection of AI and design.",
  url: "https://astro-whoami.sivura.com",

  author: {
    name: "Jane Developer",
    email: "jane@example.com",
    avatar: "/images/avatar.jpg",
  },

  social: {
    github: "https://github.com/janedeveloper",
    linkedin: "https://linkedin.com/in/janedeveloper",
    twitter: "https://x.com/janedeveloper",
  },

  nav: [
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
  ],

  homepage: {
    greeting: "Hi, I'm Jane.",
    intro:
      "I'm a software engineer who writes about technology, design, and building things for the web. Currently working on AI-powered developer tools.",
    featured: [
      {
        title: "Building AI-Friendly Websites",
        href: "/blog/building-ai-friendly-websites",
      },
      {
        title: "On Simplicity in Design",
        href: "/blog/on-simplicity-in-design",
      },
      {
        title: "Getting Started with Astro",
        href: "/blog/getting-started-with-astro",
      },
    ],
  },

  jsonLd: {
    jobTitle: "Software Engineer",
    worksFor: {
      name: "Example Corp",
      url: "https://astro-whoami.sivura.com",
    },
  },
} as const

export type SiteConfig = typeof siteConfig
