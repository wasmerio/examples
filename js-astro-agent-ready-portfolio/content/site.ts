// Site-wide settings. Replace every value that describes the starter person.
export const site = {
  // Full address of the deployed site, no trailing slash.
  url: "https://alex-rivera.example",
  name: "Alex Rivera",
  // <title> of the home page and the default social title.
  title: "Alex Rivera - Software Engineer",
  // Meta description for search results and link previews (one or two sentences).
  description:
    "Alex Rivera - A software engineer building developer tools, reliable backends, and AI-assisted workflows.",
  shortDescription:
    "Software engineer building developer tools and reliable backends.",
  publishedDate: "2026-11-10",
  modifiedDate: "2026-11-10",
  language: "en",
  locale: "en_US",
  // Your X/Twitter handle, with the @.
  twitterHandle: "@alexrivera",
  themeColor: "#000000",
  // Highlight colour (active filters, reading progress, focus rings, the Important callout).
  // A 6-digit hex such as #7dd3fc. Pick one that is readable on a black background.
  accent: "#7dd3fc",
  // Social preview image, 1200x630 or similar. The file lives in content/public/images/.
  image: {
    path: "/images/og-image.png",
    width: 1200,
    height: 630,
    type: "image/png",
    alt: "Alex Rivera, software engineer",
  },
  // Square photo for the hero and the author note under posts.
  profileImage: {
    path: "/images/profile.png",
    width: 512,
    height: 512,
    type: "image/png",
    alt: "Portrait of Alex Rivera",
  },
  keywords: ["Alex Rivera", "Software Engineer", "TypeScript", "Developer tools"],
  features: {
    // /blog, post pages, feeds, tags and the home-page section. Posts live in content/posts/.
    blog: true,
    // "Ask AI" button and dialog: prefilled chat links about the owner.
    askAi: true,
    // Soft availability line in the hero. Turn off if the timing is wrong.
    openToWork: true,
  },
  openToWorkText: "Open to new roles. Remote.",
  // Paste the Cloudflare Web Analytics beacon token to enable cookie-free analytics.
  analyticsToken: "",
};
