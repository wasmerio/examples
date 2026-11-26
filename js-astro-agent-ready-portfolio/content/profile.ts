import type { Profile } from "$lib/types/portfolio";

// Start of professional experience; drives the "N+ years" figure everywhere.
export const careerStartDate = new Date("2018-06-01T00:00:00Z");

export const profile: Profile = {
  name: "Alex Rivera",
  givenName: "Alex",
  familyName: "Rivera",
  // Your domain without https://. Shown at the top of the page.
  domain: "alex-rivera.example",
  role: "Software Engineer",
  company: "Northwind Labs",
  // Optional. Shown in the hero and the llms.txt summary; delete the line to hide it.
  location: "Lisbon, remote",
  email: "alex@alex-rivera.example",
  // One line under your name; also used by the author note under posts.
  focus: "Developer tools & reliable backends.",
  // The "about me" text, in three parts: `current` (what you do now), `previous` (what you did
  // before) and `writing` (below). The site description in site.ts is the short version.
  current:
    "Building the internal platform at Northwind Labs: deploy pipelines, service templates, and the tooling that keeps them boring.",
  // Ends the author note under each post.
  writing: "I write about the small habits that keep software dependable.",
  previous: "Previously built payment APIs at Brightpay.",
  // Shown in this order. Remove the ones you do not use; keep one Email entry.
  links: [
    {
      label: "GitHub",
      username: "@alexrivera",
      href: "https://github.com/alexrivera",
    },
    {
      label: "LinkedIn",
      username: "/in/alexrivera",
      href: "https://www.linkedin.com/in/alexrivera",
    },
    {
      label: "Twitter/X",
      username: "@alexrivera",
      href: "https://twitter.com/alexrivera",
    },
    {
      label: "Email",
      username: "alex@alex-rivera.example",
      href: "mailto:alex@alex-rivera.example",
    },
  ],
};
