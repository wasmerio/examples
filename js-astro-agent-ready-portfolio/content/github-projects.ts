import type { GithubProject } from "$lib/types/portfolio";

// Project cards. `page` links a card to content/projects/<page>.md; without it the card
// links to `href`. `image` is optional (a file under content/public/).
export const githubProjects: GithubProject[] = [
  {
    name: "shipline",
    description:
      "One deploy pipeline for every service: build, test, canary, promote. Gates each canary step on error rate and p95 against the running version.",
    href: "https://github.com/alexrivera/shipline",
    page: "shipline",
    language: "TypeScript",
    // Both optional: a date or a label like "Active", and a star count. Delete a line to hide it.
    updated: "2026-11-02",
    stars: 1240,
    topics: ["deploys", "kubernetes", "ci"],
    metrics: [{ value: "8.4k", label: "weekly downloads", icon: "downloads" }],
    image: {
      src: "/images/demo/projects/shipline.webp",
      alt: "A shipline run holding at the canary stage, with an error-rate chart",
      width: 1280,
      height: 800,
    },
  },
  {
    name: "outboxer",
    description:
      "A transactional outbox for Go and PostgreSQL. Write the event with your data in one transaction; a relay delivers it at least once.",
    href: "https://github.com/alexrivera/outboxer",
    page: "outboxer",
    language: "Go",
    updated: "2026-09-14",
    stars: 486,
    topics: ["go", "postgres", "kafka"],
    image: {
      src: "/images/demo/projects/outboxer.webp",
      alt: "Go code adding an outbox event inside a transaction, and the relay's output",
      width: 1280,
      height: 800,
    },
  },
  {
    name: "notegrep",
    description:
      "Ranked full-text search for a folder of Markdown notes. An inverted index answers in 27 ms across ten thousand notes, with no server.",
    href: "https://github.com/alexrivera/notegrep",
    page: "notegrep",
    language: "TypeScript",
    updated: "2026-07-30",
    stars: 312,
    topics: ["cli", "search", "notes"],
    image: {
      src: "/images/demo/projects/notegrep.webp",
      alt: "notegrep in a terminal showing four ranked results",
      width: 1280,
      height: 800,
    },
  },
];
