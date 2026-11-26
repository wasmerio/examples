import type { ExperienceItem } from "$lib/types/portfolio";

// Newest first. Each entry is one role.
export const experience: ExperienceItem[] = [
  {
    role: "Software Engineer",
    company: "Northwind Labs",
    period: "Mar 2022 - Present",
    stack: ["TypeScript", "Kubernetes", "PostgreSQL", "GitHub Actions"],
    summary:
      "Own the internal developer platform: deploy pipeline, service templates, and on-call tooling.",
    highlights: [
      "Built the deploy pipeline now used by 40+ services.",
      "Cut median time from commit to production from two days to twelve minutes.",
      "Wrote the service template that new teams start from.",
      "Wrote the platform on-call handbook; pages fell from 31 to 9 a week.",
    ],
    links: [],
  },
  {
    role: "Backend Engineer",
    company: "Brightpay",
    period: "Jun 2018 - Feb 2022",
    stack: ["Go", "PostgreSQL", "Kafka", "AWS"],
    summary: "Worked on the payments API and the systems around it.",
    highlights: [
      "Designed the idempotent write path for the payments API.",
      "Built the replay tool support uses to resolve stuck payments.",
      "Wrote the transactional outbox that became the open-source outboxer.",
    ],
    links: [],
  },
];
