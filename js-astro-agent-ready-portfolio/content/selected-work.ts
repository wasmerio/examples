import type { SelectedWork } from "$lib/types/portfolio";

// The big stories: two or three pieces of work you want people to remember.
export const selectedWork: SelectedWork[] = [
  {
    name: "A deploy pipeline teams actually use",
    context: "Northwind Labs · internal platform",
    description:
      "Replaced three hand-rolled release scripts with one pipeline: build, test, canary, promote. Adoption went from one pilot team to every service in a year, without a mandate, because the first deploy took ten minutes, not a day.",
    metrics: [
      { value: "40+", label: "services on the pipeline" },
      { value: "12 min", label: "median commit to production" },
    ],
    stack: ["TypeScript", "Kubernetes", "GitHub Actions"],
    href: "/projects/shipline",
    hrefLabel: "See shipline",
  },
  {
    name: "Idempotent payments API",
    context: "Brightpay · payments",
    description:
      "Designed the retry-safe write path for a payments API handling millions of requests a day, with request fingerprints, an outbox, and a replay tool for support.",
    metrics: [{ value: "0", label: "double charges in production" }],
    stack: ["Go", "PostgreSQL", "Kafka"],
    href: "/blog/idempotency-keys",
    hrefLabel: "Read the write-up",
  },
  {
    name: "An on-call rotation people stopped dreading",
    context: "Northwind Labs · platform on-call",
    description:
      "Rewrote every paging alert's runbook into a twelve-page handbook with the same four parts, and started a Friday review that deletes alerts nobody needed. Pages dropped by two thirds in twelve weeks.",
    metrics: [
      { value: "31 → 9", label: "pages per week" },
      { value: "30", label: "alerts deleted or moved to daytime" },
    ],
    stack: ["Prometheus", "Grafana", "PagerDuty"],
    href: "/blog/the-on-call-handbook",
    hrefLabel: "Read the write-up",
  },
];
